const nodemailer = require('nodemailer');
const crypto = require('crypto');
const pool = require('../db/Connection'); 

const Store = {};
// Create a transporter for sending OTP emails
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'np03cs4s230084@heraldcollege.edu.np', // Use your email
    pass: 'drvs oidv kutj vtgw'  // Use the correct email password or app password
  }
});

// Function to generate OTP
const generateOTP = () => {
  return crypto.randomInt(100000, 999999).toString(); // 6-digit OTP
};

// Send OTP email
const sendOTPEmail = async (email, otp) => {
  const mailOptions = {
    from: 'np03cs4s230084@heraldcollege.edu.np',
    to: email,
    subject: 'Your OTP Code',
    text: `Your OTP code is: ${otp}`
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    throw new Error('Error sending OTP email');
  }
};

// Generate OTP and send email
const sendOTP = async (req, res) => {
  const { email } = req.body;

  try {
    const otp = generateOTP();

    Store[email] = otp; 

    await sendOTPEmail(email, otp);    

    res.status(200).json({ message: 'OTP sent successfully', success: true });
  } catch (error) {
    console.error('Error generating OTP:', error);
    res.status(500).json({ message: 'Server error', success: false });
  }
};



const verifyOTP = async (req, res) => {
  const { otp, email } = req.body; // Include email in the request body
  console.log(otp, email)
  // Ensure the OTP is verified correctly
  if (Store[email] === otp) { // Assuming you store OTP in a mapping by email
    res.status(200).json({ success: true });
    Store[email] = null; 
  } else {
    res.status(400).json({ success: false, message: 'Invalid OTP' });
  }
};



module.exports = { sendOTP, verifyOTP };
