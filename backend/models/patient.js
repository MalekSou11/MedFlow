const mongoose = require('mongoose');

const patientSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  email: { type: String, lowercase: true },
  contactNumber: String,
  dob: Date,
  gender: { type: String, enum: ['male','female','other'] },
  address: String,
  medicalHistory: [{ date: Date, note: String }],
  files: [{ filename: String, url: String }],
  isDeleting: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

const Patient = mongoose.model("Patient", patientSchema);

module.exports = Patient;