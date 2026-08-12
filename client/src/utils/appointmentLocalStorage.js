import { HEALTH_IMAGES } from "../assets/healthImages";

export const STORAGE_KEY = "setv_my_appointments_v2";

/** Default demo data — dates resolved at runtime in filters */
export const SEED_APPOINTMENTS = [
  {
    id: 1,
    service: "Breast Cancer Screening",
    doctor: "Dr. Priya Sharma",
    doctorImage: HEALTH_IMAGES.teamDoctor,
    specialty: "Oncologist",
    scheduledAt: "2026-03-20T10:30:00",
    location: "SETV Main Center, Vijayawada",
    status: "confirmed",
    canReschedule: true,
    hasReport: false,
  },
  {
    id: 2,
    service: "PCOS Follow-up",
    doctor: "Dr. Anitha Reddy",
    doctorImage: HEALTH_IMAGES.teamNurse,
    specialty: "Gynecologist",
    scheduledAt: "2026-03-25T14:00:00",
    location: "SETV Guntur Branch",
    status: "pending",
    canReschedule: true,
    hasReport: false,
  },
  {
    id: 3,
    service: "Comprehensive Checkup",
    doctor: "Dr. Lakshmi Rao",
    doctorImage: HEALTH_IMAGES.teamResearch,
    specialty: "Radiologist",
    scheduledAt: "2026-03-05T11:00:00",
    location: "SETV Main Center",
    status: "completed",
    canReschedule: false,
    hasReport: true,
  },
  {
    id: 4,
    service: "Breast Cancer Screening",
    doctor: "Dr. Priya Sharma",
    doctorImage: HEALTH_IMAGES.teamDoctor,
    specialty: "Oncologist",
    scheduledAt: "2026-02-15T09:30:00",
    location: "Mobile Van - MV002",
    status: "completed",
    canReschedule: false,
    hasReport: true,
  },
  {
    id: 5,
    service: "PCOS Detection",
    doctor: "Dr. Anitha Reddy",
    doctorImage: HEALTH_IMAGES.teamNurse,
    specialty: "Gynecologist",
    scheduledAt: "2026-01-20T15:00:00",
    location: "SETV Main Center",
    status: "cancelled",
    canReschedule: false,
    hasReport: false,
  },
  {
    id: 6,
    service: "Fibroid Detection",
    doctor: "Dr. Lakshmi Rao",
    doctorImage: HEALTH_IMAGES.teamResearch,
    specialty: "Radiologist",
    scheduledAt: "2026-06-12T11:00:00",
    location: "SETV Main Center, Vijayawada",
    status: "confirmed",
    canReschedule: true,
    hasReport: false,
  },
];

export function loadStoredAppointments() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return SEED_APPOINTMENTS;
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0) return SEED_APPOINTMENTS;
    return parsed
      .map((row) => ({
        ...row,
        scheduledAt: row.scheduledAt || row.dateISO || null,
      }))
      .filter((row) => row.scheduledAt);
  } catch {
    return SEED_APPOINTMENTS;
  }
}

export function persistAppointments(next) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    /* ignore quota */
  }
}

/** Merge selected calendar date with slot label e.g. "09:30 AM" → ISO string */
export function combineDateAndTimeSlot(date, timeStr) {
  const d = new Date(date);
  const match = String(timeStr).match(/(\d{1,2}):(\d{2})\s*(AM|PM)/i);
  if (!match) return d.toISOString();
  let h = parseInt(match[1], 10);
  const m = parseInt(match[2], 10);
  const ap = match[3].toUpperCase();
  if (ap === "PM" && h !== 12) h += 12;
  if (ap === "AM" && h === 12) h = 0;
  d.setHours(h, m, 0, 0);
  return d.toISOString();
}

export function appendAppointment(appointment) {
  const list = loadStoredAppointments();
  const maxId = list.reduce((m, a) => Math.max(m, Number(a.id) || 0), 0);
  const next = [...list, { ...appointment, id: maxId + 1 }];
  persistAppointments(next);
}
