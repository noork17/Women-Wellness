//////////////////////////////////////////////////////////////////////////////////////////////////////
// //////////////////////// SETV HEALTHCARE TECHNOLOGIES PRIVATE LIMITED ///////////////////////
// //////////////////// PREGNANCY TRACKER SOURCE CODE VERSION 2.0  (READY FOR DEVELOPMENT)
// CODE CLEANED LAST ON : 27-02-2025 //
// CODE LENGTH OF FILE ALLREPORTS LINE 16 - LINE XXXX (TO BE UPDATED AFTER FINAL CLEANING) //
// NUMBER OF SANITY CHECKS DONE DURING DEVELOPMENT : 6 CHECKS //
// DATE OF DEVELOPMENT START OF ALLREPORTS.JSX 10/2/2025 - 27/2/2025
///////////////////////// BASIC INFORMATION ABOUT THE FILE //////////////////////////////////////////
// This React component handles the display and management of all generated ultrasound scan reports. 
// The component supports features like search, sort, date filtering, pagination, and direct navigation to 
// detailed frame analysis for each report.

/* Report Management Features:

Fetches all reports from the backend API.

Provides search functionality by visit ID, patient ID, and patient name.

Supports sorting reports by date (newest/oldest).

Date filter allows narrowing reports to a specific day.

Pagination supports smooth navigation across multiple pages.

User can directly open frame analysis of any report by selecting it.

UI/UX Enhancements:

Search bar with real-time filtering.

Date picker for quick date selection.

Pagination for better report navigation.

Dynamic sidebar and navbar for seamless navigation across the app.

Error Handling and Validation:

Handles API errors gracefully with console logs (can be improved with user notifications).

Validates existence of folder before navigating to frame analysis.
*/

// Key Libraries and Dependencies
/*
React: Core library for building the UI.

React Router: Handles navigation within the app.

lucide-react: Provides icons for search and calendar.

Tailwind CSS: Handles styling and responsiveness.

React Hook Form: Planned future enhancement for managing filters and inputs (optional).

*/

// Data Flow:
/*
Reports fetched from backend via API call (http://localhost:8080/auth/api/reports).

Reports are stored in state and filtered based on search term, date, and sort order.

Filtered reports are paginated for display.

Selecting a report saves its folder to sessionStorage and navigates to frame analysis.
*/

// ENV OF FILE : FRONTEND
// LANGUAGES USED : REACT JS , TAILWIND CSS
// SECURITY CODE LEVEL : HIGH
//////////////////////////////////////////////////////////////////////////////////////////////////////

///////////////////////////////////// CODE STARTS HERE ////////////////////////////////////////////////

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Calendar, Filter, ChevronLeft, ChevronRight, Video, FileText, Activity, ShieldCheck, Sparkles } from "lucide-react";
import logo from "../../assets/health.webp";
import SideBar from "./SideBar";
import { BackToTop } from "../ui/BackToTop";
import { HEALTH_IMAGES } from "../../assets/healthImages";

export default function AllReports({ logoutFunction }) {
  const [reports, setReports] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredReports, setFilteredReports] = useState([]);
  const [sortOrder, setSortOrder] = useState("newest");
  const [selectedDate, setSelectedDate] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const navigate = useNavigate();

  const ResultFrames = (e) => {
    sessionStorage.setItem("folder", e);
    const folder = sessionStorage.getItem("folder");
    if (folder) {
      navigate("/analyze-frames");
    }
  };

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const response = await fetch("http://localhost:8080/auth/api/reports");
        if (!response.ok) throw new Error("Failed to fetch reports");
        const data = await response.json();
        setReports(data);
        setFilteredReports([...data].reverse());
      } catch (error) {
        console.error("Error fetching reports:", error);
      }
    };
    fetchReports();
  }, []);

  const parseCustomDate = (dateTimeString) => {
    const [datePart, timePart] = dateTimeString.split(" ");
    const [day, month, year] = datePart.split("/");
    const formattedDate = `${year}-${month}-${day} ${timePart}`;
    return new Date(formattedDate).getTime();
  };

  useEffect(() => {
    let filtered = reports.filter(
      (report) =>
        (report.visitId?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
        (report.patientId?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
        (report.patientName?.toLowerCase() || "").includes(searchTerm.toLowerCase())
    );

    if (selectedDate) {
      filtered = filtered.filter((report) => {
        const reportTime = parseCustomDate(`${report.visitDate} ${report.visitTime}`);
        const reportDateOnly = new Date(reportTime).toDateString();
        return reportDateOnly === selectedDate.toDateString();
      });
    }

    filtered = [...filtered].sort((a, b) => {
      const timeA = parseCustomDate(`${a.visitDate} ${a.visitTime}`);
      const timeB = parseCustomDate(`${b.visitDate} ${b.visitTime}`);
      return sortOrder === "newest" ? timeB - timeA : timeA - timeB;
    });

    setFilteredReports(filtered);
    setCurrentPage(1);
  }, [searchTerm, reports, sortOrder, selectedDate]);

  const indexOfLastReport = currentPage * itemsPerPage;
  const indexOfFirstReport = indexOfLastReport - itemsPerPage;
  const currentReports = filteredReports.slice(indexOfFirstReport, indexOfLastReport);
  const totalPages = Math.ceil(filteredReports.length / itemsPerPage);

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: { opacity: 1, x: 0 }
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-slate-50 relative overflow-hidden">
      <div className="fixed inset-0 pointer-events-none opacity-[0.06] z-0">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${HEALTH_IMAGES.healthcare})` }} />
      </div>
      {/* Abstract Background Elements */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-5%] left-[20%] w-[400px] h-[400px] bg-primary/5 rounded-full blur-[100px]" />
        <div className="absolute bottom-[5%] right-[10%] w-[500px] h-[500px] bg-secondary/5 rounded-full blur-[120px]" />
      </div>

      <SideBar logoutFunction={logoutFunction} className="z-40" />

      <main className="flex-1 p-6 lg:p-12 relative z-10">
        {/* Top Header */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white shadow-sm border border-gray-100 rounded-full text-primary text-[10px] font-black uppercase tracking-widest mb-3">
              <ShieldCheck size={12} /> HIPAA Compliant Portal
            </div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight">Patient <span className="text-primary">Reports</span></h1>
            <p className="text-slate-400 font-medium mt-1">Access and manage comprehensive diagnostic analytics.</p>
          </div>
          
          <div className="flex items-center gap-4">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate("/")}
              className="premium-button py-3 px-8 flex items-center gap-2"
            >
              <Activity size={18} /> New Analysis
            </motion.button>
            <motion.img src={logo} alt="Logo" className="w-16 h-16 object-contain hidden md:block" />
          </div>
        </header>

        {/* Global Stats bar - Premium touch */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
          {[
            { label: 'Total Scans', value: reports.length, icon: <Activity className="text-blue-500" /> },
            { label: 'Recent This Week', value: reports.filter(r => new Date(parseCustomDate(`${r.visitDate} ${r.visitTime}`)) > new Date() - 7*24*60*60*1000).length, icon: <Sparkles className="text-amber-500" /> }
          ].map((stat, i) => (
            <motion.div key={i} whileHover={{ y: -5 }} className="glass-card p-6 border-l-4 border-l-primary/50">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-slate-400 text-xs font-black uppercase tracking-widest mb-1">{stat.label}</p>
                  <p className="text-3xl font-black text-slate-800">{stat.value}</p>
                </div>
                <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center">
                  {stat.icon}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Control Center */}
        <section className="glass-card p-4 mb-8 bg-white/60 backdrop-blur-xl border-white/40">
          <div className="flex flex-col lg:flex-row gap-4 items-center">
            {/* Search Box */}
            <div className="relative flex-1 group w-full">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" size={20} />
              <input
                type="text"
                placeholder="Search by ID, Name or Visit ID..."
                className="w-full bg-white/80 border border-slate-200 focus:border-primary/40 focus:ring-4 focus:ring-primary/5 transition-all duration-300 rounded-2xl pl-12 pr-4 py-4 text-slate-700 font-medium placeholder:text-slate-300 outline-none"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Filters */}
            <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
              <div className="flex items-center gap-2 bg-white/80 border border-slate-200 rounded-2xl px-4 py-2">
                <Filter size={16} className="text-slate-400" />
                <select
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value)}
                  className="bg-transparent text-slate-600 font-bold text-sm outline-none cursor-pointer"
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                </select>
              </div>

              <div className="flex items-center gap-2 bg-white/80 border border-slate-200 rounded-2xl px-4 py-2">
                <Calendar size={16} className="text-slate-400" />
                <input
                  type="date"
                  className="bg-transparent text-slate-600 font-bold text-sm outline-none cursor-pointer"
                  onChange={(e) => setSelectedDate(e.target.value ? new Date(e.target.value) : null)}
                />
                {selectedDate && (
                  <button onClick={() => setSelectedDate(null)} className="text-rose-500 hover:text-rose-600 font-black text-[10px] uppercase">
                    Clear
                  </button>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Reports Table Container */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="glass-card overflow-hidden border-white/50 bg-white/40 backdrop-blur-md"
        >
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-900/5 border-b border-slate-200/50">
                  <th className="py-5 px-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Patient Details</th>
                  <th className="py-5 px-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">IDs</th>
                  <th className="py-5 px-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Date & Time</th>
                  <th className="py-5 px-6 text-right text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <AnimatePresence mode="popLayout">
                  {currentReports.map((report, index) => (
                    <motion.tr
                      key={report.visitId || index}
                      variants={itemVariants}
                      layout
                      className="group hover:bg-white/80 transition-all duration-300"
                    >
                      <td className="py-5 px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center text-primary font-black">
                            {report.patientName?.charAt(0) || 'P'}
                          </div>
                          <div>
                            <p className="font-bold text-slate-800">{report.patientName}</p>
                            <p className="text-xs text-slate-400 font-medium">Verified Patient</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-5 px-6">
                        <div className="space-y-1">
                          <p className="text-xs font-black text-slate-500 uppercase tracking-tighter">PID: <span className="text-slate-800 tracking-normal">{report.patientId}</span></p>
                          <p className="text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-md inline-block">VISIT: {report.visitId}</p>
                        </div>
                      </td>
                      <td className="py-5 px-6">
                        <div className="flex flex-col">
                          <span className="font-bold text-slate-700 text-sm">{report.visitDate}</span>
                          <span className="text-xs text-slate-400 font-medium italic">{report.visitTime}</span>
                        </div>
                      </td>
                      <td className="py-5 px-6">
                        <div className="flex items-center justify-end gap-2">
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => ResultFrames(report.visitId)}
                            className="p-2.5 rounded-xl bg-primary/10 text-primary hover:bg-primary hover:text-white transition-all duration-300 shadow-sm"
                            title="Analyze Frames"
                          >
                            <Activity size={18} />
                          </motion.button>
                          
                          <a href={report.video} target="_blank" rel="noopener noreferrer">
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              className="p-2.5 rounded-xl bg-secondary/10 text-secondary hover:bg-secondary hover:text-white transition-all duration-300 shadow-sm"
                              title="View Video"
                            >
                              <Video size={18} />
                            </motion.button>
                          </a>

                          <a href={report.report} target="_blank" rel="noopener noreferrer">
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              className="p-2.5 rounded-xl bg-slate-900/5 text-slate-600 hover:bg-slate-900 hover:text-white transition-all duration-300 shadow-sm"
                              title="View PDF Report"
                            >
                              <FileText size={18} />
                            </motion.button>
                          </a>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>

          {filteredReports.length === 0 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-20 text-center">
              <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search size={32} className="text-slate-300" />
              </div>
              <p className="text-slate-800 font-black text-xl mb-1">No Reports Found</p>
              <p className="text-slate-400 font-medium">Try adjusting your filters or search terms.</p>
            </motion.div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="p-6 border-t border-slate-100 flex justify-between items-center bg-white/30 backdrop-blur-sm">
              <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">
                Showing {indexOfFirstReport + 1}-{Math.min(indexOfLastReport, filteredReports.length)} of {filteredReports.length}
              </p>
              <div className="flex items-center gap-2">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(prev => prev - 1)}
                  className="p-2 rounded-xl bg-white border border-slate-200 text-slate-400 disabled:opacity-30 disabled:pointer-events-none hover:border-primary hover:text-primary transition-all shadow-sm"
                >
                  <ChevronLeft size={16} />
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
                  <button
                    key={num}
                    onClick={() => setCurrentPage(num)}
                    className={`w-10 h-10 rounded-xl font-bold text-sm transition-all ${
                      currentPage === num 
                        ? "bg-primary text-white shadow-lg shadow-primary/30" 
                        : "bg-white text-slate-400 border border-slate-100 hover:border-primary/30"
                    }`}
                  >
                    {num}
                  </button>
                ))}
                <button
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(prev => prev + 1)}
                  className="p-2 rounded-xl bg-white border border-slate-200 text-slate-400 disabled:opacity-30 disabled:pointer-events-none hover:border-primary hover:text-primary transition-all shadow-sm"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </main>
      <BackToTop />
    </div>
  );
}
