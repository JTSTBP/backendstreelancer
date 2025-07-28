const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  fullName: { type: String },
  gender: { type: String, },
  jobStatus: { type: String, },
  email: { type: String, unique: true },
  password: { type: String, },
  isGoogleUser:{type:Boolean},
  registrationCompleted:{type:Boolean},
  isLinkedInUser:{type:Boolean},
  profilePicture: { type: String },
});

module.exports = mongoose.model("Registeredusers", userSchema);
