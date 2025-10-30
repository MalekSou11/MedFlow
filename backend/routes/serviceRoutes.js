const express = require("express");
const auth = require("../middlewares/auth");
const permit = require("../middlewares/rbac");
const Service = require("../models/Service");

const router = express.Router();

// Créer service
router.post("/", auth, permit("admin"), async (req, res) => {
  const service = await Service.create({ ...req.body, clinicId: req.user.clinicId });
  res.json(service);
});

// Lister services
router.get("/", auth, permit("admin", "receptionist", "doctor"), async (req, res) => {
  const list = await Service.find({ clinicId: req.user.clinicId });
  res.json(list);
});

// Modifier
router.put("/:id", auth, permit("admin"), async (req, res) => {
  const service = await Service.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(service);
});

// Supprimer
router.delete("/:id", auth, permit("admin"), async (req, res) => {
  await Service.findByIdAndDelete(req.params.id);
  res.json({ message: "Service deleted" });
});

module.exports = router;
