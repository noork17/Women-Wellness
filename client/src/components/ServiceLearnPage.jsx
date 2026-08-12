import React from "react";
import { motion } from "framer-motion";
import { Link, useParams, Navigate } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  Brain,
  CheckCircle,
  Heart,
  Stethoscope,
  Activity,
  Shield,
  Sparkles,
  Upload,
  Scan,
  FileText,
  UserCheck,
} from "lucide-react";
import { HEALTH_IMAGES } from "../assets/healthImages";

const SLUG_CONFIG = {
  "breast-cancer": {
    title: "Breast Cancer Screening",
    subtitle: "When caught early, treatment works. Screening is the bridge between worry and action.",
    image: HEALTH_IMAGES.breastScreening,
    accent: "from-rose-500/20 to-pink-600/10",
    borderAccent: "border-rose-500/30",
    stats: [
      { value: "Stage I–II", label: "Often highly treatable when imaging finds changes early" },
      { value: "AI + Expert", label: "Our pipeline flags suspicious patterns for radiologist review" },
      { value: "24–48h", label: "Typical turnaround for screening workflow results" },
    ],
    bullets: [
      "Clinical breast exam and imaging guidance tailored to risk factors",
      "AI-assisted review to prioritize cases and reduce human oversight gaps",
      "Secure reports you can share with your gynecologist or oncologist",
      "Mobile camps and van outreach for districts across Andhra Pradesh",
    ],
    steps: [
      { icon: Upload, title: "Upload or camp visit", text: "Book online or walk into a SETV camp with trained staff." },
      { icon: Scan, title: "Imaging & capture", text: "Standardized capture protocols for consistent AI input." },
      { icon: Brain, title: "AI triage", text: "Models highlight regions of interest for expert confirmation." },
      { icon: UserCheck, title: "Doctor sign-off", text: "Licensed specialists validate before any report is released." },
    ],
    disclaimer:
      "Educational information only. Screening does not replace diagnosis; follow your clinician’s advice.",
  },
  pcos: {
    title: "PCOS Detection & Care Pathways",
    subtitle: "Irregular cycles, weight changes, and fertility questions deserve answers—not guesswork.",
    image: HEALTH_IMAGES.pcosService,
    accent: "from-violet-500/20 to-purple-600/10",
    borderAccent: "border-violet-500/30",
    stats: [
      { value: "1 in 10", label: "Roughly how many women of reproductive age may have PCOS-related patterns (global estimates vary)" },
      { value: "Holistic", label: "We combine symptom history with structured screening data" },
      { value: "Action plan", label: "Clear next steps: lifestyle, labs, or specialist referral" },
    ],
    bullets: [
      "Structured questionnaires aligned with international PCOS diagnostic criteria",
      "Integration with hormonal and metabolic risk indicators where available",
      "Dashboard for tracking symptoms over time",
      "Referral hooks to endocrinology and fertility specialists in our network",
    ],
    steps: [
      { icon: FileText, title: "Intake", text: "Guided forms capture cycles, skin changes, and family history." },
      { icon: Activity, title: "Signal check", text: "We map patterns suggestive of hyperandrogenism or ovulatory issues." },
      { icon: Brain, title: "AI assist", text: "Models cluster findings to surface likely PCOS phenotypes." },
      { icon: Stethoscope, title: "Clinical follow-up", text: "Doctors interpret results and order confirmatory tests if needed." },
    ],
    disclaimer:
      "PCOS is a clinical diagnosis. Our tools support screening and triage, not self-diagnosis.",
  },
  fibroids: {
    title: "Fibroid Detection (Ultrasound Pathway)",
    subtitle: "Heavy bleeding and pelvic pressure are common—and often treatable once fibroids are mapped.",
    image: HEALTH_IMAGES.fibroidService,
    accent: "from-teal-500/20 to-cyan-600/10",
    borderAccent: "border-teal-500/30",
    stats: [
      { value: "Very common", label: "Benign uterine fibroids affect many women; most are manageable" },
      { value: "Ultrasound-first", label: "Non-invasive imaging to locate size, count, and position" },
      { value: "Surgical clarity", label: "Better imaging → clearer options (watch, medication, or procedure)" },
    ],
    bullets: [
      "Video/clip-based workflows where appropriate for longitudinal tracking",
      "AI highlights structural patterns consistent with fibroid tissue",
      "Reports formatted for gynecologists considering UAE, myomectomy, or other options",
      "Part of SETV’s broader uterine health program in AP",
    ],
    steps: [
      { icon: Upload, title: "Capture", text: "Upload standardized ultrasound clips or complete a camp scan." },
      { icon: Scan, title: "Segmentation", text: "AI assists in outlining suspected fibroid regions." },
      { icon: Brain, title: "Risk band", text: "Outputs include size trends and symptomatic correlation prompts." },
      { icon: FileText, title: "Report", text: "Downloadable summary for your treating gynecologist." },
    ],
    disclaimer:
      "Imaging assistance does not replace in-person ultrasound interpretation by a qualified specialist.",
  },
};

const ServiceLearnPage = () => {
  const { slug } = useParams();
  const config = SLUG_CONFIG[slug];

  if (!config) {
    return <Navigate to="/landing" replace />;
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <header className="border-b border-slate-800 bg-slate-950/90 backdrop-blur-xl sticky top-0 z-20">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between gap-4">
          <Link
            to="/landing"
            className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-teal-400 transition-colors"
          >
            <ArrowLeft size={18} />
            Back to home
          </Link>
          <div className="flex items-center gap-2">
            <Heart className="text-teal-400" size={22} />
            <span className="font-semibold text-slate-200">SETV</span>
          </div>
        </div>
      </header>

      <section className={`relative overflow-hidden border-b border-slate-800 ${config.borderAccent}`}>
        <div className={`absolute inset-0 bg-gradient-to-br ${config.accent}`} />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent" />
        <div className="relative max-w-5xl mx-auto px-6 py-16 md:py-24 grid md:grid-cols-2 gap-12 items-center">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/25 text-teal-300 text-xs font-semibold uppercase tracking-wider mb-4">
              <Sparkles size={14} />
              Service detail
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-4 leading-tight">{config.title}</h1>
            <p className="text-lg text-slate-400 mb-8">{config.subtitle}</p>
            <div className="flex flex-wrap gap-3">
              <Link
                to="/signup"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-500 font-semibold text-white shadow-lg shadow-teal-500/20 hover:shadow-teal-500/35 transition-all"
              >
                Create account
                <ArrowRight size={18} />
              </Link>
              <Link
                to="/login"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-slate-600 text-slate-200 hover:bg-slate-800/80 transition-all"
              >
                Sign in to run screening
              </Link>
            </div>
            <p className="mt-6 text-xs text-slate-500 max-w-md">{config.disclaimer}</p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="rounded-3xl overflow-hidden border border-slate-800 shadow-2xl shadow-black/40"
          >
            <img src={config.image} alt="" className="w-full h-64 md:h-80 object-cover" />
          </motion.div>
        </div>
      </section>

      <section className="py-16 px-6 border-b border-slate-800">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-sm font-semibold text-teal-400 uppercase tracking-wider mb-8">At a glance</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {config.stats.map((s, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800"
              >
                <p className="text-2xl font-bold text-white mb-2">{s.value}</p>
                <p className="text-sm text-slate-400 leading-relaxed">{s.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 px-6 border-b border-slate-800">
        <div className="max-w-5xl mx-auto grid lg:grid-cols-2 gap-12">
          <div>
            <h2 className="text-2xl font-bold text-white mb-6">What you get</h2>
            <ul className="space-y-4">
              {config.bullets.map((b, i) => (
                <li key={i} className="flex gap-3 text-slate-300">
                  <CheckCircle className="text-teal-400 shrink-0 mt-0.5" size={20} />
                  <span>{b}</span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white mb-6">How the journey works</h2>
            <div className="space-y-4">
              {config.steps.map((step, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: 12 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.06 }}
                  className="flex gap-4 p-4 rounded-xl bg-slate-900/50 border border-slate-800"
                >
                  <div className="w-11 h-11 rounded-xl bg-teal-500/15 flex items-center justify-center shrink-0">
                    <step.icon className="text-teal-400" size={22} />
                  </div>
                  <div>
                    <p className="font-semibold text-white">
                      {i + 1}. {step.title}
                    </p>
                    <p className="text-sm text-slate-400 mt-1">{step.text}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <Shield className="mx-auto text-teal-400 mb-4" size={40} />
          <h2 className="text-2xl font-bold text-white mb-4">Ready inside the app</h2>
          <p className="text-slate-400 mb-8">
            The full upload, analysis, and PDF report tools live in your dashboard after you sign in. This page explains
            the program; the product is one click away.
          </p>
          <Link
            to="/login"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-white text-slate-900 font-semibold hover:bg-slate-100 transition-colors"
          >
            Log in to open screening tools
            <ArrowRight size={20} />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default ServiceLearnPage;
