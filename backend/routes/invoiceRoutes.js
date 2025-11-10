const express = require("express");
const auth = require("../middlewares/auth.js");
const permit = require("../middlewares/rbac.js");
const Invoice = require("../models/Invoice.js");

const router = express.Router();

// Créer une facture
router.post("/", auth, permit("receptionist", "admin"), async (req, res) => {
  const invoice = await Invoice.create({ ...req.body });
  res.json(invoice);
});
// invoiceRoutes.js
router.get("/", auth, permit("admin", "receptionist", "doctor"), async (req, res) => {
  const invoices = await Invoice.find()
    .populate("patient", "firstName lastName"); 
  res.json(invoices);
});



// Modifier statut (payer)
router.put("/:id", auth, permit("receptionist", "admin"), async (req, res) => {
  const invoice = await Invoice.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(invoice);
});

// Supprimer
router.delete("/:id", auth, permit("admin"), async (req, res) => {
  await Invoice.findByIdAndDelete(req.params.id);
  res.json({ message: "Invoice deleted" });
});

module.exports = router;
