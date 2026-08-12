import React, { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Send } from "lucide-react";

/**
 * SETV Women Wellness assistant — site & dashboard knowledge, multi-language,
 * greets signed-in users by first name (sessionStorage / localStorage loggedInuser).
 */

const LANGUAGES = {
  en: { label: "English", flag: "EN" },
  hi: { label: "हिन्दी", flag: "HI" },
  te: { label: "తెలుగు", flag: "TE" },
  ta: { label: "தமிழ்", flag: "TA" },
};

export function getUserFirstName() {
  try {
    const raw =
      sessionStorage.getItem("loggedInuser") ||
      localStorage.getItem("loggedInuser") ||
      "";
    const part = String(raw).trim().split(/[\s@]+/)[0] || "";
    if (!part) return "";
    return part.charAt(0).toUpperCase() + part.slice(1).toLowerCase();
  } catch {
    return "";
  }
}

const DISCLAIMER =
  "I'm an assistant for SETV's app and education—not a doctor. For symptoms or results, always follow your clinician.";

const DISCLAIMER_I18N = {
  en: DISCLAIMER,
  hi: "मैं ऐप मार्गदर्शिका हूँ, डॉक्टर नहीं—लक्षणों के लिए चिकित्सक से पूछें।",
  te: "నేను యాప్ సహాయకుడిని మాత్రమే—వైద్యుడిని కాదు; ఆరోగ్య లక్షణాలకు డాక్టర్‌ని సంప్రదించండి.",
  ta: "நான் பயன்பாட்டு உதவியாளர்—மருத்துவர் அல்ல; அறிகுறிகளுக்கு மருத்துவரை அணுகவும்.",
};

function pickAnswer(row, lang) {
  const disc = DISCLAIMER_I18N[lang] || DISCLAIMER_I18N.en;
  const body = row[lang] || row.en;
  return `${body}\n\n${disc}`;
}

/** Normalize Latin chat for Indian-language users (Teluglish, etc.) */
function normalizeQuery(text) {
  return text.toLowerCase().trim().replace(/\s+/g, " ");
}

/** Rich answers: use `en` plus optional `te`/`hi`/`ta`; pickAnswer falls back to English. */
const KNOWLEDGE = [
  {
    test: (t) =>
      /your name|what'?s? your name|whats you name|who are you|^who r you|call you what|bot name|assistant name|nee peru|meeru yavar|nuvvu yavar|నీ పేరు|మీ పేరు|మీరు ఎవరు|నువ్వు ఎవరు|పేరు ఏమిటి/.test(
        t
      ),
    en: `I'm **SETV's Wellness Assistant**—a chat helper built into this website. I'm not a human doctor; I explain **menus, dashboard, screening steps, reports, and appointments**.`,
    te: `నేను **SETV Women Wellness Assistant** — ఈ వెబ్‌సైట్‌లోని చాట్ సహాయకుడిని/సహాయకురాలిని. నేను వైద్యుడిని కాదు. మెనూ, డాష్‌బోర్డు, స్క్రీనింగ్, రిపోర్ట్లు, అపాయింట్‌మెంట్లు ఎలా ఉపయోగించాలో చెబుతాను.`,
    hi: `मैं **SETV Women Wellness Assistant** हूँ—इस वेबसाइट का चैट सहायक। मैं डॉक्टर नहीं हूँ। मेनू, डैशबोर्ड, स्क्रीनिंग, रिपोर्ट और अपॉइंटमेंट समझाने में मदद करती हूँ।`,
    ta: `நான் **SETV Women Wellness Assistant** — இந்த தளத்தின் உரை உதவியாளர். நான் மருத்துவர் அல்ல. மெனு, டாஷ்போர்ட், ஸ்கிரீனிங், அறிக்கைகள், நேரம் குறித்து வழிகாட்டுகிறேன்.`,
  },
  {
    test: (t) =>
      /how to use|how do i use|use (the )?(website|site|app)|getting started|where (do i|to) (go|start)|navigation|sidebar|open menu|everything where|ee website|website ela|ela vadali|ela use|ela chal|వెబ్‌సైట్|ఎలా ఉపయోగ|ఎలా వాడ|వాడాలో|वेबसाइट.*(कैसे|चलाएं)|साइट कैसे|எப்படி பயன்படுத்த|தளம் எப்படி/.test(
        t
      ),
    en: `**How to use this website:**\n1. Tap **☰ (menu)** top-left to open all sections.\n2. **Dashboard** — AP district map, stats, export, compare districts, van deploy.\n3. **Select Scan** (home) — choose Breast / Fibroid / PCOS and upload as guided.\n4. **Book Appointment** & **My Appointments** — scheduling.\n5. **All Reports** — past analyses.\n6. **Profile / Notifications / Feedback** under Account.\n7. Public info: **Landing** & **Learn** pages work without login.\nAsk me any step in more detail!`,
    te: `**ఈ వెబ్‌సైట్ ఎలా వాడాలి:**\n1. ఎడమ పైన **☰ మెనూ** నొక్కండి — అన్ని విభాగాలు వస్తాయి.\n2. **డాష్‌బోర్డు** — AP మ్యాప్, గణాంకాలు, CSV ఎగుమతి, జిల్లాల పోలిక, మొబైల్ వ్యాన్.\n3. **సెలెక్ట్ స్కాన్** (హోమ్) — బ్రెస్ట్ / ఫైబ్రాయిడ్ / PCOS ఎంచుకుని వీడియో అప్లోడ్.\n4. **బుక్ అపాయింట్‌మెంట్**, **మై అపాయింట్‌మెంట్స్**.\n5. **ఆల్ రిపోర్ట్స్** — పాత విశ్లేషణలు.\n6. **ప్రొఫైల్, నోటిఫికేషన్స్, ఫీడ్‌బ్యాక్** — అకౌంట్ కింద.\n7. లాగిన్ లేకుండా **ల్యాండింగ్**, **లర్న్ మోర్** పేజీలు.\nఏ అంశం గురించైనా మరింత అడగండి!`,
    hi: `**वेबसाइट कैसे इस्तेमाल करें:**\n1. ऊपर-बाएँ **☰ मेनू** खोलें।\n2. **डैशबोर्ड** — मानचित्र, आँकड़े, निर्यात, तुलना, वैन।\n3. **स्कैन चुनें** — स्तन / फाइब्रॉयड / PCOS और वीडियो अपलोड।\n4. **अपॉइंटमेंट बुक / मेरे अपॉइंटमेंट**।\n5. **सभी रिपोर्ट**।\n6. **प्रोफ़ाइल, सूचनाएँ, फ़ीडबैक**।\n7. बिना लॉगिन **लैंडिंग / लर्न मोर**।\nऔर पूछें!`,
    ta: `**தளத்தை எப்படி பயன்படுத்துவது:**\n1. மேல் இடது **☰ மெனு** திறக்கவும்.\n2. **டாஷ்போர்ட்** — வரைபடம், புள்ளிவிவரங்கள், ஏற்றுமதி, ஒப்பீடு.\n3. **ஸ்கேன் தேர்வு** — மார்பகம் / ஃபைப்ராய்ட் / PCOS.\n4. **நேரம் பதிவு / எனது நேரங்கள்**.\n5. **அனைத்து அறிக்கைகள்**.\n6. **சுயவிவரம், அறிவிப்புகள்**.\n7. **லேண்டிங் / மேலும் அறிக** பக்கங்கள்.\nகேளுங்கள்!`,
  },
  {
    test: (t) =>
      /what is setv|about setv|setv mean|full form|smart early detection|^setv$/.test(t) && !/your name|who are you/.test(t),
    en: `SETV stands for **Smart Early Detection Technology for Women**. It's a women's wellness platform for Andhra Pradesh: AI-assisted screening for breast health, fibroids, and PCOS, district dashboards, mobile van planning, reports, and appointments.`,
    te: `**SETV** అంటే **Smart Early Detection Technology for Women**. ఆంధ్రప్రదేశ్ మహిళా ఆరోగ్యం కోసం — AI సహాయంతో బ్రెస్ట్, ఫైబ్రాయిడ్స్, PCOS స్క్రీనింగ్, జిల్లా డాష్‌బోర్డు, రిపోర్ట్లు, అపాయింట్‌మెంట్లు.`,
    hi: `**SETV** का मतलब **Smart Early Detection Technology for Women**। आंध्र प्रदेश में महिला स्वास्थ्य: AI स्क्रीनिंग (स्तन, फाइब्रॉयड, PCOS), डैशबोर्ड, रिपोर्ट, अपॉइंटमेंट।`,
    ta: `**SETV** என்பது **Smart Early Detection Technology for Women**. ஆந்திரா பெண்கள் நலம்: AI ஸ்கிரீனிங், டாஷ்போர்ட், அறிக்கைகள்.`,
  },
  {
    test: (t) => /dashboard|district|heatmap|kpi|analytics/.test(t),
    en: `The **Dashboard** (/dashboard) shows Andhra Pradesh district stats: total cases, flagged zones, AI confidence, a **color map** (red = high risk, amber = medium, green = low for the filter you pick), bar charts, comparison tool, recent screenings, mobile van tracker, and export. Use disease filters (All / Breast / Fibroid / PCOS) to change what the map and numbers reflect.`,
    te: `**డాష్‌బోర్డు** (/dashboard) AP జిల్లాల గణాంకాలు, ఫ్లాగ్డ్ జోన్లు, AI విశ్వాసం, **రంగు మ్యాప్** (ఎరుపు=అధిక, పసుపు=మధ్యస్థ, ఆకుపచ్చ=తక్కువ ప్రమాదం), బార్ చార్ట్లు, జిల్లాల పోలిక, స్క్రీనింగ్ జాబితా, మొబైల్ వ్యాన్, CSV ఎగుమతి. పైన ఫిల్టర్లు మార్చండి.`,
    hi: `**डैशबोर्ड** पर आंध्र जिलों के आँकड़े, मानचित्र (लाल/पीला/हरा जोखिम), तुलना, वैन, निर्यात। ऊपर फ़िल्टर बदलें।`,
    ta: `**டாஷ்போர்ட்** — AP மாவட்ட புள்ளிவிவரங்கள், வண்ண வரைபடம் (சிவப்பு/மஞ்சள்/பச்சை), ஒப்பீடு, ஏற்றுமதி.`,
  },
  {
    test: (t) => /map|heatmap|color|red|green|amber|risk zone/.test(t),
    en: `On the AP map: **red** districts = high risk for the selected metric, **amber** = medium, **green** = low. Borders are thicker for higher risk. Hover for case counts; click a district to open details, export CSV/JSON, add to **Compare**, or **Deploy mobile van**.`,
    te: `మ్యాప్‌లో **ఎరుపు** = అధిక ప్రమాదం, **పసుపు** = మధ్యస్థ, **ఆకుపచ్చ** = తక్కువ. మందమైన బోర్డర్ = మరింత ప్రమాదం. క్లిక్ చేస్తే వివరాలు, CSV/JSON, Compare, Mobile Van.`,
    hi: `मानचित्र: लाल=उच्च, पीला=मध्यम, हरा=कम जोखिम। क्लिक करने पर विवरण, निर्यात, तुलना।`,
    ta: `வரைபடம்: சிவப்பு=அதிகம், மஞ்சள்=நடுத்தரம், பச்சை=குறைவு. கிளிக் செய்து விவரங்கள், ஏற்றுமதி.`,
  },
  {
    test: (t) => /export|csv|json|download|copy summary/.test(t),
    en: `From a district popup you can **Export CSV**, **Export JSON**, or **Copy summary** to clipboard. The main toolbar also has **Export CSV** for all districts. Files include risk, rank vs state average, and disease split when available.`,
    te: `జిల్లా విండోలో **Export CSV**, **Export JSON**, **Copy summary**. పై టూల్‌బార్‌లో అన్ని జిల్లాల CSV.`,
    hi: `जिला पॉपअप से CSV/JSON निर्यात या सारांश कॉपी। टूलबार से पूरी सूची।`,
    ta: `மாவட்ட சாளரத்தில் CSV/JSON / சுருக்க நகல். கருவிப்பட்டையில் முழு பட்டியல்.`,
  },
  {
    test: (t) => /mobile van|deploy van|van dispatch/.test(t),
    en: `**Deploy Mobile Van** sends a request to the SETV backend (or logs locally if offline) with a reference ID, saves recent dispatches in your browser, and scrolls to the **Mobile Van Tracker** section. Use it for high-risk districts from the dashboard.`,
    te: `**Deploy Mobile Van** సర్వర్‌కు అభ్యర్థన పంపుతుంది (లేదా ఆఫ్‌లైన్‌లో లాగ్), రిఫరెన్స్ ID ఇస్తుంది, **Mobile Van Tracker** వరకు స్క్రోల్ చేస్తుంది.`,
    hi: `**Deploy Mobile Van** सर्वर को अनुरोध भेजता है, संदर्भ ID देता है, ट्रैकर पर ले जाता है।`,
    ta: `**Deploy Mobile Van** சேவையகத்திற்கு கோரிக்கை, ஐடி, டிராக்கர் பகுதி.`,
  },
  {
    test: (t) => /compare|comparison|two district|swap/.test(t),
    en: `**District Comparison Tool** lets you pick two districts and see case totals, disease split, and difference. From a district modal, **Add to Compare** fills the next free slot (or replaces the second). **Swap** exchanges A and B.`,
    te: `**District Comparison** — రెండు జిల్లాలు ఎంచుకుని కేసులు, వ్యాధి విభజన, తేడా చూడండి. జిల్లా విండోలో **Add to Compare**. **Swap** A/B మార్చుతుంది.`,
    hi: `**तुलना टूल** — दो जिले, केस, बीमारी बंटवारा। मोडल में **Add to Compare**।`,
    ta: `**ஒப்பீடு** — இரண்டு மாவட்டங்கள், வித்தியாசம். **Add to Compare**, **Swap**.`,
  },
  {
    test: (t) =>
      /screening camp|outreach camp|wellness camp|health camp|\/camps|camp registration|register for.*camp|free camp/.test(t),
    en: `**Screening Camps** (/camps) show SETV **outreach events** across Andhra Pradesh (Vijayawada, Kadapa, Srikakulam, Guntur, etc.). You can **search**, **filter** by type (breast, PCOS, fibroid, mobile van), read **what to bring**, and **register** (demo: saved on this device). **Book Appointment** is separate for clinic slots. The **dashboard** may show related camp planning for districts.`,
    te: `**Screening Camps** (/camps) — AP లో ఉచిత/అవుట్రీచ్ శిబిరాలు. శోధన, ఫిల్టర్, నమోదు. క్లినిక్ కోసం **Book Appointment** వేరు.`,
    hi: `**Screening Camps** (/camps) — आंध्र में मुफ्त शिविर। खोज, फ़िल्टर, रजिस्टर। क्लिनिक के लिए **Book Appointment** अलग।`,
    ta: `**Screening Camps** (/camps) — ஆந்திரா புறநகர் முகாம்கள். தேடல், வடிகட்டி, பதிவு. கிளினிக் **Book Appointment** தனி.`,
  },
  {
    test: (t) => /screening|scan|upload|video|breast|pcos|fibroid/.test(t) && !/dashboard|map/.test(t) && !/camp/.test(t),
    en: `**Select Scan** (home /) lets you choose Breast, Fibroids, or PCOS flows. Upload clinical video per instructions; AI assists analysis and doctors review before reports. Paths: /breast-cancer, /fibroids-detection, /pcos-detection (after login).`,
    te: `**Select Scan** (హోమ్) — బ్రెస్ట్ / ఫైబ్రాయిడ్ / PCOS. సూచనల ప్రకారం వీడియో అప్లోడ్; AI + డాక్టర్ రివ్యూ. లాగిన్ తర్వాత /breast-cancer, /fibroids-detection, /pcos-detection.`,
    hi: `**स्कैन चुनें** — स्तन / फाइब्रॉयड / PCOS, वीडियो अपलोड, AI + डॉक्टर समीक्षा।`,
    ta: `**ஸ்கேன் தேர்வு** — மார்பகம் / ஃபைப்ராய்ட் / PCOS, வீடியோ, AI + மருத்துவர்.`,
  },
  {
    test: (t) => /report|all reports|finding|pdf/.test(t),
    en: `After analysis, open **All Reports** (/all-reports) for history. District modal exports are separate (CSV/JSON). Reports include findings and recommendations—always confirm with your doctor.`,
    te: `విశ్లేషణ తర్వాత **All Reports** (/all-reports). జిల్లా CSV వేరు. ఫలితాలు డాక్టర్‌తో నిర్ధారించండి.`,
    hi: `विश्लेषण के बाद **All Reports**। जिला निर्यात अलग। डॉक्टर से पुष्टि करें।`,
    ta: `பகுப்பாய்வுக்குப் பிறகு **All Reports**. மருத்துவரை உறுதிப்படுத்தவும்.`,
  },
  {
    test: (t) => /appointment|book|camps|schedule/.test(t),
    en: `Use **Book Appointment** (/book-appointment) and **My Appointments** (/my-appointments). **Screening Camps** (/camps) lists outreach. Landing page: /landing (public).`,
    te: `**Book Appointment** / **My Appointments** మెనులో. **Screening Camps** (/camps). బహిరంగ **Landing** /landing.`,
    hi: `**Book Appointment**, **My Appointments**, **Camps** मेनू में।`,
    ta: `**Book Appointment**, **My Appointments**, **Camps**.`,
  },
  {
    test: (t) => /login|sign up|register|password|account/.test(t),
    en: `**Login** /login, **Sign up** /signup. Scanning routes need an account. **Profile** /profile, **Notifications** /notifications, **Feedback** /feedback, **Doctor portal** /doctor-dashboard.`,
    te: `**లాగిన్** /login, **సైన్ అప్** /signup. స్కాన్ కోసం ఖాతా కావాలి. ప్రొఫైల్, నోటిఫికేషన్స్, ఫీడ్‌బ్యాక్, డాక్టర్ పోర్టల్ మెనులో.`,
    hi: `**लॉगिन** /login, **साइन अप**। स्कैन के लिए खाता। प्रोफ़ाइल, सूचनाएँ।`,
    ta: `**உள்நுழைவு** /login, **பதிவு**. ஸ்கேனுக்கு கணக்கு.`,
  },
  {
    test: (t) => /landing|home page|public|learn more/.test(t),
    en: `Public **Landing** /landing explains SETV, demo video, and **Learn more** pages: /learn/breast-cancer, /learn/pcos, /learn/fibroids (no login). **About** /about, **Services** /services, **Contact** /contact.`,
    te: `బహిరంగ **Landing** /landing — డెమో వీడియో, **Learn more** /learn/breast-cancer, /learn/pcos, /learn/fibroids. About, Services, Contact.`,
    hi: `सार्वजनिक **Landing**, **Learn more** पृष्ठ, About/Services/Contact।`,
    ta: `பொது **Landing**, **Learn more**, About/Services/Contact.`,
  },
  {
    test: (t) => /symptom|risk calculator|health tracker|blog|faq|chat/.test(t),
    en: `Health tools: **Symptom Checker** /symptom-checker, **Risk Calculator** /risk-calculator, **Health Tracker** /health-tracker, **Health Records** /health-records, **Blog** /blog, **FAQ** /faq. This chat is separate from **AI Chat** /chat if you use that module.`,
    te: `ఆరోగ్య టూల్స్ మెనులో: Symptom Checker, Risk Calculator, Health Tracker, Records, Blog, FAQ. ఇది వేరు **AI Chat** /chat కంటే.`,
    hi: `स्वास्थ्य टूल मेनू में: लक्षण, जोखिम, ट्रैकर, रिकॉर्ड, ब्लॉग, FAQ।`,
    ta: `ஆரோக்கிய கருவிகள்: அறிகுறி, ஆபத்து, டிராக்கர், பதிவேடு, வலைப்பதிவு, FAQ.`,
  },
  {
    test: (t) => /how many district|13 district|andhra/.test(t),
    en: `The dashboard covers **13 districts** of Andhra Pradesh (e.g. Visakhapatnam, Guntur, Anantapur). Data comes from SETV's dashboard API and district stats; risk levels are spread across high, medium, and low so the map stays readable.`,
    te: `డాష్‌బోర్డ్ AP **13 జిల్లాలు** (విశాఖ, గుంటూరు, అనంతపురం మొదలైనవి). డేటా API నుండి; ప్రమాదం అధిక/మధ్యస్థ/తక్కువ రంగులతో.`,
    hi: `आंध्र के **13 जिले** डैशबोर्ड पर। जोखिम स्तर: उच्च/मध्यम/कम।`,
    ta: `ஆந்திரா **13 மாவட்டங்கள்**. ஆபத்து: அதிகம்/நடுத்தரம்/குறைவு.`,
  },
];

const BASE = {
  en: {
    greeting: (name) =>
      name
        ? `Hi ${name}! I'm your SETV Women Wellness assistant. Ask about the dashboard, map colors, screening, reports, appointments, or any menu item.`
        : `Hi! I'm your SETV Women Wellness assistant. Ask about the dashboard, screening, reports, or your account.`,
    help: "Try: “What does the map mean?”, “How do I export a district?”, “Where is PCOS screening?”, “Book appointment”. I cover SETV routes and features—not personal medical advice.",
    thanks: "You're welcome! Stay well—and use the dashboard filters to explore AP districts.",
    default: (name) =>
      name
        ? `${name}, I didn’t catch that topic. Try: **your name**, **how to use this site**, **dashboard**, **map colors**, **export**, **screening**, **reports**, **appointments**, or type **help**. You can also switch language and ask in English.`
        : `I didn’t catch that. Try **help**, or ask about the **dashboard**, **map**, **export**, **van deploy**, **screening**, or **login**. You can switch language above.`,
  },
  hi: {
    greeting: (name) =>
      name
        ? `नमस्ते ${name}! मैं SETV सहायक हूं — डैशबोर्ड, स्क्रीनिंग, रिपोर्ट।`
        : `नमस्ते! मैं SETV सहायक हूं।`,
    help: "डैशबोर्ड, मानचित्र, रिपोर्ट, अपॉइंटमेंट पूछें। चिकित्सा निदान नहीं।",
    thanks: "धन्यवाद! स्वस्थ रहें।",
    default: (name) =>
      name
        ? `${name}, समझ नहीं आया। **मदद** टाइप करें, या पूछें: वेबसाइट कैसे चलाएँ, डैशबोर्ड, मानचित्र रंग, निर्यात, स्कैन, रिपोर्ट, लॉगिन। अंग्रेज़ी में भी पूछ सकते हैं।`
        : `समझ नहीं आया। **मदद** देखें या डैशबोर्ड / मानचित्र / स्कैन के बारे में पूछें। डॉक्टर से चिकित्सा सलाह लें।`,
  },
  te: {
    greeting: (name) =>
      name
        ? `నమస్కారం ${name}! నేను SETV సహాయకుడిని — డాష్‌బోర్డ్, స్క్రీనింగ్.`
        : `నమస్కారం! SETV సహాయకుడు.`,
    help: "మ్యాప్, ఎగుమతి, అపాయింట్‌మెంట్, స్కాన్ మార్గాలు అడగండి.",
    thanks: "ధన్యవాదాలు! ఆరోగ్యంగా ఉండండి.",
    default: (name) =>
      name
        ? `${name}, ఆ ప్రశ్న స్పష్టంగా అర్థం కాలేదు. **సహాయం** అని టైప్ చేయండి లేదా అడగండి: **మీ పేరు ఏమిటి**, **వెబ్‌సైట్ ఎలా వాడాలి**, డాష్‌బోర్డు, మ్యాప్ రంగులు, CSV ఎగుమతి, స్క్రీనింగ్, రిపోర్ట్లు, లాగిన్. English భాష మార్చి కూడా అడగొచ్చు.`
        : `అర్థం కాలేదు. **సహాయం** లేదా పై విషయాల గురించి అడగండి. లేదా English ఎంచుకోండి.`,
  },
  ta: {
    greeting: (name) =>
      name
        ? `வணக்கம் ${name}! SETV உதவியாளர் — டாஷ்போர்ட், ஸ்கிரீனிங்.`
        : `வணக்கம்! SETV உதவியாளர்.`,
    help: "வரைபடம், ஏற்றுமதி, நேரம், ஸ்கேன் பாதைகள் கேளுங்கள்.",
    thanks: "நன்றி! ஆரோக்கியமாக இருங்கள்.",
    default: (name) =>
      name
        ? `${name}, புரியவில்லை. **உதவி** என்று தட்டச்சு செய்யவும், அல்லது: தளம் எப்படி பயன்படுத்துவது, டாஷ்போர்ட், வரைபட நிறங்கள், ஏற்றுமதி, ஸ்கேன், அறிக்கைகள் பற்றி கேளுங்கள். English-இலும் கேட்கலாம்.`
        : `புரியவில்லை. **உதவி** அல்லது மேலுள்ள தலைப்புகள் பற்றி கேளுங்கள்.`,
  },
};

function getResponse(text, lang) {
  const t = normalizeQuery(text);
  const name = getUserFirstName();
  const L = BASE[lang] || BASE.en;
  const disc = DISCLAIMER_I18N[lang] || DISCLAIMER_I18N.en;

  for (const row of KNOWLEDGE) {
    if (row.test(t)) return pickAnswer(row, lang);
  }

  if (/hello|hi|namaste|namaskar|vanakkam|hey|హాయ్|నమస్కారం|வணக்கம்/.test(t))
    return `${L.greeting(name)}\n\n${disc}`;
  if (/help|what can you|guide|how do i|sahayam|సహాయం|मदद|உதவி/.test(t)) return `${L.help}\n\n${disc}`;
  if (/thank|dhanyavad|dhanyavaad|nandri|ధన్యవాద|நன்றி/.test(t)) return `${L.thanks}\n\n${disc}`;
  const body = typeof L.default === "function" ? L.default(name) : L.default;
  return `${body}\n\n${disc}`;
}

function buildWelcomeMessage(lang) {
  const name = getUserFirstName();
  const L = BASE[lang] || BASE.en;
  const line = L.greeting(name);
  return `${line}\n\nTip: ask about the **map colors**, **export**, **compare districts**, or **where to scan**.`;
}

export function Chatbot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [lang, setLang] = useState("en");
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (!open) return;
    setMessages((prev) => {
      if (prev.length > 0) return prev;
      return [{ role: "assistant", text: buildWelcomeMessage(lang) }];
    });
  }, [open, lang]);

  const sendMessage = useCallback(() => {
    if (!input.trim()) return;
    const userMsg = { role: "user", text: input.trim() };
    setMessages((prev) => [...prev, userMsg]);
    const q = userMsg.text;
    setInput("");

    setTimeout(() => {
      const reply = getResponse(q, lang);
      setMessages((prev) => [...prev, { role: "assistant", text: reply }]);
    }, 450);
  }, [input, lang]);

  return (
    <>
      <motion.button
        type="button"
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-6 z-[55] w-14 h-14 rounded-full bg-primary text-white shadow-lg hover:shadow-xl flex items-center justify-center transition-all hover:scale-105"
        aria-label="Open SETV assistant"
      >
        {open ? <X size={24} /> : <MessageCircle size={24} />}
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-24 right-6 z-[54] w-[380px] max-w-[calc(100vw-3rem)] h-[min(420px,70vh)] glass-card rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-slate-200/80"
          >
            <div className="p-4 border-b border-slate-200 bg-white/90">
              <h3 className="font-bold text-slate-800">SETV Women Wellness Assistant</h3>
              <p className="text-xs text-slate-500">
                {getUserFirstName()
                  ? `Signed in as ${getUserFirstName()} · Dashboard & site help`
                  : "Dashboard, screening & site help · Sign in for a personalized greeting"}
              </p>
              <div className="flex flex-wrap gap-1 mt-2">
                {Object.entries(LANGUAGES).map(([key, { label }]) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setLang(key)}
                    className={`px-2 py-1 rounded text-xs font-medium ${
                      lang === key ? "bg-primary text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50/50">
              {messages.map((m, i) => (
                <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[90%] rounded-2xl px-3 py-2 text-sm whitespace-pre-wrap leading-relaxed ${
                      m.role === "user"
                        ? "bg-primary text-white rounded-br-md"
                        : "bg-white text-slate-800 border border-slate-200 rounded-bl-md shadow-sm"
                    }`}
                  >
                    {m.text.split("**").map((chunk, j) => (j % 2 === 1 ? <strong key={j}>{chunk}</strong> : <span key={j}>{chunk}</span>))}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            <div className="p-3 border-t border-slate-200 bg-white flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                placeholder="Ask about dashboard, map, screening…"
                className="flex-1 px-3 py-2.5 rounded-xl border border-slate-200 text-slate-800 placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm"
              />
              <button
                type="button"
                onClick={sendMessage}
                className="p-2.5 rounded-xl bg-primary text-white hover:bg-primary/90 transition-colors"
                aria-label="Send"
              >
                <Send size={20} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
