const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  // Personal Information
  personal: {
    firstName: { type: String, required: true },
    lastName: { type: String },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    gender: { type: String, required: true },
    country: { type: String, required: true },
    city: { type: String, required: true },
    careerBreak: { type: String }, // e.g., "on" if selected
    deiIdentities: [{ type: String }], // e.g., ['woman', 'bipoc']
  },

  // Professional Details
  professional: {
    education: { type: String }, // e.g., "bachelor"
    industries: [{ type: String }], // e.g., ["Technology", "Marketing & Advertising"]
    roles: [{ type: String }], // e.g., ["Frontend"]
    skills: [{ type: String }], // e.g., ["Microsoft Office"]
  },

  // Preferences
  preferences: {
    experience: { type: String }, // e.g., "entry"
    workTracks: [{ type: String }], // e.g., ["remote", "leadership"]
  },

  // Availability
  availability: {
    workAvailability: { type: String }, // e.g., "full"
    startTime: { type: String }, // e.g., "Immediately"
    devices: [{ type: String }], // e.g., ["Laptop/Desktop Computer"]
    internet: { type: String }, // e.g., "high"
    trainingNeeds: [{ type: String }], // e.g., ["Technical skills"]
  },

  // Portfolio & Resume
  portfolio: {
    resume: {
    fileName: String,
    fileType: String,
    fileData: String, // Base64
  },
    portfolio: { type: String },
    linkedin: { type: String },
    workSamples: [{ type: String }], // optional list of sample links
    additionalInfo: { type: String },
  },

  // Almost Done
  almostDone: {
    joinCommunity: { type: Boolean, default: false },
    preferences: {
      jobMatches: { type: Boolean, default: false },
      training: { type: Boolean, default: false },
      events: { type: Boolean, default: false },
      news: { type: Boolean, default: false },
    },
    agreeTerms: { type: Boolean, default: false },
  },

  // Timestamp
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("RegisteredusersDetails", userSchema);
