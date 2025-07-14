// const nodemailer = require("nodemailer");

// const transporter = nodemailer.createTransport({
//   service: "gmail",
//   auth: {
//     user: process.env.EMAIL_USER,
//     pass: process.env.EMAIL_PASS,
//   },
//   secure: true, 
// });

// /**
//  * Sends a contact form email
//  * @param {Object} formData - Contact form data
//  * @returns {Promise} - Nodemailer sendMail promise
//  */
// const sendContactEmail = async (formData) => {
//   const { company, name, email,phone, regions, workModel, country, teamSize, requirements } = formData;


//   const mailOptions = {
//     from: process.env.EMAIL_USER,
//     to: process.env.EMAIL_USER, // Change this to your actual receiving email
//     subject: "New Contact Inquiry",
//     html: `
//       <h3>New Contact Form Submission</h3>
//       <p><strong>Company:</strong> ${company}</p>
//       <p><strong>Name:</strong> ${name}</p>
//         <p><strong>Phone Number:</strong> ${phone}</p>
//       <p><strong>Email:</strong> ${email}</p>
//       <p><strong>Regions of Interest:</strong> ${regions.join(", ")}</p>
//       <p><strong>Work Model:</strong> ${workModel}</p>
//       <p><strong>Country:</strong> ${country}</p>
//       <p><strong>Team Size:</strong> ${teamSize}</p>
//       <p><strong>Additional Requirements:</strong><br>${requirements}</p>
//     `,
//   };


//   return transporter.sendMail(mailOptions);
// };

// module.exports = sendContactEmail;


const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  secure: true,
});

/**
 * Sends a detailed contact form email
 * @param {Object} formData - Detailed contact form data
 * @returns {Promise} - Nodemailer sendMail promise
 */
const sendContactEmail = async (formData) => {
  const { company, name, email, phone, regions, workModel, country, teamSize, requirements } = formData;

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: process.env.EMAIL_USER,
    subject: "New Contact Inquiry",
    html: `
      <h3>New Contact Form Submission</h3>
      <p><strong>Company:</strong> ${company}</p>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Phone Number:</strong> ${phone}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Regions of Interest:</strong> ${regions.join(", ")}</p>
      <p><strong>Work Model:</strong> ${workModel}</p>
      <p><strong>Country:</strong> ${country}</p>
      <p><strong>Team Size:</strong> ${teamSize}</p>
      <p><strong>Additional Requirements:</strong><br>${requirements}</p>
    `,
  };

  return transporter.sendMail(mailOptions);
};

/**
 * Sends a simplified contact form email
 * @param {Object} formData - Simplified contact form data
 * @returns {Promise} - Nodemailer sendMail promise
 */
const sendSimpleContactEmail = async (formData) => {
  const { company, name, phone, email, requirements } = formData;

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: process.env.EMAIL_USER,
    subject: "New Simple Contact Inquiry",
    html: `
      <h3>New Contact Form Submission (Simplified)</h3>
      <p><strong>Company:</strong> ${company}</p>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Phone Number:</strong> ${phone}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Requirements:</strong><br>${requirements}</p>
    `,
  };

  return transporter.sendMail(mailOptions);
};


const sendcontactcommunityemail = async (formData) => {
  const {  name, phone, email, message } = formData;

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: process.env.EMAIL_USER,
    subject: "New Simple Contact Inquiry",
    html: `
      <h3>New Contact Form Submission (Simplified)</h3>
    
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Phone Number:</strong> ${phone}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Requirements:</strong><br>${message}</p>
    `,
  };

  return transporter.sendMail(mailOptions);
};

module.exports = { sendContactEmail, sendSimpleContactEmail,sendcontactcommunityemail };
