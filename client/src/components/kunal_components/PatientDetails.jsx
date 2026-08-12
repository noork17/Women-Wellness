import React from 'react';
import { useNavigate } from 'react-router-dom';
import SideBar from './SideBar';
import { motion } from 'framer-motion';
import { ArrowLeft, User, Calendar, Activity, Eye, Video, FileText, Phone, UserCircle } from 'lucide-react';
import logo from "../../assets/health.webp";

export default function PatientDetails() {
  const navigate = useNavigate();

  const scans = [
    { id: 1, date: '07-01-2025', time: '09:30 AM', type: 'Breast Cancer Scan', status: 'Completed' },
    { id: 2, date: '15-12-2024', time: '02:45 PM', type: 'Fibroid Scan', status: 'Archive' }
  ];

  return (
    <div className="min-h-screen bg-[#FDFCFD] flex font-sans text-slate-900">
      <SideBar />
      
      <main className="flex-grow p-8 lg:p-12">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-12">
            <motion.button
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 px-4 py-2 bg-white shadow-premium rounded-xl text-slate-600 hover:text-primary transition-all font-bold border border-transparent hover:border-primary/20"
            >
              <ArrowLeft size={18} />
              <span>Back</span>
            </motion.button>

            <motion.img 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              src={logo} 
              alt="Logo" 
              className="h-12 w-auto" 
            />
          </div>

          {/* Patient Profile Card */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="bg-white rounded-[2.5rem] shadow-premium p-8 lg:p-10 mb-10 border border-slate-50 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
            
            <div className="flex flex-col md:flex-row items-center md:items-start gap-8 relative z-10">
              <div className="w-32 h-32 rounded-[2rem] bg-gradient-to-br from-primary to-primary-dark p-1 shadow-2xl shadow-primary/20">
                <div className="w-full h-full rounded-[1.8rem] bg-white flex items-center justify-center text-primary">
                  <UserCircle size={64} strokeWidth={1.5} />
                </div>
              </div>

              <div className="flex-grow text-center md:text-left">
                <div className="mb-6">
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-1">Patient Identity</p>
                  <h1 className="text-4xl font-black text-slate-800 tracking-tight mb-2">User 1</h1>
                  <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-bold ring-1 ring-primary/20">ID: #SETV-8821</span>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                  <div className="space-y-1">
                    <p className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
                      <Calendar size={14} className="text-primary" /> Age
                    </p>
                    <p className="text-lg font-black text-slate-800">45 Years</p>
                  </div>
                  <div className="space-y-1">
                    <p className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
                      <User size={14} className="text-primary" /> Gender
                    </p>
                    <p className="text-lg font-black text-slate-800">Male</p>
                  </div>
                  <div className="space-y-1">
                    <p className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
                      <Phone size={14} className="text-primary" /> Phone
                    </p>
                    <p className="text-lg font-black text-slate-800">+1 (555) 123-4567</p>
                  </div>
                  <div className="space-y-1">
                    <p className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
                      <Activity size={14} className="text-primary" /> Records
                    </p>
                    <p className="text-lg font-black text-slate-800">02 Scans</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Scans Timeline */}
          <div className="space-y-6">
            <h2 className="text-xl font-black text-slate-800 mb-6 flex items-center gap-3">
              <Activity className="text-primary" /> Analysis History
            </h2>
            
            {scans.map((scan, index) => (
              <motion.div
                key={scan.id}
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: index * 0.1 }}
                className="group bg-white rounded-3xl p-6 shadow-premium border border-slate-50 flex flex-col lg:flex-row items-center justify-between gap-6 hover:shadow-xl hover:shadow-primary/5 transition-all duration-500"
              >
                <div className="flex items-center gap-6 w-full lg:w-auto">
                  <div className="w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-primary/10 group-hover:text-primary transition-colors duration-500">
                    <FileText size={24} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-400">{scan.date} • {scan.time}</p>
                    <h3 className="text-lg font-black text-slate-800">{scan.type}</h3>
                  </div>
                </div>

                <div className="flex flex-wrap gap-3 w-full lg:w-auto md:justify-end">
                  <button className="flex-grow md:flex-none flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-slate-50 text-slate-600 font-bold hover:bg-slate-100 transition-all border border-slate-100">
                    <Video size={18} />
                    <span>View Video</span>
                  </button>
                  <button className="flex-grow md:flex-none flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-slate-50 text-slate-600 font-bold hover:bg-slate-100 transition-all border border-slate-100">
                    <FileText size={18} />
                    <span>View Report</span>
                  </button>
                  <button className="flex-grow md:flex-none flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-primary text-white font-bold hover:shadow-lg hover:shadow-primary/30 transition-all ring-4 ring-transparent hover:ring-primary/10">
                    <Activity size={18} />
                    <span>Analyze Frames</span>
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
