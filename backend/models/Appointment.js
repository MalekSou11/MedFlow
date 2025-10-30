const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
  patient: { type: mongoose.Schema.Types.ObjectId, ref: "Patient", required: true },
  doctor: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  service: { type: String }, // ou ref: "Service" si tu ajoutes un modèle Service
  start: { type: Date, required: true },
  end: { type: Date },
  status: {
    type: String,
    enum: ["scheduled", "confirmed", "cancelled", "done"],
    default: "scheduled",
  },
  notes: String,
  createdAt: { type: Date, default: Date.now },
});

const Appointment = mongoose.model("Appointment", appointmentSchema);


module.exports = Appointment;
