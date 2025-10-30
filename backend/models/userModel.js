const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },
  firstName: { type: String },
  lastName: { type: String },
  contactNumber: { type: String },
  role: {
    type: String,
    enum: ["admin", "doctor", "receptionist", "patient"],
    default: "patient",
  },
  isDeleting: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

const User = mongoose.model("User", userSchema);

module.exports = User;