import { HEALTH_IMAGES } from "../assets/healthImages";

/**
 * Full blog library: listing uses all fields; article page uses `sections` + `takeaways`.
 */
export const blogArticles = [
  {
    id: 1,
    slug: "early-detection-breast-cancer",
    featured: true,
    title: "Understanding Breast Cancer: Early Detection Saves Lives",
    excerpt:
      "Learn about the importance of regular screenings and self-examinations in detecting breast cancer at its earliest stages.",
    category: "breast",
    author: "Dr. Priya Sharma",
    date: "Mar 8, 2026",
    readTime: "12 min read",
    likes: 234,
    comments: 45,
    image: HEALTH_IMAGES.breastScreening,
    sections: [
      {
        title: "Why early detection matters",
        paragraphs: [
          "When breast cancer is found early, before it has spread, treatment is often less intensive and outcomes are generally better. That is why screening programs and knowing your own body both play a role.",
          "Guidelines for mammography and supplemental imaging depend on your age, family history, breast density, and prior results. Your clinician can personalize the schedule—there is no one-size-fits-all plan for every woman.",
        ],
      },
      {
        title: "Screening tools you may hear about",
        paragraphs: [
          "Mammography uses low-dose X-rays to image breast tissue. Ultrasound is sometimes added, especially when tissue is dense. MRI may be used for higher-risk individuals. Each tool answers slightly different questions.",
          "Artificial intelligence can assist radiologists in highlighting areas that deserve a second look; it does not replace human judgment or the need for follow-up tests when something is uncertain.",
        ],
      },
      {
        title: "Self-awareness vs. self-exam",
        paragraphs: [
          "Many organizations emphasize breast self-awareness: noticing what is normal for you in terms of shape, texture, and cyclical changes. Report new lumps, skin dimpling, nipple discharge, or persistent pain to a clinician—not to a search engine.",
          "If you notice a change, try not to panic; many findings are benign. Do book an appointment promptly so you can get clarity and a plan.",
        ],
      },
      {
        title: "Risk factors (a short overview)",
        paragraphs: [
          "Age, certain genetic mutations, strong family history, prior chest radiation at a young age, and some hormonal exposures can affect risk. Having risk factors does not mean you will develop cancer; many people with no known risk factors do.",
          "Discuss risk assessment tools (for example, family-history questionnaires) with your doctor if several relatives have had breast or ovarian cancer.",
        ],
      },
    ],
    takeaways: [
      "Ask your doctor when to start mammography and how often.",
      "Know what is normal for your breasts and report changes early.",
      "Screening complements—but does not replace—clinical exams when needed.",
    ],
  },
  {
    id: 2,
    slug: "pcos-diet-foods",
    title: "PCOS Diet: Foods That Help Manage Symptoms",
    excerpt: "Discover the best foods to include in your diet if you have PCOS and what to avoid.",
    category: "pcos",
    author: "Dr. Anitha Reddy",
    date: "Mar 5, 2026",
    readTime: "10 min read",
    likes: 189,
    comments: 32,
    image: HEALTH_IMAGES.patientCare,
    sections: [
      {
        title: "PCOS and metabolism",
        paragraphs: [
          "Polycystic ovary syndrome (PCOS) often involves insulin resistance and irregular cycles. Food choices can support steadier blood sugar, which in turn may help energy, weight, and skin for some people.",
          "This article is general education; your dietitian may recommend a different macronutrient mix based on your labs, culture, and preferences.",
        ],
      },
      {
        title: "Foods to emphasize",
        paragraphs: [
          "Fiber-rich vegetables, legumes, and whole grains slow digestion and can reduce glucose spikes. Lean proteins (fish, poultry, tofu, lentils) help satiety.",
          "Anti-inflammatory patterns—nuts, olive oil, colorful produce—are reasonable defaults unless you have allergies or intolerances.",
        ],
      },
      {
        title: "What to limit (for many people)",
        paragraphs: [
          "Frequent sugary drinks, large portions of refined flour, and ultra-processed snacks can worsen insulin swings for some women with PCOS.",
          "Alcohol and caffeine affect everyone differently; discuss amounts with your clinician, especially if sleep is poor.",
        ],
      },
      {
        title: "Meal timing and consistency",
        paragraphs: [
          "Skipping meals all day then eating heavily at night can make glucose harder to control. Regular meals with protein + fiber are a practical starting point.",
          "If you take medications for glucose or other conditions, align eating patterns with your prescriber’s instructions.",
        ],
      },
    ],
    takeaways: [
      "Prioritize fiber, protein, and whole foods most of the time.",
      "Work with a dietitian for a culturally appropriate plan.",
      "Pair diet changes with sleep, stress care, and prescribed treatment.",
    ],
  },
  {
    id: 3,
    slug: "living-with-fibroids",
    title: "Living with Fibroids: What You Need to Know",
    excerpt: "A comprehensive guide to understanding uterine fibroids and treatment options available.",
    category: "fibroid",
    author: "Dr. Lakshmi Rao",
    date: "Mar 3, 2026",
    readTime: "11 min read",
    likes: 156,
    comments: 28,
    image: HEALTH_IMAGES.healthcare,
    sections: [
      {
        title: "What are fibroids?",
        paragraphs: [
          "Uterine fibroids (leiomyomas) are non-cancerous growths in or on the uterus. They are common, especially in the 30s–40s, and many cause no symptoms.",
          "Size, number, and location (inside the cavity, in the wall, or on the outer surface) influence symptoms like heavy bleeding, pressure, or fertility concerns.",
        ],
      },
      {
        title: "Symptoms to track",
        paragraphs: [
          "Heavy menstrual bleeding (soaking through pads quickly, clots), pelvic pressure, frequent urination, constipation, or pain with periods may be related to fibroids—but other conditions can mimic these symptoms.",
          "A symptom diary (flow days, pain scale, anemia symptoms like fatigue) helps your gynecologist decide on tests.",
        ],
      },
      {
        title: "Diagnosis",
        paragraphs: [
          "Pelvic ultrasound is often the first imaging step. MRI is sometimes used for surgical planning. Your history and exam guide the pathway.",
        ],
      },
      {
        title: "Treatment spectrum",
        paragraphs: [
          "Options range from watchful waiting to medications (hormonal and non-hormonal), minimally invasive procedures, and surgery. Fertility goals and symptom severity steer the choice.",
          "Emerging therapies vary by region and hospital; ask what is available where you receive care.",
        ],
      },
    ],
    takeaways: [
      "Not all fibroids need immediate intervention.",
      "Heavy bleeding deserves medical review—anemia can develop quietly.",
      "Bring your fertility goals to every consultation.",
    ],
  },
  {
    id: 4,
    slug: "breast-self-awareness-guide",
    title: "The Power of Self-Examination: A Step-by-Step Guide",
    excerpt: "Learn how to perform breast self-examination correctly and what to look for.",
    category: "breast",
    author: "Dr. Priya Sharma",
    date: "Feb 28, 2026",
    readTime: "8 min read",
    likes: 312,
    comments: 67,
    image: HEALTH_IMAGES.womenWellness,
    sections: [
      {
        title: "Mindset: awareness first",
        paragraphs: [
          "Guidelines evolve, but consistency matters: know the usual look and feel of your breasts across the month if you still menstruate (tissue can feel lumpier before a period).",
          "A formal monthly self-exam on a schedule is optional for some guidelines; awareness is widely encouraged.",
        ],
      },
      {
        title: "Practical steps",
        paragraphs: [
          "Stand before a mirror: arms at sides, then raised—look for dimpling, puckering, or nipple changes.",
          "Lying down, use the pads of three fingers in small circles from the outer breast toward the nipple, covering all quadrants and the underarm tail.",
        ],
      },
      {
        title: "When to call your doctor",
        paragraphs: [
          "New hard lump, persistent focal pain, nipple discharge (especially bloody or from one duct), skin changes like orange peel texture, or swelling should prompt an appointment.",
        ],
      },
    ],
    takeaways: ["Changes persist for more than one cycle—get checked.", "Breast cancer is not only a disease of older age."],
  },
  {
    id: 5,
    slug: "exercise-womens-health",
    title: "Exercise and Women's Health: Finding the Right Balance",
    excerpt: "How regular physical activity can help prevent and manage various women's health conditions.",
    category: "wellness",
    author: "Dr. Sunita Devi",
    date: "Feb 25, 2026",
    readTime: "9 min read",
    likes: 201,
    comments: 41,
    image: HEALTH_IMAGES.mobileHealth,
    sections: [
      {
        title: "Benefits across the lifespan",
        paragraphs: [
          "Movement supports bone density (especially important around menopause), mood, sleep, blood pressure, and glucose regulation.",
          "For PCOS, fibroid-related fatigue, or postpartum recovery, the right dose of activity is individualized.",
        ],
      },
      {
        title: "How much is enough?",
        paragraphs: [
          "Many public health bodies suggest roughly 150 minutes per week of moderate activity plus strength training twice weekly, but start where you are.",
          "If you have heart disease, severe anemia, or pregnancy complications, ask before intensifying.",
        ],
      },
      {
        title: "Making it stick",
        paragraphs: [
          "Habit stacking (walk after lunch), social exercise, and enjoyable activities beat rigid plans you dread.",
        ],
      },
    ],
    takeaways: ["Something is better than nothing.", "Strength training matters for bones and metabolism."],
  },
  {
    id: 6,
    slug: "nutrition-hormonal-balance",
    title: "Nutrition Tips for Hormonal Balance",
    excerpt: "Essential nutrients and dietary changes that support hormonal health in women.",
    category: "nutrition",
    author: "Nutritionist Kavya",
    date: "Feb 22, 2026",
    readTime: "9 min read",
    likes: 178,
    comments: 35,
    image: HEALTH_IMAGES.aiDiagnosis,
    sections: [
      {
        title: "Foundations",
        paragraphs: [
          "Hormones depend on adequate protein, healthy fats, and micronutrients. Chronic undereating can disrupt cycles.",
          "Vitamin D, iron, B12, and iodine are common discussion points in clinic—deficiencies should be corrected with guidance, not guesswork.",
        ],
      },
      {
        title: "Blood sugar stability",
        paragraphs: [
          "Pairing carbohydrates with protein/fiber reduces swings that some women link to mood or cravings.",
        ],
      },
      {
        title: "Gut health",
        paragraphs: [
          "Fiber and fermented foods may support microbiome diversity; evidence linking diet to estrogen recycling is evolving.",
        ],
      },
    ],
    takeaways: ["Test before megadosing supplements.", "Whole-food patterns beat single ‘superfoods’."],
  },
  {
    id: 7,
    slug: "mammography-what-to-expect",
    title: "Mammography: What to Expect at Your First Screening",
    excerpt: "Reduce anxiety by knowing how the appointment works, how to prepare, and how results are communicated.",
    category: "breast",
    author: "Dr. Priya Sharma",
    date: "Feb 18, 2026",
    readTime: "7 min read",
    likes: 142,
    comments: 19,
    image: HEALTH_IMAGES.radiology,
    sections: [
      {
        title: "Before you go",
        paragraphs: [
          "Wear a two-piece outfit; avoid deodorant or powders on the chest if your center requests it—they can show up as artifacts on the image.",
          "Bring prior images if you moved cities so radiologists can compare for subtle changes.",
        ],
      },
      {
        title: "During the exam",
        paragraphs: [
          "Each breast is compressed briefly to spread tissue for a clear picture. It feels tight but lasts seconds.",
          "3D mammography (tomosynthesis) takes multiple low-dose images; the experience is similar from your perspective.",
        ],
      },
      {
        title: "Results and callbacks",
        paragraphs: [
          "A ‘callback’ for extra views is common and often resolves as benign. It still deserves follow-through so nothing is missed.",
        ],
      },
    ],
    takeaways: ["Callbacks are not automatically bad news.", "Keep a file of your reports over time."],
  },
  {
    id: 8,
    slug: "pcos-fertility-pathways",
    title: "PCOS and Fertility: Pathways to Discuss With Your Doctor",
    excerpt: "How ovulation works with PCOS and which medical options exist—without replacing specialist advice.",
    category: "pcos",
    author: "Dr. Anitha Reddy",
    date: "Feb 14, 2026",
    readTime: "10 min read",
    likes: 267,
    comments: 54,
    image: HEALTH_IMAGES.pcosService,
    sections: [
      {
        title: "Why cycles may be irregular",
        paragraphs: [
          "In PCOS, ovulation may be infrequent. Without predictable ovulation, timing conception is harder—but many people conceive with support.",
        ],
      },
      {
        title: "Lifestyle first-line",
        paragraphs: [
          "Modest weight change (if medically appropriate), sleep, and stress care can improve ovulation for some.",
        ],
      },
      {
        title: "Medical options (overview)",
        paragraphs: [
          "Medications such as letrozole or clomiphene are commonly used under supervision. Injectable hormones and IVF are steps for some journeys.",
          "Never start prescription fertility drugs without monitoring—ovarian hyperstimulation is a real risk.",
        ],
      },
    ],
    takeaways: ["Track cycles or use ovulation kits if your doctor agrees.", "Both partners may need evaluation."],
  },
  {
    id: 9,
    slug: "iron-women-health",
    title: "Iron, Fatigue, and Women's Health",
    excerpt: "Heavy periods, pregnancy, and diet can all affect iron—here is how to think about it with your clinician.",
    category: "nutrition",
    author: "Nutritionist Kavya",
    date: "Feb 10, 2026",
    readTime: "8 min read",
    likes: 198,
    comments: 27,
    image: HEALTH_IMAGES.medicalLab,
    sections: [
      {
        title: "Signs of low iron",
        paragraphs: [
          "Fatigue, hair shedding, restless legs, pallor, or shortness of breath on exertion can occur with iron deficiency anemia—but thyroid issues, sleep apnea, and depression can overlap.",
        ],
      },
      {
        title: "Diet sources",
        paragraphs: [
          "Haem iron (meat, fish) is absorbed more easily; plant iron pairs well with vitamin C sources.",
          "Calcium-rich foods and some teas can reduce absorption if taken at the same moment as iron pills.",
        ],
      },
      {
        title: "Testing",
        paragraphs: [
          "Ferritin, CBC, and sometimes CRP help interpret stores. Treat the cause (e.g., heavy bleeding) plus replace iron if prescribed.",
        ],
      },
    ],
    takeaways: ["Do not self-treat indefinitely with high-dose iron.", "Heavy periods + fatigue = gynecology visit."],
  },
  {
    id: 10,
    slug: "sleep-stress-hormones",
    title: "Sleep, Stress, and Your Hormones",
    excerpt: "Why rest and nervous-system regulation matter for cycles, mood, and metabolic health.",
    category: "wellness",
    author: "Dr. Sunita Devi",
    date: "Feb 6, 2026",
    readTime: "8 min read",
    likes: 165,
    comments: 22,
    image: HEALTH_IMAGES.darkHospital,
    sections: [
      {
        title: "The stress–cycle link",
        paragraphs: [
          "Major stress can delay or skip periods for some; chronic poor sleep affects cortisol, appetite hormones, and glucose.",
        ],
      },
      {
        title: "Practical sleep hygiene",
        paragraphs: [
          "Consistent wake time, dim light before bed, cooler room, and limiting late caffeine help broadly.",
        ],
      },
      {
        title: "When to seek help",
        paragraphs: [
          "Snoring, gasping, or daytime sleepiness may warrant sleep-apnea evaluation. Persistent insomnia benefits from CBT-I or medical review.",
        ],
      },
    ],
    takeaways: ["Protect sleep like a vital sign.", "Mental health care is health care."],
  },
  {
    id: 11,
    slug: "cervical-screening-basics",
    title: "Cervical Screening Basics: Pap and HPV Tests",
    excerpt: "A plain-language overview of why screening exists and how often guidelines suggest testing.",
    category: "wellness",
    author: "Dr. Anitha Reddy",
    date: "Feb 2, 2026",
    readTime: "7 min read",
    likes: 124,
    comments: 16,
    image: HEALTH_IMAGES.ultrasound,
    sections: [
      {
        title: "What we are looking for",
        paragraphs: [
          "Screening finds precancerous changes on the cervix, usually related to HPV, so they can be treated before cancer develops.",
        ],
      },
      {
        title: "HPV vaccination",
        paragraphs: [
          "Vaccines prevent many high-risk HPV types; screening still matters for people who were exposed before vaccination or to other types.",
        ],
      },
      {
        title: "Guidelines vary",
        paragraphs: [
          "Intervals depend on age, prior results, and whether HPV testing is combined with cytology. Follow local national guidance and your doctor’s letter.",
        ],
      },
    ],
    takeaways: ["Normal results don’t mean skip forever—know your next due date.", "Abnormal results often need follow-up, not panic."],
  },
  {
    id: 12,
    slug: "postpartum-recovery",
    title: "Postpartum Recovery: Physical and Emotional Checkpoints",
    excerpt: "Weeks after delivery, your body and mood deserve structured check-ins—not ‘bounce back’ pressure.",
    category: "wellness",
    author: "Dr. Lakshmi Rao",
    date: "Jan 28, 2026",
    readTime: "9 min read",
    likes: 210,
    comments: 38,
    image: HEALTH_IMAGES.chatSupport,
    sections: [
      {
        title: "Bleeding and healing",
        paragraphs: [
          "Lochia changes color over weeks. Fever, worsening pain, or foul-smelling discharge needs urgent review.",
        ],
      },
      {
        title: "Pelvic floor",
        paragraphs: [
          "Leaking urine, heaviness, or pain with intercourse are common and treatable—pelvic physiotherapy helps many.",
        ],
      },
      {
        title: "Mood",
        paragraphs: [
          "Baby blues peak around day 3–5; depression or anxiety that persists or includes intrusive thoughts requires compassionate medical care.",
        ],
      },
    ],
    takeaways: ["You are not failing if recovery is slow.", "Partners should watch for red flags too."],
  },
  {
    id: 13,
    slug: "breast-pain-explained",
    title: "Breast Pain Explained: Cyclical vs. Non-Cyclical",
    excerpt: "Most breast pain is benign—learn patterns that are reassuring and those that deserve a visit.",
    category: "breast",
    author: "Dr. Priya Sharma",
    date: "Jan 22, 2026",
    readTime: "6 min read",
    likes: 176,
    comments: 29,
    image: HEALTH_IMAGES.breastHealth,
    sections: [
      {
        title: "Cyclical pain",
        paragraphs: [
          "Hormonal fluctuation can cause bilateral aching or tenderness before periods; supportive bras and gentle NSAIDs if appropriate may help.",
        ],
      },
      {
        title: "Non-cyclical or focal pain",
        paragraphs: [
          "Pain in one spot that is persistent, or associated with a mass or skin change, should be examined even if you recently had a normal mammogram.",
        ],
      },
      {
        title: "Chest wall sources",
        paragraphs: [
          "Costochondritis and muscle strain can mimic breast pain; clinical exam helps separate these.",
        ],
      },
    ],
    takeaways: ["Pain alone is rarely the only sign of cancer—but don’t ignore persistent focal symptoms.", "Well-fitted bras matter."],
  },
  {
    id: 14,
    slug: "when-to-see-gynecologist",
    title: "When to See a Gynecologist: 12 Clear Reasons",
    excerpt: "From first periods to menopause—situations where a specialist visit is worthwhile.",
    category: "wellness",
    author: "Dr. Anitha Reddy",
    date: "Jan 15, 2026",
    readTime: "8 min read",
    likes: 303,
    comments: 61,
    image: HEALTH_IMAGES.landingDoctor,
    sections: [
      {
        title: "Cycle and bleeding",
        paragraphs: [
          "Bleeding between periods, after intercourse, or soaking through protection hourly warrants evaluation. Skipped periods for three months (if not pregnant) too.",
        ],
      },
      {
        title: "Pain and infection symptoms",
        paragraphs: [
          "Severe pelvic pain, fever with pelvic symptoms, or recurrent discharge/itching should be reviewed.",
        ],
      },
      {
        title: "Planning and prevention",
        paragraphs: [
          "Preconception counseling, contraception changes, HPV vaccine questions, and menopause symptoms are all valid reasons to book.",
        ],
      },
    ],
    takeaways: ["You don’t need to ‘wait until it’s unbearable.’", "Bring a list of medications and dates."],
  },
  {
    id: 15,
    slug: "mediterranean-meal-ideas",
    title: "Mediterranean-Style Meal Ideas for Busy Weeks",
    excerpt: "Simple plate templates that support heart and metabolic health—adapted for Indian kitchens too.",
    category: "nutrition",
    author: "Nutritionist Kavya",
    date: "Jan 10, 2026",
    readTime: "7 min read",
    likes: 154,
    comments: 18,
    image: HEALTH_IMAGES.fibroidService,
    sections: [
      {
        title: "Plate template",
        paragraphs: [
          "Half vegetables (cooked or salad), quarter protein (dal, fish, egg, paneer in moderation), quarter whole grains or millet.",
        ],
      },
      {
        title: "Snacks",
        paragraphs: [
          "Roasted chana, fruit with yogurt, or a small handful of nuts beat frequent fried or sugary tea snacks for steady energy.",
        ],
      },
      {
        title: "Cooking oils",
        paragraphs: [
          "Rotate oils as culturally appropriate; avoid repeatedly super-heating the same frying oil.",
        ],
      },
    ],
    takeaways: ["Batch-cook grains and dal twice a week.", "Flavor with herbs and citrus, not only salt."],
  },
  {
    id: 16,
    slug: "ai-assisted-screening-setv",
    title: "How AI-Assisted Screening Fits Into Your Care",
    excerpt: "What SETV-style workflows do—and what still requires your doctor’s judgment.",
    category: "breast",
    author: "SETV Clinical Education",
    date: "Jan 5, 2026",
    readTime: "6 min read",
    likes: 98,
    comments: 12,
    image: HEALTH_IMAGES.aiDiagnosis,
    sections: [
      {
        title: "Decision support, not replacement",
        paragraphs: [
          "Algorithms can flag regions on imaging or triage video-based workflows, but only licensed clinicians diagnose and prescribe.",
        ],
      },
      {
        title: "Your role",
        paragraphs: [
          "Upload quality video when prompted, complete history fields honestly, and follow up on any ‘needs review’ result promptly.",
        ],
      },
    ],
    takeaways: ["Ask how to interpret confidence scores in your portal.", "Keep offline copies of reports when offered."],
  },
];

export function getArticleBySlug(slug) {
  return blogArticles.find((a) => a.slug === slug) ?? null;
}

export function getFeaturedArticle() {
  return blogArticles.find((a) => a.featured) ?? blogArticles[0];
}

export function getListPosts() {
  return blogArticles.filter((a) => !a.featured);
}

export function getRelatedArticles(slug, category, limit = 3) {
  return blogArticles.filter((a) => a.slug !== slug && a.category === category).slice(0, limit);
}

/** Plain text for search */
export function articleSearchBlob(a) {
  const sectionText = (a.sections || [])
    .flatMap((s) => [s.title, ...(s.paragraphs || [])])
    .join(" ");
  const take = (a.takeaways || []).join(" ");
  return `${a.title} ${a.excerpt} ${sectionText} ${take}`.toLowerCase();
}
