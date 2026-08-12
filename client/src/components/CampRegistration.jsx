import React, { useState, useMemo, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  Tent,
  Calendar,
  MapPin,
  Clock,
  Users,
  CheckCircle,
  Phone,
  User,
  Mail,
  ChevronRight,
  Heart,
  Activity,
  Stethoscope,
  Gift,
  Search,
  LayoutDashboard,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import { screeningCamps, campTypeFilters } from "../data/screeningCamps";

const REG_IDS_KEY = "setv_screening_camp_registered_ids";

function loadRegisteredIds() {
  try {
    const raw = localStorage.getItem(REG_IDS_KEY);
    if (!raw) return new Set();
    const arr = JSON.parse(raw);
    return new Set(Array.isArray(arr) ? arr : []);
  } catch {
    return new Set();
  }
}

function saveRegisteredIds(set) {
  try {
    localStorage.setItem(REG_IDS_KEY, JSON.stringify([...set]));
  } catch {
    /* ignore */
  }
}

const CampRegistration = () => {
  const [selectedCamp, setSelectedCamp] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [expandedId, setExpandedId] = useState(null);
  const [registeredIds, setRegisteredIds] = useState(loadRegisteredIds);

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    age: "",
    service: "",
  });

  useEffect(() => {
    saveRegisteredIds(registeredIds);
  }, [registeredIds]);

  const filteredCamps = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return screeningCamps.filter((camp) => {
      if (typeFilter !== "all" && camp.type !== typeFilter) return false;
      if (!q) return true;
      const blob = `${camp.title} ${camp.location} ${camp.address} ${camp.district} ${camp.services.join(" ")}`.toLowerCase();
      return blob.includes(q);
    });
  }, [searchQuery, typeFilter]);

  const benefits = [
    { icon: Gift, text: "Free or subsidised screening" },
    { icon: Heart, text: "Clinical + AI support" },
    { icon: Users, text: "SETV & partner doctors" },
    { icon: CheckCircle, text: "Referral guidance" },
  ];

  const handleRegister = (e) => {
    e.preventDefault();
    if (!selectedCamp) return;
    if (!formData.service) {
      toast.error("Choose a preferred service");
      return;
    }
    const phoneOk = /^[\d\s+\-]{10,15}$/.test(formData.phone.replace(/\s/g, ""));
    if (!phoneOk) {
      toast.error("Enter a valid phone number");
      return;
    }
    setRegisteredIds((prev) => {
      const next = new Set(prev);
      next.add(selectedCamp.id);
      return next;
    });
    toast.success(`You're registered for "${selectedCamp.title}" (demo — saved on this device).`, {
      style: { borderRadius: "16px", background: "#1e293b", color: "#fff" },
      duration: 4000,
    });
    setShowForm(false);
    setSelectedCamp(null);
    setFormData({ name: "", phone: "", email: "", age: "", service: "" });
  };

  const openRegister = useCallback((camp) => {
    if (registeredIds.has(camp.id)) {
      toast("You're already registered for this camp on this device.");
      return;
    }
    setSelectedCamp(camp);
    setFormData((f) => ({ ...f, service: camp.services[0] || "" }));
    setShowForm(true);
  }, [registeredIds]);

  const getTypeIcon = (type) => {
    switch (type) {
      case "breast":
        return Heart;
      case "pcos":
        return Activity;
      case "fibroid":
        return Stethoscope;
      case "comprehensive":
        return Stethoscope;
      default:
        return Tent;
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case "breast":
        return "from-rose-500 to-pink-600";
      case "pcos":
        return "from-violet-500 to-purple-600";
      case "fibroid":
        return "from-amber-500 to-orange-600";
      case "comprehensive":
        return "from-teal-500 to-emerald-600";
      default:
        return "from-amber-500 to-orange-600";
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white relative">
      <Toaster position="top-right" />

      <div className="fixed inset-0 z-0 pointer-events-none" aria-hidden>
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950" />
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-teal-500/5 rounded-full blur-3xl" />
      </div>

      <header className="relative z-10 px-6 py-4 border-b border-slate-800 bg-slate-950/80 backdrop-blur-sm">
        <div className="max-w-5xl mx-auto flex items-center justify-between gap-3">
          <Link to="/" className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors shrink-0">
            <ArrowLeft size={18} />
            <span className="text-sm">Back</span>
          </Link>
          <h1 className="text-lg font-bold flex items-center gap-2 truncate">
            <Tent size={20} className="text-teal-400 shrink-0" />
            Screening camps
          </h1>
          <div className="w-16 shrink-0" />
        </div>
      </header>

      <div className="relative z-10 max-w-5xl mx-auto px-6 py-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-teal-500/10 to-emerald-500/10 rounded-3xl border border-teal-500/30 p-6 mb-6"
        >
          <div className="flex flex-col lg:flex-row items-start justify-between gap-6">
            <div className="flex-1">
              <h2 className="text-2xl font-bold mb-2">SETV outreach & screening camps</h2>
              <p className="text-slate-400 text-sm leading-relaxed mb-4">
                Free and subsidised camps across Andhra Pradesh. Search by place or service, filter by camp type, then
                register. Demo registrations are stored in your browser only—not sent to a live server yet.
              </p>
              <div className="flex flex-wrap gap-2">
                <Link
                  to="/dashboard"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900/60 border border-slate-700 text-sm text-teal-300 hover:border-teal-500/50 transition-colors"
                >
                  <LayoutDashboard size={16} />
                  District dashboard
                </Link>
                <Link
                  to="/book-appointment"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900/60 border border-slate-700 text-sm text-slate-300 hover:border-slate-500 transition-colors"
                >
                  <Calendar size={16} />
                  Book clinic appointment
                </Link>
              </div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-2 gap-3 w-full lg:w-auto lg:min-w-[240px]">
              {benefits.map((benefit, i) => (
                <div key={i} className="flex flex-col items-center gap-1 px-2 py-2 rounded-xl bg-slate-900/40 border border-slate-800">
                  <benefit.icon size={22} className="text-teal-400" />
                  <span className="text-[10px] sm:text-xs text-slate-400 text-center leading-tight">{benefit.text}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="flex-1 relative">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
            <input
              type="search"
              placeholder="Search district, city, or service…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-xl bg-slate-900/50 border border-slate-800 focus:border-teal-500 focus:outline-none text-white placeholder:text-slate-500"
            />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1">
            {campTypeFilters.map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => setTypeFilter(f.id)}
                className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap shrink-0 transition-all ${
                  typeFilter === f.id ? "bg-teal-500 text-white" : "bg-slate-900/50 text-slate-400 border border-slate-800 hover:bg-slate-800"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        <p className="text-xs text-slate-500 mb-4">
          Showing {filteredCamps.length} of {screeningCamps.length} camps
          {registeredIds.size > 0 ? ` · ${registeredIds.size} registered on this device` : ""}
        </p>

        <div className="space-y-4">
          {filteredCamps.map((camp, i) => {
            const TypeIcon = getTypeIcon(camp.type);
            const progressPercent = ((camp.totalSpots - camp.spotsLeft) / camp.totalSpots) * 100;
            const isRegistered = registeredIds.has(camp.id);
            const expanded = expandedId === camp.id;

            return (
              <motion.div
                key={camp.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: Math.min(i * 0.05, 0.3) }}
                className="bg-slate-900/50 rounded-2xl border border-slate-800 overflow-hidden hover:border-slate-700 transition-all"
              >
                <div className="flex flex-col md:flex-row">
                  <div className="relative md:w-64 h-48 md:min-h-[200px] flex-shrink-0">
                    <img src={camp.image} alt="" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent to-slate-900/80 md:bg-gradient-to-t pointer-events-none" />
                    <div
                      className={`absolute top-3 left-3 w-10 h-10 rounded-xl bg-gradient-to-br ${getTypeColor(camp.type)} flex items-center justify-center shadow-lg`}
                    >
                      <TypeIcon size={20} className="text-white" />
                    </div>
                    {isRegistered && (
                      <span className="absolute top-3 right-3 px-2 py-1 rounded-lg bg-emerald-500/90 text-white text-xs font-medium">Registered</span>
                    )}
                  </div>

                  <div className="flex-1 p-5">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div>
                        <p className="text-xs text-teal-400 font-medium mb-0.5">{camp.district} district</p>
                        <h3 className="text-lg font-bold text-white">{camp.title}</h3>
                        <p className="text-sm text-slate-400 flex items-center gap-1 mt-1">
                          <MapPin size={14} className="shrink-0" /> {camp.location}
                        </p>
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium shrink-0 ${
                          camp.spotsLeft < 30 ? "bg-amber-500/10 text-amber-400" : "bg-emerald-500/10 text-emerald-400"
                        }`}
                      >
                        {camp.spotsLeft} spots left
                      </span>
                    </div>

                    <p className="text-xs text-slate-500 mb-3">{camp.address}</p>

                    <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
                      <div className="flex items-center gap-2 text-slate-400">
                        <Calendar size={14} />
                        <span>{camp.dateLabel}</span>
                      </div>
                      <div className="flex items-center gap-2 text-slate-400">
                        <Clock size={14} />
                        <span>{camp.time}</span>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-3">
                      {camp.services.map((service, j) => (
                        <span key={j} className="px-3 py-1 rounded-full bg-slate-800 text-xs text-slate-300">
                          {service}
                        </span>
                      ))}
                    </div>

                    <button
                      type="button"
                      onClick={() => setExpandedId(expanded ? null : camp.id)}
                      className="flex items-center gap-2 text-xs text-teal-400 hover:text-teal-300 mb-4"
                    >
                      {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                      {expanded ? "Hide camp notes" : "Camp notes & what to expect"}
                    </button>

                    <AnimatePresence>
                      {expanded && camp.notes && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="overflow-hidden mb-4"
                        >
                          <p className="text-sm text-slate-400 bg-slate-800/50 rounded-xl p-3 border border-slate-700">{camp.notes}</p>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between text-xs text-slate-500 mb-1">
                          <span>Registration fill</span>
                          <span>{Math.round(progressPercent)}%</span>
                        </div>
                        <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                          <div
                            className={`h-full ${camp.spotsLeft < 30 ? "bg-amber-500" : "bg-teal-500"}`}
                            style={{ width: `${progressPercent}%` }}
                          />
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => openRegister(camp)}
                        disabled={isRegistered}
                        className="px-6 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-600 disabled:opacity-50 disabled:cursor-not-allowed font-medium text-sm flex items-center justify-center gap-2 transition-colors shrink-0"
                      >
                        {isRegistered ? (
                          <>
                            <CheckCircle size={16} /> Registered
                          </>
                        ) : (
                          <>
                            Register <ChevronRight size={16} />
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {filteredCamps.length === 0 && (
          <p className="text-center text-slate-500 py-12">No camps match your filters. Clear search or choose “All camps”.</p>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="mt-8 p-6 rounded-2xl bg-slate-900/50 border border-slate-800"
        >
          <h3 className="font-bold mb-3">What to bring</h3>
          <ul className="grid md:grid-cols-2 gap-2 text-sm text-slate-400">
            <li className="flex items-center gap-2">
              <CheckCircle size={14} className="text-teal-400 shrink-0" /> Valid ID (Aadhaar / voter ID)
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle size={14} className="text-teal-400 shrink-0" /> Phone for SMS confirmation (demo)
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle size={14} className="text-teal-400 shrink-0" /> Prior scans or lab reports if any
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle size={14} className="text-teal-400 shrink-0" /> Comfortable clothing; avoid lotions on chest if mammography
            </li>
          </ul>
        </motion.div>
      </div>

      <AnimatePresence>
        {showForm && selectedCamp && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowForm(false)}
            role="presentation"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-slate-900 rounded-2xl border border-slate-800 p-6 max-w-md w-full max-h-[90vh] overflow-y-auto"
            >
              <h2 className="text-xl font-bold mb-2">Register for camp</h2>
              <p className="text-sm text-slate-400 mb-1">{selectedCamp.title}</p>
              <p className="text-xs text-slate-500 mb-6">
                {selectedCamp.dateLabel} · {selectedCamp.location}
              </p>

              <form onSubmit={handleRegister} className="space-y-4">
                <div>
                  <label className="block text-sm text-slate-400 mb-2">Full name</label>
                  <div className="relative">
                    <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full pl-12 pr-4 py-3 rounded-xl bg-slate-800/50 border border-slate-700 focus:border-teal-500 focus:outline-none text-white"
                      placeholder="Your full name"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-slate-400 mb-2">Phone number</label>
                  <div className="relative">
                    <Phone size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full pl-12 pr-4 py-3 rounded-xl bg-slate-800/50 border border-slate-700 focus:border-teal-500 focus:outline-none text-white"
                      placeholder="+91 98765 43210"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-slate-400 mb-2">Email (optional)</label>
                  <div className="relative">
                    <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full pl-12 pr-4 py-3 rounded-xl bg-slate-800/50 border border-slate-700 focus:border-teal-500 focus:outline-none text-white"
                      placeholder="you@example.com"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-slate-400 mb-2">Age</label>
                    <input
                      type="number"
                      required
                      min={12}
                      max={120}
                      value={formData.age}
                      onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-slate-800/50 border border-slate-700 focus:border-teal-500 focus:outline-none text-white"
                      placeholder="Age"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-slate-400 mb-2">Preferred service</label>
                    <select
                      required
                      value={formData.service}
                      onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-slate-800/50 border border-slate-700 focus:border-teal-500 focus:outline-none text-white"
                    >
                      <option value="">Select…</option>
                      {selectedCamp.services.map((s, idx) => (
                        <option key={idx} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="flex-1 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 font-medium transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-3 rounded-xl bg-teal-500 hover:bg-teal-600 font-medium flex items-center justify-center gap-2 transition-colors"
                  >
                    <CheckCircle size={18} /> Confirm
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CampRegistration;
