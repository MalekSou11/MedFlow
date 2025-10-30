const express = require("express");
const auth = require("../middlewares/auth");
const permit = require("../middlewares/rbac");
const Prescription = require("../models/Prescription");

const router = express.Router();

// Créer
router.post("/", auth, permit("doctor"), async (req, res) => {
  const p = await Prescription.create({ ...req.body });
  res.json(p);
});

// Lister
router.get("/", auth, permit("admin", "doctor", "patient"), async (req, res) => {
  const list = await Prescription.find().populate("doctor patient", "firstName lastName");
  res.json(list);
});

// Modifier
router.put("/:id", auth, permit("doctor"), async (req, res) => {
  const pres = await Prescription.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(pres);
});

// Supprimer
router.delete("/:id", auth, permit("doctor", "admin"), async (req, res) => {
  await Prescription.findByIdAndDelete(req.params.id);
  res.json({ message: "Prescription deleted" });
});

module.exports = router;
