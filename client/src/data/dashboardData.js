/**
 * Predefined seed data for Andhra Pradesh District Health Monitoring
 * Women Wellness - Breast Cancer, Fibroids, PCOS
 */

export const AP_DISTRICTS = [
  { id: "spsr", name: "S.P.S. Nellore", cases: 312, risk: "medium" },
  { id: "kadapa", name: "Y.S.R. Kadapa", cases: 287, risk: "high" },
  { id: "anantapur", name: "Anantapur", cases: 256, risk: "medium" },
  { id: "kurnool", name: "Kurnool", cases: 423, risk: "high" },
  { id: "guntur", name: "Guntur", cases: 534, risk: "high" },
  { id: "krishna", name: "Krishna", cases: 489, risk: "medium" },
  { id: "vijayawada", name: "Vijayawada", cases: 612, risk: "high" },
  { id: "visakhapatnam", name: "Visakhapatnam", cases: 578, risk: "high" },
  { id: "eastgodavari", name: "East Godavari", cases: 445, risk: "medium" },
  { id: "westgodavari", name: "West Godavari", cases: 398, risk: "medium" },
  { id: "prakasam", name: "Prakasam", cases: 267, risk: "low" },
  { id: "srikakulam", name: "Srikakulam", cases: 234, risk: "low" },
  { id: "vizianagaram", name: "Vizianagaram", cases: 198, risk: "low" },
  { id: "chittoor", name: "Chittoor", cases: 356, risk: "medium" },
  { id: "tirupati", name: "Tirupati", cases: 412, risk: "high" },
  { id: "nellore", name: "Nellore", cases: 289, risk: "medium" },
];

export const DISEASE_FILTERS = [
  { id: "all", label: "All Conditions", color: "bg-teal-500" },
  { id: "breast", label: "Breast Cancer", color: "bg-rose-500" },
  { id: "fibroid", label: "Fibroids", color: "bg-indigo-500" },
  { id: "pcos", label: "PCOS", color: "bg-purple-500" },
];

export const SCAN_SUMMARY = {
  totalScans: 89500,
  normalScans: 71600,
  abnormalScans: 17900,
  pendingValidation: 4750,
};

export const DASHBOARD_STATS = {
  totalDistricts: 26,
  totalCases: 6127,
  flaggedZones: 2,
  avgConfidence: 94.3,
};

export const RISK_ALERTS = [
  { district: "Y.S.R. Kadapa", condition: "Breast abnormality cluster detected", action: "Deploy mobile screening van", severity: "high" },
  { district: "Visakhapatnam", condition: "PCOS prevalence rising", severity: "escalating" },
];
