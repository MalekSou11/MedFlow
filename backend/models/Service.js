const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  price: {
    type: Number,
    required: true
  },
  duration: {
    type: Number, // durée en minutes
    default: 30
  },
  clinicId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // ou un modèle Clinic si tu en as un
    required: true
  },
  isDeleting: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

module.exports = mongoose.model('Service', serviceSchema);

const Service = mongoose.model("Service", serviceSchema);

module.exports = Service;
