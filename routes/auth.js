const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const sendContactEmail = require("../utils/mailer");
const User = require("../models/User");
const RegisteredusersDetails = require("../models/userDetails");
const ContactInquiry = require("../models/Contact");

const router = express.Router();


// Registration
router.post("/register", async(req, res) => {
  const formData = req.body;

  try {
   const user = await User.findOne({ email: formData.personal.email });

    console.log(user,"user")
    if (!user) return res.status(400).json({ message: "Email is not Registered" });
   
    const newUser = new RegisteredusersDetails(formData);
    await newUser.save();
 res.json({ message: "Registered successful" });
  } catch (error) {
    res.status(500).json({ message: "Server error during Registration" });
  }
 

});


// Signup
router.post("/signup", async (req, res) => {
  const { fullName, gender, jobStatus, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "Email already registered" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      fullName,
      gender,
      jobStatus,
      email,
      password: hashedPassword,
    });

    await newUser.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error during signup" });
  }
});

// Login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
   
    if (!user) return res.status(400).json({ message: "Email is not Registered" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1d" });

    res.json({ message: "Login successful", token });
  } catch (error) {
    res.status(500).json({ message: "Server error during login" });
  }
});


router.post("/contact", async (req, res) => {
  try {
    const newContact = new ContactInquiry(req.body);
    await newContact.save();
   

     await sendContactEmail(req.body);
    res.status(200).json({ message: "Contact form submitted successfully" });
  } catch (err) {
    console.error("Contact form error:", err);
    res.status(500).json({ message: "Server error while submitting contact form" });
  }
});

module.exports = router;
