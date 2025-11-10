const express = require("express");
const auth = require("../middlewares/auth");
const permit = require("../middlewares/rbac");
const Appointment = require("../models/Appointment");

const router = express.Router();

// Créer rendez-vous
router.post("/", auth, permit("receptionist", "admin", "patient"), async (req, res) => {
  const appt = await Appointment.create({ ...req.body });
  res.json(appt);
});

// Lister
router.get("/", auth, permit("admin", "receptionist", "doctor"), async (req, res) => {
  const list = await Appointment.find()
    .populate("patient doctor", "firstName lastName");
  res.json(list);
});

// Modifier
router.put("/:id", auth, permit("receptionist", "admin"), async (req, res) => {
  const updated = await Appointment.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(updated);
});

// Supprimer
router.delete("/:id", auth, permit("admin"), async (req, res) => {
  await Appointment.findByIdAndDelete(req.params.id);
  res.json({ message: "Appointment deleted" });
});

module.exports = router;
