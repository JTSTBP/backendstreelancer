const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    image: { type: String }, // base64 or URL
  },
  { timestamps: true }
);

module.exports = mongoose.model("blogs", PostSchema);
