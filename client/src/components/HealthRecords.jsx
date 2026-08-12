import React, { useState, useMemo, useCallback } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  FileText,
  Download,
  Eye,
  ArrowLeft,
  Search,
  Calendar,
  CheckCircle,
  AlertTriangle,
  Share2,
  Printer,
  Folder,
  Heart,
  Activity,
  Stethoscope,
  TrendingUp,
  TrendingDown,
  ExternalLink,
  Copy,
} from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

const REPORTS_SEED = [
  {
    id: 1,
    title: "Breast Cancer Screening Report",
    category: "breast",
    dateISO: "2026-03-05",
    doctor: "Dr. Priya Sharma",
    status: "normal",
    type: "Mammography + AI Analysis",
    findings: "No abnormalities detected in reviewed imaging.",
    recommendations: "Continue annual screening per your clinician.",
    aiConfidence: 96,
  },
  {
    id: 2,
    title: "PCOS Assessment Report",
    category: "pcos",
    dateISO: "2026-02-20",
    doctor: "Dr. Anitha Reddy",
    status: "attention",
    type: "Ultrasound + Hormonal Panel",
    findings: "Mild polycystic ovarian morphology on ultrasound.",
    recommendations: "Follow-up in 3 months; lifestyle counseling as discussed.",
    aiConfidence: 94,
  },
  {
    id: 3,
    title: "Fibroid Detection Report",
    category: "fibroid",
    dateISO: "2026-01-15",
    doctor: "Dr. Lakshmi Rao",
    status: "normal",
    type: "Pelvic Ultrasound",
    findings: "No fibroids detected on current scan.",
    recommendations: "Routine gynecologic follow-up.",
    aiConfidence: 98,
  },
  {
    id: 4,
    title: "Comprehensive Health Report",
    category: "breast",
    dateISO: "2025-12-10",
    doctor: "Dr. Priya Sharma",
    status: "normal",
    type: "Full Body Screening",
    findings: "Screening parameters within expected range for age.",
    recommendations: "Maintain activity and balanced nutrition.",
    aiConfidence: 95,
  },
  {
    id: 5,
    title: "PCOS Follow-up Report",
    category: "pcos",
    dateISO: "2025-11-05",
    doctor: "Dr. Anitha Reddy",
    status: "normal",
    type: "Ultrasound Review",
    findings: "Improvement compared with prior scan.",
    recommendations: "Continue current care plan.",
    aiConfidence: 93,
  },
  {
    id: 6,
    title: "Breast Clinical Exam Summary",
    category: "breast",
    dateISO: "2025-09-22",
    doctor: "Dr. Priya Sharma",
    status: "normal",
    type: "Clinical breast exam",
    findings: "No dominant masses palpated; routine screening advised.",
    recommendations: "Schedule next visit per guidelines.",
    aiConfidence: 91,
  },
  {
    id: 7,
    title: "Fibroid Monitoring Scan",
    category: "fibroid",
    dateISO: "2025-08-01",
    doctor: "Dr. Lakshmi Rao",
    status: "attention",
    type: "Pelvic Ultrasound",
    findings: "Small intramural fibroid noted; stable size.",
    recommendations: "Symptom diary; discuss if bleeding worsens.",
    aiConfidence: 92,
  },
];

function formatDisplayDate(dateISO) {
  if (!dateISO) return "";
  const d = new Date(dateISO + "T12:00:00");
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

const HealthRecords = () => {
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedReport, setSelectedReport] = useState(null);
  const [sortNewest, setSortNewest] = useState(true);

  const reports = REPORTS_SEED;

  const categoryCounts = useMemo(() => {
    const c = { all: reports.length, breast: 0, pcos: 0, fibroid: 0 };
    for (const r of reports) {
      if (r.category in c) c[r.category] += 1;
    }
    return c;
  }, [reports]);

  const categories = useMemo(
    () => [
      { id: "all", label: "All records", count: categoryCounts.all },
      { id: "breast", label: "Breast screening", count: categoryCounts.breast },
      { id: "pcos", label: "PCOS", count: categoryCounts.pcos },
      { id: "fibroid", label: "Fibroid", count: categoryCounts.fibroid },
    ],
    [categoryCounts]
  );

  const healthMetrics = useMemo(() => {
    const normal = reports.filter((r) => r.status === "normal").length;
    const attention = reports.filter((r) => r.status === "attention").length;
    const avgAi =
      reports.length === 0 ? 0 : Math.round(reports.reduce((s, r) => s + r.aiConfidence, 0) / reports.length);
    return [
      { label: "Total screenings", value: String(reports.length), icon: FileText, color: "text-teal-400", trend: "+demo" },
      { label: "Normal results", value: String(normal), icon: CheckCircle, color: "text-emerald-400", trend: "—" },
      { label: "Needs follow-up", value: String(attention), icon: AlertTriangle, color: "text-amber-400", trend: attention ? "review" : "—" },
      { label: "Avg. AI confidence", value: `${avgAi}%`, icon: Activity, color: "text-violet-400", trend: "demo" },
    ];
  }, [reports]);

  const filteredReports = useMemo(() => {
    let list = reports.filter(
      (r) =>
        (activeCategory === "all" || r.category === activeCategory) &&
        (r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          r.doctor.toLowerCase().includes(searchQuery.toLowerCase()) ||
          r.findings.toLowerCase().includes(searchQuery.toLowerCase()))
    );
    list = [...list].sort((a, b) => {
      const ta = new Date(a.dateISO).getTime();
      const tb = new Date(b.dateISO).getTime();
      return sortNewest ? tb - ta : ta - tb;
    });
    return list;
  }, [reports, activeCategory, searchQuery, sortNewest]);

  const copyReportText = useCallback((r) => {
    const text = `${r.title}\n${formatDisplayDate(r.dateISO)}\nDoctor: ${r.doctor}\nFindings: ${r.findings}\nRecommendations: ${r.recommendations}`;
    navigator.clipboard?.writeText(text).then(
      () => toast.success("Copied summary to clipboard"),
      () => toast.error("Could not copy")
    );
  }, []);

  const exportListJson = useCallback(() => {
    const payload = filteredReports.map(({ id, title, category, dateISO, doctor, status, findings }) => ({
      id,
      title,
      category,
      dateISO,
      doctor,
      status,
      findings,
    }));
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `setv-health-records-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Download started");
  }, [filteredReports]);

  const getStatusBadge = (status) => {
    switch (status) {
      case "normal":
        return (
          <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-medium flex items-center gap-1">
            <CheckCircle size={12} /> Normal
          </span>
        );
      case "attention":
        return (
          <span className="px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 text-xs font-medium flex items-center gap-1">
            <AlertTriangle size={12} /> Follow-up
          </span>
        );
      default:
        return null;
    }
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case "breast":
        return Heart;
      case "pcos":
        return Activity;
      case "fibroid":
        return Stethoscope;
      default:
        return FileText;
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <Toaster position="top-right" />
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950" />
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-teal-500/5 rounded-full blur-3xl" />
      </div>

      <header className="relative z-10 px-6 py-4 border-b border-slate-800">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-3">
          <Link to="/" className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors shrink-0">
            <ArrowLeft size={18} />
            <span className="text-sm hidden sm:inline">Back</span>
          </Link>
          <h1 className="text-lg font-bold truncate">Health Records</h1>
          <div className="flex items-center gap-1 shrink-0">
            <button
              type="button"
              onClick={exportListJson}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 transition-colors"
              title="Export filtered list as JSON"
            >
              <Download size={20} className="text-teal-400" />
            </button>
          </div>
        </div>
      </header>

      <div className="relative z-10 max-w-6xl mx-auto px-6 py-6">
        <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-4 mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <p className="text-sm text-slate-400">
            Demo records for the SETV portal. For live visit PDFs from scans, also open{" "}
            <Link to="/all-reports" className="text-teal-400 hover:underline inline-flex items-center gap-1">
              All Reports <ExternalLink size={12} />
            </Link>
            .
          </p>
          <Link
            to="/book-appointment"
            className="px-4 py-2 rounded-xl bg-teal-500/15 border border-teal-500/40 text-teal-300 text-sm font-medium hover:bg-teal-500/25 transition-colors text-center"
          >
            Book follow-up
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {healthMetrics.map((metric, i) => (
            <motion.div
              key={metric.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="p-4 rounded-2xl bg-slate-900/50 border border-slate-800"
            >
              <div className="flex items-center justify-between mb-2">
                <metric.icon size={20} className={metric.color} />
                <span className="text-xs font-medium text-slate-500 flex items-center gap-1">
                  {metric.trend !== "—" && metric.trend !== "review" && <TrendingUp size={12} className="text-emerald-400" />}
                  {metric.trend === "review" && <TrendingDown size={12} className="text-amber-400" />}
                  {metric.trend}
                </span>
              </div>
              <p className="text-2xl font-bold text-white">{metric.value}</p>
              <p className="text-xs text-slate-500">{metric.label}</p>
            </motion.div>
          ))}
        </div>

        <div className="flex flex-col lg:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              placeholder="Search by title, doctor, or findings…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-xl bg-slate-900/50 border border-slate-800 focus:border-teal-500 focus:outline-none"
            />
          </div>
          <button
            type="button"
            onClick={() => setSortNewest((s) => !s)}
            className="px-4 py-3 rounded-xl bg-slate-900/50 border border-slate-800 hover:border-slate-600 text-sm text-slate-300 whitespace-nowrap"
          >
            Sort: {sortNewest ? "Newest first" : "Oldest first"}
          </button>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-2 mb-6">
          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setActiveCategory(cat.id)}
              className={`px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all flex items-center gap-2 ${
                activeCategory === cat.id ? "bg-teal-500 text-white" : "bg-slate-900/50 text-slate-400 hover:bg-slate-800"
              }`}
            >
              {cat.label}
              <span className={`px-2 py-0.5 rounded-full text-xs ${activeCategory === cat.id ? "bg-white/20" : "bg-slate-700"}`}>
                {cat.count}
              </span>
            </button>
          ))}
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          {filteredReports.map((report, i) => {
            const CategoryIcon = getCategoryIcon(report.category);
            return (
              <motion.div
                key={report.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: Math.min(i * 0.04, 0.3) }}
                className="bg-slate-900/50 rounded-2xl border border-slate-800 p-5 hover:border-teal-500/30 transition-colors"
              >
                <div className="flex items-start justify-between mb-3 gap-2">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center shrink-0">
                      <CategoryIcon size={20} className="text-teal-400" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-bold text-white text-sm leading-snug">{report.title}</h3>
                      <p className="text-xs text-slate-500 truncate">{report.type}</p>
                    </div>
                  </div>
                  {getStatusBadge(report.status)}
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm text-slate-400">
                    <Calendar size={14} />
                    <span>{formatDisplayDate(report.dateISO)}</span>
                  </div>
                  <p className="text-sm text-slate-300">
                    <span className="text-slate-500">Doctor:</span> {report.doctor}
                  </p>
                  <p className="text-sm text-slate-300 line-clamp-2">
                    <span className="text-slate-500">Findings:</span> {report.findings}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-slate-800 gap-2 flex-wrap">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-500">AI confidence</span>
                    <span className="text-sm font-bold text-teal-400">{report.aiConfidence}%</span>
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setSelectedReport(report)}
                      className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 transition-colors"
                      title="View"
                    >
                      <Eye size={16} className="text-slate-400" />
                    </button>
                    <button
                      type="button"
                      onClick={() => copyReportText(report)}
                      className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 transition-colors"
                      title="Copy summary"
                    >
                      <Copy size={16} className="text-slate-400" />
                    </button>
                    <button
                      type="button"
                      onClick={() => toast("Share: use copy summary or export JSON")}
                      className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 transition-colors"
                      title="Share"
                    >
                      <Share2 size={16} className="text-slate-400" />
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {filteredReports.length === 0 && (
          <div className="text-center py-12">
            <Folder size={48} className="mx-auto mb-4 text-slate-600" />
            <p className="text-slate-400 mb-4">No records match your filters.</p>
            <Link to="/breast-cancer" className="text-teal-400 hover:underline text-sm">
              Start a screening flow
            </Link>
          </div>
        )}
      </div>

      {selectedReport && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          onClick={() => setSelectedReport(null)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-slate-900 rounded-2xl border border-slate-800 p-6 max-w-lg w-full max-h-[85vh] overflow-y-auto shadow-2xl"
          >
            <div className="flex items-start justify-between mb-4 gap-2">
              <div>
                <h2 className="text-xl font-bold text-white pr-2">{selectedReport.title}</h2>
                <p className="text-sm text-slate-400">{formatDisplayDate(selectedReport.dateISO)}</p>
              </div>
              {getStatusBadge(selectedReport.status)}
            </div>

            <div className="space-y-4">
              {[
                ["Report type", selectedReport.type],
                ["Attending doctor", selectedReport.doctor],
                ["Findings", selectedReport.findings],
                ["Recommendations", selectedReport.recommendations],
              ].map(([k, v]) => (
                <div key={k} className="p-4 rounded-xl bg-slate-800/50">
                  <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">{k}</h4>
                  <p className="text-white text-sm leading-relaxed">{v}</p>
                </div>
              ))}

              <div className="p-4 rounded-xl bg-teal-500/10 border border-teal-500/30">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-teal-400">AI analysis confidence (demo)</span>
                  <span className="text-2xl font-bold text-teal-400">{selectedReport.aiConfidence}%</span>
                </div>
                <p className="text-xs text-slate-500 mt-2">Clinical decisions are always made by your care team.</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-3 mt-6">
              <button
                type="button"
                onClick={() => {
                  copyReportText(selectedReport);
                }}
                className="flex-1 min-w-[140px] py-3 rounded-xl bg-teal-500 hover:bg-teal-600 font-medium flex items-center justify-center gap-2 transition-colors"
              >
                <Copy size={18} /> Copy text
              </button>
              <button
                type="button"
                onClick={() => {
                  toast.success("In production, this would download your signed PDF from the visit.");
                  copyReportText(selectedReport);
                }}
                className="flex-1 min-w-[140px] py-3 rounded-xl bg-slate-800 hover:bg-slate-700 font-medium flex items-center justify-center gap-2 transition-colors"
              >
                <Download size={18} /> PDF (demo)
              </button>
              <button
                type="button"
                onClick={() => window.print()}
                className="p-3 rounded-xl bg-slate-800 hover:bg-slate-700 transition-colors"
                title="Print"
              >
                <Printer size={18} />
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default HealthRecords;
