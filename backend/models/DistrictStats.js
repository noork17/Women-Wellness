const mongoose = require('mongoose');

const districtStatsSchema = new mongoose.Schema({
  districtId: { type: String, unique: true, required: true },
  name: { type: String, required: true },
  cases: { type: Number, default: 0 },
  casesByDisease: {
    breast: { type: Number, default: 0 },
    fibroid: { type: Number, default: 0 },
    pcos: { type: Number, default: 0 },
  },
  risk: { type: String, enum: ['low', 'medium', 'high'], default: 'low' },
  riskByDisease: {
    breast: { type: String, enum: ['low', 'medium', 'high'], default: 'low' },
    fibroid: { type: String, enum: ['low', 'medium', 'high'], default: 'low' },
    pcos: { type: String, enum: ['low', 'medium', 'high'], default: 'low' },
  },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('DistrictStats', districtStatsSchema);
