import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Bell,
  ArrowLeft,
  Calendar,
  FileText,
  AlertCircle,
  CheckCircle,
  Info,
  Trash2,
  Check,
  Settings,
  Filter,
  Clock,
  Heart,
  MessageSquare,
  Gift,
  Megaphone,
  X,
} from "lucide-react";

const Notifications = () => {
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: "appointment",
      title: "Appointment Reminder",
      message: "Your breast screening appointment is tomorrow at 10:30 AM with Dr. Priya Sharma",
      time: "2 hours ago",
      read: false,
      icon: Calendar,
      color: "bg-violet-500",
    },
    {
      id: 2,
      type: "report",
      title: "Report Ready",
      message: "Your PCOS assessment report is now available for download",
      time: "5 hours ago",
      read: false,
      icon: FileText,
      color: "bg-teal-500",
    },
    {
      id: 3,
      type: "alert",
      title: "Health Tip",
      message: "Regular self-examination is key to early detection. Learn the proper technique.",
      time: "1 day ago",
      read: true,
      icon: Heart,
      color: "bg-rose-500",
    },
    {
      id: 4,
      type: "message",
      title: "Message from Dr. Anitha",
      message: "Your test results look good! Keep up with the healthy lifestyle.",
      time: "2 days ago",
      read: true,
      icon: MessageSquare,
      color: "bg-blue-500",
    },
    {
      id: 5,
      type: "promo",
      title: "Free Screening Camp",
      message: "Join our free screening camp this Saturday at Vijayawada Community Center",
      time: "3 days ago",
      read: true,
      icon: Megaphone,
      color: "bg-amber-500",
    },
    {
      id: 6,
      type: "system",
      title: "Profile Update",
      message: "Your insurance details have been updated successfully",
      time: "5 days ago",
      read: true,
      icon: CheckCircle,
      color: "bg-emerald-500",
    },
  ]);

  const [filter, setFilter] = useState("all");

  const markAsRead = (id) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    ));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const deleteNotification = (id) => {
    setNotifications(notifications.filter(n => n.id !== id));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  const filteredNotifications = filter === "all" 
    ? notifications 
    : filter === "unread" 
    ? notifications.filter(n => !n.read)
    : notifications.filter(n => n.type === filter);

  const filters = [
    { id: "all", label: "All" },
    { id: "unread", label: "Unread" },
    { id: "appointment", label: "Appointments" },
    { id: "report", label: "Reports" },
    { id: "message", label: "Messages" },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-teal-500/5 rounded-full blur-3xl" />
      </div>

      <header className="relative z-10 px-6 py-4 border-b border-slate-800">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
            <ArrowLeft size={18} />
            <span className="text-sm">Back</span>
          </Link>
          <div className="flex items-center gap-2">
            <Bell size={20} />
            <h1 className="text-lg font-bold">Notifications</h1>
            {unreadCount > 0 && (
              <span className="px-2 py-0.5 rounded-full bg-teal-500 text-xs font-bold">{unreadCount}</span>
            )}
          </div>
          <button className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 transition-colors">
            <Settings size={18} className="text-slate-400" />
          </button>
        </div>
      </header>

      <div className="relative z-10 max-w-2xl mx-auto px-6 py-6">
        {/* Actions */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex gap-2 overflow-x-auto pb-2">
            {filters.map((f) => (
              <button
                key={f.id}
                onClick={() => setFilter(f.id)}
                className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
                  filter === f.id
                    ? "bg-teal-500 text-white"
                    : "bg-slate-900/50 text-slate-400 hover:bg-slate-800"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {unreadCount > 0 && (
          <div className="flex gap-3 mb-4">
            <button
              onClick={markAllAsRead}
              className="flex-1 py-2.5 rounded-xl bg-slate-900/50 border border-slate-800 hover:border-teal-500/50 text-sm font-medium flex items-center justify-center gap-2 transition-colors"
            >
              <Check size={16} /> Mark all as read
            </button>
            <button
              onClick={clearAll}
              className="py-2.5 px-4 rounded-xl bg-slate-900/50 border border-slate-800 hover:border-rose-500/50 text-sm font-medium flex items-center justify-center gap-2 transition-colors text-rose-400"
            >
              <Trash2 size={16} /> Clear all
            </button>
          </div>
        )}

        {/* Notifications List */}
        <div className="space-y-3">
          <AnimatePresence mode="popLayout">
            {filteredNotifications.length > 0 ? (
              filteredNotifications.map((notification, i) => (
                <motion.div
                  key={notification.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  transition={{ delay: i * 0.05 }}
                  onClick={() => markAsRead(notification.id)}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                    notification.read
                      ? "bg-slate-900/30 border-slate-800"
                      : "bg-slate-900/50 border-slate-700"
                  }`}
                >
                  <div className="flex gap-4">
                    <div className={`w-10 h-10 rounded-xl ${notification.color} flex items-center justify-center flex-shrink-0`}>
                      <notification.icon size={20} className="text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className={`font-semibold ${notification.read ? "text-slate-400" : "text-white"}`}>
                          {notification.title}
                        </h3>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          {!notification.read && (
                            <span className="w-2 h-2 rounded-full bg-teal-500" />
                          )}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteNotification(notification.id);
                            }}
                            className="p-1 rounded-lg hover:bg-slate-800 transition-colors"
                          >
                            <X size={14} className="text-slate-500" />
                          </button>
                        </div>
                      </div>
                      <p className={`text-sm mt-1 ${notification.read ? "text-slate-500" : "text-slate-400"}`}>
                        {notification.message}
                      </p>
                      <p className="text-xs text-slate-600 mt-2 flex items-center gap-1">
                        <Clock size={12} />
                        {notification.time}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-12"
              >
                <Bell size={48} className="mx-auto mb-4 text-slate-600" />
                <p className="text-slate-400">No notifications</p>
                <p className="text-sm text-slate-600 mt-1">You're all caught up!</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default Notifications;
