const mongoose = require('mongoose');
//const patientId = 'patient_id_from_previous_record';  // Example patientId

// Create a new Visit ID
//const visitId = generateVisitId(patientId);  
const visitSchema = new mongoose.Schema({
  visitId: { type: String, unique: true, required: true },  // Unique visit ID
  patient: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },  // Patient's unique ID
  visitDate: { type: Date, default: Date.now },  // The date of the visit

  // MRI Scans, Reports, and Videos linked to the visit
  frames:{
    framesDetected :{ type: String },
    framesAll : {type : String}
  } , // URL or path to the MRI scan (stored in Azure Blob Storage)
  report: { type: String },  // URL or path to the report file (stored in Azure Blob Storage)
  video: { type: String },  // URL or path to the video (stored in Azure Blob Storage)

   // Additional notes for the visit
});

visitSchema.pre("save", function (next) {
  if (!this.visitId) {
    const now = new Date();
    const day = String(now.getDate()).padStart(2, "0");
    const month = String(now.getMonth() + 1).padStart(2, "0"); // Months are 0-indexed
    const year = now.getFullYear();
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");

    // Construct the visitId
    this.visitId = `SETV-KUNMRI-${day}${month}${year}${hours}${minutes}`;
  }
  next();
});




const Visit = mongoose.model('Visit', visitSchema);

module.exports = Visit;