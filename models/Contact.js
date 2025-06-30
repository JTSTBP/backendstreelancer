const mongoose = require("mongoose");

const contactInquirySchema = new mongoose.Schema({
  company: String,
  name: String,
  email: String,
  regions: [String],
  workModel: String,
  country: String,
  teamSize: Number,
  requirements: String,
  submittedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("ContactInquiry", contactInquirySchema);
