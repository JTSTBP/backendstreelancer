const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { sendContactEmail, sendSimpleContactEmail,sendcontactcommunityemail }  = require("../utils/mailer");
const { OAuth2Client } = require('google-auth-library');
const User = require("../models/User");
const RegisteredusersDetails = require("../models/userDetails");
const ContactInquiry = require("../models/Contact");
const DEISurvey = require("../models/DeiSurvey");
const axios = require('axios');



const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);


const router = express.Router();



router.post('/google-login', async (req, res) => {
  const { access_token } = req.body;

  try {
    const ticket = await client.getTokenInfo(access_token);
    const email = tokenInfo.email;

    if (!email) {
      return res.status(400).json({ message: "Invalid Google access token" });
    }

    // Check if user exists in your database
    let user = await User.findOne({ email });

    let isNewUser = false;

    if (!user) {
      // Create a new user
      user = new User({
        email,
        isGoogleUser: true,
        registrationCompleted: false, // You can customize based on your logic
      });

      await user.save();
      isNewUser = true;
    }

    // Generate your own JWT token
    const token = jwt.sign({ userId: user._id, email: user.email }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.status(200).json({
      message: "Google login successful",
      token,
      isNewUser,
    });
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: "Invalid Google token" });
  }
});


// Linkdin login

const LINKEDIN_REDIRECT_URI =
   process.env.NODE_ENV === 'development'
    ? 'http://localhost:5000/api/linkedin/callback'
    :`${process.env.REACT_APP_BACKEND_URL}/api/linkedin/callback`;

    const frontend_URL =
   process.env.NODE_ENV === 'development'
    ? 'http://localhost:3000'
    :process.env.CLIENT_REDIRECT_URI;
 console.log("NODE_ENV:", process.env.NODE_ENV);


// get userData
const getUserData=async(accessToken)=>{
const response = await fetch("https://api.linkedin.com/v2/userinfo",
  {
    method:"get",
    headers:{
      Authorization:`Bearer ${accessToken}`
    }
  }
)
if(!response.ok){
    throw new Error(response.statusText)
  }
  const userData= await response.json()
  return userData

}

// getaccesstoken fun
const getAccessToken=async(code)=>{
const body =new URLSearchParams({
  grant_type:"authorization_code",
  code:code,
  client_id:process.env.REACT_LINKEDIN_CLIENT_ID,
  client_secret:process.env.REACT_LINKEDIN_CLIENT_SECRET,
  redirect_uri:LINKEDIN_REDIRECT_URI

})

  const response=await fetch("https://www.linkedin.com/oauth/v2/accessToken" , {
    method:"post",
    headers:{
      "Content-type":"application/x-www-form-urlencoded"
    },
    body:body.toString()
  })
  console.log(LINKEDIN_REDIRECT_URI,"LINKEDIN_REDIRECT_URI",frontend_URL )
  if(!response.ok){
    throw new Error(response.statusText)
  }
  const accessToken= await response.json()
  return accessToken
}

router.get("/linkedin/callback",async(req,res)=>{
try {
  const {code}=req.query
  // get accesstoken
  const accessToken=await getAccessToken(code)

// get userData from accesstoken
const userData=await getUserData(accessToken.access_token)


 const email = userData.email;
    if (!email) {
      return res.status(400).json({ message: "Unable to retrieve email from LinkedIn" });
    }

    let user = await User.findOne({ email });
    let isNewUser = false;

     if (!user) {
      // Step 4: Create new user if not found
      user = new User({
        email,
        name: userData.name,
        isLinkedInUser: true,
        registrationCompleted: false,
        profilePicture: userData.picture,
      });

      await user.save();
      isNewUser = true;
    }
     const token = jwt.sign({ userId: user._id, email: user.email }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

 res.redirect(`${frontend_URL}/linkedin-success?token=${token}&isNewUser=${isNewUser}`);

} catch (error) {
  console.error(error);
    res.status(500).json({ message: "LinkedIn login failed", error });
  
}
})


// Registration
router.post("/register", async(req, res) => {
  const formData = req.body;

  try {
   const user = await User.findOne({ email: formData.personal.email });
   const reguser=await RegisteredusersDetails.findOne({ "personal.email":formData.personal.email });
console.log(user,reguser)
 
    if (!user) return res.status(400).json({ message: "No account with this Email please create account" });
   if(reguser) return res.status(400).json({ message: "Email is already registered please use the same email which you create your account" });
   
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

const CLIENT_URL = process.env.CLIENT_REDIRECT_URI;
const linkdin =
  process.env.NODE_ENV === "development"
    ? "http://localhost:5000/api/linkedin/callback"
    : `${CLIENT_URL}/api/linkedin/callback`;
    
router.get("/health", (req, res) => {
  res.status(200).json({ message: "Server is running ✅",
    environment: process.env.NODE_ENV,
    clientURL: CLIENT_URL,
    linkedinCallback: linkdin, });
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

// DELETE a user by ID
router.delete("/delete-user/:id", async (req, res) => {
  try {

const deletedDetails = await RegisteredusersDetails.findByIdAndDelete(req.params.id);
const emaildel=deletedDetails.personal.email
const deletedUser = await User.findOneAndDelete({ email:emaildel });
console.log(emaildel)
console.log('Deleted user:', deletedUser);
console.log('Deleted user details:', deletedDetails);
    res.json({ message: "User deleted successfully." });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ message: "Server error deleting user." });
  }
});


module.exports = router;
