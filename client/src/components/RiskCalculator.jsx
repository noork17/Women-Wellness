import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  Calculator,
  Heart,
  Activity,
  Stethoscope,
  Info,
  Calendar,
  HelpCircle,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

function clampScore(n) {
  return Math.min(100, Math.max(0, Math.round(n)));
}

function parseNum(v, fallback = NaN) {
  const n = parseFloat(String(v).replace(",", "."));
  return Number.isFinite(n) ? n : fallback;
}

const RiskCalculator = () => {
  const [activeTab, setActiveTab] = useState("breast");
  const [showResult, setShowResult] = useState(false);
  const [showMethod, setShowMethod] = useState(false);
  const [bmiHeightCm, setBmiHeightCm] = useState("");
  const [bmiWeightKg, setBmiWeightKg] = useState("");

  const [breastForm, setBreastForm] = useState({
    age: "",
    familyHistory: "no",
    firstPeriod: "",
    firstBirth: "",
    biopsies: "0",
    hormoneTherapy: "no",
  });

  const [pcosForm, setPcosForm] = useState({
    age: "",
    bmi: "",
    cycleLength: "",
    hairGrowth: "no",
    acne: "no",
    familyHistory: "no",
  });

  const [fibroidForm, setFibroidForm] = useState({
    age: "",
    familyHistory: "no",
    heavyBleeding: "no",
    pregnancies: "0",
    bmi: "",
  });

  const applyBmiToActive = () => {
    const h = parseNum(bmiHeightCm);
    const w = parseNum(bmiWeightKg);
    if (!h || !w || h < 80 || h > 250 || w < 30 || w > 300) {
      toast.error("Enter realistic height (cm) and weight (kg)");
      return;
    }
    const m = h / 100;
    const bmi = w / (m * m);
    const rounded = Math.round(bmi * 10) / 10;
    if (activeTab === "pcos") setPcosForm((f) => ({ ...f, bmi: String(rounded) }));
    if (activeTab === "fibroid") setFibroidForm((f) => ({ ...f, bmi: String(rounded) }));
    toast.success(`BMI ≈ ${rounded}`);
  };

  const breastBreakdown = useMemo(() => {
    const parts = [];
    let risk = 5;
    const age = parseInt(breastForm.age, 10);
    if (Number.isFinite(age)) {
      if (age > 60) {
        risk += 15;
        parts.push({ label: "Age over 60", pts: 15 });
      } else if (age > 50) {
        risk += 10;
        parts.push({ label: "Age 51–60", pts: 10 });
      } else if (age > 40) {
        risk += 5;
        parts.push({ label: "Age 41–50", pts: 5 });
      }
    }
    if (breastForm.familyHistory === "yes") {
      risk += 20;
      parts.push({ label: "Family history of breast cancer", pts: 20 });
    }
    const fp = parseInt(breastForm.firstPeriod, 10);
    if (Number.isFinite(fp) && fp < 12) {
      risk += 5;
      parts.push({ label: "Menarche before 12", pts: 5 });
    }
    if (breastForm.firstBirth === "never") {
      risk += 5;
      parts.push({ label: "No childbirth", pts: 5 });
    } else {
      const fb = parseInt(breastForm.firstBirth, 10);
      if (Number.isFinite(fb) && fb > 30) {
        risk += 5;
        parts.push({ label: "First birth after 30", pts: 5 });
      }
    }
    const bio = parseInt(breastForm.biopsies, 10);
    if (bio > 1) {
      risk += 10;
      parts.push({ label: "2+ breast biopsies", pts: 10 });
    }
    if (breastForm.hormoneTherapy === "yes") {
      risk += 5;
      parts.push({ label: "Hormone therapy", pts: 5 });
    }
    parts.unshift({ label: "Baseline (population prior)", pts: 5 });
    return { score: clampScore(risk), parts };
  }, [breastForm]);

  const pcosBreakdown = useMemo(() => {
    const parts = [];
    let risk = 5;
    parts.push({ label: "Baseline", pts: 5 });
    const bmi = parseNum(pcosForm.bmi);
    if (Number.isFinite(bmi)) {
      if (bmi > 30) {
        risk += 20;
        parts.push({ label: "BMI over 30", pts: 20 });
      } else if (bmi > 25) {
        risk += 10;
        parts.push({ label: "BMI 25–30", pts: 10 });
      }
    }
    const cl = parseInt(pcosForm.cycleLength, 10);
    if (Number.isFinite(cl) && (cl > 35 || cl < 21)) {
      risk += 25;
      parts.push({ label: "Cycle length outside 21–35 d", pts: 25 });
    }
    if (pcosForm.hairGrowth === "yes") {
      risk += 15;
      parts.push({ label: "Excess hair growth", pts: 15 });
    }
    if (pcosForm.acne === "yes") {
      risk += 10;
      parts.push({ label: "Persistent acne", pts: 10 });
    }
    if (pcosForm.familyHistory === "yes") {
      risk += 15;
      parts.push({ label: "Family history of PCOS", pts: 15 });
    }
    return { score: clampScore(risk), parts };
  }, [pcosForm]);

  const fibroidBreakdown = useMemo(() => {
    const parts = [];
    let risk = 5;
    parts.push({ label: "Baseline", pts: 5 });
    const age = parseInt(fibroidForm.age, 10);
    if (Number.isFinite(age)) {
      if (age > 40) {
        risk += 15;
        parts.push({ label: "Age over 40", pts: 15 });
      } else if (age > 30) {
        risk += 10;
        parts.push({ label: "Age 31–40", pts: 10 });
      }
    }
    if (fibroidForm.familyHistory === "yes") {
      risk += 20;
      parts.push({ label: "Family history of fibroids", pts: 20 });
    }
    if (fibroidForm.heavyBleeding === "yes") {
      risk += 15;
      parts.push({ label: "Heavy menstrual bleeding", pts: 15 });
    }
    const preg = parseInt(fibroidForm.pregnancies, 10);
    if (preg === 0) {
      risk += 10;
      parts.push({ label: "No pregnancies recorded", pts: 10 });
    }
    const bmi = parseNum(fibroidForm.bmi);
    if (Number.isFinite(bmi) && bmi > 30) {
      risk += 15;
      parts.push({ label: "BMI over 30", pts: 15 });
    }
    return { score: clampScore(risk), parts };
  }, [fibroidForm]);

  const getBundle = () => {
    switch (activeTab) {
      case "breast":
        return breastBreakdown;
      case "pcos":
        return pcosBreakdown;
      case "fibroid":
        return fibroidBreakdown;
      default:
        return { score: 0, parts: [] };
    }
  };

  const validationError = useMemo(() => {
    if (activeTab === "breast") {
      const age = parseInt(breastForm.age, 10);
      if (!Number.isFinite(age) || age < 18 || age > 100) return "Enter a valid age (18–100).";
      return null;
    }
    if (activeTab === "pcos") {
      const bmi = parseNum(pcosForm.bmi);
      const cl = parseInt(pcosForm.cycleLength, 10);
      if (!Number.isFinite(bmi) || bmi < 12 || bmi > 70) return "Enter a realistic BMI (or use the BMI helper).";
      if (!Number.isFinite(cl) || cl < 15 || cl > 90) return "Enter average cycle length in days (e.g. 28).";
      return null;
    }
    const age = parseInt(fibroidForm.age, 10);
    const bmi = parseNum(fibroidForm.bmi);
    if (!Number.isFinite(age) || age < 18 || age > 100) return "Enter a valid age (18–100).";
    if (!Number.isFinite(bmi) || bmi < 12 || bmi > 70) return "Enter a realistic BMI (or use the BMI helper).";
    return null;
  }, [activeTab, breastForm, pcosForm, fibroidForm]);

  const getRiskLevel = (score) => {
    if (score < 15)
      return {
        level: "Low",
        color: "text-emerald-400",
        bg: "bg-emerald-500",
        desc: "Fewer modeled risk factors. Keep routine screening and healthy habits.",
      };
    if (score < 30)
      return {
        level: "Moderate",
        color: "text-amber-400",
        bg: "bg-amber-500",
        desc: "Some factors suggest discussing timing of screening with your clinician.",
      };
    if (score < 50)
      return {
        level: "Elevated",
        color: "text-orange-400",
        bg: "bg-orange-500",
        desc: "Several factors align with higher modeled risk—book a discussion or screening soon.",
      };
    return {
      level: "High",
      color: "text-rose-400",
      bg: "bg-rose-500",
      desc: "Many factors in this demo model—prioritize an appointment for personalized advice.",
    };
  };

  const tabs = [
    { id: "breast", label: "Breast", icon: Heart, color: "from-rose-500 to-pink-600" },
    { id: "pcos", label: "PCOS", icon: Activity, color: "from-violet-500 to-purple-600" },
    { id: "fibroid", label: "Fibroid", icon: Stethoscope, color: "from-amber-500 to-orange-600" },
  ];

  const { score: risk, parts } = showResult ? getBundle() : { score: 0, parts: [] };
  const riskInfo = getRiskLevel(risk);

  const handleCalculate = () => {
    if (validationError) {
      toast.error(validationError);
      return;
    }
    setShowResult(true);
  };

  const switchTab = (id) => {
    setActiveTab(id);
    setShowResult(false);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <Toaster position="top-right" />
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950" />
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-teal-500/5 rounded-full blur-3xl" />
      </div>

      <header className="relative z-10 px-6 py-4 border-b border-slate-800">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
            <ArrowLeft size={18} />
            <span className="text-sm">Back</span>
          </Link>
          <h1 className="text-lg font-bold flex items-center gap-2">
            <Calculator size={20} className="text-teal-400" />
            Risk calculator
          </h1>
          <div className="w-16" />
        </div>
      </header>

      <div className="relative z-10 max-w-2xl mx-auto px-6 py-8">
        <p className="text-slate-400 text-sm mb-4 text-center max-w-lg mx-auto">
          Educational scoring from a few lifestyle and history fields—<strong className="text-slate-300">not</strong> a
          clinical risk model (e.g. not Gail or formal PCOS criteria).
        </p>

        <div className="flex gap-2 mb-6">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => switchTab(tab.id)}
              className={`flex-1 py-3 rounded-xl font-medium flex items-center justify-center gap-2 transition-all text-sm sm:text-base ${
                activeTab === tab.id ? `bg-gradient-to-r ${tab.color} text-white` : "bg-slate-900/50 text-slate-400 hover:bg-slate-800"
              }`}
            >
              <tab.icon size={18} />
              <span className="hidden xs:inline sm:inline">{tab.label}</span>
            </button>
          ))}
        </div>

        <div className="bg-slate-900/50 rounded-3xl border border-slate-800 p-6">
          <button
            type="button"
            onClick={() => setShowMethod(!showMethod)}
            className="w-full flex items-center justify-between text-sm text-slate-400 hover:text-slate-200 mb-4 py-2"
          >
            <span className="flex items-center gap-2">
              <HelpCircle size={16} className="text-teal-400" />
              How this demo score works
            </span>
            {showMethod ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </button>
          <AnimatePresence>
            {showMethod && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden mb-6"
              >
                <p className="text-xs text-slate-500 bg-slate-800/40 rounded-xl p-3 border border-slate-700/80">
                  Points are added for age bands, BMI, cycle length, bleeding, and family history, then capped at 100.
                  Your doctor uses different tools and exams—use this only as a conversation starter.
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* BMI helper */}
          <div className="mb-6 p-4 rounded-xl bg-slate-800/40 border border-slate-700/80">
            <p className="text-xs font-semibold text-teal-400 mb-2">Quick BMI (fills PCOS / Fibroid BMI field)</p>
            <div className="flex flex-wrap gap-2 items-end">
              <div className="flex-1 min-w-[100px]">
                <label className="text-[10px] text-slate-500 uppercase">Height (cm)</label>
                <input
                  type="number"
                  value={bmiHeightCm}
                  onChange={(e) => setBmiHeightCm(e.target.value)}
                  placeholder="165"
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-sm focus:border-teal-500 focus:outline-none"
                />
              </div>
              <div className="flex-1 min-w-[100px]">
                <label className="text-[10px] text-slate-500 uppercase">Weight (kg)</label>
                <input
                  type="number"
                  value={bmiWeightKg}
                  onChange={(e) => setBmiWeightKg(e.target.value)}
                  placeholder="62"
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-sm focus:border-teal-500 focus:outline-none"
                />
              </div>
              <button
                type="button"
                onClick={applyBmiToActive}
                className="px-4 py-2 rounded-lg bg-teal-500/20 border border-teal-500/50 text-teal-300 text-sm hover:bg-teal-500/30"
              >
                Apply BMI
              </button>
            </div>
          </div>

          {!showResult ? (
            <motion.div key={activeTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              <h2 className="text-xl font-bold mb-2">
                {activeTab === "breast" && "Breast cancer–related factors"}
                {activeTab === "pcos" && "PCOS-related factors"}
                {activeTab === "fibroid" && "Uterine fibroid–related factors"}
              </h2>
              <p className="text-slate-400 text-sm mb-6">Complete the fields, then calculate. Required fields are validated.</p>

              <div className="space-y-4">
                {activeTab === "breast" && (
                  <>
                    <div>
                      <label className="block text-sm text-slate-400 mb-2">Current age *</label>
                      <input
                        type="number"
                        value={breastForm.age}
                        onChange={(e) => setBreastForm({ ...breastForm, age: e.target.value })}
                        placeholder="e.g. 42"
                        className="w-full px-4 py-3 rounded-xl bg-slate-800/50 border border-slate-700 focus:border-teal-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-slate-400 mb-2">Family history of breast cancer?</label>
                      <div className="flex gap-3">
                        {["yes", "no"].map((opt) => (
                          <button
                            key={opt}
                            type="button"
                            onClick={() => setBreastForm({ ...breastForm, familyHistory: opt })}
                            className={`flex-1 py-3 rounded-xl capitalize transition-all ${
                              breastForm.familyHistory === opt
                                ? "bg-teal-500/20 border border-teal-500"
                                : "bg-slate-800/50 border border-slate-700"
                            }`}
                          >
                            {opt}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm text-slate-400 mb-2">Age at first period (optional)</label>
                      <input
                        type="number"
                        value={breastForm.firstPeriod}
                        onChange={(e) => setBreastForm({ ...breastForm, firstPeriod: e.target.value })}
                        placeholder="e.g. 12"
                        className="w-full px-4 py-3 rounded-xl bg-slate-800/50 border border-slate-700 focus:border-teal-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-slate-400 mb-2">Age at first childbirth</label>
                      <select
                        value={breastForm.firstBirth}
                        onChange={(e) => setBreastForm({ ...breastForm, firstBirth: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-slate-800/50 border border-slate-700 focus:border-teal-500 focus:outline-none"
                      >
                        <option value="">Select</option>
                        <option value="never">Never had children</option>
                        <option value="20">Before 20</option>
                        <option value="25">20–25</option>
                        <option value="30">26–30</option>
                        <option value="35">After 30</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm text-slate-400 mb-2">Breast biopsies</label>
                      <select
                        value={breastForm.biopsies}
                        onChange={(e) => setBreastForm({ ...breastForm, biopsies: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-slate-800/50 border border-slate-700 focus:border-teal-500 focus:outline-none"
                      >
                        <option value="0">None</option>
                        <option value="1">1</option>
                        <option value="2">2 or more</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm text-slate-400 mb-2">Hormone therapy (current/past)?</label>
                      <div className="flex gap-3">
                        {["yes", "no"].map((opt) => (
                          <button
                            key={opt}
                            type="button"
                            onClick={() => setBreastForm({ ...breastForm, hormoneTherapy: opt })}
                            className={`flex-1 py-3 rounded-xl capitalize transition-all ${
                              breastForm.hormoneTherapy === opt
                                ? "bg-teal-500/20 border border-teal-500"
                                : "bg-slate-800/50 border border-slate-700"
                            }`}
                          >
                            {opt}
                          </button>
                        ))}
                      </div>
                    </div>
                  </>
                )}

                {activeTab === "pcos" && (
                  <>
                    <div>
                      <label className="block text-sm text-slate-400 mb-2">BMI *</label>
                      <input
                        type="number"
                        step="0.1"
                        value={pcosForm.bmi}
                        onChange={(e) => setPcosForm({ ...pcosForm, bmi: e.target.value })}
                        placeholder="e.g. 27.5"
                        className="w-full px-4 py-3 rounded-xl bg-slate-800/50 border border-slate-700 focus:border-teal-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-slate-400 mb-2">Average cycle length (days) *</label>
                      <input
                        type="number"
                        value={pcosForm.cycleLength}
                        onChange={(e) => setPcosForm({ ...pcosForm, cycleLength: e.target.value })}
                        placeholder="e.g. 28"
                        className="w-full px-4 py-3 rounded-xl bg-slate-800/50 border border-slate-700 focus:border-teal-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-slate-400 mb-2">Excess hair growth?</label>
                      <div className="flex gap-3">
                        {["yes", "no"].map((opt) => (
                          <button
                            key={opt}
                            type="button"
                            onClick={() => setPcosForm({ ...pcosForm, hairGrowth: opt })}
                            className={`flex-1 py-3 rounded-xl capitalize transition-all ${
                              pcosForm.hairGrowth === opt ? "bg-teal-500/20 border border-teal-500" : "bg-slate-800/50 border border-slate-700"
                            }`}
                          >
                            {opt}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm text-slate-400 mb-2">Persistent acne?</label>
                      <div className="flex gap-3">
                        {["yes", "no"].map((opt) => (
                          <button
                            key={opt}
                            type="button"
                            onClick={() => setPcosForm({ ...pcosForm, acne: opt })}
                            className={`flex-1 py-3 rounded-xl capitalize transition-all ${
                              pcosForm.acne === opt ? "bg-teal-500/20 border border-teal-500" : "bg-slate-800/50 border border-slate-700"
                            }`}
                          >
                            {opt}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm text-slate-400 mb-2">Family history of PCOS?</label>
                      <div className="flex gap-3">
                        {["yes", "no"].map((opt) => (
                          <button
                            key={opt}
                            type="button"
                            onClick={() => setPcosForm({ ...pcosForm, familyHistory: opt })}
                            className={`flex-1 py-3 rounded-xl capitalize transition-all ${
                              pcosForm.familyHistory === opt ? "bg-teal-500/20 border border-teal-500" : "bg-slate-800/50 border border-slate-700"
                            }`}
                          >
                            {opt}
                          </button>
                        ))}
                      </div>
                    </div>
                  </>
                )}

                {activeTab === "fibroid" && (
                  <>
                    <div>
                      <label className="block text-sm text-slate-400 mb-2">Current age *</label>
                      <input
                        type="number"
                        value={fibroidForm.age}
                        onChange={(e) => setFibroidForm({ ...fibroidForm, age: e.target.value })}
                        placeholder="e.g. 38"
                        className="w-full px-4 py-3 rounded-xl bg-slate-800/50 border border-slate-700 focus:border-teal-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-slate-400 mb-2">BMI *</label>
                      <input
                        type="number"
                        step="0.1"
                        value={fibroidForm.bmi}
                        onChange={(e) => setFibroidForm({ ...fibroidForm, bmi: e.target.value })}
                        placeholder="e.g. 29"
                        className="w-full px-4 py-3 rounded-xl bg-slate-800/50 border border-slate-700 focus:border-teal-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-slate-400 mb-2">Family history of fibroids?</label>
                      <div className="flex gap-3">
                        {["yes", "no"].map((opt) => (
                          <button
                            key={opt}
                            type="button"
                            onClick={() => setFibroidForm({ ...fibroidForm, familyHistory: opt })}
                            className={`flex-1 py-3 rounded-xl capitalize transition-all ${
                              fibroidForm.familyHistory === opt ? "bg-teal-500/20 border border-teal-500" : "bg-slate-800/50 border border-slate-700"
                            }`}
                          >
                            {opt}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm text-slate-400 mb-2">Heavy menstrual bleeding?</label>
                      <div className="flex gap-3">
                        {["yes", "no"].map((opt) => (
                          <button
                            key={opt}
                            type="button"
                            onClick={() => setFibroidForm({ ...fibroidForm, heavyBleeding: opt })}
                            className={`flex-1 py-3 rounded-xl capitalize transition-all ${
                              fibroidForm.heavyBleeding === opt ? "bg-teal-500/20 border border-teal-500" : "bg-slate-800/50 border border-slate-700"
                            }`}
                          >
                            {opt}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm text-slate-400 mb-2">Pregnancies</label>
                      <select
                        value={fibroidForm.pregnancies}
                        onChange={(e) => setFibroidForm({ ...fibroidForm, pregnancies: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-slate-800/50 border border-slate-700 focus:border-teal-500 focus:outline-none"
                      >
                        <option value="0">None</option>
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="3">3 or more</option>
                      </select>
                    </div>
                  </>
                )}
              </div>

              {validationError && <p className="text-amber-400/90 text-sm mt-4">{validationError}</p>}

              <button
                type="button"
                onClick={handleCalculate}
                className="w-full mt-6 py-4 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-500 font-semibold flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-teal-500/25 transition-all"
              >
                <Calculator size={18} /> Calculate score
              </button>
            </motion.div>
          ) : (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              <div className="text-center mb-6">
                <h2 className="text-xl font-bold mb-2">Your demo risk score</h2>
                <div className="relative w-40 h-40 mx-auto my-6">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 160 160">
                    <circle cx="80" cy="80" r="70" stroke="#1e293b" strokeWidth="12" fill="none" />
                    <motion.circle
                      cx="80"
                      cy="80"
                      r="70"
                      stroke={
                        risk < 15 ? "#22c55e" : risk < 30 ? "#f59e0b" : risk < 50 ? "#f97316" : "#ef4444"
                      }
                      strokeWidth="12"
                      fill="none"
                      strokeLinecap="round"
                      initial={{ strokeDasharray: "0 440" }}
                      animate={{ strokeDasharray: `${(risk / 100) * 440} 440` }}
                      transition={{ duration: 1 }}
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className={`text-4xl font-bold ${riskInfo.color}`}>{risk}%</span>
                    <span className={`text-sm ${riskInfo.color}`}>{riskInfo.level}</span>
                  </div>
                </div>
                <p className="text-slate-400 text-sm px-2">{riskInfo.desc}</p>
              </div>

              <div className="rounded-xl border border-slate-700 bg-slate-800/30 p-4 mb-6">
                <h3 className="text-sm font-semibold text-white mb-3">What added to this score</h3>
                <ul className="space-y-2 text-sm text-slate-400">
                  {parts.map((p, i) => (
                    <li key={i} className="flex justify-between gap-2 border-b border-slate-700/50 last:border-0 pb-2 last:pb-0">
                      <span>{p.label}</span>
                      <span className="text-teal-400 font-mono shrink-0">+{p.pts}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-slate-800/50 rounded-xl p-4 mb-6">
                <div className="flex items-start gap-3">
                  <Info size={20} className="text-teal-400 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-slate-300">
                    Not a diagnosis. For breast cancer, doctors may use validated models and imaging; for PCOS, Rotterdam
                    criteria and labs. Use this screen to prepare questions for your visit.
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <Link
                  to="/book-appointment"
                  className="flex-1 py-3 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-500 font-semibold text-center flex items-center justify-center gap-2 transition-all"
                >
                  <Calendar size={18} /> Book screening
                </Link>
                <Link
                  to="/symptom-checker"
                  className="flex-1 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 font-medium text-center flex items-center justify-center gap-2 transition-all"
                >
                  Symptom checker
                </Link>
                <button type="button" onClick={() => setShowResult(false)} className="px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 transition-colors">
                  Edit inputs
                </button>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RiskCalculator;
