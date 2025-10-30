const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const permit = require('../middlewares/rbac');
const Patient = require('../models/patient');

// créer patient (receptionist, admin)
router.post('/', auth, permit('admin', 'receptionist'), async (req, res) => {
  const p = await Patient.create({ ...req.body, clinicId: req.user.clinicId });
  res.json(p);
});

// lister patients (tous roles autorisés)
router.get('/', auth, permit('admin', 'receptionist', 'doctor'), async (req, res) => {
  const patients = await Patient.find({ clinicId: req.user.clinicId });
  res.json(patients);
});

// get patient
router.get('/:id', auth, permit('admin', 'receptionist', 'doctor', 'patient'), async (req, res) => {
  const p = await Patient.findById(req.params.id);
  res.json(p);
});

// update
router.put('/:id', auth, permit('admin', 'receptionist', 'doctor'), async (req, res) => {
  const p = await Patient.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(p);
});

// delete (soft delete)
router.delete('/:id', auth, permit('admin'), async (req, res) => {
  await Patient.findByIdAndUpdate(req.params.id, { isDeleting: true });
  res.json({ message: 'deleted' });
});

module.exports = router;
