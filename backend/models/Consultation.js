const mongoose = require("mongoose");

const consultationSchema = new mongoose.Schema({
  patient: { type: mongoose.Schema.Types.ObjectId, ref: "Patient", required: true },
  doctor: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  notes: String,
  diagnosis: String,
  prescriptions: [{ type: mongoose.Schema.Types.ObjectId, ref: "Prescription" }],
  date: { type: Date, default: Date.now },
});

const Consultation = mongoose.model("Consultation", consultationSchema);

module.exports = Consultation;
