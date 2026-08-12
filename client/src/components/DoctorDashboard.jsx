import React, { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  Users,
  Calendar,
  Clock,
  CheckCircle,
  AlertCircle,
  FileText,
  Activity,
  TrendingUp,
  Bell,
  Search,
  Filter,
  MoreVertical,
  Eye,
  MessageSquare,
  Video,
  Phone,
  ChevronRight,
  Stethoscope,
  Heart,
  Brain,
  ClipboardList,
} from "lucide-react";
import { HEALTH_IMAGES } from "../assets/healthImages";

const DoctorDashboard = () => {
  const [activeTab, setActiveTab] = useState("today");
  const [searchQuery, setSearchQuery] = useState("");

  const stats = [
    { label: "Today's Patients", value: "12", icon: Users, color: "text-teal-400", bg: "bg-teal-500/10", change: "+3" },
    { label: "Pending Reviews", value: "8", icon: FileText, color: "text-amber-400", bg: "bg-amber-500/10", change: "+2" },
    { label: "Completed Today", value: "4", icon: CheckCircle, color: "text-emerald-400", bg: "bg-emerald-500/10", change: "+4" },
    { label: "Urgent Cases", value: "2", icon: AlertCircle, color: "text-rose-400", bg: "bg-rose-500/10", change: "0" },
  ];

  const todayAppointments = [
    { id: 1, patient: "Priya Sharma", age: 35, type: "Breast Screening", time: "09:00 AM", status: "completed", risk: "low" },
    { id: 2, patient: "Lakshmi Devi", age: 42, type: "PCOS Follow-up", time: "09:30 AM", status: "completed", risk: "medium" },
    { id: 3, patient: "Sunita Rao", age: 38, type: "Mammography Review", time: "10:00 AM", status: "in-progress", risk: "high" },
    { id: 4, patient: "Anita Kumar", age: 45, type: "Fibroid Consultation", time: "10:30 AM", status: "waiting", risk: "low" },
    { id: 5, patient: "Kavya Reddy", age: 29, type: "PCOS Screening", time: "11:00 AM", status: "waiting", risk: "medium" },
    { id: 6, patient: "Meera Singh", age: 52, type: "Breast Screening", time: "11:30 AM", status: "scheduled", risk: "low" },
  ];

  const pendingReviews = [
    { id: 1, patient: "Radha Menon", type: "Mammography", submittedAt: "2 hours ago", aiConfidence: 94, flagged: true },
    { id: 2, patient: "Geeta Patel", type: "PCOS Ultrasound", submittedAt: "3 hours ago", aiConfidence: 89, flagged: false },
    { id: 3, patient: "Sita Verma", type: "Fibroid Scan", submittedAt: "4 hours ago", aiConfidence: 96, flagged: false },
  ];

  const recentActivities = [
    { action: "Completed review", patient: "Priya Sharma", time: "10 mins ago" },
    { action: "Added notes", patient: "Lakshmi Devi", time: "25 mins ago" },
    { action: "Sent report", patient: "Sunita Rao", time: "1 hour ago" },
    { action: "Started consultation", patient: "Anita Kumar", time: "2 hours ago" },
  ];

  const getStatusBadge = (status) => {
    switch (status) {
      case "completed":
        return <span className="px-2 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs">Completed</span>;
      case "in-progress":
        return <span className="px-2 py-1 rounded-full bg-blue-500/10 text-blue-400 text-xs">In Progress</span>;
      case "waiting":
        return <span className="px-2 py-1 rounded-full bg-amber-500/10 text-amber-400 text-xs">Waiting</span>;
      case "scheduled":
        return <span className="px-2 py-1 rounded-full bg-slate-500/10 text-slate-400 text-xs">Scheduled</span>;
      default:
        return null;
    }
  };

  const getRiskBadge = (risk) => {
    switch (risk) {
      case "high":
        return <span className="px-2 py-1 rounded-full bg-rose-500/10 text-rose-400 text-xs">High Risk</span>;
      case "medium":
        return <span className="px-2 py-1 rounded-full bg-amber-500/10 text-amber-400 text-xs">Medium</span>;
      default:
        return <span className="px-2 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs">Low</span>;
    }
  };

  const filteredAppointments = todayAppointments.filter(apt =>
    apt.patient.toLowerCase().includes(searchQuery.toLowerCase()) ||
    apt.type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950" />
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-teal-500/5 rounded-full blur-3xl" />
      </div>

      <header className="relative z-10 px-6 py-4 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
            <ArrowLeft size={18} />
            <span className="text-sm">Back</span>
          </Link>
          <h1 className="text-lg font-bold flex items-center gap-2">
            <Stethoscope size={20} className="text-teal-400" />
            Doctor Dashboard
          </h1>
          <div className="flex items-center gap-3">
            <button className="relative p-2 rounded-xl bg-slate-800 hover:bg-slate-700">
              <Bell size={18} />
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 rounded-full text-xs flex items-center justify-center">3</span>
            </button>
            <img src={HEALTH_IMAGES.teamDoctor} alt="Doctor" className="w-10 h-10 rounded-full object-cover border-2 border-teal-500" />
          </div>
        </div>
      </header>

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-6">
        {/* Welcome Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-teal-500/10 to-emerald-500/10 rounded-3xl border border-teal-500/30 p-6 mb-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold mb-1">Good Morning, Dr. Priya!</h2>
              <p className="text-slate-400">You have <span className="text-teal-400 font-semibold">12 appointments</span> today and <span className="text-amber-400 font-semibold">8 reports</span> pending review.</p>
            </div>
            <div className="hidden md:flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm text-slate-400">Today's Date</p>
                <p className="font-semibold">March 10, 2026</p>
              </div>
              <div className="w-px h-12 bg-slate-700" />
              <div className="text-right">
                <p className="text-sm text-slate-400">Time</p>
                <p className="font-semibold">10:15 AM</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="p-4 rounded-2xl bg-slate-900/50 border border-slate-800"
            >
              <div className="flex items-center justify-between mb-2">
                <div className={`w-10 h-10 rounded-xl ${stat.bg} flex items-center justify-center`}>
                  <stat.icon size={20} className={stat.color} />
                </div>
                <span className={`text-xs font-medium ${
                  stat.change.startsWith("+") && stat.change !== "+0" ? "text-emerald-400" : "text-slate-500"
                }`}>
                  {stat.change !== "0" && stat.change}
                </span>
              </div>
              <p className="text-2xl font-bold">{stat.value}</p>
              <p className="text-xs text-slate-500">{stat.label}</p>
            </motion.div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Content - Appointments */}
          <div className="lg:col-span-2 space-y-6">
            {/* Today's Appointments */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-slate-900/50 rounded-2xl border border-slate-800 p-5"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold flex items-center gap-2">
                  <Calendar size={18} className="text-teal-400" />
                  Today's Appointments
                </h3>
                <div className="flex gap-2">
                  <div className="relative">
                    <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                    <input
                      type="text"
                      placeholder="Search..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-9 pr-4 py-2 rounded-lg bg-slate-800 border border-slate-700 text-sm focus:border-teal-500 focus:outline-none w-40"
                    />
                  </div>
                  <button className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700">
                    <Filter size={16} />
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                {filteredAppointments.map((apt, i) => (
                  <motion.div
                    key={apt.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className={`p-4 rounded-xl border ${
                      apt.status === "in-progress" ? "bg-blue-500/5 border-blue-500/30" :
                      apt.status === "waiting" ? "bg-amber-500/5 border-amber-500/30" :
                      "bg-slate-800/50 border-slate-700"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-teal-400 to-emerald-500 flex items-center justify-center font-bold">
                          {apt.patient.split(" ").map(n => n[0]).join("")}
                        </div>
                        <div>
                          <p className="font-medium">{apt.patient}</p>
                          <p className="text-sm text-slate-400">{apt.type} • {apt.age} yrs</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="text-right hidden sm:block">
                          <p className="text-sm font-medium">{apt.time}</p>
                          <div className="flex gap-2">
                            {getStatusBadge(apt.status)}
                            {getRiskBadge(apt.risk)}
                          </div>
                        </div>
                        <div className="flex gap-1">
                          <button className="p-2 rounded-lg hover:bg-slate-700 transition-colors">
                            <Eye size={16} className="text-slate-400" />
                          </button>
                          <button className="p-2 rounded-lg hover:bg-slate-700 transition-colors">
                            <Video size={16} className="text-slate-400" />
                          </button>
                          <button className="p-2 rounded-lg hover:bg-slate-700 transition-colors">
                            <MoreVertical size={16} className="text-slate-400" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Pending Reviews */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-slate-900/50 rounded-2xl border border-slate-800 p-5"
            >
              <h3 className="font-bold mb-4 flex items-center gap-2">
                <ClipboardList size={18} className="text-amber-400" />
                Pending AI Reviews
              </h3>
              <div className="space-y-3">
                {pendingReviews.map((review, i) => (
                  <div
                    key={review.id}
                    className={`p-4 rounded-xl border ${
                      review.flagged ? "bg-rose-500/5 border-rose-500/30" : "bg-slate-800/50 border-slate-700"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-medium">{review.patient}</p>
                          {review.flagged && (
                            <span className="px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-400 text-xs">Flagged</span>
                          )}
                        </div>
                        <p className="text-sm text-slate-400">{review.type} • {review.submittedAt}</p>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="text-xs text-slate-500">AI Confidence</p>
                          <p className={`text-lg font-bold ${
                            review.aiConfidence >= 95 ? "text-emerald-400" :
                            review.aiConfidence >= 90 ? "text-amber-400" : "text-rose-400"
                          }`}>{review.aiConfidence}%</p>
                        </div>
                        <button className="px-4 py-2 rounded-lg bg-teal-500 hover:bg-teal-600 text-sm font-medium flex items-center gap-1 transition-colors">
                          Review <ChevronRight size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-slate-900/50 rounded-2xl border border-slate-800 p-5"
            >
              <h3 className="font-bold mb-4">Quick Actions</h3>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { icon: FileText, label: "New Report", color: "text-teal-400" },
                  { icon: Video, label: "Video Call", color: "text-blue-400" },
                  { icon: MessageSquare, label: "Messages", color: "text-violet-400" },
                  { icon: Brain, label: "AI Analysis", color: "text-amber-400" },
                ].map((action, i) => (
                  <button key={i} className="p-4 rounded-xl bg-slate-800 hover:bg-slate-700 flex flex-col items-center gap-2 transition-colors">
                    <action.icon size={24} className={action.color} />
                    <span className="text-xs">{action.label}</span>
                  </button>
                ))}
              </div>
            </motion.div>

            {/* Recent Activity */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-slate-900/50 rounded-2xl border border-slate-800 p-5"
            >
              <h3 className="font-bold mb-4 flex items-center gap-2">
                <Activity size={18} className="text-teal-400" />
                Recent Activity
              </h3>
              <div className="space-y-3">
                {recentActivities.map((activity, i) => (
                  <div key={i} className="flex items-center gap-3 p-2">
                    <div className="w-2 h-2 rounded-full bg-teal-500" />
                    <div className="flex-1">
                      <p className="text-sm">{activity.action}</p>
                      <p className="text-xs text-slate-500">{activity.patient} • {activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Performance */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-gradient-to-br from-teal-500/10 to-emerald-500/10 rounded-2xl border border-teal-500/30 p-5"
            >
              <h3 className="font-bold mb-4 flex items-center gap-2">
                <TrendingUp size={18} className="text-emerald-400" />
                This Month
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-slate-400">Patients Seen</span>
                  <span className="font-bold">156</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Reports Reviewed</span>
                  <span className="font-bold">142</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Avg. Rating</span>
                  <span className="font-bold text-amber-400">4.9 ★</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorDashboard;
