/**
 * Seed script - populates DistrictStats and Report with 1000s of records
 * Run: node scripts/seed.js (from backend folder)
 */
require('dotenv').config();
require('../models/db');

const mongoose = require('mongoose');
const DistrictStats = require('../models/DistrictStats');
const Report = require('../models/report');

const AP_DISTRICTS = [
  { districtId: 'srikakulam', name: 'Srikakulam' },
  { districtId: 'vizianagaram', name: 'Vizianagaram' },
  { districtId: 'visakhapatnam', name: 'Visakhapatnam' },
  { districtId: 'eastgodavari', name: 'East Godavari' },
  { districtId: 'westgodavari', name: 'West Godavari' },
  { districtId: 'krishna', name: 'Krishna' },
  { districtId: 'guntur', name: 'Guntur' },
  { districtId: 'prakasam', name: 'Prakasam' },
  { districtId: 'nellore', name: 'S.P.S. Nellore' },
  { districtId: 'chittoor', name: 'Chittoor' },
  { districtId: 'kadapa', name: 'Y.S.R. Kadapa' },
  { districtId: 'anantapur', name: 'Anantapur' },
  { districtId: 'kurnool', name: 'Kurnool' },
];

const FIRST_NAMES = ['Lakshmi', 'Sita', 'Padma', 'Venkata', 'Anitha', 'Sunita', 'Geetha', 'Rama', 'Saroja', 'Manjula', 'Usha', 'Vijaya', 'Padmini', 'Kavitha', 'Swathi'];
const GENDERS = ['Female', 'Female', 'Female'];
const OUTCOMES = ['Normal', 'Normal', 'Normal', 'Normal', 'Abnormal', 'Abnormal', 'Pending'];

function rand(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function riskFor(c) {
  return c > 800 ? 'high' : c > 400 ? 'medium' : 'low';
}

async function seedDistrictStats() {
  await DistrictStats.deleteMany({});
  const docs = AP_DISTRICTS.map((d, i) => {
    const breast = rand(400, 1800);
    const fibroid = rand(300, 1500);
    const pcos = rand(350, 1700);
    const cases = breast + fibroid + pcos;
    return {
      ...d,
      cases,
      casesByDisease: { breast, fibroid, pcos },
      risk: riskFor(cases),
      riskByDisease: {
        breast: riskFor(breast),
        fibroid: riskFor(fibroid),
        pcos: riskFor(pcos),
      },
    };
  });
  await DistrictStats.insertMany(docs);
  const total = docs.reduce((s, d) => s + d.cases, 0);
  console.log(`Seeded ${docs.length} districts, total cases: ${total.toLocaleString()}`);
}

async function seedReports() {
  const existing = await Report.countDocuments();
  const target = 5000;
  if (existing >= target) {
    console.log(`Reports already have ${existing} records (target ${target})`);
    return;
  }
  const toAdd = target - existing;
  const batchSize = 500;
  const districtNames = AP_DISTRICTS.map(d => d.name);
  const reports = [];
  const now = new Date();

  for (let i = 0; i < toAdd; i++) {
    const daysAgo = rand(0, 90);
    const d = new Date(now);
    d.setDate(d.getDate() - daysAgo);
    reports.push({
      visitId: `VISIT-${Date.now()}-${i}`,
      patientId: `P${String(100000 + i).slice(-6)}`,
      patientName: `${FIRST_NAMES[rand(0, FIRST_NAMES.length - 1)]} Devi`,
      patientNumber: `9${String(rand(100000000, 999999999))}`,
      gender: GENDERS[rand(0, GENDERS.length - 1)],
      visitDate: d.toISOString().split('T')[0],
      visitTime: `${String(rand(8, 18)).padStart(2, '0')}:${String(rand(0, 59)).padStart(2, '0')}`,
      video: '',
      report: OUTCOMES[rand(0, OUTCOMES.length - 1)],
    });
    if (reports.length >= batchSize) {
      await Report.insertMany(reports);
      process.stdout.write(`\rReports: ${existing + reports.length} / ${target}`);
      reports.length = 0;
    }
  }
  if (reports.length > 0) {
    await Report.insertMany(reports);
  }
  const total = await Report.countDocuments();
  console.log(`\nSeeded reports: ${total} total`);
}

async function run() {
  try {
    console.log('Starting seed...');
    await seedDistrictStats();
    await seedReports();
    console.log('Seed complete.');
  } catch (err) {
    console.error('Seed error:', err);
  } finally {
    await mongoose.connection.close();
    process.exit(0);
  }
}

run();
