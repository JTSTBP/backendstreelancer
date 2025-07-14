const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { sendContactEmail, sendSimpleContactEmail,sendcontactcommunityemail }  = require("../utils/mailer");

const User = require("../models/User");
const RegisteredusersDetails = require("../models/userDetails");
const ContactInquiry = require("../models/Contact");
const DEISurvey = require("../models/DeiSurvey");

const router = express.Router();


// Registration
router.post("/register", async(req, res) => {
  const formData = req.body;

  try {
   const user = await User.findOne({ email: formData.personal.email });

 
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

// contact
router.post("/contact", async (req, res) => {
  try {
    const data=req.body
    console.log(data)
    const newContact = new ContactInquiry(data);
    await newContact.save();
   

     await sendSimpleContactEmail(data);
    res.status(200).json({ message: "Contact form submitted successfully" });
  } catch (err) {
    console.error("Contact form error:", err);
    res.status(500).json({ message: "Server error while submitting contact form" });
  }
});


// contactCommunity

router.post("/contactCommunity", async (req, res) => {
  try {
    const data=req.body
    console.log(data)
    const newContact = new ContactInquiry(data);
    await newContact.save();
   

     await sendcontactcommunityemail(data);
    res.status(200).json({ message: "Contact form submitted successfully" });
  } catch (err) {
    console.error("Contact form error:", err);
    res.status(500).json({ message: "Server error while submitting contact form" });
  }
});

// Deisurvey
router.post("/dei-survey", async (req, res) => {
  try {
  
    const newSurvey = new DEISurvey(req.body);
    await newSurvey.save();
    res.status(200).json({ message: "Survey submitted successfully" });
  } catch (error) {
    console.error("Survey submission error:", error);
    res.status(500).json({ message: "Server error while submitting survey" });
  }
});
router.get("/health", (req, res) => {
  res.status(200).json({ message: "Server is running ✅" });
});


// Check if a survey exists for a given email
router.post("/check-dei-survey", async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const existingSurvey = await DEISurvey.findOne({ "info1.email": email });
    console.log(existingSurvey,"existingSurvey")

    if (existingSurvey) {
      return res.status(200).json({ exists: true, message: "Survey found for this email" });
    } else {
      return res.status(200).json({ exists: false, message: "No survey found for this email" });
    }
  } catch (error) {
    console.error("Error checking survey for email:", error);
    res.status(500).json({ message: "Server error while checking survey" });
  }
});

module.exports = router;
