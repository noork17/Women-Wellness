import React, { useState, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Calendar,
  Clock,
  MapPin,
  ArrowLeft,
  CheckCircle,
  XCircle,
  AlertCircle,
  Video,
  MessageSquare,
  Plus,
  Filter,
  Search,
  FileText,
  RefreshCw,
} from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import {
  loadStoredAppointments,
  persistAppointments,
} from "../utils/appointmentLocalStorage";

function formatAppointmentDate(iso) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function formatAppointmentTime(iso) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true });
}

/** True if this appointment belongs in the Upcoming tab */
function isUpcomingSlot(apt, nowMs) {
  if (apt.status === "cancelled" || apt.status === "completed") return false;
  const t = new Date(apt.scheduledAt).getTime();
  if (Number.isNaN(t)) return false;
  return t >= nowMs;
}

const MyAppointments = () => {
  const [activeTab, setActiveTab] = useState("upcoming");
  const [showCancelModal, setShowCancelModal] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [appointments, setAppointments] = useState(loadStoredAppointments);

  const { upcoming, past } = useMemo(() => {
    const nowMs = Date.now();
    const up = [];
    const pa = [];
    for (const apt of appointments) {
      if (isUpcomingSlot(apt, nowMs)) up.push(apt);
      else pa.push(apt);
    }
    const byTime = (a, b) => new Date(a.scheduledAt) - new Date(b.scheduledAt);
    up.sort(byTime);
    pa.sort((a, b) => new Date(b.scheduledAt) - new Date(a.scheduledAt));
    return { upcoming: up, past: pa };
  }, [appointments]);

  const persist = useCallback((next) => {
    persistAppointments(next);
  }, []);

  const handleCancel = (id) => {
    setAppointments((prev) => {
      const next = prev.map((a) =>
        a.id === id ? { ...a, status: "cancelled", canReschedule: false, hasReport: false } : a
      );
      persist(next);
      return next;
    });
    toast.success("Appointment cancelled successfully", {
      style: { borderRadius: "16px", background: "#1e293b", color: "#fff" },
    });
    setShowCancelModal(null);
    setActiveTab("past");
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "confirmed":
        return (
          <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-medium flex items-center gap-1">
            <CheckCircle size={12} /> Confirmed
          </span>
        );
      case "pending":
        return (
          <span className="px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 text-xs font-medium flex items-center gap-1">
            <AlertCircle size={12} /> Pending
          </span>
        );
      case "completed":
        return (
          <span className="px-3 py-1 rounded-full bg-teal-500/10 text-teal-400 text-xs font-medium flex items-center gap-1">
            <CheckCircle size={12} /> Completed
          </span>
        );
      case "cancelled":
        return (
          <span className="px-3 py-1 rounded-full bg-rose-500/10 text-rose-400 text-xs font-medium flex items-center gap-1">
            <XCircle size={12} /> Cancelled
          </span>
        );
      default:
        return null;
    }
  };

  const list = activeTab === "upcoming" ? upcoming : past;
  const filteredAppointments = list.filter(
    (apt) =>
      apt.service.toLowerCase().includes(searchQuery.toLowerCase()) ||
      apt.doctor.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <Toaster position="top-right" />

      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-teal-500/5 rounded-full blur-3xl" />
      </div>

      <header className="relative z-10 px-6 py-4 border-b border-slate-800">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
            <ArrowLeft size={18} />
            <span className="text-sm">Back</span>
          </Link>
          <h1 className="text-lg font-bold">My Appointments</h1>
          <Link to="/book-appointment" className="p-2 rounded-xl bg-teal-500 hover:bg-teal-600 transition-colors">
            <Plus size={20} />
          </Link>
        </div>
      </header>

      <div className="relative z-10 max-w-4xl mx-auto px-6 py-6">
        <div className="flex gap-3 mb-6">
          <div className="flex-1 relative">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              placeholder="Search appointments..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-xl bg-slate-900/50 border border-slate-800 focus:border-teal-500 focus:outline-none"
            />
          </div>
          <button
            type="button"
            title="Filter (search covers doctor & service)"
            className="p-3 rounded-xl bg-slate-900/50 border border-slate-800 hover:border-slate-700 transition-colors"
          >
            <Filter size={20} className="text-slate-400" />
          </button>
        </div>

        <div className="flex gap-2 mb-6">
          {[
            { id: "upcoming", label: "Upcoming", count: upcoming.length },
            { id: "past", label: "Past", count: past.length },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`px-5 py-2.5 rounded-xl text-sm font-medium flex items-center gap-2 transition-all ${
                activeTab === tab.id ? "bg-teal-500 text-white" : "bg-slate-900/50 text-slate-400 hover:bg-slate-800"
              }`}
            >
              {tab.label}
              <span
                className={`px-2 py-0.5 rounded-full text-xs ${
                  activeTab === tab.id ? "bg-white/20" : "bg-slate-700"
                }`}
              >
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        <div className="space-y-4">
          <AnimatePresence mode="popLayout">
            {filteredAppointments.length > 0 ? (
              filteredAppointments.map((apt, i) => (
                <motion.div
                  key={apt.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: i * 0.05 }}
                  className="bg-slate-900/50 rounded-2xl border border-slate-800 p-5"
                >
                  <div className="flex gap-4">
                    <img src={apt.doctorImage} alt={apt.doctor} className="w-16 h-16 rounded-xl object-cover" />
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="font-bold text-white">{apt.service}</h3>
                          <p className="text-sm text-teal-400">
                            {apt.doctor} • {apt.specialty}
                          </p>
                        </div>
                        {getStatusBadge(apt.status)}
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm mt-3">
                        <div className="flex items-center gap-2 text-slate-400">
                          <Calendar size={14} />
                          <span>{formatAppointmentDate(apt.scheduledAt)}</span>
                        </div>
                        <div className="flex items-center gap-2 text-slate-400">
                          <Clock size={14} />
                          <span>{formatAppointmentTime(apt.scheduledAt)}</span>
                        </div>
                        <div className="flex items-center gap-2 text-slate-400 col-span-2 md:col-span-1">
                          <MapPin size={14} />
                          <span className="truncate">{apt.location}</span>
                        </div>
                      </div>

                      <div className="flex gap-2 mt-4 pt-4 border-t border-slate-800 flex-wrap">
                        {activeTab === "upcoming" && apt.status !== "cancelled" && (
                          <>
                            <Link
                              to="/book-appointment"
                              className="flex-1 min-w-[120px] py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-sm font-medium flex items-center justify-center gap-2 transition-colors text-center"
                            >
                              <RefreshCw size={14} /> Reschedule
                            </Link>
                            <button
                              type="button"
                              onClick={() => setShowCancelModal(apt.id)}
                              className="flex-1 min-w-[120px] py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 text-sm font-medium flex items-center justify-center gap-2 transition-colors"
                            >
                              <XCircle size={14} /> Cancel
                            </button>
                            <button
                              type="button"
                              className="p-2 rounded-xl bg-teal-500/10 hover:bg-teal-500/20 text-teal-400 transition-colors"
                              title="Video call (demo)"
                            >
                              <Video size={18} />
                            </button>
                            <button
                              type="button"
                              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 transition-colors"
                              title="Message (demo)"
                            >
                              <MessageSquare size={18} className="text-slate-400" />
                            </button>
                          </>
                        )}
                        {activeTab === "past" && apt.hasReport && (
                          <Link
                            to="/health-records"
                            className="flex-1 py-2 rounded-xl bg-teal-500/10 hover:bg-teal-500/20 text-teal-400 text-sm font-medium flex items-center justify-center gap-2 transition-colors"
                          >
                            <FileText size={14} /> View Report
                          </Link>
                        )}
                        {activeTab === "past" && apt.status === "completed" && (
                          <Link
                            to="/book-appointment"
                            className="flex-1 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-sm font-medium flex items-center justify-center gap-2 transition-colors"
                          >
                            <RefreshCw size={14} /> Book Again
                          </Link>
                        )}
                        {activeTab === "past" && apt.status === "cancelled" && (
                          <Link
                            to="/book-appointment"
                            className="flex-1 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-sm font-medium flex items-center justify-center gap-2 transition-colors"
                          >
                            <Plus size={14} /> Book new appointment
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))
            ) : (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-12">
                <Calendar size={48} className="mx-auto mb-4 text-slate-600" />
                <p className="text-slate-400">No appointments found</p>
                <Link
                  to="/book-appointment"
                  className="inline-flex items-center gap-2 mt-4 px-6 py-3 rounded-xl bg-teal-500 hover:bg-teal-600 font-medium transition-colors"
                >
                  <Plus size={18} /> Book Appointment
                </Link>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <AnimatePresence>
        {showCancelModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowCancelModal(null)}
            role="presentation"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-slate-900 rounded-2xl border border-slate-800 p-6 max-w-md w-full"
            >
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-rose-500/10 flex items-center justify-center mx-auto mb-4">
                  <AlertCircle size={32} className="text-rose-400" />
                </div>
                <h3 className="text-xl font-bold mb-2">Cancel Appointment?</h3>
                <p className="text-slate-400 text-sm mb-6">
                  Are you sure you want to cancel this appointment? This action cannot be undone.
                </p>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setShowCancelModal(null)}
                    className="flex-1 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 font-medium transition-colors"
                  >
                    Keep It
                  </button>
                  <button
                    type="button"
                    onClick={() => handleCancel(showCancelModal)}
                    className="flex-1 py-3 rounded-xl bg-rose-500 hover:bg-rose-600 font-medium transition-colors"
                  >
                    Yes, Cancel
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MyAppointments;
