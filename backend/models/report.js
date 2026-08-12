const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
    visitId: String,
    patientId: String,
    patientName: String,
    patientNumber: String,
    gender : String,
    visitDate: String,
    visitTime: String,
    video:String,
    report: String,
  });

const ReportSchema= mongoose.model('Report',reportSchema);
module.exports = ReportSchema;