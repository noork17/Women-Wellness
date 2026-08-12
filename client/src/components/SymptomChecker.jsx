import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  AlertTriangle,
  AlertCircle,
  Heart,
  Activity,
  Stethoscope,
  Brain,
  Calendar,
  RefreshCw,
  Phone,
  Shield,
  Sparkles,
} from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

const STORAGE_LAST = "setv_symptom_checker_last";

const SymptomChecker = () => {
  const [started, setStarted] = useState(false);
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showResult, setShowResult] = useState(false);

  const questions = [
    {
      id: "age",
      question: "What is your age group?",
      type: "single",
      options: ["Under 30", "30-40", "40-50", "50-60", "Over 60"],
    },
    {
      id: "breast_lump",
      question: "Have you noticed any lumps or thickening in your breast or underarm area?",
      type: "single",
      category: "Breast health",
      options: ["Yes, recently", "Yes, but it's been there for a while", "No", "Not sure"],
    },
    {
      id: "breast_changes",
      question: "Have you noticed any changes in your breast?",
      type: "multi",
      category: "Breast health",
      options: [
        "Change in size or shape",
        "Skin dimpling or puckering",
        "Nipple changes or discharge",
        "Redness or rash",
        "Breast pain",
        "None of these",
      ],
    },
    {
      id: "period_regularity",
      question: "How would you describe your menstrual cycle?",
      type: "single",
      category: "Hormonal / PCOS",
      options: [
        "Regular (21-35 days)",
        "Irregular",
        "Very heavy bleeding",
        "Very light or missed periods",
        "Stopped/Menopause",
      ],
    },
    {
      id: "pcos_symptoms",
      question: "Do you experience any of the following?",
      type: "multi",
      category: "Hormonal / PCOS",
      options: [
        "Excessive facial/body hair",
        "Acne or oily skin",
        "Weight gain (especially around waist)",
        "Difficulty losing weight",
        "Hair thinning on scalp",
        "None of these",
      ],
    },
    {
      id: "pelvic_symptoms",
      question: "Do you experience any pelvic symptoms?",
      type: "multi",
      category: "Fibroids / pelvic",
      options: [
        "Heavy menstrual bleeding",
        "Pelvic pain or pressure",
        "Frequent urination",
        "Constipation",
        "Lower back pain",
        "None of these",
      ],
    },
    {
      id: "family_history",
      question: "Do you have a family history of any of these conditions?",
      type: "multi",
      options: ["Breast cancer", "Ovarian cancer", "PCOS", "Uterine fibroids", "None that I know of"],
    },
    {
      id: "last_screening",
      question: "When was your last health screening?",
      type: "single",
      options: [
        "Within last 6 months",
        "6-12 months ago",
        "1-2 years ago",
        "More than 2 years ago",
        "Never had one",
      ],
    },
  ];

  const handleAnswer = (questionId, answer, isMulti = false) => {
    if (isMulti) {
      const current = answers[questionId] || [];
      let updated;
      if (answer === "None of these") {
        updated = current.includes("None of these") ? [] : ["None of these"];
      } else {
        const withoutNone = current.filter((a) => a !== "None of these");
        updated = withoutNone.includes(answer)
          ? withoutNone.filter((a) => a !== answer)
          : [...withoutNone, answer];
      }
      setAnswers({ ...answers, [questionId]: updated });
    } else {
      setAnswers({ ...answers, [questionId]: answer });
    }
  };

  const calculateRisk = () => {
    let breastRisk = 0;
    let pcosRisk = 0;
    let fibroidRisk = 0;

    if (answers.breast_lump === "Yes, recently") breastRisk += 40;
    if (answers.breast_lump === "Yes, but it's been there for a while") breastRisk += 25;
    if (answers.breast_changes?.length > 0 && !answers.breast_changes.includes("None of these")) {
      breastRisk += Math.min(answers.breast_changes.length * 10, 40);
    }
    if (answers.family_history?.includes("Breast cancer")) breastRisk += 20;
    if (answers.age === "Over 60") breastRisk += 15;
    if (answers.age === "50-60") breastRisk += 10;

    if (answers.period_regularity === "Irregular") pcosRisk += 30;
    if (answers.period_regularity === "Very light or missed periods") pcosRisk += 25;
    if (answers.pcos_symptoms?.length > 0 && !answers.pcos_symptoms.includes("None of these")) {
      pcosRisk += Math.min(answers.pcos_symptoms.length * 12, 48);
    }
    if (answers.family_history?.includes("PCOS")) pcosRisk += 15;

    if (answers.pelvic_symptoms?.length > 0 && !answers.pelvic_symptoms.includes("None of these")) {
      fibroidRisk += Math.min(answers.pelvic_symptoms.length * 15, 60);
    }
    if (answers.family_history?.includes("Uterine fibroids")) fibroidRisk += 15;
    if (answers.period_regularity === "Very heavy bleeding") fibroidRisk += 20;

    return {
      breast: Math.min(breastRisk, 100),
      pcos: Math.min(pcosRisk, 100),
      fibroid: Math.min(fibroidRisk, 100),
    };
  };

  const getRiskLevel = (score) => {
    if (score < 20) return { level: "Low", color: "text-emerald-400", bg: "bg-emerald-500/10" };
    if (score < 50) return { level: "Moderate", color: "text-amber-400", bg: "bg-amber-500/10" };
    return { level: "Elevated", color: "text-rose-400", bg: "bg-rose-500/10" };
  };

  const urgentBreastFlags = useMemo(() => {
    const lumpRecent = answers.breast_lump === "Yes, recently";
    const changes = answers.breast_changes || [];
    const badChange =
      changes.includes("Nipple changes or discharge") ||
      changes.includes("Skin dimpling or puckering") ||
      changes.includes("Redness or rash");
    return lumpRecent || badChange;
  }, [answers]);

  const screeningTip = useMemo(() => {
    const v = answers.last_screening;
    if (v === "Never had one" || v === "More than 2 years ago") {
      return "You indicated it has been a while since a full screening—booking a wellness visit is a good next step.";
    }
    if (v === "1-2 years ago") {
      return "Consider scheduling your next screening within the next few months if your clinician agrees.";
    }
    return null;
  }, [answers.last_screening]);

  const buildRecommendations = (risk) => {
    const items = [];
    if (urgentBreastFlags) {
      items.push({
        urgent: true,
        text: "New lump, nipple discharge, skin changes, or redness can need prompt clinical assessment—please contact a doctor or clinic soon (emergency services if severe or sudden).",
      });
    }
    if (risk.breast >= 20) {
      items.push({ text: "Book a breast clinical exam or screening pathway offered on SETV (after login)." });
    }
    if (risk.pcos >= 20) {
      items.push({ text: "Discuss cycle changes, weight, and skin symptoms with a gynecologist—PCOS is manageable with the right plan." });
    }
    if (risk.fibroid >= 20) {
      items.push({ text: "Heavy bleeding or pelvic pressure may warrant ultrasound evaluation—ask your provider about next steps." });
    }
    if (screeningTip) items.push({ text: screeningTip });
    items.push({ text: "Keep doing monthly breast self-awareness (notice what is normal for you)." });
    items.push({ text: "Bring this summary to your appointment; it is not a diagnosis." });
    return items;
  };

  const currentQuestion = questions[step];
  const progress = started && !showResult ? ((step + 1) / questions.length) * 100 : 0;
  const risk = showResult ? calculateRisk() : null;
  const recommendations = risk ? buildRecommendations(risk) : [];

  const canProceed = currentQuestion?.type === "multi"
    ? (answers[currentQuestion.id]?.length ?? 0) > 0
    : Boolean(answers[currentQuestion?.id]);

  const restart = () => {
    setShowResult(false);
    setStep(0);
    setAnswers({});
    setStarted(false);
  };

  const finishAssessment = () => {
    const r = calculateRisk();
    setShowResult(true);
    try {
      localStorage.setItem(
        STORAGE_LAST,
        JSON.stringify({ at: new Date().toISOString(), answers, risk: r })
      );
      toast.success("Summary saved on this device for your reference");
    } catch {
      toast.success("Assessment complete");
    }
  };

  const optionShape = currentQuestion?.type === "multi" ? "rounded-md" : "rounded-full";

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <Toaster position="top-right" />
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950" />
        <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-teal-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-violet-500/5 rounded-full blur-3xl" />
      </div>

      <header className="relative z-10 px-6 py-4 border-b border-slate-800">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
            <ArrowLeft size={18} />
            <span className="text-sm">Back</span>
          </Link>
          <h1 className="text-lg font-bold flex items-center gap-2">
            <Brain size={20} className="text-teal-400" />
            Symptom Checker
          </h1>
          <div className="w-16" />
        </div>
      </header>

      <div className="relative z-10 max-w-2xl mx-auto px-6 py-8">
        {!started && !showResult && (
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <div className="text-center mb-2">
              <div className="w-16 h-16 rounded-2xl bg-teal-500/15 flex items-center justify-center mx-auto mb-4">
                <Sparkles className="text-teal-400" size={32} />
              </div>
              <h2 className="text-2xl font-bold">Women&apos;s wellness symptom guide</h2>
              <p className="text-slate-400 mt-2 text-sm max-w-md mx-auto">
                A short questionnaire about breast changes, cycles, pelvic symptoms, and family history. Output is a
                <strong className="text-slate-300"> general risk-style summary</strong>—not a medical diagnosis.
              </p>
            </div>

            <div className="bg-slate-900/50 rounded-2xl border border-slate-800 p-5 space-y-3 text-sm text-slate-300">
              <p className="font-semibold text-white flex items-center gap-2">
                <Shield size={16} className="text-teal-400" /> What you get
              </p>
              <ul className="list-disc list-inside space-y-1 text-slate-400">
                <li>Three scores (breast-related, PCOS-related, fibroid-related) with low / moderate / elevated bands</li>
                <li>Practical next steps and links to screening &amp; booking</li>
                <li>Optional save of your last run on this device only</li>
              </ul>
            </div>

            <div className="bg-rose-500/10 border border-rose-500/25 rounded-xl p-4 flex gap-3 text-sm">
              <AlertTriangle className="text-rose-400 shrink-0 mt-0.5" size={20} />
              <p className="text-rose-100/90">
                If you have severe pain, heavy bleeding, fever with breast redness, or sudden shortness of breath, seek
                urgent in-person care or call your local emergency number.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setStarted(true)}
              className="w-full py-4 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-500 font-semibold hover:shadow-lg hover:shadow-teal-500/20 transition-all"
            >
              Start questionnaire ({questions.length} steps)
            </button>
            <div className="flex flex-wrap gap-3 justify-center text-xs text-slate-500">
              <Link to="/risk-calculator" className="text-teal-400 hover:underline">
                Risk calculator
              </Link>
              <span>·</span>
              <Link to="/book-appointment" className="text-teal-400 hover:underline">
                Book appointment
              </Link>
              <span>·</span>
              <Link to="/health-tracker" className="text-teal-400 hover:underline">
                Health tracker
              </Link>
            </div>
          </motion.div>
        )}

        {started && !showResult && (
          <>
            <div className="mb-8">
              <div className="flex justify-between text-sm text-slate-400 mb-2">
                <span>
                  Question {step + 1} of {questions.length}
                </span>
                <span>{Math.round(progress)}% complete</span>
              </div>
              <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-teal-500 to-emerald-500"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                />
              </div>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="bg-slate-900/50 rounded-3xl border border-slate-800 p-6"
              >
                {currentQuestion.category && (
                  <p className="text-xs font-medium text-teal-400/90 mb-2 uppercase tracking-wide">
                    {currentQuestion.category}
                  </p>
                )}
                <h2 className="text-xl font-bold mb-6">{currentQuestion.question}</h2>

                <div className="space-y-3">
                  {currentQuestion.options.map((option, i) => {
                    const isSelected =
                      currentQuestion.type === "multi"
                        ? answers[currentQuestion.id]?.includes(option)
                        : answers[currentQuestion.id] === option;

                    return (
                      <button
                        key={i}
                        type="button"
                        onClick={() => handleAnswer(currentQuestion.id, option, currentQuestion.type === "multi")}
                        className={`w-full p-4 rounded-xl border text-left transition-all flex items-center gap-3 ${
                          isSelected
                            ? "bg-teal-500/10 border-teal-500"
                            : "bg-slate-800/50 border-slate-700 hover:border-slate-600"
                        }`}
                      >
                        <div
                          className={`w-5 h-5 ${optionShape} border-2 flex items-center justify-center shrink-0 ${
                            isSelected ? "border-teal-500 bg-teal-500" : "border-slate-600"
                          }`}
                        >
                          {isSelected && <CheckCircle size={12} className="text-white" />}
                        </div>
                        <span className={isSelected ? "text-white" : "text-slate-300"}>{option}</span>
                      </button>
                    );
                  })}
                </div>

                {currentQuestion.type === "multi" && (
                  <p className="text-xs text-slate-500 mt-4">Select all that apply. Choosing &quot;None of these&quot; clears other options.</p>
                )}
              </motion.div>
            </AnimatePresence>

            <div className="flex justify-between mt-6">
              <button
                type="button"
                onClick={() => (step === 0 ? setStarted(false) : setStep(step - 1))}
                className="px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 flex items-center gap-2 transition-colors"
              >
                <ArrowLeft size={18} /> {step === 0 ? "Exit" : "Back"}
              </button>

              {step < questions.length - 1 ? (
                <button
                  type="button"
                  onClick={() => setStep(step + 1)}
                  disabled={!canProceed}
                  className="px-6 py-3 rounded-xl bg-teal-500 hover:bg-teal-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition-colors"
                >
                  Next <ArrowRight size={18} />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={finishAssessment}
                  disabled={!canProceed}
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-500 hover:shadow-lg hover:shadow-teal-500/25 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition-all font-semibold"
                >
                  Get Results <CheckCircle size={18} />
                </button>
              )}
            </div>
          </>
        )}

        {showResult && risk && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="text-center mb-8">
              <div className="w-20 h-20 rounded-full bg-teal-500/10 flex items-center justify-center mx-auto mb-4">
                <CheckCircle size={40} className="text-teal-400" />
              </div>
              <h2 className="text-2xl font-bold">Assessment complete</h2>
              <p className="text-slate-400 mt-2 text-sm">Educational summary only—your clinician makes the diagnosis.</p>
            </div>

            {urgentBreastFlags && (
              <div className="bg-rose-500/15 border border-rose-500/40 rounded-xl p-4 mb-6 flex gap-3">
                <Phone className="text-rose-400 shrink-0" size={22} />
                <div className="text-sm">
                  <p className="font-semibold text-rose-200">Priority: speak with a doctor soon</p>
                  <p className="text-rose-100/80 mt-1">
                    Some of your answers suggest changes that should be reviewed in person. If symptoms are worsening
                    quickly, use urgent care or emergency services per local guidance.
                  </p>
                </div>
              </div>
            )}

            <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 mb-6">
              <div className="flex items-start gap-3">
                <AlertCircle size={20} className="text-amber-400 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-amber-100/90">
                  This tool does not replace examination, imaging, or labs. Always follow advice from a qualified
                  healthcare professional.
                </p>
              </div>
            </div>

            <div className="space-y-4 mb-8">
              {[
                { key: "breast", label: "Breast-related pattern score", icon: Heart },
                { key: "pcos", label: "PCOS-related pattern score", icon: Activity },
                { key: "fibroid", label: "Fibroid-related pattern score", icon: Stethoscope },
              ].map((item) => {
                const riskInfo = getRiskLevel(risk[item.key]);
                return (
                  <div key={item.key} className="bg-slate-900/50 rounded-2xl border border-slate-800 p-5">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-xl ${riskInfo.bg} flex items-center justify-center`}>
                          <item.icon size={20} className={riskInfo.color} />
                        </div>
                        <span className="font-semibold text-sm sm:text-base">{item.label}</span>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${riskInfo.bg} ${riskInfo.color}`}>
                        {riskInfo.level}
                      </span>
                    </div>
                    <div className="h-3 bg-slate-800 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${risk[item.key]}%` }}
                        transition={{ delay: 0.2 }}
                        className={`h-full ${
                          risk[item.key] < 20 ? "bg-emerald-500" : risk[item.key] < 50 ? "bg-amber-500" : "bg-rose-500"
                        }`}
                      />
                    </div>
                    <p className="text-right text-sm text-slate-400 mt-1">{risk[item.key]}% weighted score</p>
                  </div>
                );
              })}
            </div>

            <div className="bg-slate-900/50 rounded-2xl border border-slate-800 p-5 mb-6">
              <h3 className="font-bold mb-3">Suggested next steps</h3>
              <ul className="space-y-3 text-sm text-slate-300">
                {recommendations.map((item, idx) => (
                  <li key={idx} className={`flex items-start gap-2 ${item.urgent ? "text-rose-200" : ""}`}>
                    {item.urgent ? (
                      <AlertTriangle size={16} className="text-rose-400 shrink-0 mt-0.5" />
                    ) : (
                      <CheckCircle size={16} className="text-teal-400 shrink-0 mt-0.5" />
                    )}
                    <span>{item.text}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                to="/book-appointment"
                className="flex-1 py-4 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-500 font-semibold text-center flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-teal-500/25 transition-all"
              >
                <Calendar size={18} /> Book appointment
              </Link>
              <Link
                to="/breast-cancer"
                className="flex-1 py-4 rounded-xl bg-slate-800 hover:bg-slate-700 font-medium text-center flex items-center justify-center gap-2 transition-colors"
              >
                Screening flows
              </Link>
              <button
                type="button"
                onClick={restart}
                className="px-6 py-4 rounded-xl bg-slate-800 hover:bg-slate-700 flex items-center justify-center gap-2 transition-colors"
              >
                <RefreshCw size={18} /> Start over
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default SymptomChecker;
