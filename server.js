const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const authRoutes = require("./routes/auth");

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api", authRoutes);

const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI, )
  .then(() => {
    console.log("MongoDB Connected");
    app.listen(PORT,'0.0.0.0', () => console.log(`Server running on port ${PORT}`));
  })
  .catch(err => console.error(err));
