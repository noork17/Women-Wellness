# 🏥 Women Wellness — AI Detection Platform

SETV Women Wellness is a full-stack, AI-powered healthcare platform that analyzes ultrasound videos to detect and classify **Breast Cancer**, **PCOS (Polycystic Ovary Syndrome)**, and **Uterine Fibroids**. The platform aims to make reliable, fast diagnostic support accessible in regions where specialist radiologists and gynecologists are scarce — with a current focus on 13 districts of Andhra Pradesh, India.

It combines a YOLOv8-based deep learning detection engine with a full web application featuring real-time analysis, automated PDF reporting, district-wide health monitoring, and appointment management.

---

## ✨ Key Features

- **🤖 AI Video Detection** — YOLOv8-based real-time ultrasound video analysis for malignant/benign classification
- **⚡ Instant Results** — Frame-by-frame analysis with live confidence scores
- **📄 PDF Reports** — Auto-generated diagnostic reports with space for doctor's comments
- **🗺️ District Dashboard** — State-wide health analytics with heatmap visualization
- **📊 District Comparison** — Dynamic tool for comparing health metrics across districts
- **📅 Appointment System** — Complete booking and management for medical consultations
- **🩺 Health Tools** — Symptom checker, risk calculator, and health tracker
- **📱 Mobile Responsive** — Fully responsive UI across all devices

### Supported Conditions

| Condition | Detection Capabilities |
|---|---|
| 🎗️ Breast Cancer | Malignant/benign classification, real-time video analysis, confidence scoring |
| 🔬 PCOS | Ovarian cyst identification, follicle counting, size measurement, pattern analysis |
| 🩺 Fibroids | Detection, location classification, size estimation, multi-fibroid tracking |

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 18, Vite, Tailwind CSS, Framer Motion, Recharts, react-simple-maps |
| **Backend** | Node.js, Express (REST API), JWT Authentication, Joi Validation |
| **AI/ML Service** | Python, Flask, YOLOv8, OpenCV |
| **Database** | MongoDB (Mongoose) |
| **Storage** | Azure Blob Storage |
| **Other** | Nodemailer (email), jsPDF / pdf-parse (reports), Multer (file uploads) |

---

## 📁 Project Structure

```
CSE-2022-26-BATCH-A-17-main/
├── client/          # React frontend (Vite)
├── backend/         # Node.js + Express REST API
│   ├── Routes/
│   ├── controllers/
│   ├── models/
│   ├── middlewares/
│   └── scripts/
├── Ai/              # Python Flask AI microservice (YOLOv8 models)
│   ├── app.py
│   ├── fibroidsdetection.py
│   ├── pcosdetection.py
│   ├── generate_report_and_pdf.py
│   └── video_analysis.py
└── docs/            # Full project documentation
```

---

## 🚀 Getting Started

The application runs as **three separate services** that need to run concurrently.

### Prerequisites
- Node.js & npm
- Python 3.x
- MongoDB instance
- Azure Blob Storage credentials (for file storage)

### 1. Frontend (React)
```bash
cd client
npm install
npm run dev
```

### 2. Backend (Node.js)
```bash
cd backend
npm install
npm start
```

### 3. AI Service (Flask)
```bash
cd Ai
pip install -r requirements.txt
python app.py
```

> 💡 Tip: Open three terminals — one for each service — and run them in parallel.

---

## 📖 Documentation

Detailed project documentation, including system architecture, API references, ML model details, and deployment guides, is available in the [`docs/`](./docs) folder.

---

## 👥 Target Users

- **Medical Professionals** — Quick AI-assisted diagnosis
- **Hospital Administrators** — Dashboard analytics for patient flow
- **Healthcare Researchers** — Data on disease prevalence and distribution
- **Public Health Officials** — District-wide health monitoring and resource allocation

---

## 📜 Project Info

This project was developed as an academic capstone project (CSE 2022–26, Batch A-17).
