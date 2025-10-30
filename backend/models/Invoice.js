const mongoose = require('mongoose');

const invoiceSchema = new mongoose.Schema({
  patient: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient' },
  items: [{ description: String, amount: Number, qty: { type: Number, default: 1 } }],
  total: Number,
  status: { type: String, enum: ['unpaid','paid','partial'], default: 'unpaid' },
  stripePaymentIntentId: String,
  createdAt: { type: Date, default: Date.now },
});

const invoice = mongoose.model("Invoice", invoiceSchema);

module.exports = invoice;
