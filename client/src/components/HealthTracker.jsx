import React, { useState, useEffect, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  Activity,
  Calendar,
  Plus,
  Droplet,
  Moon,
  Dumbbell,
  Apple,
  Heart,
  ThermometerSun,
  Scale,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  X,
} from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

const STORAGE_KEY = "setv_health_tracker_v1";

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function saveState(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    /* ignore */
  }
}

/** 1-based cycle day for calendar date */
function cycleDayForDate(d, lastStartStr, cycleLen) {
  if (!lastStartStr || !cycleLen) return null;
  const [y, m, day] = lastStartStr.split("-").map(Number);
  const start = new Date(y, m - 1, day);
  start.setHours(12, 0, 0, 0);
  const cur = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  cur.setHours(12, 0, 0, 0);
  const diff = Math.round((cur - start) / 86400000);
  let mod = diff % cycleLen;
  if (mod < 0) mod += cycleLen;
  return mod + 1;
}

function isPeriodDayDate(d, lastStartStr, cycleLen, periodLen) {
  const cd = cycleDayForDate(d, lastStartStr, cycleLen);
  if (cd == null) return false;
  return cd <= periodLen;
}

function isFertileDayDate(d, lastStartStr, cycleLen) {
  const cd = cycleDayForDate(d, lastStartStr, cycleLen);
  if (cd == null) return false;
  const ov = Math.max(8, cycleLen - 14);
  return cd >= ov - 4 && cd <= ov + 1;
}

function formatShort(d) {
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function addDays(isoDateStr, days) {
  const [y, m, d] = isoDateStr.split("-").map(Number);
  const dt = new Date(y, m - 1, d);
  dt.setDate(dt.getDate() + days);
  const mm = String(dt.getMonth() + 1).padStart(2, "0");
  const dd = String(dt.getDate()).padStart(2, "0");
  return `${dt.getFullYear()}-${mm}-${dd}`;
}

const HealthTracker = () => {
  const stored = loadState();
  const [activeTab, setActiveTab] = useState("period");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showLogModal, setShowLogModal] = useState(false);
  const [logStep, setLogStep] = useState(null);
  const [logNote, setLogNote] = useState("");

  const [lastPeriodStart, setLastPeriodStart] = useState(stored?.lastPeriodStart || "2026-04-01");
  const [cycleLength, setCycleLength] = useState(stored?.cycleLength ?? 28);
  const [periodLength, setPeriodLength] = useState(stored?.periodLength ?? 5);
  const [logs, setLogs] = useState(stored?.logs || []);

  const [goals, setGoals] = useState(
    stored?.goals || [
      { id: "sleep", label: "Sleep 7+ hours", progress: 72, done: false },
      { id: "water", label: "Drink 2.5L water", progress: 60, done: false },
      { id: "move", label: "30 min movement", progress: 100, done: true },
      { id: "sym", label: "Log symptoms", progress: 40, done: false },
    ]
  );

  useEffect(() => {
    saveState({ lastPeriodStart, cycleLength, periodLength, logs, goals });
  }, [lastPeriodStart, cycleLength, periodLength, logs, goals]);

  const today = new Date();
  const todayCd = cycleDayForDate(today, lastPeriodStart, cycleLength);

  const nextPeriodStart = useMemo(() => addDays(lastPeriodStart, cycleLength), [lastPeriodStart, cycleLength]);
  const nextPeriodEnd = useMemo(() => addDays(nextPeriodStart, periodLength - 1), [nextPeriodStart, periodLength]);

  const upcomingPeriods = useMemo(() => {
    const rows = [];
    let start = nextPeriodStart;
    for (let i = 0; i < 3; i++) {
      const end = addDays(start, periodLength - 1);
      rows.push({ start, end, label: `${formatShort(new Date(start + "T12:00:00"))} – ${formatShort(new Date(end + "T12:00:00"))}` });
      start = addDays(start, cycleLength);
    }
    return rows;
  }, [nextPeriodStart, periodLength, cycleLength]);

  const fertileWindows = useMemo(() => {
    const ovOffset = cycleLength - 14;
    const rows = [];
    let anchor = lastPeriodStart;
    for (let i = 0; i < 3; i++) {
      const ov = addDays(anchor, ovOffset);
      const fs = addDays(ov, -4);
      const fe = addDays(ov, 1);
      rows.push({
        label: `${formatShort(new Date(fs + "T12:00:00"))}–${formatShort(new Date(fe + "T12:00:00"))}`,
      });
      anchor = addDays(anchor, cycleLength);
    }
    return rows;
  }, [lastPeriodStart, cycleLength]);

  const logsSorted = useMemo(() => [...logs].sort((a, b) => (a.dateISO < b.dateISO ? 1 : -1)), [logs]);

  const weeklyStats = useMemo(() => {
    const cutoff = Date.now() - 7 * 86400000;
    const recent = logs.filter((l) => new Date(l.dateISO).getTime() >= cutoff);
    const sleepLogs = recent.filter((l) => l.type === "sleep");
    const exerciseLogs = recent.filter((l) => l.type === "exercise");
    const moodLogs = recent.filter((l) => l.type === "mood");
    let avgSleep = 7.2;
    if (sleepLogs.length) {
      const nums = sleepLogs.map((l) => parseFloat(String(l.value).replace(/[^\d.]/g, ""))).filter((n) => !Number.isNaN(n));
      if (nums.length) avgSleep = Math.round((nums.reduce((a, b) => a + b, 0) / nums.length) * 10) / 10;
    }
    return {
      avgSleep,
      exerciseDays: exerciseLogs.length,
      moodLogs: moodLogs.length,
      waterIntake: 2.0 + Math.min(recent.length * 0.05, 0.6),
    };
  }, [logs]);

  const addLog = useCallback((type, value) => {
    const dateISO = new Date().toISOString().slice(0, 10);
    const entry = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      dateISO,
      type,
      value,
    };
    setLogs((prev) => [entry, ...prev]);
    setGoals((g) =>
      g.map((goal) => {
        if (goal.id !== "sym" || type !== "symptom") return goal;
        const progress = Math.min(100, goal.progress + 25);
        return { ...goal, progress, done: progress >= 100 };
      })
    );
    toast.success("Logged for today");
    setShowLogModal(false);
    setLogStep(null);
    setLogNote("");
  }, []);

  const openLog = (type) => {
    setLogStep(type);
    setLogNote("");
  };

  const confirmLog = () => {
    if (!logStep) return;
    const presets = {
      period: logNote.trim() || "Period flow logged",
      symptom: logNote.trim() || "Symptom noted",
      mood: logNote.trim() || "Mood logged",
      sleep: logNote.trim() ? `${logNote} hours` : "7 hours",
      exercise: logNote.trim() || "Activity logged",
      weight: logNote.trim() || "Weight logged",
    };
    addLog(logStep, presets[logStep] || logNote);
  };

  const toggleSymptomChip = (symptom) => {
    addLog("symptom", symptom);
  };

  const logMood = (label) => {
    addLog("mood", label);
  };

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const days = [];
    for (let i = 0; i < firstDay.getDay(); i++) days.push(null);
    for (let i = 1; i <= lastDay.getDate(); i++) days.push(new Date(year, month, i));
    return days;
  };

  const iconMap = {
    symptom: ThermometerSun,
    mood: Heart,
    sleep: Moon,
    exercise: Dumbbell,
    weight: Scale,
    period: Droplet,
  };

  const tabs = [
    { id: "period", label: "Period", icon: Droplet },
    { id: "symptoms", label: "Symptoms", icon: ThermometerSun },
    { id: "lifestyle", label: "Lifestyle", icon: Apple },
  ];

  const symptoms = [
    "Headache",
    "Cramps",
    "Back pain",
    "Bloating",
    "Fatigue",
    "Mood swings",
    "Breast tenderness",
    "Acne",
    "Nausea",
    "Hot flashes",
  ];

  const moods = [
    { emoji: "😊", label: "Great" },
    { emoji: "🙂", label: "Good" },
    { emoji: "😐", label: "Okay" },
    { emoji: "😔", label: "Low" },
    { emoji: "😢", label: "Bad" },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <Toaster position="top-right" />
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-rose-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-violet-500/5 rounded-full blur-3xl" />
      </div>

      <header className="relative z-10 px-6 py-4 border-b border-slate-800">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
            <ArrowLeft size={18} />
            <span className="text-sm">Back</span>
          </Link>
          <h1 className="text-lg font-bold flex items-center gap-2">
            <Activity size={20} className="text-rose-400" />
            Health Tracker
          </h1>
          <button
            type="button"
            onClick={() => {
              setShowLogModal(true);
              setLogStep(null);
            }}
            className="p-2 rounded-xl bg-teal-500 hover:bg-teal-600 transition-colors"
            aria-label="Add log"
          >
            <Plus size={20} />
          </button>
        </div>
      </header>

      <div className="relative z-10 max-w-4xl mx-auto px-6 py-6">
        <p className="text-xs text-slate-500 mb-4 text-center">
          Data is stored on <strong className="text-slate-400">this device only</strong>. Adjust cycle settings if your dates don&apos;t match.
        </p>

        <div className="flex gap-2 mb-6">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 py-3 rounded-xl font-medium flex items-center justify-center gap-2 transition-all ${
                activeTab === tab.id ? "bg-gradient-to-r from-rose-500 to-pink-600 text-white" : "bg-slate-900/50 text-slate-400 hover:bg-slate-800"
              }`}
            >
              <tab.icon size={18} />
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === "period" && (
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-br from-rose-500/10 to-pink-600/10 rounded-3xl border border-rose-500/30 p-6"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                <h2 className="text-lg font-bold">Cycle settings</h2>
                {todayCd != null && (
                  <span className="px-3 py-1 rounded-full bg-rose-500/20 text-rose-400 text-sm w-fit">
                    Today ≈ day {todayCd} of {cycleLength}
                  </span>
                )}
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
                <label className="p-3 rounded-xl bg-slate-900/50 space-y-1">
                  <span className="text-xs text-slate-500">Last period start</span>
                  <input
                    type="date"
                    value={lastPeriodStart}
                    onChange={(e) => setLastPeriodStart(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2 py-1.5 text-sm"
                  />
                </label>
                <label className="p-3 rounded-xl bg-slate-900/50 space-y-1">
                  <span className="text-xs text-slate-500">Cycle length (days)</span>
                  <input
                    type="number"
                    min={21}
                    max={45}
                    value={cycleLength}
                    onChange={(e) => setCycleLength(Number(e.target.value) || 28)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2 py-1.5 text-sm"
                  />
                </label>
                <label className="p-3 rounded-xl bg-slate-900/50 space-y-1">
                  <span className="text-xs text-slate-500">Period length (days)</span>
                  <input
                    type="number"
                    min={2}
                    max={10}
                    value={periodLength}
                    onChange={(e) => setPeriodLength(Number(e.target.value) || 5)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2 py-1.5 text-sm"
                  />
                </label>
                <div className="p-3 rounded-xl bg-slate-900/50 flex flex-col justify-center text-sm">
                  <p className="text-xs text-slate-500">Next period (estimate)</p>
                  <p className="font-bold text-rose-400">
                    {formatShort(new Date(nextPeriodStart + "T12:00:00"))} – {formatShort(new Date(nextPeriodEnd + "T12:00:00"))}
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 }}
              className="bg-slate-900/50 rounded-2xl border border-slate-800 p-4"
            >
              <div className="flex items-center justify-between mb-4">
                <button
                  type="button"
                  onClick={() => setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth() - 1))}
                  className="p-2 hover:bg-slate-800 rounded-lg"
                >
                  <ChevronLeft size={20} />
                </button>
                <h3 className="font-bold">{selectedDate.toLocaleDateString("en-US", { month: "long", year: "numeric" })}</h3>
                <button
                  type="button"
                  onClick={() => setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1))}
                  className="p-2 hover:bg-slate-800 rounded-lg"
                >
                  <ChevronRight size={20} />
                </button>
              </div>
              <div className="grid grid-cols-7 gap-1 text-center text-sm">
                {["S", "M", "T", "W", "T", "F", "S"].map((day, i) => (
                  <div key={i} className="py-2 text-slate-500 font-medium">
                    {day}
                  </div>
                ))}
                {getDaysInMonth(selectedDate).map((date, i) => {
                  const isToday = date?.toDateString() === new Date().toDateString();
                  const period = date && isPeriodDayDate(date, lastPeriodStart, cycleLength, periodLength);
                  const fertile = date && !period && isFertileDayDate(date, lastPeriodStart, cycleLength);
                  return (
                    <div
                      key={i}
                      className={`py-2 rounded-lg relative text-slate-300 ${
                        isToday ? "ring-2 ring-teal-500" : ""
                      } ${period ? "bg-rose-500/20 text-rose-300" : fertile ? "bg-emerald-500/15 text-emerald-300" : ""}`}
                    >
                      {date?.getDate()}
                      {period && <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-rose-500" />}
                    </div>
                  );
                })}
              </div>
              <div className="flex justify-center gap-6 mt-4 text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-rose-500/30" />
                  <span className="text-slate-400">Period (estimated)</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-emerald-500/30" />
                  <span className="text-slate-400">Fertile window (approx.)</span>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="grid md:grid-cols-2 gap-4"
            >
              <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800">
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <Calendar size={18} className="text-rose-400" />
                  Upcoming periods
                </h3>
                <div className="space-y-2 text-sm">
                  {upcomingPeriods.map((row, i) => (
                    <div key={i} className="flex justify-between gap-2">
                      <span className="text-slate-400">{i === 0 ? "Next" : i === 1 ? "After" : "Then"}</span>
                      <span>{row.label}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800">
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <Heart size={18} className="text-emerald-400" />
                  Fertile windows (approx.)
                </h3>
                <div className="space-y-2 text-sm">
                  {fertileWindows.map((row, i) => (
                    <div key={i} className="flex justify-between gap-2">
                      <span className="text-slate-400">{i === 0 ? "This cycle" : i === 1 ? "Next" : "After"}</span>
                      <span className="text-emerald-400">{row.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        )}

        {activeTab === "symptoms" && (
          <div className="space-y-6">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-slate-900/50 rounded-2xl border border-slate-800 p-6">
              <h3 className="font-bold mb-2">Log a symptom</h3>
              <p className="text-xs text-slate-500 mb-4">Tap to add to your timeline (saved on this device).</p>
              <div className="flex flex-wrap gap-2">
                {symptoms.map((symptom) => (
                  <button
                    key={symptom}
                    type="button"
                    onClick={() => toggleSymptomChip(symptom)}
                    className="px-4 py-2 rounded-full bg-slate-800 hover:bg-rose-500/20 hover:text-rose-400 border border-slate-700 hover:border-rose-500/50 text-sm transition-all"
                  >
                    {symptom}
                  </button>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 }}
              className="bg-slate-900/50 rounded-2xl border border-slate-800 p-6"
            >
              <h3 className="font-bold mb-4">Mood</h3>
              <div className="flex flex-wrap justify-between gap-2">
                {moods.map((m) => (
                  <button
                    key={m.label}
                    type="button"
                    onClick={() => logMood(m.label)}
                    className="flex flex-col items-center gap-1 p-3 rounded-xl hover:bg-slate-800 transition-all min-w-[4rem]"
                  >
                    <span className="text-2xl">{m.emoji}</span>
                    <span className="text-xs text-slate-400">{m.label}</span>
                  </button>
                ))}
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-slate-900/50 rounded-2xl border border-slate-800 p-6">
              <h3 className="font-bold mb-4">Recent logs</h3>
              {logsSorted.length === 0 ? (
                <p className="text-slate-500 text-sm">No entries yet. Use chips above or the + button.</p>
              ) : (
                <div className="space-y-3 max-h-72 overflow-y-auto">
                  {logsSorted.map((log) => {
                    const Icon = iconMap[log.type] || Activity;
                    return (
                      <div key={log.id} className="flex items-center gap-3 p-3 rounded-xl bg-slate-800/50">
                        <div className="w-10 h-10 rounded-xl bg-slate-700 flex items-center justify-center">
                          <Icon size={18} className="text-slate-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm truncate">{log.value}</p>
                          <p className="text-xs text-slate-500">
                            {log.dateISO} · {log.type}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </motion.div>
          </div>
        )}

        {activeTab === "lifestyle" && (
          <div className="space-y-6">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-4 rounded-2xl bg-slate-900/50 border border-slate-800">
                <Moon size={24} className="text-violet-400 mb-2" />
                <p className="text-2xl font-bold">{weeklyStats.avgSleep}h</p>
                <p className="text-xs text-slate-500">Avg. sleep (7d)</p>
                <p className="text-xs text-slate-500 mt-1">from sleep logs</p>
              </div>
              <div className="p-4 rounded-2xl bg-slate-900/50 border border-slate-800">
                <Heart size={24} className="text-rose-400 mb-2" />
                <p className="text-2xl font-bold">{weeklyStats.moodLogs}</p>
                <p className="text-xs text-slate-500">Mood logs (7d)</p>
              </div>
              <div className="p-4 rounded-2xl bg-slate-900/50 border border-slate-800">
                <Dumbbell size={24} className="text-amber-400 mb-2" />
                <p className="text-2xl font-bold">{weeklyStats.exerciseDays}</p>
                <p className="text-xs text-slate-500">Activity logs (7d)</p>
              </div>
              <div className="p-4 rounded-2xl bg-slate-900/50 border border-slate-800">
                <Droplet size={24} className="text-blue-400 mb-2" />
                <p className="text-2xl font-bold">{weeklyStats.waterIntake.toFixed(1)}L</p>
                <p className="text-xs text-slate-500">Demo hydration est.</p>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="bg-slate-900/50 rounded-2xl border border-slate-800 p-6">
              <h3 className="font-bold mb-4">Quick log</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowLogModal(true);
                    openLog("sleep");
                  }}
                  className="p-4 rounded-xl bg-slate-800 hover:bg-violet-500/20 border border-slate-700 flex flex-col items-center gap-2 transition-all"
                >
                  <Moon size={24} className="text-violet-400" />
                  <span className="text-sm">Sleep</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowLogModal(true);
                    openLog("exercise");
                  }}
                  className="p-4 rounded-xl bg-slate-800 hover:bg-amber-500/20 border border-slate-700 flex flex-col items-center gap-2 transition-all"
                >
                  <Dumbbell size={24} className="text-amber-400" />
                  <span className="text-sm">Exercise</span>
                </button>
                <button
                  type="button"
                  onClick={() => toast("Water goal: use a bottle note in Sleep/Exercise log for now")}
                  className="p-4 rounded-xl bg-slate-800 hover:bg-blue-500/20 border border-slate-700 flex flex-col items-center gap-2 transition-all"
                >
                  <Droplet size={24} className="text-blue-400" />
                  <span className="text-sm">Water tip</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowLogModal(true);
                    openLog("weight");
                  }}
                  className="p-4 rounded-xl bg-slate-800 hover:bg-emerald-500/20 border border-slate-700 flex flex-col items-center gap-2 transition-all"
                >
                  <Scale size={24} className="text-emerald-400" />
                  <span className="text-sm">Weight</span>
                </button>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-slate-900/50 rounded-2xl border border-slate-800 p-6">
              <h3 className="font-bold mb-4">Goals</h3>
              <div className="space-y-4">
                {goals.map((goal) => (
                  <div key={goal.id} className="flex items-center gap-4">
                    <button
                      type="button"
                      onClick={() => setGoals((g) => g.map((x) => (x.id === goal.id ? { ...x, done: !x.done, progress: !x.done ? 100 : x.progress } : x)))}
                      className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${goal.done ? "bg-emerald-500" : "bg-slate-700"}`}
                    >
                      {goal.done && <CheckCircle size={14} className="text-white" />}
                    </button>
                    <div className="flex-1">
                      <div className="flex justify-between text-sm mb-1">
                        <span className={goal.done ? "text-slate-400 line-through" : ""}>{goal.label}</span>
                        <span className="text-slate-500">{goal.progress}%</span>
                      </div>
                      <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                        <div className={`h-full ${goal.done ? "bg-emerald-500" : "bg-teal-500"}`} style={{ width: `${goal.progress}%` }} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            <div className="flex flex-wrap gap-3 justify-center text-sm">
              <Link to="/symptom-checker" className="text-teal-400 hover:underline">
                Symptom checker
              </Link>
              <span className="text-slate-600">·</span>
              <Link to="/risk-calculator" className="text-teal-400 hover:underline">
                Risk calculator
              </Link>
            </div>
          </div>
        )}
      </div>

      <AnimatePresence>
        {showLogModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
            onClick={() => {
              setShowLogModal(false);
              setLogStep(null);
            }}
          >
            <motion.div
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 100, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-slate-900 rounded-t-3xl sm:rounded-2xl border border-slate-800 p-6 w-full max-w-md"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold">{logStep ? "Add details" : "Add log entry"}</h3>
                <button type="button" onClick={() => setShowLogModal(false)} className="p-2 hover:bg-slate-800 rounded-lg">
                  <X size={20} />
                </button>
              </div>

              {!logStep ? (
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { type: "period", icon: Droplet, label: "Period", color: "text-rose-400" },
                    { type: "symptom", icon: ThermometerSun, label: "Symptom", color: "text-amber-400" },
                    { type: "mood", icon: Heart, label: "Mood", color: "text-pink-400" },
                    { type: "sleep", icon: Moon, label: "Sleep", color: "text-violet-400" },
                    { type: "exercise", icon: Dumbbell, label: "Exercise", color: "text-orange-400" },
                    { type: "weight", icon: Scale, label: "Weight", color: "text-emerald-400" },
                  ].map((item) => (
                    <button
                      key={item.type}
                      type="button"
                      onClick={() => openLog(item.type)}
                      className="p-4 rounded-xl bg-slate-800 hover:bg-slate-700 flex flex-col items-center gap-2 transition-all"
                    >
                      <item.icon size={24} className={item.color} />
                      <span className="text-xs">{item.label}</span>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  <label className="block text-sm text-slate-400">
                    Note (optional)
                    <input
                      value={logNote}
                      onChange={(e) => setLogNote(e.target.value)}
                      placeholder={
                        logStep === "sleep" ? "Hours slept e.g. 7.5" : logStep === "weight" ? "kg e.g. 58" : "Short description"
                      }
                      className="mt-1 w-full px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 focus:border-teal-500 focus:outline-none"
                    />
                  </label>
                  <button type="button" onClick={confirmLog} className="w-full py-3 rounded-xl bg-teal-500 hover:bg-teal-600 font-medium">
                    Save log
                  </button>
                  <button type="button" onClick={() => setLogStep(null)} className="w-full py-2 text-sm text-slate-400 hover:text-white">
                    Back
                  </button>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default HealthTracker;
