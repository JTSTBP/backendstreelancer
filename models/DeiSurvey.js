const mongoose = require("mongoose");

const deiSurveySchema = new mongoose.Schema({
  info1: {
    companyName: String,
    industry: String,
    companySize: String,
    fullName: String,
    email: String,
  },
  info2: {
    employeeNote: String,
    employeeCount: String,
    selectedGroups: [String],
  },
  info3: {
    selectedPolicies: [String],
  },
  info4: {
    metrics: Number,
    leadership: Number,
  },
  info5: {
    metrics: [String],
    hasGoals: Boolean,
    hasCouncil: Boolean,
    budget: String,
  },
  info6: {
    consentGiven: Boolean,
  },
  submittedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("DEISurvey", deiSurveySchema);
