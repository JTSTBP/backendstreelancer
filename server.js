

const path = require('path');
const envFile = process.env.NODE_ENV === 'production' ? '.env.production' : '.env.development'
require('dotenv').config({ path: path.resolve(process.cwd(), envFile) });


const express = require("express");
const mongoose = require("mongoose");

const cors = require("cors");
const authRoutes = require("./routes/auth");
const dataRoutes = require("./routes/data");
const adminroutes = require("./routes/admin");


console.log("✅ NODE_ENV:", process.env.NODE_ENV);

const app = express();

// Increase JSON and URL encoded limits
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

app.use(cors());

// Static folder
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Routes
app.use("/admin", adminroutes);
app.use("/api", authRoutes);
app.use("/api/data", dataRoutes);

const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB Connected");
    app.listen(PORT, '0.0.0.0', () => console.log(`Server running on port ${PORT}`));
  })
  .catch(err => console.error(err));
