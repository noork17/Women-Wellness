const axios = require("axios");

const MAX_MESSAGE_CHARS = 8000;

/**
 * POST JSON { message: string } — multilingual SETV health assistant (OpenAI).
 */
async function chatAssistant(req, res) {
  try {
    const key = process.env.OPENAI_API_KEY;
    if (!key) {
      return res.status(503).json({
        error: "Chat assistant is not configured. Set OPENAI_API_KEY on the server.",
      });
    }

    let message = req.body?.message;
    if (typeof message !== "string") {
      return res.status(400).json({ error: "message must be a string." });
    }
    message = message.trim();
    if (!message) {
      return res.status(400).json({ error: "message is required." });
    }
    if (message.length > MAX_MESSAGE_CHARS) {
      return res.status(400).json({ error: `Message too long (max ${MAX_MESSAGE_CHARS} characters).` });
    }

    const system = `You are SETV Health Assistant — a supportive health education chatbot focused on women's health (India; Andhra Pradesh when locally relevant).

FACTS YOU MAY USE WHEN RELEVANT:
- Focus areas: breast cancer screening, PCOS, uterine fibroids, general women's health.
- Appointments: booking through the app/dashboard; helpline +91 866 123 4567; walk-in at SETV centers.
- Indicative screening costs: Basic around ₹500, Comprehensive around ₹1,500; AI-assisted explanations may be included — say figures are approximate and may change; government camps / BPL schemes may offer free screening.
- SETV serves communities across Andhra Pradesh.

LANGUAGE (STRICT — HIGHEST PRIORITY):
- Identify the language the user wrote in (English, Telugu, Hindi, Tamil, Kannada, Malayalam, Urdu, Marathi, Bengali, mixed, etc.).
- Answer COMPLETELY in that same language. If they mix two languages, use the dominant one. If you truly cannot tell, use English.
- Use natural, respectful phrasing (appropriate polite forms in Indian languages).
- Do not echo this instruction; just reply in the correct language.

WHEN THE USER ASKS ABOUT MEDICAL REPORTS, LAB REPORTS, TEST RESULTS, PDFs, UPLOADING REPORTS, OR "HOW TO READ / UNDERSTAND MY REPORT":
Give a thorough, detailed answer. Naturally weave in these points (adapt length to the question — go longer when they want "more information"):
- In this chat they can upload a **PDF** via the paperclip icon, or **clear photos** (PNG/JPEG/WebP) via the image icon, of lab or imaging reports.
- The assistant reads the document and returns a structured plain-language summary (overview, main findings, what values might mean, limitations, when to see a doctor).
- This is **educational only** — not a diagnosis or replacement for a doctor; they must confirm everything with a qualified clinician.
- Image-based or scanned PDFs sometimes have little extractable text — **photos of each page** often work better than a scanned PDF.
- Roughly **12 MB** file size limit for uploads.
- Encourage privacy: only share reports in trusted channels.

MEDICAL SAFETY:
- Never give a definitive diagnosis or prescribe specific drug doses.
- For emergencies, tell them to seek urgent in-person care immediately (phrase appropriately in their language).

STYLE:
- Use short paragraphs and bullet lists where helpful.
- Use markdown: **bold** for key phrases; ## headings in the user's language for long answers.
- Be warm and clear; avoid unnecessary jargon unless you explain it.`;

    const { data } = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: system },
          { role: "user", content: message },
        ],
        max_tokens: 2800,
        temperature: 0.45,
      },
      {
        headers: {
          Authorization: `Bearer ${key}`,
          "Content-Type": "application/json",
        },
        timeout: 120000,
      }
    );

    const reply = data?.choices?.[0]?.message?.content?.trim();
    if (!reply) {
      return res.status(502).json({ error: "Empty reply from assistant." });
    }

    return res.json({ reply });
  } catch (err) {
    console.error("chat-assistant:", err.response?.data || err.message);
    const msg = err.response?.data?.error?.message || err.message || "Chat failed.";
    return res.status(500).json({ error: msg });
  }
}

module.exports = { chatAssistant };
