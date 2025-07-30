const express = require("express");
const router = express.Router();
const Industry = require("../models/data/industries");

// Create new Industry
router.post("/industries/new", async (req, res) => {
  try {
   
    const industry = new Industry({ name: req.body.name });
    await industry.save();
    res.status(201).json(industry);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get all Industries
router.get("/getindustries", async (req, res) => {
  try {
    const industries = await Industry.find().sort({ name: 1 });
    res.status(200).json(industries);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update Industry
router.put("/industries/:id", async (req, res) => {
  try {
    const industry = await Industry.findByIdAndUpdate(
      req.params.id,
      { name: req.body.name },
      { new: true }
    );
    if (!industry) return res.status(404).json({ message: "Industry not found" });
    res.status(200).json(industry);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete Industry
router.delete("/industries/:id", async (req, res) => {
  try {
    const industry = await Industry.findByIdAndDelete(req.params.id);
    if (!industry) return res.status(404).json({ message: "Industry not found" });
    res.status(200).json({ message: "Industry deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
