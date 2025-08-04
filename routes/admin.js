const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/User");
const RegisteredusersDetails = require("../models/userDetails");
const blogs = require("../models/blogs");
const Admin = require("../models/admin");


router.post("/admin-login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const admin = await Admin.findOne({ email });
    if (!admin) return res.status(400).json({ message: "Admin not found" });

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { id: admin._id, email: admin.email, role: admin.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({ message: "Admin login successful", token });
  } catch (error) {
    res.status(500).json({ message: "Error during admin login", error });
  }
});

// Create dummy admin once
router.post("/create-dummy-admin", async (req, res) => {
  try {
    const existingAdmin = await Admin.findOne({ email: "admin@streelancer.com" });
    if (existingAdmin) return res.status(400).json({ message: "Admin already exists" });

    const hashedPassword = await bcrypt.hash("Admin@123", 10);

    const newAdmin = new Admin({
      fullName: "Super Admin",
      email: "admin@streelancer.com",
      password: hashedPassword,
    });

    await newAdmin.save();
    res.status(201).json({ message: "Dummy admin created successfully ✅" });
  } catch (error) {
    res.status(500).json({ message: "Error creating admin", error });
  }
});

// get all users
router.get("/allusers", async (req, res) => {
  try {
    const users = await User.find(); // fetch all documents
    res.json(users); // send them as JSON array
  } catch (error) {
    console.error("Error fetching all users:", error);
    res.status(500).json({ message: "Server error fetching All users." });
  }
});

// Get ALL registered users' details
router.get("/registered-users", async (req, res) => {
  try {
    const users = await RegisteredusersDetails.find(); // fetch all documents
    res.json(users); // send them as JSON array
  } catch (error) {
    console.error("Error fetching registered users:", error);
    res.status(500).json({ message: "Server error fetching registered users." });
  }
});

router.delete("/delete-user/:id", async (req, res) => {
  const { type } = req.query;  // "User" or "RegisteredusersDetails"
  const userId = req.params.id;

  try {
    let email = null;

    if (type === "RegisteredusersDetails") {
      // Try deleting from RegisteredusersDetails first
      const deletedDetails = await RegisteredusersDetails.findByIdAndDelete(userId);
      if (deletedDetails) {
        email = deletedDetails.personal?.email;
      }
    } 
    else if (type === "User") {
      // Try deleting from User first
      const deletedUser = await User.findByIdAndDelete(userId);
      if (deletedUser) {
        email = deletedUser.email;
      }
    } 
    else {
      return res.status(400).json({ message: "Invalid type parameter." });
    }

    // If email found, delete from the other collection too
    if (email) {
      await User.findOneAndDelete({ email });  // safe delete, won't throw if not found
      await RegisteredusersDetails.findOneAndDelete({ "personal.email": email });
    }

    return res.json({ message: "User deleted from both collections if existed." });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ message: "Server error deleting user." });
  }
});




router.post("/blogpost", async (req, res) => {
  try {
    const { title, content, image } = req.body;
    if (!title || !content)
      return res.status(400).json({ message: "Title and content are required" });

    const blog = new blogs({ title, content, image });
    await blog.save();

    res.status(201).json({ message: "Post created successfully", blogs });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Fetch all posts
router.get("/allblogs", async (req, res) => {
  try {
    const posts = await blogs.find().sort({ createdAt: -1 });
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
