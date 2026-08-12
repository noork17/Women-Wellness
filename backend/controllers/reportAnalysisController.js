const axios = require("axios");
const pdfParse = require("pdf-parse");

const MAX_TEXT_CHARS = 14000;

/**
 * POST multipart field "report" — PDF or image (PNG/JPEG/WebP).
 * Uses OPENAI_API_KEY; returns { analysis } markdown string.
 */
async function analyzeReport(req, res) {
  try {
    const key = process.env.OPENAI_API_KEY;
    if (!key) {
      return res.status(503).json({
        error: "Report analysis is not configured. Set OPENAI_API_KEY on the server.",
      });
    }

    if (!req.file?.buffer) {
      return res.status(400).json({ error: 'No file uploaded. Use form field "report".' });
    }

    const { mimetype, buffer, originalname } = req.file;
    let userMessage;

    if (mimetype === "application/pdf") {
      let text;
      try {
        const data = await pdfParse(buffer);
        text = (data.text || "").replace(/\s+/g, " ").trim();
      } catch {
        return res.status(400).json({
          error: "Could not read this PDF. It may be encrypted or corrupted.",
        });
      }
      if (!text || text.length < 15) {
        return res.status(400).json({
          error:
            "Almost no text found in this PDF. If it is a scanned report, upload clear photos (PNG or JPEG) of each page instead.",
        });
      }
      const clipped =
        text.length > MAX_TEXT_CHARS ? `${text.slice(0, MAX_TEXT_CHARS)}\n\n[... document truncated ...]` : text;
      userMessage = {
        role: "user",
        content: `File name: ${originalname}\n\nExtracted report text:\n${clipped}`,
      };
    } else if (/^image\/(png|jpeg|jpg|webp)$/i.test(mimetype)) {
      const b64 = buffer.toString("base64");
      const mime = mimetype === "image/jpg" ? "image/jpeg" : mimetype;
      userMessage = {
        role: "user",
        content: [
          {
            type: "text",
            text: `The user uploaded a medical report image named "${originalname}". Read all visible text and analyze it.`,
          },
          {
            type: "image_url",
            image_url: { url: `data:${mime};base64,${b64}` },
          },
        ],
      };
    } else {
      return res.status(400).json({ error: "Use a PDF or image (PNG, JPEG, or WebP)." });
    }

    const langRaw = String(req.body.language || req.body.outputLanguage || "en")
      .trim()
      .toLowerCase()
      .slice(0, 2);
    const langCode = ["te", "hi", "en"].includes(langRaw) ? langRaw : "en";
    const langNames = { en: "English", te: "Telugu", hi: "Hindi" };
    const outputLangName = langNames[langCode] || "English";

    const system = `You are a health education assistant for SETV. You are not a doctor and do not give a medical diagnosis.
The user shared a medical/lab/imaging report. Analyze only what is visible in the document.

OUTPUT LANGUAGE: Write the ENTIRE response in ${outputLangName}. All section headings and bullets must be in ${outputLangName}.

Respond in markdown with exactly these sections (translate section titles into ${outputLangName}):
## Summary
2–4 sentences in plain language for a patient.

## Key findings
Bullet list of important tests, values, dates, or impressions stated in the document.

## What this may mean
Patient-friendly explanations of medical terms and typical interpretations. Use cautious language ("may suggest", "often seen when"). Never state a definitive diagnosis.

## Red flags (if any)
If anything in the document suggests urgent in-person care, say so briefly. If none, write: **None apparent from this document.**

## Limitations
Remind that OCR/PDF extraction can miss text; the user should confirm everything with their clinician.

## Suggested next steps
General, non-prescriptive follow-up (e.g., discuss results with your doctor). No medication dosing.

If the file is not a medical report, say so in Summary and keep other sections minimal.`;

    const { data } = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-4o-mini",
        messages: [{ role: "system", content: system }, userMessage],
        max_tokens: 2800,
        temperature: 0.35,
      },
      {
        headers: {
          Authorization: `Bearer ${key}`,
          "Content-Type": "application/json",
        },
        timeout: 120000,
      }
    );

    const analysis = data?.choices?.[0]?.message?.content;
    if (!analysis) {
      return res.status(502).json({ error: "Empty response from analysis service." });
    }

    return res.json({ analysis });
  } catch (err) {
    console.error("analyze-report:", err.response?.data || err.message);
    const msg =
      err.response?.data?.error?.message || err.message || "Analysis failed";
    return res.status(500).json({ error: msg });
  }
}

module.exports = { analyzeReport };
