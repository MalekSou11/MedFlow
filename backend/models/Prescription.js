const mongoose = require('mongoose');

const prescriptionSchema = new mongoose.Schema({
  patient: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
  doctor: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  medicines: [{ name: String, dose: String, frequency: String, duration: String }],
  notes: String,
  date: { type: Date, default: Date.now },
});

const Prescription = mongoose.model("Prescription", prescriptionSchema);

module.exports = Prescription;
