import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  Menu, X, LayoutDashboard, BarChart3, FileText, HelpCircle, LogOut, User, Sparkles,
  Home, Calendar, Bell, Heart, Activity, Brain, Calculator, Droplet, BookOpen, 
  Tent, MessageSquare, Star, Stethoscope, FolderOpen, Settings, ChevronDown, ChevronUp
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function SideBar() {
  const [isOpen, setIsOpen] = useState(false);
  const [expandedSection, setExpandedSection] = useState('main');
  const navigate = useNavigate();
  const location = useLocation();
  const name = sessionStorage.getItem('loggedInuser') || localStorage.getItem('loggedInuser');

  const navSections = [
    {
      id: 'main',
      label: 'Main',
      items: [
        { label: 'Landing Page', path: '/landing', icon: <Home size={18} /> },
        { label: 'Dashboard', path: '/dashboard', icon: <BarChart3 size={18} /> },
        { label: 'Select Scan', path: '/', icon: <LayoutDashboard size={18} /> },
      ]
    },
    {
      id: 'appointments',
      label: 'Appointments',
      items: [
        { label: 'Book Appointment', path: '/book-appointment', icon: <Calendar size={18} /> },
        { label: 'My Appointments', path: '/my-appointments', icon: <FileText size={18} /> },
      ]
    },
    {
      id: 'health',
      label: 'Health Tools',
      items: [
        { label: 'Symptom Checker', path: '/symptom-checker', icon: <Brain size={18} /> },
        { label: 'Risk Calculator', path: '/risk-calculator', icon: <Calculator size={18} /> },
        { label: 'Health Tracker', path: '/health-tracker', icon: <Droplet size={18} /> },
        { label: 'Health Records', path: '/health-records', icon: <FolderOpen size={18} /> },
      ]
    },
    {
      id: 'resources',
      label: 'Resources',
      items: [
        { label: 'Health Blog', path: '/blog', icon: <BookOpen size={18} /> },
        { label: 'Screening Camps', path: '/camps', icon: <Tent size={18} /> },
        { label: 'AI Chat', path: '/chat', icon: <MessageSquare size={18} /> },
        { label: 'All Reports', path: '/all-reports', icon: <FileText size={18} /> },
        { label: 'FAQ', path: '/faq', icon: <HelpCircle size={18} /> },
      ]
    },
  ];

  const accountItems = [
    { label: 'My Profile', path: '/profile', icon: <User size={18} /> },
    { label: 'Notifications', path: '/notifications', icon: <Bell size={18} /> },
    { label: 'Feedback', path: '/feedback', icon: <Star size={18} /> },
    { label: 'Doctor Portal', path: '/doctor-dashboard', icon: <Stethoscope size={18} /> },
  ];

  const userRole = sessionStorage.getItem('userRole') || localStorage.getItem('userRole') || '';

  const toggleSection = (sectionId) => {
    setExpandedSection(expandedSection === sectionId ? null : sectionId);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('loggedInuser');
    localStorage.removeItem('userRole');
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('loggedInuser');
    sessionStorage.removeItem('userRole');
    navigate('/login');
  };

  return (
    <>
      {/* Toggle Button — z above dashboard modals/chat; always clickable */}
      {!isOpen && (
        <motion.button
          type="button"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          onClick={() => setIsOpen(true)}
          className="fixed top-6 left-6 z-[100] p-3 bg-white shadow-lg rounded-xl border border-slate-200 text-slate-600 hover:text-primary hover:border-primary/30 transition-colors focus-ring"
        >
          <Menu size={24} />
        </motion.button>
      )}

      {/* Sidebar Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-[90]"
          />
        )}
      </AnimatePresence>

      {/* Sidebar Container — no pointer capture when slid off-screen */}
      <motion.aside
        initial={false}
        animate={{ x: isOpen ? 0 : -300 }}
        className={`fixed top-0 left-0 h-full w-72 backdrop-blur-xl border-r border-slate-200 z-[95] transform transition-shadow duration-500 flex flex-col ${isOpen ? "shadow-2xl pointer-events-auto" : "pointer-events-none"}`}
        style={{ backgroundImage: `linear-gradient(180deg, rgba(255,255,255,0.98) 0%, rgba(248,250,252,0.95) 100%), url(https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=800&q=85)`, backgroundSize: "cover", backgroundPosition: "center" }}
      >
        <div className="p-4 flex items-center justify-between border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20 text-white">
              <Sparkles size={18} />
            </div>
            <h1 className="text-xl font-black text-slate-800 tracking-tight">SETV<span className="text-primary italic">.H</span></h1>
          </div>
          <button type="button" onClick={() => setIsOpen(false)} className="p-2 hover:bg-slate-100 rounded-lg text-slate-400">
            <X size={20} />
          </button>
        </div>

        {/* User Profile Area */}
        <div className="px-4 mb-4">
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
              <User size={18} />
            </div>
            <div className="overflow-hidden flex-1">
              <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 truncate">
                {userRole === 'admin' ? 'administrator' : 'active account'}
              </p>
              <p className="text-sm font-bold text-slate-800 truncate">{name || 'Healthcare Pro'}</p>
            </div>
          </div>
        </div>

        {/* Navigation — main sections (scrollable) */}
        <nav className="flex-1 min-h-0 px-4 overflow-y-auto">
          <div className="space-y-1 pb-2">
            {navSections.map((section) => (
              <div key={section.id}>
                <button
                  type="button"
                  onClick={() => toggleSection(section.id)}
                  className="w-full flex items-center justify-between px-3 py-2 text-xs font-black uppercase tracking-widest text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {section.label}
                  {expandedSection === section.id ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                </button>
                <AnimatePresence>
                  {expandedSection === section.id && (
                    <motion.ul
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="space-y-1 overflow-hidden"
                    >
                      {section.items.map((item) => (
                        <li key={item.path}>
                          <Link
                            to={item.path}
                            onClick={() => setIsOpen(false)}
                            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl font-semibold text-sm transition-all duration-200 ${
                              location.pathname === item.path
                                ? 'bg-primary text-white shadow-md shadow-primary/20'
                                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                            }`}
                          >
                            {item.icon}
                            <span>{item.label}</span>
                            {location.pathname === item.path && (
                              <motion.div layoutId="activeNav" className="ml-auto w-1.5 h-1.5 rounded-full bg-white" />
                            )}
                          </Link>
                        </li>
                      ))}
                    </motion.ul>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </nav>

        {/* Account — fixed block below all sections, above logout */}
        <div className="shrink-0 px-4 pt-2 pb-3 border-t border-slate-200/90 bg-white/40 backdrop-blur-sm">
          <p className="px-3 py-2 text-xs font-black uppercase tracking-widest text-slate-400">Account</p>
          <ul className="space-y-1">
            {accountItems.map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl font-semibold text-sm transition-all duration-200 ${
                    location.pathname === item.path
                      ? 'bg-primary text-white shadow-md shadow-primary/20'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Footer actions */}
        <div className="shrink-0 p-4 border-t border-slate-100">
          <button
            type="button"
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-600 font-semibold hover:bg-red-50 transition-colors"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </motion.aside>
    </>
  );
}
