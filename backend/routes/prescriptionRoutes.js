const express = require("express");
const auth = require("../middlewares/auth");
const permit = require("../middlewares/rbac");
const Prescription = require("../models/Prescription");
const PDFDocument = require("pdfkit"); // pour générer le PDF

const router = express.Router();

// ✅ Créer une prescription (docteur uniquement)
router.post("/", auth, permit("admin"), async (req, res) => {
  try {
    const p = await Prescription.create({ ...req.body });
    res.json(p);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur lors de la création de la prescription" });
  }
});

// ✅ Lister les prescriptions (admin, docteur, patient)
router.get("/", auth, permit("admin", "doctor", "patient"), async (req, res) => {
  try {
    const list = await Prescription.find()
      .populate("doctor patient", "firstName lastName");
    res.json(list);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur lors de la récupération des prescriptions" });
  }
});

// ✅ Modifier une prescription (docteur)
router.put("/:id", auth, permit("admin"), async (req, res) => {
  try {
    const pres = await Prescription.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(pres);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur lors de la modification de la prescription" });
  }
});

// ✅ Supprimer une prescription (docteur ou admin)
router.delete("/:id", auth, permit("doctor", "admin"), async (req, res) => {
  try {
    await Prescription.findByIdAndDelete(req.params.id);
    res.json({ message: "Prescription deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur lors de la suppression de la prescription" });
  }
});

// ✅ Télécharger une prescription en PDF (tous les rôles autorisés)
router.get("/:id/pdf", auth, permit("admin", "doctor", "patient"), async (req, res) => {
  try {
    const pres = await Prescription.findById(req.params.id)
      .populate("doctor patient", "firstName lastName");

    if (!pres) return res.status(404).json({ message: "Prescription not found" });

    // En-têtes HTTP
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="prescription-${pres._id}.pdf"`
    );

    // Création du PDF
    const doc = new PDFDocument();
    doc.pipe(res);

    // 🩺 Entête
    doc.fontSize(22).text("Ordonnance Médicale", { align: "center" });
    doc.moveDown();

    doc.fontSize(14).text(`Patient : ${pres.patient.firstName} ${pres.patient.lastName}`);
    doc.text(`Médecin : ${pres.doctor.firstName} ${pres.doctor.lastName}`);
    doc.text(`Date : ${new Date(pres.createdAt).toLocaleDateString()}`);
    doc.moveDown();

    doc.fontSize(16).text("Prescription :", { underline: true });
    doc.moveDown();

    if (Array.isArray(pres.medicines) && pres.medicines.length > 0) {
      pres.medicines.forEach((m, index) => {
        // Affiche le nom et les détails si disponibles
        doc.fontSize(14).text(
          `${index + 1}. ${m.name}${m.dose ? `, Dose: ${m.dose}` : ''}${m.frequency ? `, Fréquence: ${m.frequency}` : ''}${m.duration ? `, Durée: ${m.duration}` : ''}`
        );
      });
    } else {
      doc.text("Aucun médicament enregistré.");
    }

    doc.end();
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur lors de la génération du PDF" });
  }
});

module.exports = router;
