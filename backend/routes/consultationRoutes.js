const express = require("express");
const auth = require("../middlewares/auth");
const permit = require("../middlewares/rbac");
const Consultation = require("../models/Consultation");
const Prescription = require("../models/Prescription");

const router = express.Router();

// Liste toutes les consultations d'un patient avec ses prescriptions
router.get("/patient/:patientId", auth, permit("doctor"), async (req, res) => {
  try {
    const consultations = await Consultation.find({ patient: req.params.patientId })
      .populate("patient", "firstName lastName")
      .sort({ date: -1 });

    const consultationsWithPrescriptions = await Promise.all(
      consultations.map(async (c) => {
        const prescriptions = await Prescription.find({ patient: c.patient._id })
          .populate("doctor", "firstName lastName")
          .sort({ date: -1 });
        return { ...c.toObject(), prescriptions };
      })
    );

    res.json(consultationsWithPrescriptions);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur récupération consultations + ordonnances" });
  }
});

// Créer consultation
router.post("/", auth, permit("doctor"), async (req, res) => {
  try {
    const consult = await Consultation.create({
      ...req.body,
      doctor: req.user._id,
    });
    res.json(consult);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur création consultation" });
  }
});

// Modifier consultation
router.put("/:id", auth, permit("doctor"), async (req, res) => {
  try {
    const updated = await Consultation.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur mise à jour consultation" });
  }
});

module.exports = router;
