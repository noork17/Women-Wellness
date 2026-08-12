import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Activity,
  MapPin,
  AlertTriangle,
  TrendingUp,
  Shield,
  RefreshCw,
  Download,
  Loader2,
  BarChart3,
  PieChart as PieChartIcon,
  Users,
  Calendar,
  Clock,
  Target,
  Award,
  Search,
  X,
  ChevronUp,
  ChevronDown,
  FileText,
  Bell,
  Zap,
  Heart,
  Stethoscope,
  TrendingDown,
  ArrowUpRight,
  ArrowDownRight,
  Filter,
  Eye,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Truck,
  MapPinned,
  Battery,
  Cpu,
  Database,
  DollarSign,
  Briefcase,
  GraduationCap,
  Star,
  Sparkles,
  Brain,
  CircleDot,
  Gauge,
  CalendarDays,
  UserCheck,
  Wrench,
  Navigation,
  ThumbsUp,
  BadgeCheck,
  ArrowLeftRight,
  Layers,
  Pill,
  Syringe,
  ClipboardList,
  Phone,
  MessageSquare,
  Send,
  Bookmark,
  Share2,
  Settings,
  HelpCircle,
  Info,
  MoreVertical,
  Plus,
  Minus,
  Edit,
  Trash2,
  Copy,
  Printer,
  Mail,
  Globe,
  Wifi,
  WifiOff,
  Volume2,
  VolumeX,
  PlayCircle,
  PauseCircle,
  SkipForward,
  Repeat,
  Shuffle,
  List,
  Grid,
  LayoutDashboard,
  Home,
  User,
  UserPlus,
  UserMinus,
  Users2,
  Building,
  Building2,
  Hospital,
  Ambulance,
  HeartPulse,
  Thermometer,
  Droplet,
  TestTube,
  Microscope,
  Scan,
  QrCode,
  CreditCard,
  Wallet,
  Receipt,
  FileCheck,
  FilePlus,
  FileX,
  FolderOpen,
  Archive,
  Package,
  Box,
  Boxes,
  ShoppingCart,
  Tag,
  Tags,
  Percent,
  TrendingUp as TrendUp,
  BarChart2,
  LineChart as LineChartIcon,
  Activity as ActivityIcon,
} from "lucide-react";
import {
  ComposableMap,
  Geographies,
  Geography,
  ZoomableGroup,
} from "react-simple-maps";
import { feature } from "topojson-client";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  Legend,
  Cell,
  PieChart,
  Pie,
  AreaChart,
  Area,
  RadialBarChart,
  RadialBar,
} from "recharts";
import SideBar from "./kunal_components/SideBar";
import { BackToTop } from "./ui/BackToTop";
import { HEALTH_IMAGES } from "../assets/healthImages";
import { DISEASE_FILTERS } from "../data/dashboardData";
import { Chatbot } from "./Chatbot";
import toast, { Toaster } from "react-hot-toast";

const FALLBACK_DISTRICTS = [
  { districtId: "srikakulam", name: "Srikakulam", cases: 234, risk: "low", casesByDisease: { breast: 78, fibroid: 82, pcos: 74 } },
  { districtId: "vizianagaram", name: "Vizianagaram", cases: 198, risk: "low", casesByDisease: { breast: 65, fibroid: 70, pcos: 63 } },
  { districtId: "visakhapatnam", name: "Visakhapatnam", cases: 578, risk: "high", casesByDisease: { breast: 210, fibroid: 185, pcos: 183 } },
  { districtId: "eastgodavari", name: "East Godavari", cases: 445, risk: "medium", casesByDisease: { breast: 155, fibroid: 145, pcos: 145 } },
  { districtId: "westgodavari", name: "West Godavari", cases: 398, risk: "medium", casesByDisease: { breast: 135, fibroid: 130, pcos: 133 } },
  { districtId: "krishna", name: "Krishna", cases: 489, risk: "medium", casesByDisease: { breast: 170, fibroid: 160, pcos: 159 } },
  { districtId: "guntur", name: "Guntur", cases: 534, risk: "high", casesByDisease: { breast: 195, fibroid: 175, pcos: 164 } },
  { districtId: "prakasam", name: "Prakasam", cases: 267, risk: "low", casesByDisease: { breast: 90, fibroid: 88, pcos: 89 } },
  { districtId: "nellore", name: "S.P.S. Nellore", cases: 312, risk: "medium", casesByDisease: { breast: 105, fibroid: 102, pcos: 105 } },
  { districtId: "chittoor", name: "Chittoor", cases: 356, risk: "medium", casesByDisease: { breast: 120, fibroid: 118, pcos: 118 } },
  { districtId: "kadapa", name: "Y.S.R. Kadapa", cases: 423, risk: "high", casesByDisease: { breast: 150, fibroid: 138, pcos: 135 } },
  { districtId: "anantapur", name: "Anantapur", cases: 287, risk: "medium", casesByDisease: { breast: 98, fibroid: 95, pcos: 94 } },
  { districtId: "kurnool", name: "Kurnool", cases: 412, risk: "high", casesByDisease: { breast: 145, fibroid: 135, pcos: 132 } },
];

const FALLBACK_STATS = { totalDistricts: 13, totalCases: 4933, flaggedZones: 4, avgConfidence: 94.3 };
const FALLBACK_SCAN = { totalScans: 89500, normalScans: 71600, abnormalScans: 17900, pendingValidation: 4750 };

const AP_TOPJSON_URL =
  "https://raw.githubusercontent.com/guneetnarula/indian-district-boundaries/master/topojson/state-wise/andhrapradesh.json";

const API_BASE =
  (typeof import.meta !== "undefined" && import.meta.env?.VITE_API_BASE_URL) || "http://localhost:8080/auth";

const DTNAME_TO_ID = {
  Srikakulam: "srikakulam",
  Vizianagaram: "vizianagaram",
  Visakhapatnam: "visakhapatnam",
  Krishna: "krishna",
  Guntur: "guntur",
  "East Godavari": "eastgodavari",
  Prakasam: "prakasam",
  Kurnool: "kurnool",
  Anantapur: "anantapur",
  "S.P.S. Nellore": "nellore",
  "West Godavari": "westgodavari",
  "Y.S.R.": "kadapa",
  Chittoor: "chittoor",
};

const CHART_COLORS = { high: "#f43f5e", medium: "#eab308", low: "#22c55e" };
const DISEASE_COLORS = { breast: "#f43f5e", fibroid: "#6366f1", pcos: "#8b5cf6" };

const RECENT_SCREENINGS = [
  { id: 1, patient: "Lakshmi D.", district: "Visakhapatnam", type: "Breast", result: "Normal", time: "10 min ago", confidence: 96.2 },
  { id: 2, patient: "Sunita R.", district: "Guntur", type: "PCOS", result: "Abnormal", time: "15 min ago", confidence: 94.8 },
  { id: 3, patient: "Padma K.", district: "Krishna", type: "Fibroid", result: "Normal", time: "22 min ago", confidence: 97.1 },
  { id: 4, patient: "Anitha M.", district: "Kadapa", type: "Breast", result: "Pending", time: "30 min ago", confidence: 89.5 },
  { id: 5, patient: "Geetha S.", district: "Kurnool", type: "PCOS", result: "Normal", time: "45 min ago", confidence: 95.3 },
  { id: 6, patient: "Vijaya P.", district: "Chittoor", type: "Fibroid", result: "Abnormal", time: "1 hr ago", confidence: 92.1 },
];

const ACTIVITY_FEED = [
  { id: 1, type: "alert", message: "High-risk cluster detected in Visakhapatnam", time: "5 min ago" },
  { id: 2, type: "success", message: "Mobile van deployed to Kadapa district", time: "20 min ago" },
  { id: 3, type: "info", message: "Daily target 82% complete (12,400/15,000)", time: "1 hr ago" },
  { id: 4, type: "warning", message: "Equipment maintenance due in Guntur", time: "2 hrs ago" },
  { id: 5, type: "success", message: "Weekly report generated successfully", time: "3 hrs ago" },
];

const MOBILE_VANS = [
  { id: 1, name: "MV-001", location: "Visakhapatnam", status: "active", screeningsToday: 145, lastUpdate: "2 min ago", driver: "Ravi K.", battery: 78 },
  { id: 2, name: "MV-002", location: "Guntur", status: "active", screeningsToday: 132, lastUpdate: "5 min ago", driver: "Suresh M.", battery: 92 },
  { id: 3, name: "MV-003", location: "Kadapa", status: "maintenance", screeningsToday: 0, lastUpdate: "1 hr ago", driver: "Venkat R.", battery: 45 },
  { id: 4, name: "MV-004", location: "Krishna", status: "active", screeningsToday: 98, lastUpdate: "8 min ago", driver: "Prasad B.", battery: 65 },
  { id: 5, name: "MV-005", location: "Kurnool", status: "en-route", screeningsToday: 67, lastUpdate: "15 min ago", driver: "Kumar S.", battery: 88 },
];

const UPCOMING_CAMPS = [
  { id: 1, name: "Breast Cancer Awareness Camp", location: "Visakhapatnam", date: "Mar 15, 2026", expectedPatients: 500, registered: 423, status: "confirmed" },
  { id: 2, name: "PCOS Screening Drive", location: "Guntur", date: "Mar 18, 2026", expectedPatients: 350, registered: 287, status: "confirmed" },
  { id: 3, name: "Women Wellness Camp", location: "Kadapa", date: "Mar 22, 2026", expectedPatients: 400, registered: 156, status: "planning" },
  { id: 4, name: "Rural Health Outreach", location: "Srikakulam", date: "Mar 25, 2026", expectedPatients: 300, registered: 89, status: "planning" },
];

const AI_MODEL_METRICS = {
  accuracy: 94.3,
  precision: 92.8,
  recall: 95.1,
  f1Score: 93.9,
  totalPredictions: 89500,
  truePositives: 17012,
  falsePositives: 888,
  modelVersion: "v3.2.1",
  lastTrained: "Feb 28, 2026",
};

const RESOURCE_ALLOCATION = [
  { category: "Equipment", allocated: 4500000, utilized: 3825000, currency: "₹" },
  { category: "Staff Salary", allocated: 8200000, utilized: 7380000, currency: "₹" },
  { category: "Medicine", allocated: 2100000, utilized: 1890000, currency: "₹" },
  { category: "Transport", allocated: 1500000, utilized: 1275000, currency: "₹" },
  { category: "Training", allocated: 800000, utilized: 640000, currency: "₹" },
];

const STAFF_DEPLOYMENT = [
  { role: "Doctors", total: 156, deployed: 142, onLeave: 8, training: 6 },
  { role: "Nurses", total: 312, deployed: 289, onLeave: 15, training: 8 },
  { role: "Technicians", total: 98, deployed: 91, onLeave: 4, training: 3 },
  { role: "Support Staff", total: 245, deployed: 228, onLeave: 12, training: 5 },
];

const SUCCESS_STORIES = [
  { id: 1, title: "Early Detection Saves Life", patient: "Lakshmi R., 42", district: "Guntur", condition: "Stage 1 Breast Cancer", outcome: "Full Recovery", date: "Feb 2026" },
  { id: 2, title: "PCOS Management Success", patient: "Anitha K., 28", district: "Krishna", condition: "Severe PCOS", outcome: "Symptoms Controlled", date: "Jan 2026" },
  { id: 3, title: "Timely Fibroid Detection", patient: "Sunita M., 35", district: "Kadapa", condition: "Uterine Fibroids", outcome: "Successful Treatment", date: "Feb 2026" },
];

const DATA_QUALITY_METRICS = {
  completeness: 96.4,
  accuracy: 98.2,
  consistency: 97.8,
  timeliness: 94.1,
  totalRecords: 89500,
  validRecords: 86342,
  duplicates: 234,
  missingFields: 1876,
};

const APPOINTMENTS_DATA = {
  all: [
    { id: 1, patient: "Lakshmi D.", age: 35, district: "Visakhapatnam", type: "Breast Screening", doctor: "Dr. Padma R.", time: "09:00 AM", status: "confirmed" },
    { id: 2, patient: "Sunita R.", age: 28, district: "Guntur", type: "PCOS Checkup", doctor: "Dr. Anitha K.", time: "09:30 AM", status: "confirmed" },
    { id: 3, patient: "Geetha M.", age: 42, district: "Krishna", type: "Fibroid Scan", doctor: "Dr. Vijaya S.", time: "10:00 AM", status: "waiting" },
    { id: 4, patient: "Padma K.", age: 38, district: "Kadapa", type: "Breast Screening", doctor: "Dr. Padma R.", time: "10:30 AM", status: "waiting" },
    { id: 5, patient: "Anitha S.", age: 31, district: "Kurnool", type: "PCOS Consultation", doctor: "Dr. Anitha K.", time: "11:00 AM", status: "scheduled" },
    { id: 6, patient: "Vijaya L.", age: 45, district: "Chittoor", type: "Fibroid Follow-up", doctor: "Dr. Vijaya S.", time: "11:30 AM", status: "scheduled" },
  ],
  breast: [
    { id: 1, patient: "Lakshmi D.", age: 35, district: "Visakhapatnam", type: "Mammography", doctor: "Dr. Padma R.", time: "09:00 AM", status: "confirmed" },
    { id: 4, patient: "Padma K.", age: 38, district: "Kadapa", type: "Breast Ultrasound", doctor: "Dr. Padma R.", time: "10:30 AM", status: "waiting" },
  ],
  fibroid: [
    { id: 3, patient: "Geetha M.", age: 42, district: "Krishna", type: "Fibroid Scan", doctor: "Dr. Vijaya S.", time: "10:00 AM", status: "waiting" },
    { id: 6, patient: "Vijaya L.", age: 45, district: "Chittoor", type: "Fibroid Follow-up", doctor: "Dr. Vijaya S.", time: "11:30 AM", status: "scheduled" },
  ],
  pcos: [
    { id: 2, patient: "Sunita R.", age: 28, district: "Guntur", type: "PCOS Checkup", doctor: "Dr. Anitha K.", time: "09:30 AM", status: "confirmed" },
    { id: 5, patient: "Anitha S.", age: 31, district: "Kurnool", type: "PCOS Consultation", doctor: "Dr. Anitha K.", time: "11:00 AM", status: "scheduled" },
  ],
};

const DOCTOR_ALLOCATION = {
  all: [
    { id: 1, name: "Dr. Padma Rao", specialty: "Breast Cancer", district: "Visakhapatnam", patients: 45, rating: 4.9, available: true },
    { id: 2, name: "Dr. Anitha Kumar", specialty: "PCOS Specialist", district: "Guntur", patients: 38, rating: 4.8, available: true },
    { id: 3, name: "Dr. Vijaya Sharma", specialty: "Fibroid Expert", district: "Krishna", patients: 42, rating: 4.7, available: false },
    { id: 4, name: "Dr. Lakshmi Devi", specialty: "General OB-GYN", district: "Kadapa", patients: 52, rating: 4.9, available: true },
    { id: 5, name: "Dr. Sunita Reddy", specialty: "Breast Cancer", district: "Kurnool", patients: 36, rating: 4.6, available: true },
  ],
  breast: [
    { id: 1, name: "Dr. Padma Rao", specialty: "Breast Cancer", district: "Visakhapatnam", patients: 45, rating: 4.9, available: true },
    { id: 5, name: "Dr. Sunita Reddy", specialty: "Breast Cancer", district: "Kurnool", patients: 36, rating: 4.6, available: true },
  ],
  fibroid: [
    { id: 3, name: "Dr. Vijaya Sharma", specialty: "Fibroid Expert", district: "Krishna", patients: 42, rating: 4.7, available: false },
  ],
  pcos: [
    { id: 2, name: "Dr. Anitha Kumar", specialty: "PCOS Specialist", district: "Guntur", patients: 38, rating: 4.8, available: true },
  ],
};

const PATIENT_QUEUE = {
  all: { waiting: 23, inProgress: 8, completed: 145, avgWaitTime: 12 },
  breast: { waiting: 8, inProgress: 3, completed: 52, avgWaitTime: 15 },
  fibroid: { waiting: 7, inProgress: 2, completed: 48, avgWaitTime: 18 },
  pcos: { waiting: 8, inProgress: 3, completed: 45, avgWaitTime: 10 },
};

const EQUIPMENT_STATUS = {
  all: [
    { id: 1, name: "Mammography Unit A", type: "Imaging", status: "operational", usage: 87, location: "Visakhapatnam", lastService: "Feb 15, 2026" },
    { id: 2, name: "Ultrasound Scanner B", type: "Imaging", status: "operational", usage: 92, location: "Guntur", lastService: "Feb 20, 2026" },
    { id: 3, name: "PCOS Diagnostic Kit", type: "Diagnostic", status: "maintenance", usage: 0, location: "Krishna", lastService: "Feb 10, 2026" },
    { id: 4, name: "Mammography Unit B", type: "Imaging", status: "operational", usage: 78, location: "Kadapa", lastService: "Feb 18, 2026" },
    { id: 5, name: "MRI Scanner", type: "Imaging", status: "operational", usage: 65, location: "Kurnool", lastService: "Feb 22, 2026" },
  ],
  breast: [
    { id: 1, name: "Mammography Unit A", type: "Imaging", status: "operational", usage: 87, location: "Visakhapatnam", lastService: "Feb 15, 2026" },
    { id: 4, name: "Mammography Unit B", type: "Imaging", status: "operational", usage: 78, location: "Kadapa", lastService: "Feb 18, 2026" },
  ],
  fibroid: [
    { id: 2, name: "Ultrasound Scanner B", type: "Imaging", status: "operational", usage: 92, location: "Guntur", lastService: "Feb 20, 2026" },
    { id: 5, name: "MRI Scanner", type: "Imaging", status: "operational", usage: 65, location: "Kurnool", lastService: "Feb 22, 2026" },
  ],
  pcos: [
    { id: 3, name: "PCOS Diagnostic Kit", type: "Diagnostic", status: "maintenance", usage: 0, location: "Krishna", lastService: "Feb 10, 2026" },
  ],
};

const MEDICINE_STOCK = {
  all: [
    { id: 1, name: "Tamoxifen 20mg", category: "Breast Cancer", stock: 5420, minStock: 1000, unit: "tablets", expiry: "Dec 2026" },
    { id: 2, name: "Letrozole 2.5mg", category: "Breast Cancer", stock: 3200, minStock: 800, unit: "tablets", expiry: "Nov 2026" },
    { id: 3, name: "Metformin 500mg", category: "PCOS", stock: 8500, minStock: 2000, unit: "tablets", expiry: "Jan 2027" },
    { id: 4, name: "Clomiphene 50mg", category: "PCOS", stock: 2100, minStock: 500, unit: "tablets", expiry: "Oct 2026" },
    { id: 5, name: "Lupron Depot", category: "Fibroid", stock: 450, minStock: 100, unit: "injections", expiry: "Sep 2026" },
    { id: 6, name: "Tranexamic Acid", category: "Fibroid", stock: 3800, minStock: 1000, unit: "tablets", expiry: "Aug 2026" },
  ],
  breast: [
    { id: 1, name: "Tamoxifen 20mg", category: "Breast Cancer", stock: 5420, minStock: 1000, unit: "tablets", expiry: "Dec 2026" },
    { id: 2, name: "Letrozole 2.5mg", category: "Breast Cancer", stock: 3200, minStock: 800, unit: "tablets", expiry: "Nov 2026" },
  ],
  fibroid: [
    { id: 5, name: "Lupron Depot", category: "Fibroid", stock: 450, minStock: 100, unit: "injections", expiry: "Sep 2026" },
    { id: 6, name: "Tranexamic Acid", category: "Fibroid", stock: 3800, minStock: 1000, unit: "tablets", expiry: "Aug 2026" },
  ],
  pcos: [
    { id: 3, name: "Metformin 500mg", category: "PCOS", stock: 8500, minStock: 2000, unit: "tablets", expiry: "Jan 2027" },
    { id: 4, name: "Clomiphene 50mg", category: "PCOS", stock: 2100, minStock: 500, unit: "tablets", expiry: "Oct 2026" },
  ],
};

const FOLLOW_UP_PATIENTS = {
  all: [
    { id: 1, patient: "Lakshmi R.", condition: "Breast Cancer Stage 1", lastVisit: "Feb 28, 2026", nextVisit: "Mar 28, 2026", status: "stable", doctor: "Dr. Padma R." },
    { id: 2, patient: "Sunita K.", condition: "PCOS", lastVisit: "Mar 1, 2026", nextVisit: "Apr 1, 2026", status: "improving", doctor: "Dr. Anitha K." },
    { id: 3, patient: "Geetha M.", condition: "Uterine Fibroids", lastVisit: "Feb 25, 2026", nextVisit: "Mar 25, 2026", status: "monitoring", doctor: "Dr. Vijaya S." },
    { id: 4, patient: "Padma D.", condition: "Breast Screening", lastVisit: "Mar 5, 2026", nextVisit: "Sep 5, 2026", status: "normal", doctor: "Dr. Sunita R." },
  ],
  breast: [
    { id: 1, patient: "Lakshmi R.", condition: "Breast Cancer Stage 1", lastVisit: "Feb 28, 2026", nextVisit: "Mar 28, 2026", status: "stable", doctor: "Dr. Padma R." },
    { id: 4, patient: "Padma D.", condition: "Breast Screening", lastVisit: "Mar 5, 2026", nextVisit: "Sep 5, 2026", status: "normal", doctor: "Dr. Sunita R." },
  ],
  fibroid: [
    { id: 3, patient: "Geetha M.", condition: "Uterine Fibroids", lastVisit: "Feb 25, 2026", nextVisit: "Mar 25, 2026", status: "monitoring", doctor: "Dr. Vijaya S." },
  ],
  pcos: [
    { id: 2, patient: "Sunita K.", condition: "PCOS", lastVisit: "Mar 1, 2026", nextVisit: "Apr 1, 2026", status: "improving", doctor: "Dr. Anitha K." },
  ],
};

const LAB_RESULTS = {
  all: { pending: 234, completed: 1245, critical: 12, avgTurnaround: 4.2 },
  breast: { pending: 78, completed: 420, critical: 5, avgTurnaround: 5.1 },
  fibroid: { pending: 65, completed: 380, critical: 3, avgTurnaround: 3.8 },
  pcos: { pending: 91, completed: 445, critical: 4, avgTurnaround: 3.5 },
};

const REFERRALS = {
  all: [
    { id: 1, patient: "Anitha R.", from: "PHC Visakhapatnam", to: "District Hospital", reason: "Advanced screening needed", status: "pending", date: "Mar 8, 2026" },
    { id: 2, patient: "Vijaya K.", from: "Mobile Van MV-002", to: "Cancer Center Guntur", reason: "Suspected malignancy", status: "accepted", date: "Mar 7, 2026" },
    { id: 3, patient: "Lakshmi M.", from: "PHC Krishna", to: "Specialty Clinic", reason: "Complex fibroid case", status: "completed", date: "Mar 5, 2026" },
  ],
  breast: [
    { id: 2, patient: "Vijaya K.", from: "Mobile Van MV-002", to: "Cancer Center Guntur", reason: "Suspected malignancy", status: "accepted", date: "Mar 7, 2026" },
  ],
  fibroid: [
    { id: 3, patient: "Lakshmi M.", from: "PHC Krishna", to: "Specialty Clinic", reason: "Complex fibroid case", status: "completed", date: "Mar 5, 2026" },
  ],
  pcos: [
    { id: 1, patient: "Anitha R.", from: "PHC Visakhapatnam", to: "District Hospital", reason: "Advanced screening needed", status: "pending", date: "Mar 8, 2026" },
  ],
};

const INSURANCE_CLAIMS = {
  all: { submitted: 1234, approved: 1089, pending: 98, rejected: 47, totalAmount: 4520000 },
  breast: { submitted: 412, approved: 365, pending: 32, rejected: 15, totalAmount: 1850000 },
  fibroid: { submitted: 398, approved: 352, pending: 31, rejected: 15, totalAmount: 1420000 },
  pcos: { submitted: 424, approved: 372, pending: 35, rejected: 17, totalAmount: 1250000 },
};

const HEALTH_TIPS = {
  all: [
    { id: 1, title: "Monthly Self-Examination", category: "Breast Health", tip: "Perform breast self-examination monthly after your period." },
    { id: 2, title: "Maintain Healthy Weight", category: "PCOS", tip: "Regular exercise helps manage PCOS symptoms effectively." },
    { id: 3, title: "Watch for Symptoms", category: "Fibroid", tip: "Heavy bleeding or pelvic pain may indicate fibroids." },
  ],
  breast: [
    { id: 1, title: "Monthly Self-Examination", category: "Breast Health", tip: "Perform breast self-examination monthly after your period." },
    { id: 4, title: "Annual Mammograms", category: "Breast Health", tip: "Women over 40 should have annual mammograms." },
  ],
  fibroid: [
    { id: 3, title: "Watch for Symptoms", category: "Fibroid", tip: "Heavy bleeding or pelvic pain may indicate fibroids." },
    { id: 5, title: "Iron-Rich Diet", category: "Fibroid", tip: "Include iron-rich foods to prevent anemia from heavy bleeding." },
  ],
  pcos: [
    { id: 2, title: "Maintain Healthy Weight", category: "PCOS", tip: "Regular exercise helps manage PCOS symptoms effectively." },
    { id: 6, title: "Low Glycemic Diet", category: "PCOS", tip: "Choose low GI foods to manage insulin resistance." },
  ],
};

const FEEDBACK_RATINGS = {
  all: { avgRating: 4.6, totalFeedback: 3245, positive: 2876, neutral: 287, negative: 82 },
  breast: { avgRating: 4.7, totalFeedback: 1120, positive: 1005, neutral: 92, negative: 23 },
  fibroid: { avgRating: 4.5, totalFeedback: 980, positive: 858, neutral: 98, negative: 24 },
  pcos: { avgRating: 4.6, totalFeedback: 1145, positive: 1013, neutral: 97, negative: 35 },
};

const TRAINING_SCHEDULE = [
  { id: 1, title: "Advanced Mammography Techniques", date: "Mar 20, 2026", trainer: "Dr. Expert", participants: 25, status: "upcoming" },
  { id: 2, title: "PCOS Diagnosis Workshop", date: "Mar 25, 2026", trainer: "Dr. Specialist", participants: 30, status: "upcoming" },
  { id: 3, title: "Fibroid Ultrasound Training", date: "Apr 2, 2026", trainer: "Dr. Radiologist", participants: 20, status: "scheduled" },
];

const EMERGENCY_ALERTS = [
  { id: 1, type: "critical", message: "Critical case in Visakhapatnam - immediate attention needed", time: "5 min ago", patient: "Patient #4521" },
  { id: 2, type: "warning", message: "Equipment malfunction in Guntur mobile van", time: "15 min ago", equipment: "Ultrasound Unit" },
  { id: 3, type: "info", message: "Blood bank stock low in Kadapa district", time: "1 hr ago", item: "O+ Blood" },
];

const COMPLIANCE_METRICS = {
  all: { protocolAdherence: 96.2, documentationRate: 98.5, followUpRate: 89.3, patientSatisfaction: 92.1 },
  breast: { protocolAdherence: 97.1, documentationRate: 99.0, followUpRate: 91.2, patientSatisfaction: 93.5 },
  fibroid: { protocolAdherence: 95.8, documentationRate: 98.2, followUpRate: 88.1, patientSatisfaction: 91.2 },
  pcos: { protocolAdherence: 95.5, documentationRate: 98.1, followUpRate: 88.8, patientSatisfaction: 91.8 },
};

const POPULATION_COVERAGE = {
  all: { totalPopulation: 2450000, screened: 892000, coverage: 36.4, targetCoverage: 50 },
  breast: { totalPopulation: 820000, screened: 312000, coverage: 38.0, targetCoverage: 50 },
  fibroid: { totalPopulation: 780000, screened: 285000, coverage: 36.5, targetCoverage: 50 },
  pcos: { totalPopulation: 850000, screened: 295000, coverage: 34.7, targetCoverage: 50 },
};

export default function HealthDashboard() {
  const [activeFilter, setActiveFilter] = useState("all");
  const [dateRange, setDateRange] = useState("7");
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [geo, setGeo] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState(null);
  const [showActivityFeed, setShowActivityFeed] = useState(true);
  const [compareDistrict1, setCompareDistrict1] = useState(null);
  const [compareDistrict2, setCompareDistrict2] = useState(null);
  const [globalSearch, setGlobalSearch] = useState("");
  const [viewMode, setViewMode] = useState("cards");
  const [autoRefresh, setAutoRefresh] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [vanDeploying, setVanDeploying] = useState(false);
  const [isAdminView, setIsAdminView] = useState(false);

  useEffect(() => {
    try {
      setIsAdminView(
        localStorage.getItem("userRole") === "admin" || sessionStorage.getItem("userRole") === "admin"
      );
    } catch {
      setIsAdminView(false);
    }
  }, []);

  const fetchDashboard = async (disease = activeFilter) => {
    try {
      setLoading(true);
      const q = disease !== "all" ? `?disease=${disease}` : "";
      const res = await fetch(`${API_BASE}/api/dashboard${q}`);
      if (!res.ok) throw new Error("Failed to fetch");
      const json = await res.json();
      setData(json);
    } catch (err) {
      console.error(err);
      setData({
        stats: FALLBACK_STATS,
        districts: FALLBACK_DISTRICTS,
        scanSummary: FALLBACK_SCAN,
        alerts: FALLBACK_DISTRICTS.filter((d) => d.risk === "high").slice(0, 4).map((d) => ({
          district: d.name,
          condition: "Screening cluster detected",
          action: "Deploy mobile screening van",
          severity: "high",
        })),
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchGeo = async () => {
    try {
      const res = await fetch(AP_TOPJSON_URL);
      const topology = await res.json();
      if (topology.objects?.["andhra-pradesh"]) {
        const geojson = feature(topology, topology.objects["andhra-pradesh"]);
        setGeo(geojson);
      }
    } catch (err) {
      try {
        const local = await fetch("/andhra-pradesh.geo.json");
        if (local.ok) setGeo(await local.json());
      } catch (e) {
        console.error("Map load error:", err);
      }
    }
  };

  useEffect(() => {
    fetchGeo();
  }, []);

  useEffect(() => {
    fetchDashboard(activeFilter);
  }, [activeFilter]);

  // Auto-refresh effect
  useEffect(() => {
    let intervalId;
    if (autoRefresh) {
      intervalId = setInterval(() => {
        fetchDashboard(activeFilter);
        setLastUpdated(new Date());
      }, 30000); // Refresh every 30 seconds
    }
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [autoRefresh, activeFilter]);

  // Update lastUpdated when data changes
  useEffect(() => {
    if (data) setLastUpdated(new Date());
  }, [data]);

  const stats = data?.stats || FALLBACK_STATS;
  const districts = (data?.districts?.length ? data.districts : FALLBACK_DISTRICTS);
  const scanSummary = data?.scanSummary || FALLBACK_SCAN;
  const alerts = data?.alerts?.length ? data.alerts : FALLBACK_DISTRICTS.filter((d) => d.risk === "high").slice(0, 4).map((d) => ({
    district: d.name,
    condition: "Screening cluster detected",
    action: "Deploy mobile screening van",
    severity: "high",
  }));

  const filteredDistricts = useMemo(() => {
    if (!searchQuery.trim()) return districts;
    return districts.filter((d) =>
      d.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [districts, searchQuery]);

  // Initialize comparison districts when data loads
  useEffect(() => {
    if (districts.length >= 2) {
      if (!compareDistrict1) setCompareDistrict1(districts[0]?.districtId);
      if (!compareDistrict2) setCompareDistrict2(districts[1]?.districtId);
    }
  }, [districts]);

  // Get comparison district data dynamically
  const comparisonData1 = useMemo(() => {
    return districts.find(d => d.districtId === compareDistrict1) || districts[0] || null;
  }, [districts, compareDistrict1]);

  const comparisonData2 = useMemo(() => {
    return districts.find(d => d.districtId === compareDistrict2) || districts[1] || null;
  }, [districts, compareDistrict2]);

  // Calculate comparison metrics
  const comparisonMetrics = useMemo(() => {
    if (!comparisonData1 || !comparisonData2) return null;
    const diff = (comparisonData1.cases || 0) - (comparisonData2.cases || 0);
    const percentDiff = comparisonData2.cases ? ((diff / comparisonData2.cases) * 100).toFixed(1) : 0;
    return {
      difference: diff,
      percentDiff,
      higherDistrict: diff > 0 ? comparisonData1.name : comparisonData2.name,
      lowerDistrict: diff > 0 ? comparisonData2.name : comparisonData1.name,
    };
  }, [comparisonData1, comparisonData2]);

  // Dynamic stats based on date range
  const dateRangeMultiplier = useMemo(() => {
    switch(dateRange) {
      case "7": return 1;
      case "30": return 4.2;
      case "90": return 12.5;
      default: return 1;
    }
  }, [dateRange]);

  // Dynamic screenings based on filter and date range
  const dynamicScreeningsToday = useMemo(() => {
    const total = scanSummary?.totalScans ?? 0;
    if (total > 0) {
      const dailyEst = Math.max(12, Math.round(total / 30));
      const mult = dateRange === "7" ? 1 : dateRange === "30" ? 1.08 : 1.12;
      const filt = activeFilter === "all" ? 1 : 0.38;
      return Math.round(dailyEst * mult * filt);
    }
    const base = activeFilter === "all" ? 12400 : activeFilter === "breast" ? 4800 : activeFilter === "pcos" ? 4100 : 3500;
    return Math.round(base * (dateRange === "7" ? 1 : dateRange === "30" ? 1.15 : 1.25));
  }, [scanSummary?.totalScans, activeFilter, dateRange]);

  const districtMap = useMemo(
    () => Object.fromEntries(districts.map((d) => [d.districtId, d])),
    [districts]
  );

  const districtByName = useMemo(
    () => Object.fromEntries(districts.map((d) => [d.name.toLowerCase(), d])),
    [districts]
  );

  /** Map styling: stronger contrast between high / medium / low vs state average. */
  const MAP_RISK_STYLE = {
    high: { fill: "#e11d48", stroke: "#881337", hover: "#fda4af" },
    medium: { fill: "#d97706", stroke: "#92400e", hover: "#fcd34d" },
    low: { fill: "#15803d", stroke: "#14532d", hover: "#86efac" },
    unknown: { fill: "#cbd5e1", stroke: "#64748b", hover: "#e2e8f0" },
  };

  const getDistrictFromGeoProps = (geoProps) => {
    const dtname = geoProps?.dtname;
    const districtId = DTNAME_TO_ID[dtname] ?? geoProps?.districtId;
    return districtMap[districtId] ?? districtByName[dtname?.toLowerCase()] ?? null;
  };

  const getMapRiskStyle = (d) => {
    if (!d) return MAP_RISK_STYLE.unknown;
    if (d.risk === "high") return MAP_RISK_STYLE.high;
    if (d.risk === "medium") return MAP_RISK_STYLE.medium;
    return MAP_RISK_STYLE.low;
  };

  const barChartData = useMemo(() => {
    return districts.slice(0, 10).map((d) => {
      let displayCases = d.cases;
      if (activeFilter !== "all" && d.casesByDisease) {
        displayCases = d.casesByDisease[activeFilter] || Math.round(d.cases * 0.33);
      }
      return {
        name: d.name.length > 12 ? d.name.slice(0, 11) + "…" : d.name,
        fullName: d.name,
        cases: displayCases,
        risk: d.risk,
        breast: d.casesByDisease?.breast || 0,
        fibroid: d.casesByDisease?.fibroid || 0,
        pcos: d.casesByDisease?.pcos || 0,
      };
    });
  }, [districts, activeFilter]);

  const trendData = useMemo(() => {
    const days = parseInt(dateRange) || 7;
    const base = Math.max((stats.totalCases ?? 0) / days, 400);
    const diseaseMultiplier = activeFilter === "all" ? 1 : 0.35;
    const seed = (i) => Math.sin(i * 1.3) * 0.15 + 1;
    
    const dataPoints = Math.min(days, 14);
    return Array.from({ length: dataPoints }, (_, i) => {
      const daysAgo = dataPoints - i;
      return {
        day: daysAgo === 1 ? "Today" : daysAgo === 2 ? "Yesterday" : `${daysAgo}d ago`,
        cases: Math.round(base * diseaseMultiplier * (0.8 + seed(i))),
        screenings: Math.round(base * diseaseMultiplier * 1.3 * (0.85 + seed(i + 2))),
        abnormal: Math.round(base * diseaseMultiplier * 0.2 * (0.7 + seed(i + 1))),
      };
    }).reverse();
  }, [stats.totalCases, dateRange, activeFilter]);

  const diseaseDistribution = useMemo(() => {
    const totals = { breast: 0, fibroid: 0, pcos: 0 };
    districts.forEach((d) => {
      if (d.casesByDisease) {
        totals.breast += d.casesByDisease.breast || 0;
        totals.fibroid += d.casesByDisease.fibroid || 0;
        totals.pcos += d.casesByDisease.pcos || 0;
      }
    });
    return [
      { name: "Breast Cancer", value: totals.breast || Math.round(stats.totalCases * 0.35), fill: DISEASE_COLORS.breast },
      { name: "Fibroids", value: totals.fibroid || Math.round(stats.totalCases * 0.33), fill: DISEASE_COLORS.fibroid },
      { name: "PCOS", value: totals.pcos || Math.round(stats.totalCases * 0.32), fill: DISEASE_COLORS.pcos },
    ];
  }, [districts, stats.totalCases]);

  const riskDistribution = useMemo(() => {
    const counts = { high: 0, medium: 0, low: 0 };
    districts.forEach((d) => {
      counts[d.risk] = (counts[d.risk] || 0) + 1;
    });
    return [
      { name: "High Risk", value: counts.high, fill: CHART_COLORS.high },
      { name: "Medium Risk", value: counts.medium, fill: CHART_COLORS.medium },
      { name: "Low Risk", value: counts.low, fill: CHART_COLORS.low },
    ];
  }, [districts]);

  const monthlyTrendData = useMemo(() => {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
    const base = Math.max((stats.totalCases ?? 0) / 6, 600);
    const filterMultiplier = activeFilter === "all" ? 1 : 0.4;
    
    return months.map((m, i) => {
      const breastVal = Math.round(base * 0.35 * filterMultiplier * (0.9 + Math.sin(i * 0.8) * 0.2));
      const fibroidVal = Math.round(base * 0.33 * filterMultiplier * (0.85 + Math.cos(i * 0.6) * 0.15));
      const pcosVal = Math.round(base * 0.32 * filterMultiplier * (0.88 + Math.sin(i * 0.9) * 0.18));
      
      return {
        month: m,
        breast: activeFilter === "all" || activeFilter === "breast" ? breastVal : 0,
        fibroid: activeFilter === "all" || activeFilter === "fibroid" ? fibroidVal : 0,
        pcos: activeFilter === "all" || activeFilter === "pcos" ? pcosVal : 0,
        total: (activeFilter === "all" || activeFilter === "breast" ? breastVal : 0) +
               (activeFilter === "all" || activeFilter === "fibroid" ? fibroidVal : 0) +
               (activeFilter === "all" || activeFilter === "pcos" ? pcosVal : 0),
      };
    });
  }, [stats.totalCases, activeFilter]);

  const performanceMetrics = useMemo(() => {
    const baseThisWeek = stats.totalCases ?? 0;
    const filterMultiplier = activeFilter === "all" ? 1 : 0.35;
    const thisWeek = Math.round(baseThisWeek * filterMultiplier);
    const lastWeek = Math.round(thisWeek * 0.92);
    const change = lastWeek > 0 ? ((thisWeek - lastWeek) / lastWeek * 100).toFixed(1) : 0;
    const total = scanSummary?.totalScans ?? 0;
    const screeningRate =
      total > 0 && scanSummary.normalScans != null
        ? Math.min(99, Math.round((scanSummary.normalScans / total) * 100))
        : 82;
    return {
      thisWeek,
      lastWeek,
      change: parseFloat(change),
      screeningRate,
      targetCompletion: 78,
      avgResponseTime: 2.4,
    };
  }, [stats.totalCases, activeFilter, scanSummary?.totalScans, scanSummary?.normalScans]);

  const topPerformers = useMemo(() => 
    [...districts].sort((a, b) => b.cases - a.cases).slice(0, 3),
    [districts]
  );

  const needsAttention = useMemo(() =>
    districts.filter((d) => d.risk === "high").slice(0, 3),
    [districts]
  );

  const ageDistribution = useMemo(() => [
    { age: "18-25", count: Math.round(stats.totalCases * 0.15), fill: "#06b6d4" },
    { age: "26-35", count: Math.round(stats.totalCases * 0.28), fill: "#0d9488" },
    { age: "36-45", count: Math.round(stats.totalCases * 0.32), fill: "#6366f1" },
    { age: "46-55", count: Math.round(stats.totalCases * 0.18), fill: "#8b5cf6" },
    { age: "55+", count: Math.round(stats.totalCases * 0.07), fill: "#ec4899" },
  ], [stats.totalCases]);

  const screeningTargets = useMemo(() => {
    const total = scanSummary?.totalScans ?? 0;
    if (total <= 0) {
      return [
        { name: "Daily", target: 15000, achieved: 12400, fill: "#0d9488" },
        { name: "Weekly", target: 100000, achieved: 78000, fill: "#6366f1" },
        { name: "Monthly", target: 400000, achieved: 312000, fill: "#8b5cf6" },
      ];
    }
    const dailyT = Math.max(500, Math.round(total / 25));
    const achieved = Math.round(dailyT * 0.82);
    return [
      { name: "Daily", target: dailyT, achieved, fill: "#0d9488" },
      { name: "Weekly", target: dailyT * 7, achieved: Math.round(achieved * 6.2), fill: "#6366f1" },
      { name: "Monthly", target: Math.round(dailyT * 28), achieved: Math.round(achieved * 24), fill: "#8b5cf6" },
    ];
  }, [scanSummary?.totalScans]);

  const currentAppointments = useMemo(() => APPOINTMENTS_DATA[activeFilter] || APPOINTMENTS_DATA.all, [activeFilter]);
  const currentDoctors = useMemo(() => DOCTOR_ALLOCATION[activeFilter] || DOCTOR_ALLOCATION.all, [activeFilter]);
  const currentQueue = useMemo(() => PATIENT_QUEUE[activeFilter] || PATIENT_QUEUE.all, [activeFilter]);
  const currentEquipment = useMemo(() => EQUIPMENT_STATUS[activeFilter] || EQUIPMENT_STATUS.all, [activeFilter]);
  const currentMedicine = useMemo(() => MEDICINE_STOCK[activeFilter] || MEDICINE_STOCK.all, [activeFilter]);
  const currentFollowUps = useMemo(() => FOLLOW_UP_PATIENTS[activeFilter] || FOLLOW_UP_PATIENTS.all, [activeFilter]);
  const currentLabResults = useMemo(() => LAB_RESULTS[activeFilter] || LAB_RESULTS.all, [activeFilter]);
  const currentReferrals = useMemo(() => REFERRALS[activeFilter] || REFERRALS.all, [activeFilter]);
  const currentInsurance = useMemo(() => INSURANCE_CLAIMS[activeFilter] || INSURANCE_CLAIMS.all, [activeFilter]);
  const currentHealthTips = useMemo(() => HEALTH_TIPS[activeFilter] || HEALTH_TIPS.all, [activeFilter]);
  const currentFeedback = useMemo(() => FEEDBACK_RATINGS[activeFilter] || FEEDBACK_RATINGS.all, [activeFilter]);
  const currentCompliance = useMemo(() => COMPLIANCE_METRICS[activeFilter] || COMPLIANCE_METRICS.all, [activeFilter]);
  const currentCoverage = useMemo(() => POPULATION_COVERAGE[activeFilter] || POPULATION_COVERAGE.all, [activeFilter]);

  const recentScreeningsSource = useMemo(() => {
    if (Array.isArray(data?.recentScreenings) && data.recentScreenings.length > 0) return data.recentScreenings;
    return RECENT_SCREENINGS;
  }, [data?.recentScreenings]);

  const filteredScreenings = useMemo(() => {
    if (activeFilter === "all") return recentScreeningsSource;
    const typeMap = { breast: "Breast", fibroid: "Fibroid", pcos: "PCOS" };
    return recentScreeningsSource.filter((s) => s.type === typeMap[activeFilter]);
  }, [activeFilter, recentScreeningsSource]);

  const activityFeedItems = useMemo(() => {
    if (Array.isArray(data?.activityFeed) && data.activityFeed.length > 0) return data.activityFeed;
    return ACTIVITY_FEED;
  }, [data?.activityFeed]);

  const mobileVansList = useMemo(() => {
    if (Array.isArray(data?.mobileVans) && data.mobileVans.length > 0) return data.mobileVans;
    return MOBILE_VANS;
  }, [data?.mobileVans]);

  const getDiseaseLabel = () => {
    const labels = { all: "All Conditions", breast: "Breast Cancer", fibroid: "Fibroids", pcos: "PCOS" };
    return labels[activeFilter] || "All Conditions";
  };

  const exportToCSV = () => {
    const headers = ["District", "Cases", "Risk Level"];
    const rows = districts.map((d) => [d.name, d.cases, d.risk]);
    const csv = [headers, ...rows].map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `district-stats-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Full district list exported as CSV");
  };

  const getDistrictRank = (d, list = districts) => {
    const sorted = [...list].sort((a, b) => (b.cases || 0) - (a.cases || 0));
    const idx = sorted.findIndex((x) => x.districtId === d.districtId);
    return idx >= 0 ? idx + 1 : 0;
  };

  const exportDistrictDetail = (d) => {
    const rank = getDistrictRank(d);
    const avgCases =
      districts.length > 0
        ? Math.round(districts.reduce((sum, x) => sum + (x.cases || 0), 0) / districts.length)
        : 0;
    const diff = (d.cases || 0) - avgCases;
    const pct = avgCases ? ((diff / avgCases) * 100).toFixed(1) : "0";
    const escape = (v) => `"${String(v ?? "").replace(/"/g, '""')}"`;
    const rows = [
      ["District", d.name],
      ["District ID", d.districtId],
      ["Risk level", d.risk],
      ["Total cases", d.cases],
      ["State rank", rank],
      ["State average cases", avgCases],
      ["Diff vs average", diff],
      ["Percent vs average", `${pct}%`],
      ["Exported at", new Date().toISOString()],
    ];
    if (d.casesByDisease) {
      Object.entries(d.casesByDisease).forEach(([k, v]) => {
        rows.push([`Cases — ${k}`, v]);
      });
    }
    const csv = rows.map((r) => r.map((c) => escape(c)).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    const safeId = String(d.districtId || "district").replace(/[^\w-]/g, "_");
    a.download = `setv-district-${safeId}-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success(`Exported ${d.name} to CSV`);
  };

  const exportDistrictJSON = (d) => {
    const rank = getDistrictRank(d);
    const avgCases =
      districts.length > 0
        ? Math.round(districts.reduce((sum, x) => sum + (x.cases || 0), 0) / districts.length)
        : 0;
    const payload = {
      district: d.name,
      districtId: d.districtId,
      risk: d.risk,
      totalCases: d.cases,
      stateRank: rank,
      stateAverageCases: avgCases,
      casesByDisease: d.casesByDisease || null,
      exportedAt: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    const safeId = String(d.districtId || "district").replace(/[^\w-]/g, "_");
    a.download = `setv-district-${safeId}-${new Date().toISOString().split("T")[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success(`Exported ${d.name} as JSON`);
  };

  const copyDistrictSummary = async (d) => {
    const rank = getDistrictRank(d);
    const avgCases =
      districts.length > 0
        ? Math.round(districts.reduce((sum, x) => sum + (x.cases || 0), 0) / districts.length)
        : 0;
    const diff = (d.cases || 0) - avgCases;
    let diseaseLines = "";
    if (d.casesByDisease) {
      diseaseLines = Object.entries(d.casesByDisease)
        .map(([k, v]) => `  ${k}: ${v}`)
        .join("\n");
    }
    const text = `SETV — ${d.name} (${d.districtId})
Risk: ${d.risk?.toUpperCase()}
Total cases: ${d.cases?.toLocaleString()}
State rank: #${rank}
State avg: ${avgCases.toLocaleString()} (${diff >= 0 ? "+" : ""}${diff} vs avg)
${diseaseLines ? `By disease:\n${diseaseLines}` : ""}`;
    try {
      await navigator.clipboard.writeText(text);
      toast.success("Summary copied to clipboard");
    } catch {
      toast.error("Could not copy — try Export instead");
    }
  };

  const handleAddDistrictToCompare = (d) => {
    const id = d.districtId;
    if (!id) return;
    if (compareDistrict1 === id) {
      toast("Already set as first district in comparison");
      setSelectedDistrict(null);
      return;
    }
    if (compareDistrict2 === id) {
      toast("Already set as second district in comparison");
      setSelectedDistrict(null);
      return;
    }
    if (!compareDistrict1) {
      setCompareDistrict1(id);
      toast.success(`${d.name} set as first district — scroll to Comparison`);
    } else if (!compareDistrict2) {
      setCompareDistrict2(id);
      toast.success(`${d.name} set as second district`);
    } else {
      setCompareDistrict2(id);
      toast.success(`${d.name} replaced second slot in comparison`);
    }
    setSelectedDistrict(null);
    setTimeout(() => {
      document.getElementById("district-comparison-tool")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 300);
  };

  const handleDeployMobileVan = async (d) => {
    setVanDeploying(true);
    const fallbackRef = `MV-${Math.floor(100 + Math.random() * 900)}`;
    try {
      const res = await fetch(`${API_BASE}/api/dashboard/deploy-van`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          districtId: d.districtId,
          districtName: d.name,
          risk: d.risk,
          cases: d.cases,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.message) {
        toast.success(data.message, { duration: 5000 });
      } else {
        toast.success(
          `Van ${fallbackRef} dispatched to ${d.name}. Field coordinator will confirm ETA (offline mode).`,
          { duration: 5000 }
        );
      }
      try {
        const key = "setv_van_deployments";
        const prev = JSON.parse(sessionStorage.getItem(key) || "[]");
        prev.unshift({
          ref: data.reference || fallbackRef,
          district: d.name,
          districtId: d.districtId,
          at: new Date().toISOString(),
        });
        sessionStorage.setItem(key, JSON.stringify(prev.slice(0, 20)));
      } catch {
        /* ignore */
      }
      setSelectedDistrict(null);
      setTimeout(() => {
        document.getElementById("mobile-van-tracker")?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 400);
    } catch {
      toast.success(
        `Van ${fallbackRef} logged for ${d.name}. Connect the API when online for live dispatch IDs.`,
        { duration: 5000 }
      );
      try {
        const key = "setv_van_deployments";
        const prev = JSON.parse(sessionStorage.getItem(key) || "[]");
        prev.unshift({
          ref: fallbackRef,
          district: d.name,
          districtId: d.districtId,
          at: new Date().toISOString(),
        });
        sessionStorage.setItem(key, JSON.stringify(prev.slice(0, 20)));
      } catch {
        /* ignore */
      }
      setSelectedDistrict(null);
      setTimeout(() => {
        document.getElementById("mobile-van-tracker")?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 400);
    } finally {
      setVanDeploying(false);
    }
  };

  if (loading && !data) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <p className="text-slate-600 font-medium">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-slate-50 relative overflow-hidden">
      <div className="fixed inset-0 pointer-events-none z-0 opacity-[0.05]">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${HEALTH_IMAGES.hero})` }}
        />
      </div>

      <SideBar />

      <main className="flex-1 relative z-10 p-6 lg:p-10 ml-0 min-w-0">
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 relative z-30"
        >
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="min-w-0 pl-14 sm:pl-16">
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-3xl lg:text-4xl font-bold text-slate-800 tracking-tight">
                  Women Wellness District Monitoring
                </h1>
                {isAdminView && (
                  <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-violet-100 text-violet-800 border border-violet-200/80">
                    Admin
                  </span>
                )}
              </div>
              <div className="flex items-center gap-4 mt-2">
                <p className="text-slate-500 font-medium">
                  Powered by SETV — Andhra Pradesh health analytics
                </p>
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${autoRefresh ? "bg-emerald-500 animate-pulse" : "bg-slate-300"}`} />
                  <span className="text-xs text-slate-400">
                    Last updated: {lastUpdated.toLocaleTimeString()}
                  </span>
                  <button
                    type="button"
                    onClick={() => setAutoRefresh(!autoRefresh)}
                    className={`px-2 py-1 rounded-lg text-xs font-medium transition-all ${
                      autoRefresh 
                        ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-200" 
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    {autoRefresh ? "Auto-refresh ON" : "Auto-refresh OFF"}
                  </button>
                  <button
                    type="button"
                    onClick={() => { fetchDashboard(activeFilter); setLastUpdated(new Date()); }}
                    disabled={loading}
                    className="p-1.5 rounded-lg bg-slate-100 text-slate-600 hover:bg-slate-200 disabled:opacity-50"
                  >
                    <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
                  </button>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3 relative z-40">
              {/* Enhanced Global Search */}
              <div className="relative z-50">
                <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} aria-hidden />
                <input
                  type="text"
                  placeholder="Search districts, patients..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  autoComplete="off"
                  className="pl-10 pr-10 py-2 rounded-xl border border-slate-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-sm w-48 lg:w-72 transition-all bg-white relative z-10"
                />
                {searchQuery && (
                  <button type="button" onClick={() => setSearchQuery("")} className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded-lg text-slate-400 hover:text-slate-600 z-20" aria-label="Clear search">
                    <X size={16} />
                  </button>
                )}
                {/* Search Results Dropdown */}
                {searchQuery && (
                  <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl border border-slate-200 shadow-xl z-[60] max-h-80 overflow-y-auto"
                  >
                    {filteredDistricts.length > 0 ? (
                      <>
                        <div className="p-2 border-b border-slate-100">
                          <p className="text-xs font-bold text-slate-400 uppercase px-2">Districts ({filteredDistricts.length})</p>
                        </div>
                        {filteredDistricts.slice(0, 5).map((d) => (
                          <button
                            type="button"
                            key={d.districtId || d._id || d.name}
                            onClick={() => { setSelectedDistrict(d); setSearchQuery(""); }}
                            className="w-full px-4 py-3 text-left hover:bg-slate-50 flex items-center justify-between transition-colors"
                          >
                            <div className="flex items-center gap-3">
                              <MapPin size={16} className="text-slate-400" />
                              <div>
                                <p className="font-medium text-slate-800 text-sm">{d.name}</p>
                                <p className="text-xs text-slate-500">{d.cases?.toLocaleString()} cases • {d.risk} risk</p>
                              </div>
                            </div>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              d.risk === "high" ? "bg-rose-100 text-rose-600" :
                              d.risk === "medium" ? "bg-amber-100 text-amber-600" :
                              "bg-emerald-100 text-emerald-600"
                            }`}>{d.risk}</span>
                          </button>
                        ))}
                        {filteredDistricts.length > 5 && (
                          <div className="p-2 text-center border-t border-slate-100">
                            <p className="text-xs text-slate-500">+{filteredDistricts.length - 5} more results</p>
                          </div>
                        )}
                      </>
                    ) : (
                      <div className="p-4 text-center">
                        <p className="text-sm text-slate-500">No results found for "{searchQuery}"</p>
                      </div>
                    )}
                  </motion.div>
                )}
              </div>
              
              {/* View Mode Toggle */}
              <div className="hidden md:flex items-center gap-1 p-1 bg-slate-100 rounded-lg">
                <button
                  type="button"
                  onClick={() => setViewMode("cards")}
                  className={`p-2 rounded-lg transition-all ${viewMode === "cards" ? "bg-white shadow-sm text-primary" : "text-slate-500 hover:text-slate-700"}`}
                  aria-label="Card view"
                >
                  <Grid size={18} />
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode("list")}
                  className={`p-2 rounded-lg transition-all ${viewMode === "list" ? "bg-white shadow-sm text-primary" : "text-slate-500 hover:text-slate-700"}`}
                  aria-label="List view"
                >
                  <List size={18} />
                </button>
              </div>

              <button
                type="button"
                onClick={() => setShowActivityFeed(!showActivityFeed)}
                className="p-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 relative bg-white"
                aria-label="Toggle activity feed"
              >
                <Bell size={20} />
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 text-white text-xs rounded-full flex items-center justify-center">{alerts.length}</span>
              </button>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 mt-4">
            {["7", "30", "90", "custom"].map((d) => (
              <button
                type="button"
                key={d}
                onClick={() => setDateRange(d)}
                className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                  dateRange === d
                    ? "bg-primary text-white shadow-md"
                    : "bg-white border border-slate-200 text-slate-600 hover:border-primary/40"
                }`}
              >
                {d === "custom" ? "Custom" : `${d} Days`}
              </button>
            ))}
          </div>
        </motion.header>

        {/* KPI Cards - Enhanced */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
        >
          {[
            { label: "Total Districts", value: stats.totalDistricts ?? 0, icon: MapPin, color: "text-teal-600", bg: "bg-teal-50", trend: null },
            { label: "Total Cases", value: (stats.totalCases ?? 0).toLocaleString(), icon: Activity, color: "text-indigo-600", bg: "bg-indigo-50", trend: performanceMetrics.change, trendUp: performanceMetrics.change > 0 },
            { label: "Flagged Zones", value: stats.flaggedZones ?? 0, icon: AlertTriangle, color: "text-amber-600", bg: "bg-amber-50", trend: -12, trendUp: false },
            { label: "Avg AI Confidence", value: `${stats.avgConfidence ?? 94.3}%`, icon: Shield, color: "text-emerald-600", bg: "bg-emerald-50", trend: 2.1, trendUp: true },
          ].map((stat, i) => (
            <div key={i} className="glass-card p-5 rounded-xl border-l-4 border-l-primary card-hover">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">{stat.label}</p>
                  <p className="text-2xl font-bold text-slate-800">{stat.value}</p>
                  {stat.trend !== null && (
                    <div className={`flex items-center gap-1 mt-1 text-xs font-medium ${stat.trendUp ? "text-emerald-600" : "text-rose-600"}`}>
                      {stat.trendUp ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                      <span>{Math.abs(stat.trend)}% vs last week</span>
                    </div>
                  )}
                </div>
                <div className={`w-10 h-10 rounded-lg ${stat.bg} ${stat.color} flex items-center justify-center`}>
                  <stat.icon size={20} />
                </div>
              </div>
            </div>
          ))}
        </motion.div>

        {/* Quick Stats Row - DYNAMIC */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="grid grid-cols-2 lg:grid-cols-6 gap-4 mb-8"
        >
          {[
            { 
              label: `Screenings (${dateRange}d)`, 
              value: dynamicScreeningsToday.toLocaleString(), 
              icon: Stethoscope, 
              color: "text-cyan-600",
              subtext: activeFilter !== "all" ? getDiseaseLabel() : "All Types"
            },
            { 
              label: "Pending Review", 
              value: Math.round((scanSummary.pendingValidation || 4750) * (activeFilter === "all" ? 1 : 0.35)).toLocaleString(), 
              icon: Clock, 
              color: "text-amber-600",
              subtext: "Awaiting validation"
            },
            { 
              label: "Abnormal Detected", 
              value: Math.round((scanSummary.abnormalScans || 17900) * (activeFilter === "all" ? 1 : 0.33) * dateRangeMultiplier).toLocaleString(), 
              icon: AlertCircle, 
              color: "text-rose-600",
              subtext: `${dateRange} day period`
            },
            { 
              label: "Normal Results", 
              value: Math.round((scanSummary.normalScans || 71600) * (activeFilter === "all" ? 1 : 0.34) * dateRangeMultiplier).toLocaleString(), 
              icon: CheckCircle2, 
              color: "text-emerald-600",
              subtext: "Cleared screenings"
            },
            { 
              label: "Avg Response", 
              value: `${(performanceMetrics.avgResponseTime * (activeFilter === "all" ? 1 : 0.85)).toFixed(1)}h`, 
              icon: Zap, 
              color: "text-violet-600",
              subtext: "Report delivery"
            },
            { 
              label: "Target Progress", 
              value: `${Math.min(100, performanceMetrics.targetCompletion + (dateRange === "30" ? 8 : dateRange === "90" ? 15 : 0))}%`, 
              icon: Target, 
              color: "text-indigo-600",
              subtext: `${dateRange} day target`
            },
          ].map((stat, i) => (
            <motion.div 
              key={`${i}-${activeFilter}-${dateRange}`} 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.05 }}
              className="bg-white rounded-xl p-4 border border-slate-100 shadow-sm hover:shadow-md hover:border-primary/30 transition-all cursor-pointer"
            >
              <div className="flex items-center gap-2 mb-1">
                <stat.icon size={16} className={stat.color} />
                <span className="text-xs text-slate-500 font-medium">{stat.label}</span>
              </div>
              <p className="text-lg font-bold text-slate-800">{stat.value}</p>
              {stat.subtext && <p className="text-[10px] text-slate-400 mt-1">{stat.subtext}</p>}
            </motion.div>
          ))}
        </motion.div>

        {/* AP Map + Filters */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-card rounded-xl p-6 mb-8 overflow-hidden"
        >
          <h2 className="text-xl font-bold text-slate-800 mb-2">
            Andhra Pradesh District Health Heatmap
          </h2>
          <p className="text-slate-500 text-sm mb-4">
            {loading ? "Updating data…" : `Showing ${activeFilter === "all" ? "all conditions" : DISEASE_FILTERS.find((f) => f.id === activeFilter)?.label} — click filters to switch`}
          </p>

          <div className="flex flex-wrap items-center gap-4 mb-4 p-3 rounded-xl bg-slate-100/80 border border-slate-200 text-xs">
            <span className="font-bold text-slate-600 uppercase tracking-wide">Map key</span>
            <div className="flex items-center gap-1.5">
              <span className="w-4 h-4 rounded border-2 border-rose-900" style={{ backgroundColor: MAP_RISK_STYLE.high.fill }} />
              <span className="text-slate-700">High risk</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-4 h-4 rounded border-2 border-amber-900" style={{ backgroundColor: MAP_RISK_STYLE.medium.fill }} />
              <span className="text-slate-700">Medium</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-4 h-4 rounded border-2 border-green-900" style={{ backgroundColor: MAP_RISK_STYLE.low.fill }} />
              <span className="text-slate-700">Low</span>
            </div>
            <span className="text-slate-500 hidden sm:inline">|</span>
            <span className="text-slate-500 max-w-xl">
              Colors follow each district&apos;s risk for the selected filter. Darker borders = higher tier. Click a district for details, export, or van dispatch.
            </span>
          </div>

          <div className="flex flex-wrap gap-2 mb-6">
            {DISEASE_FILTERS.map((f) => (
              <button
                key={f.id}
                onClick={() => setActiveFilter(f.id)}
                disabled={loading}
                className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all disabled:opacity-70 ${
                  activeFilter === f.id ? `${f.color} text-white shadow-md` : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* AP Map - accurate TopoJSON */}
          <div className="w-full h-[420px] rounded-xl border border-slate-200 bg-gradient-to-b from-slate-50 to-white overflow-hidden mb-6 shadow-inner">
            {geo ? (
              <ComposableMap
                projection="geoMercator"
                projectionConfig={{
                  center: [79, 15.2],
                  scale: 5500,
                }}
                style={{ width: "100%", height: "100%" }}
              >
                <ZoomableGroup center={[79, 15.2]} zoom={1}>
                  <Geographies geography={geo}>
                    {({ geographies }) =>
                      geographies.map((geoFeature, idx) => {
                        const d = getDistrictFromGeoProps(geoFeature.properties);
                        const m = getMapRiskStyle(d);
                        const filterLabel =
                          activeFilter === "all"
                            ? "all conditions"
                            : DISEASE_FILTERS.find((f) => f.id === activeFilter)?.label || activeFilter;
                        const caseLabel =
                          d && activeFilter !== "all" && d.casesByDisease
                            ? (d.casesByDisease[activeFilter] ?? d.cases)
                            : d?.cases;
                        const tip = d
                          ? `${d.name}: ${String(d.risk || "").toUpperCase()} risk — ${Number(caseLabel || 0).toLocaleString()} cases (${filterLabel}). Click for actions.`
                          : `${geoFeature.properties?.dtname || "District"}: no dashboard row — check spelling vs AP districts.`;
                        return (
                          <Geography
                            key={geoFeature.rsmKey ?? idx}
                            geography={geoFeature}
                            fill={m.fill}
                            stroke={m.stroke}
                            strokeWidth={d?.risk === "high" ? 1.35 : d?.risk === "medium" ? 1.05 : d ? 0.85 : 0.5}
                            style={{
                              default: { outline: "none", transition: "fill 0.15s ease, stroke-width 0.15s ease" },
                              hover: {
                                fill: m.hover,
                                cursor: "pointer",
                                outline: "none",
                                strokeWidth: d?.risk === "high" ? 1.6 : 1.2,
                              },
                              pressed: { outline: "none" },
                            }}
                            onClick={() => {
                              if (d) setSelectedDistrict(d);
                            }}
                          >
                            <title>{tip}</title>
                          </Geography>
                        );
                      })
                    }
                  </Geographies>
                </ZoomableGroup>
              </ComposableMap>
            ) : (
              <div className="w-full h-full flex items-center justify-center text-slate-500">
                <Loader2 className="h-8 w-8 animate-spin" />
              </div>
            )}
          </div>

          {/* District list - Dynamic View Mode */}
          {filteredDistricts.length > 0 && (
            <>
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm text-slate-600">
                  <span className="font-semibold">{filteredDistricts.length}</span> districts found
                  {searchQuery && <span className="text-slate-400"> for "{searchQuery}"</span>}
                </p>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setViewMode("cards")}
                    className={`p-2 rounded-lg transition-all ${viewMode === "cards" ? "bg-primary text-white" : "bg-slate-100 text-slate-500 hover:bg-slate-200"}`}
                  >
                    <Grid size={16} />
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    className={`p-2 rounded-lg transition-all ${viewMode === "list" ? "bg-primary text-white" : "bg-slate-100 text-slate-500 hover:bg-slate-200"}`}
                  >
                    <List size={16} />
                  </button>
                </div>
              </div>

              {viewMode === "cards" ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                  {filteredDistricts.map((d, i) => (
                    <motion.div
                      key={d.districtId}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.02 * i }}
                      onClick={() => setSelectedDistrict(d)}
                      className={`p-4 rounded-xl border-2 cursor-pointer transition-all card-hover ${
                        d.risk === "high" ? "bg-rose-50 border-rose-200 hover:border-rose-400" :
                        d.risk === "medium" ? "bg-amber-50 border-amber-200 hover:border-amber-400" :
                        "bg-emerald-50 border-emerald-200 hover:border-emerald-400"
                      } ${selectedDistrict?.districtId === d.districtId ? "ring-2 ring-primary ring-offset-2" : ""}`}
                    >
                      <p className="font-bold text-slate-800 text-sm truncate">{d.name}</p>
                      <p className="text-lg font-black text-primary mt-1">{d.cases?.toLocaleString()}</p>
                      <p className="text-xs text-slate-500 font-medium">screening cases</p>
                      <div className="mt-2 pt-2 border-t border-slate-200/50">
                        <div className="flex gap-1">
                          {d.casesByDisease && Object.entries(d.casesByDisease).map(([k, v]) => (
                            <div key={k} className={`flex-1 text-center p-1 rounded text-[10px] ${
                              k === "breast" ? "bg-rose-100 text-rose-600" :
                              k === "pcos" ? "bg-violet-100 text-violet-600" :
                              "bg-indigo-100 text-indigo-600"
                            }`}>
                              <span className="font-bold">{v}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="space-y-2">
                  {filteredDistricts.map((d, i) => (
                    <motion.div
                      key={d.districtId}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.02 * i }}
                      onClick={() => setSelectedDistrict(d)}
                      className={`p-4 rounded-xl border cursor-pointer transition-all flex items-center justify-between hover:shadow-md ${
                        d.risk === "high" ? "bg-rose-50 border-rose-200" :
                        d.risk === "medium" ? "bg-amber-50 border-amber-200" :
                        "bg-emerald-50 border-emerald-200"
                      } ${selectedDistrict?.districtId === d.districtId ? "ring-2 ring-primary" : ""}`}
                    >
                      <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                          d.risk === "high" ? "bg-rose-200" :
                          d.risk === "medium" ? "bg-amber-200" :
                          "bg-emerald-200"
                        }`}>
                          <MapPin size={18} className="text-slate-700" />
                        </div>
                        <div>
                          <p className="font-bold text-slate-800">{d.name}</p>
                          <p className="text-xs text-slate-500">District ID: {d.districtId}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-6">
                        <div className="text-center">
                          <p className="text-lg font-bold text-slate-800">{d.cases?.toLocaleString()}</p>
                          <p className="text-xs text-slate-500">Total Cases</p>
                        </div>
                        <div className="flex gap-2">
                          {d.casesByDisease && Object.entries(d.casesByDisease).map(([k, v]) => (
                            <div key={k} className="text-center">
                              <p className={`text-sm font-bold ${
                                k === "breast" ? "text-rose-600" :
                                k === "pcos" ? "text-violet-600" :
                                "text-indigo-600"
                              }`}>{v}</p>
                              <p className="text-[10px] text-slate-400 capitalize">{k}</p>
                            </div>
                          ))}
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                          d.risk === "high" ? "bg-rose-200 text-rose-700" :
                          d.risk === "medium" ? "bg-amber-200 text-amber-700" :
                          "bg-emerald-200 text-emerald-700"
                        }`}>{d.risk}</span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </>
          )}
          
          {filteredDistricts.length === 0 && searchQuery && (
            <div className="text-center py-8">
              <Search size={48} className="mx-auto mb-4 text-slate-300" />
              <p className="text-slate-500">No districts found matching "{searchQuery}"</p>
              <button onClick={() => setSearchQuery("")} className="mt-2 text-primary text-sm font-medium hover:underline">
                Clear search
              </button>
            </div>
          )}

          <div className="flex flex-wrap gap-6 mt-6 pt-6 border-t border-slate-200">
            <div className="flex items-center gap-2">
              <span className="w-4 h-4 rounded bg-rose-400" />
              <span className="text-sm font-medium text-slate-600">High risk</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-4 h-4 rounded bg-amber-400" />
              <span className="text-sm font-medium text-slate-600">Medium risk</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-4 h-4 rounded bg-emerald-400" />
              <span className="text-sm font-medium text-slate-600">Low risk</span>
            </div>
          </div>
        </motion.section>

        {/* Disease Distribution + Risk Distribution */}
        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.22 }}
            className="glass-card rounded-xl p-6"
          >
            <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
              <PieChartIcon size={20} className="text-primary" />
              Disease Distribution
            </h3>
            <div className="h-[280px] flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={diseaseDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={3}
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    labelLine={false}
                  >
                    {diseaseDistribution.map((entry, i) => (
                      <Cell key={i} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(v) => [v.toLocaleString(), "Cases"]} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-center gap-6 mt-2">
              {diseaseDistribution.map((d, i) => (
                <div key={i} className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full" style={{ backgroundColor: d.fill }} />
                  <span className="text-xs text-slate-600">{d.name}</span>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.24 }}
            className="glass-card rounded-xl p-6"
          >
            <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
              <Filter size={20} className="text-primary" />
              Risk Distribution by District
            </h3>
            <div className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={riskDistribution} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis type="number" stroke="#64748b" fontSize={12} />
                  <YAxis type="category" dataKey="name" width={100} stroke="#64748b" fontSize={12} />
                  <Tooltip formatter={(v) => [v, "Districts"]} />
                  <Bar dataKey="value" radius={[0, 6, 6, 0]}>
                    {riskDistribution.map((entry, i) => (
                      <Cell key={i} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        </div>

        {/* Bar Chart + Trend Chart */}
        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="glass-card rounded-xl p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                <BarChart3 size={20} className="text-primary" />
                District-wise Cases (Top 10)
              </h3>
              <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold">
                {getDiseaseLabel()}
              </span>
            </div>
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barChartData} layout="vertical" margin={{ left: 0, right: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis type="number" stroke="#64748b" fontSize={12} />
                <YAxis type="category" dataKey="name" width={90} stroke="#64748b" fontSize={11} />
                <Tooltip
                  formatter={(v, name) => [v.toLocaleString(), name === "cases" ? getDiseaseLabel() : name]}
                  labelFormatter={(_, payload) => payload[0]?.payload?.fullName}
                  contentStyle={{ borderRadius: 12, border: "1px solid #e2e8f0", backgroundColor: "#fff" }}
                />
                <Bar dataKey="cases" radius={[0, 6, 6, 0]} maxBarSize={32} name={getDiseaseLabel()}>
                  {barChartData.map((entry, i) => (
                    <Cell 
                      key={i} 
                      fill={activeFilter === "breast" ? DISEASE_COLORS.breast : 
                            activeFilter === "fibroid" ? DISEASE_COLORS.fibroid : 
                            activeFilter === "pcos" ? DISEASE_COLORS.pcos : 
                            CHART_COLORS[entry.risk] ?? "#94a3b8"} 
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="glass-card rounded-xl p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                <TrendingUp size={20} className="text-primary" />
                {dateRange}-Day Screening Trend
              </h3>
              <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold">
                {getDiseaseLabel()}
              </span>
            </div>
            <div className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={trendData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="day" stroke="#64748b" fontSize={12} />
                  <YAxis stroke="#64748b" fontSize={12} />
                  <Tooltip
                    contentStyle={{ borderRadius: 12, border: "1px solid #e2e8f0", backgroundColor: "#fff" }}
                    formatter={(value, name) => [value.toLocaleString(), name]}
                    labelStyle={{ fontWeight: "bold", color: "#334155" }}
                  />
                  <Legend />
                  <Line type="monotone" dataKey="cases" stroke="#0d9488" strokeWidth={2.5} dot={{ r: 4, fill: "#0d9488" }} activeDot={{ r: 6 }} name="Flagged Cases" />
                  <Line type="monotone" dataKey="screenings" stroke="#6366f1" strokeWidth={2.5} strokeDasharray="5 5" dot={{ r: 4, fill: "#6366f1" }} activeDot={{ r: 6 }} name="Total Screenings" />
                  <Line type="monotone" dataKey="abnormal" stroke="#f43f5e" strokeWidth={2} dot={{ r: 3, fill: "#f43f5e" }} activeDot={{ r: 5 }} name="Abnormal Detected" />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 pt-4 border-t border-slate-200">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-500">Showing data for: <strong className="text-slate-700">{dateRange} days</strong></span>
                <span className="text-slate-500">Filter: <strong className="text-primary">{getDiseaseLabel()}</strong></span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Monthly Area Chart + Age Distribution */}
        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.32 }}
            className="glass-card rounded-xl p-6"
          >
            <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
              <Calendar size={20} className="text-primary" />
              Monthly Disease Trend
            </h3>
            <div className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={monthlyTrendData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="month" stroke="#64748b" fontSize={12} />
                  <YAxis stroke="#64748b" fontSize={12} />
                  <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #e2e8f0" }} />
                  <Legend />
                  <Area type="monotone" dataKey="breast" stackId="1" stroke={DISEASE_COLORS.breast} fill={DISEASE_COLORS.breast} fillOpacity={0.6} name="Breast Cancer" />
                  <Area type="monotone" dataKey="fibroid" stackId="1" stroke={DISEASE_COLORS.fibroid} fill={DISEASE_COLORS.fibroid} fillOpacity={0.6} name="Fibroids" />
                  <Area type="monotone" dataKey="pcos" stackId="1" stroke={DISEASE_COLORS.pcos} fill={DISEASE_COLORS.pcos} fillOpacity={0.6} name="PCOS" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.34 }}
            className="glass-card rounded-xl p-6"
          >
            <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
              <Users size={20} className="text-primary" />
              Age Group Distribution
            </h3>
            <div className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={ageDistribution} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="age" stroke="#64748b" fontSize={12} />
                  <YAxis stroke="#64748b" fontSize={12} />
                  <Tooltip formatter={(v) => [v.toLocaleString(), "Patients"]} contentStyle={{ borderRadius: 12, border: "1px solid #e2e8f0" }} />
                  <Bar dataKey="count" radius={[6, 6, 0, 0]} maxBarSize={50}>
                    {ageDistribution.map((entry, i) => (
                      <Cell key={i} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        </div>

        {/* Screening Targets + Top/Bottom Performers */}
        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.36 }}
            className="glass-card rounded-xl p-6"
          >
            <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
              <Target size={20} className="text-primary" />
              Screening Targets
            </h3>
            <div className="space-y-4">
              {screeningTargets.map((t, i) => (
                <div key={i}>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium text-slate-600">{t.name}</span>
                    <span className="text-sm font-bold text-slate-800">{Math.round(t.achieved / t.target * 100)}%</span>
                  </div>
                  <div className="h-3 bg-slate-200 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{ width: `${Math.min(100, t.achieved / t.target * 100)}%`, backgroundColor: t.fill }}
                    />
                  </div>
                  <p className="text-xs text-slate-400 mt-1">{t.achieved.toLocaleString()} / {t.target.toLocaleString()}</p>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.38 }}
            className="glass-card rounded-xl p-6"
          >
            <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
              <Award size={20} className="text-emerald-600" />
              Top Performing Districts
            </h3>
            <div className="space-y-3">
              {topPerformers.map((d, i) => (
                <div key={d.districtId} className="flex items-center gap-3 p-3 bg-emerald-50 rounded-xl">
                  <div className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold text-sm">
                    {i + 1}
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-slate-800 text-sm">{d.name}</p>
                    <p className="text-xs text-slate-500">{d.cases?.toLocaleString()} cases</p>
                  </div>
                  <ChevronUp className="text-emerald-500" size={20} />
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="glass-card rounded-xl p-6"
          >
            <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
              <AlertTriangle size={20} className="text-rose-600" />
              Needs Attention
            </h3>
            <div className="space-y-3">
              {needsAttention.map((d, i) => (
                <div key={d.districtId} className="flex items-center gap-3 p-3 bg-rose-50 rounded-xl">
                  <div className="w-8 h-8 rounded-full bg-rose-500 text-white flex items-center justify-center">
                    <AlertTriangle size={16} />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-slate-800 text-sm">{d.name}</p>
                    <p className="text-xs text-rose-600 font-medium">High risk zone</p>
                  </div>
                  <Eye className="text-slate-400 cursor-pointer hover:text-primary" size={20} onClick={() => setSelectedDistrict(d)} />
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Recent Screenings Table - DYNAMIC */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.42 }}
          className="glass-card rounded-xl p-6 mb-8"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                <FileText size={20} className="text-primary" />
                Recent Screenings
              </h3>
              <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold">
                {filteredScreenings.length} records • {getDiseaseLabel()}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400">Updated: {lastUpdated.toLocaleTimeString()}</span>
              <button className="text-sm text-primary font-medium hover:underline">View All</button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="text-left py-3 px-4 text-xs font-bold text-slate-500 uppercase">Patient</th>
                  <th className="text-left py-3 px-4 text-xs font-bold text-slate-500 uppercase">District</th>
                  <th className="text-left py-3 px-4 text-xs font-bold text-slate-500 uppercase">Type</th>
                  <th className="text-left py-3 px-4 text-xs font-bold text-slate-500 uppercase">Result</th>
                  <th className="text-left py-3 px-4 text-xs font-bold text-slate-500 uppercase">Confidence</th>
                  <th className="text-left py-3 px-4 text-xs font-bold text-slate-500 uppercase">Time</th>
                  <th className="text-left py-3 px-4 text-xs font-bold text-slate-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredScreenings.length > 0 ? (
                  filteredScreenings.map((s, idx) => {
                    const conf = Number(s.confidence ?? stats.avgConfidence ?? 94);
                    const safeConf = Number.isFinite(conf) ? Math.min(100, Math.max(0, conf)) : 94;
                    const initial = (s.patient && String(s.patient).trim().charAt(0)) || "?";
                    return (
                    <motion.tr 
                      key={s.id} 
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      className="border-b border-slate-100 hover:bg-slate-50 transition-colors cursor-pointer"
                    >
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-teal-500 flex items-center justify-center text-white text-xs font-bold">
                            {initial}
                          </div>
                          <span className="font-medium text-slate-800">{s.patient}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-slate-600">
                        <div className="flex items-center gap-1">
                          <MapPin size={12} className="text-slate-400" />
                          {s.district}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded-lg text-xs font-medium ${
                          s.type === "Breast" ? "bg-rose-100 text-rose-700" :
                          s.type === "Fibroid" ? "bg-indigo-100 text-indigo-700" :
                          s.type === "PCOS" ? "bg-purple-100 text-purple-700" :
                          "bg-slate-100 text-slate-700"
                        }`}>{s.type}</span>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded-lg text-xs font-medium flex items-center gap-1 w-fit ${
                          s.result === "Normal" ? "bg-emerald-100 text-emerald-700" :
                          s.result === "Abnormal" ? "bg-rose-100 text-rose-700" :
                          "bg-amber-100 text-amber-700"
                        }`}>
                          {s.result === "Normal" ? <CheckCircle2 size={12} /> : s.result === "Abnormal" ? <AlertCircle size={12} /> : <Clock size={12} />}
                          {s.result}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <div className="w-20 h-2 bg-slate-200 rounded-full overflow-hidden">
                            <motion.div 
                              initial={{ width: 0 }}
                              animate={{ width: `${safeConf}%` }}
                              transition={{ duration: 0.5, delay: idx * 0.05 }}
                              className={`h-full rounded-full ${safeConf >= 95 ? "bg-emerald-500" : safeConf >= 90 ? "bg-primary" : "bg-amber-500"}`}
                            />
                          </div>
                          <span className="text-xs text-slate-600 font-medium">{safeConf}%</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-slate-500 text-sm">{s.time}</td>
                      <td className="py-3 px-4">
                        <button className="p-1.5 rounded-lg hover:bg-slate-200 text-slate-500 hover:text-primary transition-colors">
                          <Eye size={16} />
                        </button>
                      </td>
                    </motion.tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-slate-500">
                      No screenings found for {getDiseaseLabel()}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="mt-4 pt-4 border-t border-slate-200 flex items-center justify-between">
            <p className="text-xs text-slate-500">
              Showing {filteredScreenings.length} of {recentScreeningsSource.length} screenings
            </p>
            <div className="flex items-center gap-2">
              <button className="px-3 py-1.5 rounded-lg bg-slate-100 text-slate-600 text-xs font-medium hover:bg-slate-200 transition-colors">
                Previous
              </button>
              <span className="px-3 py-1.5 rounded-lg bg-primary text-white text-xs font-medium">1</span>
              <button className="px-3 py-1.5 rounded-lg bg-slate-100 text-slate-600 text-xs font-medium hover:bg-slate-200 transition-colors">
                Next
              </button>
            </div>
          </div>
        </motion.section>

        {/* Mobile Van Tracker */}
        <motion.section
          id="mobile-van-tracker"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.43 }}
          className="glass-card rounded-xl p-6 mb-8 scroll-mt-24"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <Truck size={20} className="text-primary" />
              Mobile Van Tracker
            </h3>
            <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-xs font-bold">{mobileVansList.filter(v => v.status === "active").length} Active</span>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
            {mobileVansList.map((van) => (
              <div key={van.id} className={`p-4 rounded-xl border-2 ${
                van.status === "active" ? "bg-emerald-50 border-emerald-200" :
                van.status === "en-route" ? "bg-blue-50 border-blue-200" :
                "bg-amber-50 border-amber-200"
              }`}>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-slate-800">{van.name}</span>
                  <span className={`w-2 h-2 rounded-full ${
                    van.status === "active" ? "bg-emerald-500 animate-pulse" :
                    van.status === "en-route" ? "bg-blue-500 animate-pulse" :
                    "bg-amber-500"
                  }`} />
                </div>
                <div className="flex items-center gap-1 text-xs text-slate-500 mb-1">
                  <MapPinned size={12} />
                  <span>{van.location}</span>
                </div>
                <div className="flex items-center gap-1 text-xs text-slate-500 mb-2">
                  <UserCheck size={12} />
                  <span>{van.driver}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-600">{van.screeningsToday} screenings</span>
                  <div className="flex items-center gap-1">
                    <Battery size={12} className={van.battery > 50 ? "text-emerald-500" : "text-amber-500"} />
                    <span className="text-xs font-medium">{van.battery}%</span>
                  </div>
                </div>
                <span className={`mt-2 inline-block px-2 py-0.5 rounded-full text-xs font-medium ${
                  van.status === "active" ? "bg-emerald-200 text-emerald-800" :
                  van.status === "en-route" ? "bg-blue-200 text-blue-800" :
                  "bg-amber-200 text-amber-800"
                }`}>{van.status}</span>
              </div>
            ))}
          </div>
        </motion.section>

        {/* Upcoming Camps + AI Model Performance */}
        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.44 }}
            className="glass-card rounded-xl p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                <CalendarDays size={20} className="text-primary" />
                Upcoming Screening Camps
              </h3>
              <button className="text-sm text-primary font-medium hover:underline">Schedule New</button>
            </div>
            <div className="space-y-3">
              {UPCOMING_CAMPS.map((camp) => (
                <div key={camp.id} className="p-4 rounded-xl border border-slate-200 bg-white">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="font-bold text-slate-800 text-sm">{camp.name}</p>
                      <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
                        <MapPin size={12} />
                        <span>{camp.location}</span>
                        <span>•</span>
                        <Calendar size={12} />
                        <span>{camp.date}</span>
                      </div>
                    </div>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                      camp.status === "confirmed" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"
                    }`}>{camp.status}</span>
                  </div>
                  <div className="mt-3">
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-slate-500">Registrations</span>
                      <span className="font-medium text-slate-700">{camp.registered} / {camp.expectedPatients}</span>
                    </div>
                    <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                      <div className="h-full bg-primary rounded-full" style={{ width: `${(camp.registered / camp.expectedPatients) * 100}%` }} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.section>

          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45 }}
            className="glass-card rounded-xl p-6"
          >
            <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
              <Brain size={20} className="text-primary" />
              AI Model Performance
            </h3>
            <div className="grid grid-cols-2 gap-4 mb-4">
              {[
                { label: "Accuracy", value: `${AI_MODEL_METRICS.accuracy}%`, color: "text-emerald-600" },
                { label: "Precision", value: `${AI_MODEL_METRICS.precision}%`, color: "text-blue-600" },
                { label: "Recall", value: `${AI_MODEL_METRICS.recall}%`, color: "text-violet-600" },
                { label: "F1 Score", value: `${AI_MODEL_METRICS.f1Score}%`, color: "text-amber-600" },
              ].map((metric, i) => (
                <div key={i} className="p-3 bg-slate-50 rounded-xl">
                  <p className="text-xs text-slate-500 font-medium">{metric.label}</p>
                  <p className={`text-xl font-bold ${metric.color}`}>{metric.value}</p>
                </div>
              ))}
            </div>
            <div className="space-y-3 pt-4 border-t border-slate-200">
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-600">Total Predictions</span>
                <span className="font-bold text-slate-800">{AI_MODEL_METRICS.totalPredictions.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-600">True Positives</span>
                <span className="font-bold text-emerald-600">{AI_MODEL_METRICS.truePositives.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-600">False Positives</span>
                <span className="font-bold text-rose-600">{AI_MODEL_METRICS.falsePositives.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center text-xs text-slate-500 pt-2 border-t border-slate-100">
                <span>Model: {AI_MODEL_METRICS.modelVersion}</span>
                <span>Last trained: {AI_MODEL_METRICS.lastTrained}</span>
              </div>
            </div>
          </motion.section>
        </div>

        {/* Staff Deployment + Resource Allocation */}
        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.46 }}
            className="glass-card rounded-xl p-6"
          >
            <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
              <Briefcase size={20} className="text-primary" />
              Staff Deployment Status
            </h3>
            <div className="space-y-4">
              {STAFF_DEPLOYMENT.map((staff, i) => (
                <div key={i}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-slate-700">{staff.role}</span>
                    <span className="text-sm text-slate-500">{staff.deployed}/{staff.total} deployed</span>
                  </div>
                  <div className="flex gap-1 h-4">
                    <div className="bg-emerald-500 rounded-l-full" style={{ width: `${(staff.deployed / staff.total) * 100}%` }} title="Deployed" />
                    <div className="bg-amber-500" style={{ width: `${(staff.onLeave / staff.total) * 100}%` }} title="On Leave" />
                    <div className="bg-blue-500 rounded-r-full" style={{ width: `${(staff.training / staff.total) * 100}%` }} title="Training" />
                  </div>
                  <div className="flex gap-4 mt-1 text-xs text-slate-500">
                    <span className="flex items-center gap-1"><span className="w-2 h-2 bg-emerald-500 rounded-full" /> {staff.deployed} active</span>
                    <span className="flex items-center gap-1"><span className="w-2 h-2 bg-amber-500 rounded-full" /> {staff.onLeave} leave</span>
                    <span className="flex items-center gap-1"><span className="w-2 h-2 bg-blue-500 rounded-full" /> {staff.training} training</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t border-slate-200 flex justify-between items-center">
              <span className="text-sm text-slate-600">Total Staff</span>
              <span className="text-xl font-bold text-slate-800">{STAFF_DEPLOYMENT.reduce((a, b) => a + b.total, 0)}</span>
            </div>
          </motion.section>

          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.47 }}
            className="glass-card rounded-xl p-6"
          >
            <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
              <DollarSign size={20} className="text-primary" />
              Resource Allocation & Budget
            </h3>
            <div className="space-y-4">
              {RESOURCE_ALLOCATION.map((resource, i) => (
                <div key={i}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-slate-700">{resource.category}</span>
                    <span className="text-sm text-slate-500">{Math.round((resource.utilized / resource.allocated) * 100)}% utilized</span>
                  </div>
                  <div className="h-3 bg-slate-200 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-primary to-emerald-500 rounded-full" style={{ width: `${(resource.utilized / resource.allocated) * 100}%` }} />
                  </div>
                  <div className="flex justify-between text-xs text-slate-500 mt-1">
                    <span>{resource.currency}{(resource.utilized / 100000).toFixed(1)}L used</span>
                    <span>{resource.currency}{(resource.allocated / 100000).toFixed(1)}L allocated</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t border-slate-200 grid grid-cols-2 gap-4">
              <div className="text-center p-3 bg-slate-50 rounded-xl">
                <p className="text-xs text-slate-500">Total Allocated</p>
                <p className="text-lg font-bold text-slate-800">₹{(RESOURCE_ALLOCATION.reduce((a, b) => a + b.allocated, 0) / 10000000).toFixed(1)}Cr</p>
              </div>
              <div className="text-center p-3 bg-emerald-50 rounded-xl">
                <p className="text-xs text-slate-500">Total Utilized</p>
                <p className="text-lg font-bold text-emerald-700">₹{(RESOURCE_ALLOCATION.reduce((a, b) => a + b.utilized, 0) / 10000000).toFixed(1)}Cr</p>
              </div>
            </div>
          </motion.section>
        </div>

        {/* Data Quality Metrics + Success Stories */}
        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.48 }}
            className="glass-card rounded-xl p-6"
          >
            <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
              <Database size={20} className="text-primary" />
              Data Quality Metrics
            </h3>
            <div className="grid grid-cols-2 gap-4 mb-4">
              {[
                { label: "Completeness", value: DATA_QUALITY_METRICS.completeness, color: "#0d9488" },
                { label: "Accuracy", value: DATA_QUALITY_METRICS.accuracy, color: "#6366f1" },
                { label: "Consistency", value: DATA_QUALITY_METRICS.consistency, color: "#8b5cf6" },
                { label: "Timeliness", value: DATA_QUALITY_METRICS.timeliness, color: "#f59e0b" },
              ].map((metric, i) => (
                <div key={i} className="p-3 bg-slate-50 rounded-xl">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-slate-500 font-medium">{metric.label}</span>
                    <span className="text-lg font-bold" style={{ color: metric.color }}>{metric.value}%</span>
                  </div>
                  <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: `${metric.value}%`, backgroundColor: metric.color }} />
                  </div>
                </div>
              ))}
            </div>
            <div className="grid grid-cols-3 gap-3 pt-4 border-t border-slate-200">
              <div className="text-center">
                <p className="text-xs text-slate-500">Total Records</p>
                <p className="text-lg font-bold text-slate-800">{DATA_QUALITY_METRICS.totalRecords.toLocaleString()}</p>
              </div>
              <div className="text-center">
                <p className="text-xs text-slate-500">Valid</p>
                <p className="text-lg font-bold text-emerald-600">{DATA_QUALITY_METRICS.validRecords.toLocaleString()}</p>
              </div>
              <div className="text-center">
                <p className="text-xs text-slate-500">Issues</p>
                <p className="text-lg font-bold text-rose-600">{(DATA_QUALITY_METRICS.duplicates + DATA_QUALITY_METRICS.missingFields).toLocaleString()}</p>
              </div>
            </div>
          </motion.section>

          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.49 }}
            className="glass-card rounded-xl p-6"
          >
            <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
              <Sparkles size={20} className="text-amber-500" />
              Success Stories
            </h3>
            <div className="space-y-4">
              {SUCCESS_STORIES.map((story) => (
                <div key={story.id} className="p-4 rounded-xl bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center flex-shrink-0">
                      <ThumbsUp size={18} className="text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="font-bold text-slate-800 text-sm">{story.title}</p>
                      <p className="text-xs text-slate-600 mt-1">{story.patient} • {story.district}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="px-2 py-0.5 rounded-full bg-rose-100 text-rose-700 text-xs">{story.condition}</span>
                        <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 text-xs">{story.outcome}</span>
                      </div>
                      <p className="text-xs text-slate-400 mt-2">{story.date}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.section>
        </div>

        {/* District Comparison Tool - FULLY DYNAMIC */}
        <motion.section
          id="district-comparison-tool"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="glass-card rounded-xl p-6 mb-8 scroll-mt-24"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <ArrowLeftRight size={20} className="text-primary" />
              District Comparison Tool
            </h3>
            <span className="text-xs text-slate-500">Filter: {getDiseaseLabel()}</span>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {/* First District */}
            <div className="space-y-3">
              <label className="text-sm font-medium text-slate-600">Select First District</label>
              <select 
                value={compareDistrict1 || ""}
                onChange={(e) => setCompareDistrict1(e.target.value)}
                className="w-full p-3 rounded-xl border border-slate-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none bg-white"
              >
                {districts.map((d) => (
                  <option key={d.districtId} value={d.districtId}>{d.name}</option>
                ))}
              </select>
              <div className="p-4 bg-gradient-to-br from-teal-50 to-emerald-50 rounded-xl border border-teal-200">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs text-slate-500">Total Cases</p>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                    comparisonData1?.risk === "high" ? "bg-rose-100 text-rose-600" :
                    comparisonData1?.risk === "medium" ? "bg-amber-100 text-amber-600" :
                    "bg-emerald-100 text-emerald-600"
                  }`}>
                    {comparisonData1?.risk?.toUpperCase()} RISK
                  </span>
                </div>
                <p className="text-3xl font-bold text-slate-800">{comparisonData1?.cases?.toLocaleString() || 0}</p>
                <div className="mt-4 space-y-2">
                  <p className="text-xs font-semibold text-slate-500 uppercase">By Disease Type</p>
                  {comparisonData1?.casesByDisease && Object.entries(comparisonData1.casesByDisease).map(([k, v]) => (
                    <div key={k} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${k === "breast" ? "bg-rose-500" : k === "pcos" ? "bg-violet-500" : "bg-indigo-500"}`} />
                        <span className="capitalize text-sm text-slate-600">{k}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-800">{v?.toLocaleString()}</span>
                        <span className="text-xs text-slate-400">({((v / comparisonData1.cases) * 100).toFixed(0)}%)</span>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 pt-4 border-t border-teal-200">
                  <div className="grid grid-cols-2 gap-2 text-center">
                    <div className="p-2 bg-white/60 rounded-lg">
                      <p className="text-lg font-bold text-teal-600">{comparisonData1?.casesByDisease?.breast || 0}</p>
                      <p className="text-[10px] text-slate-500">Breast</p>
                    </div>
                    <div className="p-2 bg-white/60 rounded-lg">
                      <p className="text-lg font-bold text-violet-600">{comparisonData1?.casesByDisease?.pcos || 0}</p>
                      <p className="text-[10px] text-slate-500">PCOS</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Comparison Center */}
            <div className="flex flex-col items-center justify-center">
              <div className="text-center">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center mx-auto mb-3 border-2 border-primary/30">
                  <ArrowLeftRight size={28} className="text-primary" />
                </div>
                <p className="text-sm font-bold text-slate-700 mb-2">Difference</p>
                {comparisonMetrics && (
                  <div className="space-y-2">
                    <p className={`text-2xl font-bold ${comparisonMetrics.difference > 0 ? "text-rose-600" : comparisonMetrics.difference < 0 ? "text-emerald-600" : "text-slate-600"}`}>
                      {comparisonMetrics.difference > 0 ? "+" : ""}{comparisonMetrics.difference.toLocaleString()}
                    </p>
                    <p className="text-xs text-slate-500">
                      ({comparisonMetrics.percentDiff}% {comparisonMetrics.difference > 0 ? "more" : "fewer"})
                    </p>
                    <div className="mt-4 p-3 bg-slate-50 rounded-xl">
                      <p className="text-[10px] text-slate-400 uppercase font-semibold mb-1">Higher Cases</p>
                      <p className="text-sm font-bold text-slate-700">{comparisonMetrics.higherDistrict}</p>
                    </div>
                  </div>
                )}
              </div>
              <button
                type="button"
                onClick={() => {
                  const temp = compareDistrict1;
                  setCompareDistrict1(compareDistrict2);
                  setCompareDistrict2(temp);
                  toast.success("Swapped comparison districts");
                }}
                className="mt-4 px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-sm font-medium text-slate-600 flex items-center gap-2 transition-colors"
              >
                <RefreshCw size={14} /> Swap
              </button>
            </div>

            {/* Second District */}
            <div className="space-y-3">
              <label className="text-sm font-medium text-slate-600">Select Second District</label>
              <select 
                value={compareDistrict2 || ""}
                onChange={(e) => setCompareDistrict2(e.target.value)}
                className="w-full p-3 rounded-xl border border-slate-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none bg-white"
              >
                {districts.map((d) => (
                  <option key={d.districtId} value={d.districtId}>{d.name}</option>
                ))}
              </select>
              <div className="p-4 bg-gradient-to-br from-violet-50 to-purple-50 rounded-xl border border-violet-200">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs text-slate-500">Total Cases</p>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                    comparisonData2?.risk === "high" ? "bg-rose-100 text-rose-600" :
                    comparisonData2?.risk === "medium" ? "bg-amber-100 text-amber-600" :
                    "bg-emerald-100 text-emerald-600"
                  }`}>
                    {comparisonData2?.risk?.toUpperCase()} RISK
                  </span>
                </div>
                <p className="text-3xl font-bold text-slate-800">{comparisonData2?.cases?.toLocaleString() || 0}</p>
                <div className="mt-4 space-y-2">
                  <p className="text-xs font-semibold text-slate-500 uppercase">By Disease Type</p>
                  {comparisonData2?.casesByDisease && Object.entries(comparisonData2.casesByDisease).map(([k, v]) => (
                    <div key={k} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${k === "breast" ? "bg-rose-500" : k === "pcos" ? "bg-violet-500" : "bg-indigo-500"}`} />
                        <span className="capitalize text-sm text-slate-600">{k}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-800">{v?.toLocaleString()}</span>
                        <span className="text-xs text-slate-400">({((v / comparisonData2.cases) * 100).toFixed(0)}%)</span>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 pt-4 border-t border-violet-200">
                  <div className="grid grid-cols-2 gap-2 text-center">
                    <div className="p-2 bg-white/60 rounded-lg">
                      <p className="text-lg font-bold text-teal-600">{comparisonData2?.casesByDisease?.breast || 0}</p>
                      <p className="text-[10px] text-slate-500">Breast</p>
                    </div>
                    <div className="p-2 bg-white/60 rounded-lg">
                      <p className="text-lg font-bold text-violet-600">{comparisonData2?.casesByDisease?.pcos || 0}</p>
                      <p className="text-[10px] text-slate-500">PCOS</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Comparison Chart */}
          {comparisonData1 && comparisonData2 && (
            <div className="mt-6 pt-6 border-t border-slate-200">
              <h4 className="text-sm font-bold text-slate-700 mb-4">Visual Comparison</h4>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={[
                    { name: "Breast", [comparisonData1.name]: comparisonData1.casesByDisease?.breast || 0, [comparisonData2.name]: comparisonData2.casesByDisease?.breast || 0 },
                    { name: "PCOS", [comparisonData1.name]: comparisonData1.casesByDisease?.pcos || 0, [comparisonData2.name]: comparisonData2.casesByDisease?.pcos || 0 },
                    { name: "Fibroid", [comparisonData1.name]: comparisonData1.casesByDisease?.fibroid || 0, [comparisonData2.name]: comparisonData2.casesByDisease?.fibroid || 0 },
                  ]}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: "#fff", borderRadius: "12px", border: "1px solid #e2e8f0" }}
                    />
                    <Legend />
                    <Bar dataKey={comparisonData1.name} fill="#14b8a6" radius={[4, 4, 0, 0]} />
                    <Bar dataKey={comparisonData2.name} fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}
        </motion.section>

        {/* Appointments Section - DYNAMIC */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.52 }}
          className="glass-card rounded-xl p-6 mb-8"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <CalendarDays size={20} className="text-primary" />
              Today's Appointments ({getDiseaseLabel()})
            </h3>
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold">{currentAppointments.length} Scheduled</span>
              <button className="px-3 py-1 rounded-xl bg-primary text-white text-xs font-medium hover:bg-primary/90">+ New Appointment</button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="text-left py-3 px-4 text-xs font-bold text-slate-500 uppercase">Patient</th>
                  <th className="text-left py-3 px-4 text-xs font-bold text-slate-500 uppercase">Age</th>
                  <th className="text-left py-3 px-4 text-xs font-bold text-slate-500 uppercase">Type</th>
                  <th className="text-left py-3 px-4 text-xs font-bold text-slate-500 uppercase">Doctor</th>
                  <th className="text-left py-3 px-4 text-xs font-bold text-slate-500 uppercase">Time</th>
                  <th className="text-left py-3 px-4 text-xs font-bold text-slate-500 uppercase">Status</th>
                </tr>
              </thead>
              <tbody>
                {currentAppointments.map((apt) => (
                  <tr key={apt.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-4 font-medium text-slate-800">{apt.patient}</td>
                    <td className="py-3 px-4 text-slate-600">{apt.age} yrs</td>
                    <td className="py-3 px-4 text-slate-600">{apt.type}</td>
                    <td className="py-3 px-4 text-slate-600">{apt.doctor}</td>
                    <td className="py-3 px-4 font-medium text-slate-800">{apt.time}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded-lg text-xs font-medium ${
                        apt.status === "confirmed" ? "bg-emerald-100 text-emerald-700" :
                        apt.status === "waiting" ? "bg-amber-100 text-amber-700" :
                        "bg-blue-100 text-blue-700"
                      }`}>{apt.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.section>

        {/* Doctor Allocation + Patient Queue - DYNAMIC */}
        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.53 }}
            className="glass-card rounded-xl p-6"
          >
            <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
              <Stethoscope size={20} className="text-primary" />
              Doctor Allocation ({getDiseaseLabel()})
            </h3>
            <div className="space-y-3">
              {currentDoctors.map((doc) => (
                <div key={doc.id} className="p-4 rounded-xl border border-slate-200 bg-white flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${doc.available ? "bg-emerald-100" : "bg-rose-100"}`}>
                      <User size={18} className={doc.available ? "text-emerald-600" : "text-rose-600"} />
                    </div>
                    <div>
                      <p className="font-bold text-slate-800 text-sm">{doc.name}</p>
                      <p className="text-xs text-slate-500">{doc.specialty} • {doc.district}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-1">
                      <Star size={14} className="text-amber-500 fill-amber-500" />
                      <span className="text-sm font-bold text-slate-800">{doc.rating}</span>
                    </div>
                    <p className="text-xs text-slate-500">{doc.patients} patients</p>
                    <span className={`text-xs font-medium ${doc.available ? "text-emerald-600" : "text-rose-600"}`}>
                      {doc.available ? "Available" : "Busy"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </motion.section>

          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.54 }}
            className="glass-card rounded-xl p-6"
          >
            <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
              <Users size={20} className="text-primary" />
              Patient Queue ({getDiseaseLabel()})
            </h3>
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="p-4 bg-amber-50 rounded-xl text-center">
                <p className="text-3xl font-bold text-amber-600">{currentQueue.waiting}</p>
                <p className="text-xs text-slate-500 font-medium">Waiting</p>
              </div>
              <div className="p-4 bg-blue-50 rounded-xl text-center">
                <p className="text-3xl font-bold text-blue-600">{currentQueue.inProgress}</p>
                <p className="text-xs text-slate-500 font-medium">In Progress</p>
              </div>
              <div className="p-4 bg-emerald-50 rounded-xl text-center">
                <p className="text-3xl font-bold text-emerald-600">{currentQueue.completed}</p>
                <p className="text-xs text-slate-500 font-medium">Completed Today</p>
              </div>
              <div className="p-4 bg-violet-50 rounded-xl text-center">
                <p className="text-3xl font-bold text-violet-600">{currentQueue.avgWaitTime}m</p>
                <p className="text-xs text-slate-500 font-medium">Avg Wait Time</p>
              </div>
            </div>
            <div className="p-4 bg-gradient-to-r from-primary/10 to-emerald-100 rounded-xl">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-slate-700">Queue Efficiency</span>
                <span className="text-lg font-bold text-primary">{Math.round((currentQueue.completed / (currentQueue.completed + currentQueue.waiting)) * 100)}%</span>
              </div>
              <div className="h-2 bg-white rounded-full mt-2 overflow-hidden">
                <div className="h-full bg-primary rounded-full" style={{ width: `${Math.round((currentQueue.completed / (currentQueue.completed + currentQueue.waiting)) * 100)}%` }} />
              </div>
            </div>
          </motion.section>
        </div>

        {/* Equipment Status + Medicine Stock - DYNAMIC */}
        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55 }}
            className="glass-card rounded-xl p-6"
          >
            <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
              <Cpu size={20} className="text-primary" />
              Equipment Status ({getDiseaseLabel()})
            </h3>
            <div className="space-y-3">
              {currentEquipment.map((equip) => (
                <div key={equip.id} className="p-4 rounded-xl border border-slate-200 bg-white">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <p className="font-bold text-slate-800 text-sm">{equip.name}</p>
                      <p className="text-xs text-slate-500">{equip.type} • {equip.location}</p>
                    </div>
                    <span className={`px-2 py-1 rounded-lg text-xs font-medium ${
                      equip.status === "operational" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"
                    }`}>{equip.status}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-slate-500 mt-2">
                    <span>Usage: {equip.usage}%</span>
                    <span>Last service: {equip.lastService}</span>
                  </div>
                  {equip.status === "operational" && (
                    <div className="h-2 bg-slate-200 rounded-full mt-2 overflow-hidden">
                      <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${equip.usage}%` }} />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </motion.section>

          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.56 }}
            className="glass-card rounded-xl p-6"
          >
            <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
              <Pill size={20} className="text-primary" />
              Medicine Stock ({getDiseaseLabel()})
            </h3>
            <div className="space-y-3">
              {currentMedicine.map((med) => (
                <div key={med.id} className="p-4 rounded-xl border border-slate-200 bg-white">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <p className="font-bold text-slate-800 text-sm">{med.name}</p>
                      <p className="text-xs text-slate-500">{med.category}</p>
                    </div>
                    <span className={`px-2 py-1 rounded-lg text-xs font-medium ${
                      med.stock > med.minStock * 2 ? "bg-emerald-100 text-emerald-700" :
                      med.stock > med.minStock ? "bg-amber-100 text-amber-700" :
                      "bg-rose-100 text-rose-700"
                    }`}>{med.stock.toLocaleString()} {med.unit}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-slate-500 mt-1">
                    <span>Min: {med.minStock.toLocaleString()}</span>
                    <span>Expiry: {med.expiry}</span>
                  </div>
                  <div className="h-2 bg-slate-200 rounded-full mt-2 overflow-hidden">
                    <div className={`h-full rounded-full ${
                      med.stock > med.minStock * 2 ? "bg-emerald-500" :
                      med.stock > med.minStock ? "bg-amber-500" : "bg-rose-500"
                    }`} style={{ width: `${Math.min(100, (med.stock / (med.minStock * 3)) * 100)}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </motion.section>
        </div>

        {/* Follow-up Patients + Lab Results - DYNAMIC */}
        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.57 }}
            className="glass-card rounded-xl p-6"
          >
            <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
              <ClipboardList size={20} className="text-primary" />
              Follow-up Patients ({getDiseaseLabel()})
            </h3>
            <div className="space-y-3">
              {currentFollowUps.map((patient) => (
                <div key={patient.id} className="p-4 rounded-xl border border-slate-200 bg-white">
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-bold text-slate-800 text-sm">{patient.patient}</p>
                    <span className={`px-2 py-1 rounded-lg text-xs font-medium ${
                      patient.status === "stable" || patient.status === "normal" ? "bg-emerald-100 text-emerald-700" :
                      patient.status === "improving" ? "bg-blue-100 text-blue-700" :
                      "bg-amber-100 text-amber-700"
                    }`}>{patient.status}</span>
                  </div>
                  <p className="text-xs text-slate-500 mb-2">{patient.condition}</p>
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span>Doctor: {patient.doctor}</span>
                    <span>Next: {patient.nextVisit}</span>
                  </div>
                </div>
              ))}
            </div>
          </motion.section>

          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.58 }}
            className="glass-card rounded-xl p-6"
          >
            <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
              <TestTube size={20} className="text-primary" />
              Lab Results ({getDiseaseLabel()})
            </h3>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="p-4 bg-amber-50 rounded-xl text-center">
                <p className="text-2xl font-bold text-amber-600">{currentLabResults.pending}</p>
                <p className="text-xs text-slate-500">Pending</p>
              </div>
              <div className="p-4 bg-emerald-50 rounded-xl text-center">
                <p className="text-2xl font-bold text-emerald-600">{currentLabResults.completed.toLocaleString()}</p>
                <p className="text-xs text-slate-500">Completed</p>
              </div>
              <div className="p-4 bg-rose-50 rounded-xl text-center">
                <p className="text-2xl font-bold text-rose-600">{currentLabResults.critical}</p>
                <p className="text-xs text-slate-500">Critical</p>
              </div>
              <div className="p-4 bg-blue-50 rounded-xl text-center">
                <p className="text-2xl font-bold text-blue-600">{currentLabResults.avgTurnaround}h</p>
                <p className="text-xs text-slate-500">Avg Turnaround</p>
              </div>
            </div>
            <div className="p-4 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-slate-700">Completion Rate</span>
                <span className="text-lg font-bold text-emerald-600">{Math.round((currentLabResults.completed / (currentLabResults.completed + currentLabResults.pending)) * 100)}%</span>
              </div>
            </div>
          </motion.section>
        </div>

        {/* Insurance Claims + Referrals - DYNAMIC */}
        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.59 }}
            className="glass-card rounded-xl p-6"
          >
            <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
              <CreditCard size={20} className="text-primary" />
              Insurance Claims ({getDiseaseLabel()})
            </h3>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="p-3 bg-slate-50 rounded-xl">
                <p className="text-xl font-bold text-slate-800">{currentInsurance.submitted.toLocaleString()}</p>
                <p className="text-xs text-slate-500">Submitted</p>
              </div>
              <div className="p-3 bg-emerald-50 rounded-xl">
                <p className="text-xl font-bold text-emerald-600">{currentInsurance.approved.toLocaleString()}</p>
                <p className="text-xs text-slate-500">Approved</p>
              </div>
              <div className="p-3 bg-amber-50 rounded-xl">
                <p className="text-xl font-bold text-amber-600">{currentInsurance.pending}</p>
                <p className="text-xs text-slate-500">Pending</p>
              </div>
              <div className="p-3 bg-rose-50 rounded-xl">
                <p className="text-xl font-bold text-rose-600">{currentInsurance.rejected}</p>
                <p className="text-xs text-slate-500">Rejected</p>
              </div>
            </div>
            <div className="p-4 bg-gradient-to-r from-primary/10 to-emerald-100 rounded-xl">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-slate-700">Total Amount</span>
                <span className="text-xl font-bold text-primary">₹{(currentInsurance.totalAmount / 100000).toFixed(1)}L</span>
              </div>
              <p className="text-xs text-slate-500 mt-1">Approval Rate: {Math.round((currentInsurance.approved / currentInsurance.submitted) * 100)}%</p>
            </div>
          </motion.section>

          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="glass-card rounded-xl p-6"
          >
            <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
              <Send size={20} className="text-primary" />
              Patient Referrals ({getDiseaseLabel()})
            </h3>
            <div className="space-y-3">
              {currentReferrals.map((ref) => (
                <div key={ref.id} className="p-4 rounded-xl border border-slate-200 bg-white">
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-bold text-slate-800 text-sm">{ref.patient}</p>
                    <span className={`px-2 py-1 rounded-lg text-xs font-medium ${
                      ref.status === "completed" ? "bg-emerald-100 text-emerald-700" :
                      ref.status === "accepted" ? "bg-blue-100 text-blue-700" :
                      "bg-amber-100 text-amber-700"
                    }`}>{ref.status}</span>
                  </div>
                  <p className="text-xs text-slate-500 mb-1">{ref.reason}</p>
                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <span>{ref.from}</span>
                    <span>→</span>
                    <span className="font-medium text-primary">{ref.to}</span>
                  </div>
                </div>
              ))}
            </div>
          </motion.section>
        </div>

        {/* Health Tips + Feedback - DYNAMIC */}
        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.61 }}
            className="glass-card rounded-xl p-6"
          >
            <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
              <Heart size={20} className="text-rose-500" />
              Health Tips ({getDiseaseLabel()})
            </h3>
            <div className="space-y-3">
              {currentHealthTips.map((tip) => (
                <div key={tip.id} className="p-4 rounded-xl bg-gradient-to-r from-rose-50 to-pink-50 border border-rose-200">
                  <p className="font-bold text-slate-800 text-sm">{tip.title}</p>
                  <span className="text-xs text-rose-600 font-medium">{tip.category}</span>
                  <p className="text-sm text-slate-600 mt-2">{tip.tip}</p>
                </div>
              ))}
            </div>
          </motion.section>

          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.62 }}
            className="glass-card rounded-xl p-6"
          >
            <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
              <Star size={20} className="text-amber-500" />
              Patient Feedback ({getDiseaseLabel()})
            </h3>
            <div className="text-center mb-6">
              <div className="flex items-center justify-center gap-1 mb-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} size={28} className={star <= Math.round(currentFeedback.avgRating) ? "text-amber-500 fill-amber-500" : "text-slate-300"} />
                ))}
              </div>
              <p className="text-3xl font-bold text-slate-800">{currentFeedback.avgRating}</p>
              <p className="text-xs text-slate-500">{currentFeedback.totalFeedback.toLocaleString()} reviews</p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <span className="text-xs text-slate-500 w-16">Positive</span>
                <div className="flex-1 h-3 bg-slate-200 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${(currentFeedback.positive / currentFeedback.totalFeedback) * 100}%` }} />
                </div>
                <span className="text-xs font-medium text-slate-800 w-12">{currentFeedback.positive.toLocaleString()}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs text-slate-500 w-16">Neutral</span>
                <div className="flex-1 h-3 bg-slate-200 rounded-full overflow-hidden">
                  <div className="h-full bg-amber-500 rounded-full" style={{ width: `${(currentFeedback.neutral / currentFeedback.totalFeedback) * 100}%` }} />
                </div>
                <span className="text-xs font-medium text-slate-800 w-12">{currentFeedback.neutral}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs text-slate-500 w-16">Negative</span>
                <div className="flex-1 h-3 bg-slate-200 rounded-full overflow-hidden">
                  <div className="h-full bg-rose-500 rounded-full" style={{ width: `${(currentFeedback.negative / currentFeedback.totalFeedback) * 100}%` }} />
                </div>
                <span className="text-xs font-medium text-slate-800 w-12">{currentFeedback.negative}</span>
              </div>
            </div>
          </motion.section>
        </div>

        {/* Compliance + Population Coverage - DYNAMIC */}
        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.63 }}
            className="glass-card rounded-xl p-6"
          >
            <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
              <BadgeCheck size={20} className="text-primary" />
              Compliance Metrics ({getDiseaseLabel()})
            </h3>
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: "Protocol Adherence", value: currentCompliance.protocolAdherence, color: "#0d9488" },
                { label: "Documentation Rate", value: currentCompliance.documentationRate, color: "#6366f1" },
                { label: "Follow-up Rate", value: currentCompliance.followUpRate, color: "#8b5cf6" },
                { label: "Patient Satisfaction", value: currentCompliance.patientSatisfaction, color: "#f59e0b" },
              ].map((metric, i) => (
                <div key={i} className="p-4 bg-slate-50 rounded-xl">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-slate-500">{metric.label}</span>
                    <span className="text-lg font-bold" style={{ color: metric.color }}>{metric.value}%</span>
                  </div>
                  <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: `${metric.value}%`, backgroundColor: metric.color }} />
                  </div>
                </div>
              ))}
            </div>
          </motion.section>

          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.64 }}
            className="glass-card rounded-xl p-6"
          >
            <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
              <Globe size={20} className="text-primary" />
              Population Coverage ({getDiseaseLabel()})
            </h3>
            <div className="text-center mb-6">
              <div className="w-32 h-32 rounded-full border-8 border-primary/20 flex items-center justify-center mx-auto relative">
                <div className="absolute inset-0 rounded-full border-8 border-primary border-t-transparent border-r-transparent" style={{ transform: `rotate(${currentCoverage.coverage * 3.6}deg)` }} />
                <div className="text-center">
                  <p className="text-3xl font-bold text-primary">{currentCoverage.coverage}%</p>
                  <p className="text-xs text-slate-500">Coverage</p>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 bg-slate-50 rounded-xl text-center">
                <p className="text-lg font-bold text-slate-800">{(currentCoverage.totalPopulation / 100000).toFixed(1)}L</p>
                <p className="text-xs text-slate-500">Target Population</p>
              </div>
              <div className="p-3 bg-emerald-50 rounded-xl text-center">
                <p className="text-lg font-bold text-emerald-600">{(currentCoverage.screened / 100000).toFixed(1)}L</p>
                <p className="text-xs text-slate-500">Screened</p>
              </div>
            </div>
            <div className="mt-4 p-3 bg-amber-50 rounded-xl">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-600">Target: {currentCoverage.targetCoverage}%</span>
                <span className="text-xs font-medium text-amber-700">{currentCoverage.targetCoverage - currentCoverage.coverage}% remaining</span>
              </div>
            </div>
          </motion.section>
        </div>

        {/* Training Schedule + Emergency Alerts */}
        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.65 }}
            className="glass-card rounded-xl p-6"
          >
            <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
              <GraduationCap size={20} className="text-primary" />
              Training Schedule
            </h3>
            <div className="space-y-3">
              {TRAINING_SCHEDULE.map((training) => (
                <div key={training.id} className="p-4 rounded-xl border border-slate-200 bg-white">
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-bold text-slate-800 text-sm">{training.title}</p>
                    <span className={`px-2 py-1 rounded-lg text-xs font-medium ${
                      training.status === "upcoming" ? "bg-emerald-100 text-emerald-700" : "bg-blue-100 text-blue-700"
                    }`}>{training.status}</span>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-slate-500">
                    <span>{training.date}</span>
                    <span>•</span>
                    <span>{training.trainer}</span>
                    <span>•</span>
                    <span>{training.participants} participants</span>
                  </div>
                </div>
              ))}
            </div>
          </motion.section>

          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.66 }}
            className="glass-card rounded-xl p-6"
          >
            <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
              <AlertTriangle size={20} className="text-rose-500" />
              Emergency Alerts
            </h3>
            <div className="space-y-3">
              {EMERGENCY_ALERTS.map((alert) => (
                <div key={alert.id} className={`p-4 rounded-xl border-2 ${
                  alert.type === "critical" ? "bg-rose-50 border-rose-200" :
                  alert.type === "warning" ? "bg-amber-50 border-amber-200" :
                  "bg-blue-50 border-blue-200"
                }`}>
                  <div className="flex items-start gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                      alert.type === "critical" ? "bg-rose-500" :
                      alert.type === "warning" ? "bg-amber-500" :
                      "bg-blue-500"
                    }`}>
                      <AlertTriangle size={16} className="text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-slate-800">{alert.message}</p>
                      <p className="text-xs text-slate-500 mt-1">{alert.time}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.section>
        </div>

        {/* Scan Summary + High-Risk Zones */}
        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.67 }}
            className="glass-card rounded-xl p-6"
          >
            <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
              <TrendingUp size={20} className="text-primary" />
              Scan Volume & AI Summary
            </h3>
            <div className="space-y-4">
              {[
                { label: "Total scans", value: (scanSummary.totalScans ?? 0).toLocaleString(), color: "bg-primary/20 text-primary" },
                { label: "Normal scans", value: (scanSummary.normalScans ?? 0).toLocaleString(), color: "bg-emerald-100 text-emerald-700" },
                { label: "Abnormal scans", value: (scanSummary.abnormalScans ?? 0).toLocaleString(), color: "bg-rose-100 text-rose-700" },
                { label: "Pending validation", value: (scanSummary.pendingValidation ?? 0).toLocaleString(), color: "bg-amber-100 text-amber-700" },
              ].map((item, i) => (
                <div key={i} className="flex justify-between items-center">
                  <span className="text-slate-600 font-medium">{item.label}</span>
                  <span className={`px-3 py-1 rounded-lg font-bold ${item.color}`}>{item.value}</span>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t border-slate-100">
              <p className="text-xs text-slate-400">Today&apos;s progress: 12,400 / 15,000</p>
              <div className="h-2 bg-slate-200 rounded-full mt-2 overflow-hidden">
                <div className="h-full bg-primary rounded-full" style={{ width: "82%" }} />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.46 }}
            className="glass-card rounded-xl p-6"
          >
            <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center justify-between">
              <span className="flex items-center gap-2">
                <AlertTriangle size={20} className="text-amber-600" />
                Andhra Pradesh High-Risk Zones
              </span>
              <span className="flex gap-2">
                <span className="px-2 py-0.5 rounded-full bg-rose-100 text-rose-700 text-xs font-bold">{alerts.length} Alerts</span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 text-xs font-bold">{stats.totalDistricts ?? 0} Districts</span>
              </span>
            </h3>
            <div className="space-y-4">
              {alerts.length > 0 ? (
                alerts.map((alert, i) => (
                  <div key={i} className="p-4 rounded-xl border border-slate-200 bg-white flex justify-between items-center">
                    <div>
                      <p className="font-bold text-slate-800">{alert.district}</p>
                      <p className="text-sm text-slate-500">{alert.condition}</p>
                      {alert.action && <p className="text-xs text-primary font-medium mt-1">{alert.action}</p>}
                    </div>
                    <span className={`px-3 py-1 rounded-lg text-xs font-bold ${alert.severity === "high" ? "bg-rose-100 text-rose-700" : "bg-amber-100 text-amber-700"}`}>
                      {alert.severity === "high" ? "Alert" : "Escalating"}
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-slate-500 text-sm">No high-risk alerts</p>
              )}
            </div>
            <div className="flex gap-2 mt-4">
              <button onClick={() => fetchDashboard(activeFilter)} className="flex-1 flex items-center justify-center gap-2 py-2 rounded-xl border border-slate-200 text-slate-600 font-semibold text-sm hover:bg-slate-50">
                <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
                Refresh
              </button>
              <button onClick={exportToCSV} className="flex-1 flex items-center justify-center gap-2 py-2 rounded-xl premium-button text-sm">
                <Download size={16} />
                Export CSV
              </button>
            </div>
          </motion.div>
        </div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="text-center py-4 text-sm text-slate-400">
          System Status: <span className="text-emerald-600 font-bold">Online</span>
          {" • "}
          Last Sync: {new Date().toLocaleString("en-IN", { dateStyle: "full", timeStyle: "short" })}
        </motion.div>
      </main>

      {/* Activity Feed Sidebar */}
      <AnimatePresence>
        {showActivityFeed && (
          <motion.aside
            initial={{ x: 300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 300, opacity: 0 }}
            className="fixed right-0 top-0 h-full w-80 bg-white border-l border-slate-200 shadow-xl z-[80] p-6 overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-slate-800">Activity Feed</h3>
              <button onClick={() => setShowActivityFeed(false)} className="p-1 hover:bg-slate-100 rounded-lg">
                <X size={20} className="text-slate-500" />
              </button>
            </div>
            <div className="space-y-4">
              {activityFeedItems.map((item) => (
                <div key={item.id} className={`p-4 rounded-xl border ${
                  item.type === "alert" ? "bg-rose-50 border-rose-200" :
                  item.type === "success" ? "bg-emerald-50 border-emerald-200" :
                  item.type === "warning" ? "bg-amber-50 border-amber-200" :
                  "bg-blue-50 border-blue-200"
                }`}>
                  <div className="flex items-start gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      item.type === "alert" ? "bg-rose-500" :
                      item.type === "success" ? "bg-emerald-500" :
                      item.type === "warning" ? "bg-amber-500" :
                      "bg-blue-500"
                    }`}>
                      {item.type === "alert" ? <AlertTriangle size={16} className="text-white" /> :
                       item.type === "success" ? <CheckCircle2 size={16} className="text-white" /> :
                       item.type === "warning" ? <AlertCircle size={16} className="text-white" /> :
                       <Bell size={16} className="text-white" />}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-slate-800 font-medium">{item.message}</p>
                      <p className="text-xs text-slate-500 mt-1">{item.time}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* District Detail Modal - ENHANCED */}
      <AnimatePresence>
        {selectedDistrict && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[85] flex items-center justify-center p-4"
            onClick={() => setSelectedDistrict(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl max-h-[90vh] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className={`p-6 ${
                selectedDistrict.risk === "high" ? "bg-gradient-to-r from-rose-500 to-pink-500" :
                selectedDistrict.risk === "medium" ? "bg-gradient-to-r from-amber-500 to-orange-500" :
                "bg-gradient-to-r from-emerald-500 to-teal-500"
              }`}>
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-2xl font-bold text-white">{selectedDistrict.name}</h3>
                    <p className="text-white/80 text-sm mt-1">District ID: {selectedDistrict.districtId}</p>
                  </div>
                  <button type="button" onClick={() => setSelectedDistrict(null)} className="p-2 hover:bg-white/20 rounded-lg transition-colors" aria-label="Close">
                    <X size={24} className="text-white" />
                  </button>
                </div>
                <div className="mt-4 flex items-center gap-4">
                  <div className="px-4 py-2 bg-white/20 rounded-xl">
                    <p className="text-white/70 text-xs">Risk Level</p>
                    <p className="text-white font-bold text-lg uppercase">{selectedDistrict.risk}</p>
                  </div>
                  <div className="px-4 py-2 bg-white/20 rounded-xl">
                    <p className="text-white/70 text-xs">Total Cases</p>
                    <p className="text-white font-bold text-lg">{selectedDistrict.cases?.toLocaleString()}</p>
                  </div>
                  <div className="px-4 py-2 bg-white/20 rounded-xl">
                    <p className="text-white/70 text-xs">State Rank</p>
                    <p className="text-white font-bold text-lg">#{getDistrictRank(selectedDistrict)}</p>
                  </div>
                </div>
              </div>

              {/* Modal Body */}
              <div className="p-6 overflow-y-auto max-h-[50vh]">
                {/* Quick Stats */}
                <div className="grid grid-cols-4 gap-3 mb-6">
                  {[
                    { label: "Screenings", value: Math.round(selectedDistrict.cases * 2.5).toLocaleString(), icon: Stethoscope, color: "text-cyan-600" },
                    { label: "Abnormal", value: Math.round(selectedDistrict.cases * 0.22).toLocaleString(), icon: AlertCircle, color: "text-rose-600" },
                    { label: "Follow-ups", value: Math.round(selectedDistrict.cases * 0.35).toLocaleString(), icon: Clock, color: "text-amber-600" },
                    { label: "Resolved", value: Math.round(selectedDistrict.cases * 0.65).toLocaleString(), icon: CheckCircle2, color: "text-emerald-600" },
                  ].map((stat, idx) => (
                    <div key={idx} className="p-3 bg-slate-50 rounded-xl text-center">
                      <stat.icon size={18} className={`mx-auto mb-1 ${stat.color}`} />
                      <p className="font-bold text-slate-800">{stat.value}</p>
                      <p className="text-[10px] text-slate-500">{stat.label}</p>
                    </div>
                  ))}
                </div>

                {/* Cases by Disease */}
                {selectedDistrict.casesByDisease && (
                  <div className="mb-6">
                    <p className="text-sm font-bold text-slate-700 mb-3 flex items-center gap-2">
                      <Activity size={16} className="text-primary" />
                      Cases by Disease Type
                    </p>
                    <div className="space-y-3">
                      {Object.entries(selectedDistrict.casesByDisease).map(([disease, count]) => {
                        const percentage = ((count / selectedDistrict.cases) * 100).toFixed(1);
                        return (
                          <div key={disease} className="p-3 bg-slate-50 rounded-xl">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm font-medium text-slate-700 capitalize flex items-center gap-2">
                                <div className={`w-3 h-3 rounded-full ${
                                  disease === "breast" ? "bg-rose-500" :
                                  disease === "pcos" ? "bg-violet-500" :
                                  "bg-indigo-500"
                                }`} />
                                {disease === "breast" ? "Breast Cancer" : disease === "pcos" ? "PCOS" : "Fibroids"}
                              </span>
                              <span className="text-sm font-bold text-slate-800">{count?.toLocaleString()} ({percentage}%)</span>
                            </div>
                            <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${Math.min(100, parseFloat(percentage))}%` }}
                                transition={{ duration: 0.5, delay: 0.1 }}
                                className="h-full rounded-full"
                                style={{ backgroundColor: DISEASE_COLORS[disease] || "#94a3b8" }}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Comparison with State Average */}
                <div className="mb-6">
                  <p className="text-sm font-bold text-slate-700 mb-3 flex items-center gap-2">
                    <ArrowLeftRight size={16} className="text-primary" />
                    Comparison with State Average
                  </p>
                  <div className="p-4 bg-gradient-to-r from-slate-50 to-slate-100 rounded-xl">
                    {(() => {
                      const avgCases = Math.round(districts.reduce((sum, d) => sum + (d.cases || 0), 0) / districts.length);
                      const diff = selectedDistrict.cases - avgCases;
                      const percentDiff = ((diff / avgCases) * 100).toFixed(1);
                      return (
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-xs text-slate-500">State Average</p>
                            <p className="text-xl font-bold text-slate-700">{avgCases.toLocaleString()} cases</p>
                          </div>
                          <div className={`text-center px-4 py-2 rounded-xl ${diff > 0 ? "bg-rose-100" : "bg-emerald-100"}`}>
                            <p className={`text-2xl font-bold ${diff > 0 ? "text-rose-600" : "text-emerald-600"}`}>
                              {diff > 0 ? "+" : ""}{diff.toLocaleString()}
                            </p>
                            <p className={`text-xs ${diff > 0 ? "text-rose-600" : "text-emerald-600"}`}>
                              ({percentDiff}% {diff > 0 ? "above" : "below"} avg)
                            </p>
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => handleAddDistrictToCompare(selectedDistrict)}
                    className="p-3 rounded-xl border-2 border-dashed border-slate-200 text-slate-600 font-medium text-sm hover:border-primary hover:text-primary transition-all flex items-center justify-center gap-2"
                  >
                    <ArrowLeftRight size={16} />
                    Add to Compare
                  </button>
                  <button
                    type="button"
                    onClick={() => exportDistrictDetail(selectedDistrict)}
                    className="p-3 rounded-xl border border-slate-200 text-slate-600 font-medium text-sm hover:bg-slate-50 transition-all flex items-center justify-center gap-2"
                  >
                    <Download size={16} />
                    Export CSV
                  </button>
                  <button
                    type="button"
                    onClick={() => exportDistrictJSON(selectedDistrict)}
                    className="p-3 rounded-xl border border-slate-200 text-slate-600 font-medium text-sm hover:bg-slate-50 transition-all flex items-center justify-center gap-2 sm:col-span-2"
                  >
                    <FileText size={16} />
                    Export JSON
                  </button>
                  <button
                    type="button"
                    onClick={() => copyDistrictSummary(selectedDistrict)}
                    className="p-3 rounded-xl border border-slate-200 text-slate-600 font-medium text-sm hover:bg-slate-50 transition-all flex items-center justify-center gap-2 sm:col-span-2"
                  >
                    <Copy size={16} />
                    Copy summary
                  </button>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="p-4 border-t border-slate-200 bg-slate-50 flex flex-col sm:flex-row gap-3">
                <button
                  type="button"
                  onClick={() => setSelectedDistrict(null)}
                  className="flex-1 py-3 rounded-xl border border-slate-300 text-slate-600 font-semibold text-sm hover:bg-white transition-colors"
                >
                  Close
                </button>
                <button
                  type="button"
                  disabled={vanDeploying}
                  onClick={() => handleDeployMobileVan(selectedDistrict)}
                  className="flex-1 py-3 rounded-xl bg-gradient-to-r from-primary to-teal-500 text-white font-semibold text-sm hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {vanDeploying ? <Loader2 size={16} className="animate-spin" /> : <Truck size={16} />}
                  {vanDeploying ? "Dispatching…" : "Deploy Mobile Van"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <Toaster position="top-center" containerStyle={{ zIndex: 200 }} />
      <Chatbot />
      <BackToTop />
    </div>
  );
}
