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
 * Sends a contact form email
 * @param {Object} formData - Contact form data
 * @returns {Promise} - Nodemailer sendMail promise
 */
const sendContactEmail = async (formData) => {
  const { company, name, email, regions, workModel, country, teamSize, requirements } = formData;


  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: process.env.EMAIL_USER, // Change this to your actual receiving email
    subject: "New Contact Inquiry",
    html: `
      <h3>New Contact Form Submission</h3>
      <p><strong>Company:</strong> ${company}</p>
      <p><strong>Name:</strong> ${name}</p>
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

module.exports = sendContactEmail;
