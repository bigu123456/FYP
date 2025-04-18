const nodemailer = require('nodemailer');
const crypto = require('crypto');
const pool = require('../db/Connection');



const Store = {};

// Email transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'np03cs4s230084@heraldcollege.edu.np',
    pass: 'drvs oidv kutj vtgw'
  }
});

// OTP generation
const generateOTP = () => crypto.randomInt(100000, 999999).toString();

// Send OTP email
const sendOTPEmail = async (email, otp) => {
  const mailOptions = {
    from: 'np03cs4s230084@heraldcollege.edu.np',
    to: email,
    subject: 'Your OTP Code',
    text: `Your OTP code is: ${otp}`
  };

  await transporter.sendMail(mailOptions);
};

// Public: Send OTP handler
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

// Public: Verify OTP handler
const verifyOTP = async (req, res) => {
  const { otp, email } = req.body;

  if (Store[email] === otp) {
    res.status(200).json({ success: true });
    Store[email] = null;
  } else {
    res.status(400).json({ success: false, message: 'Invalid OTP' });
  }
};

const sendBookingConfirmation = async (to, orderDetails) => {
  const {
    vehicle_brand,
    vehicle_model,
    pickup_location,
    pickup_time,
    dropoff_location,
    dropoff_time,
    rental_price,
    driver_name,
    driver_phone,
    driver_license
  } = orderDetails;

  const mailOptions = {
    from: 'np03cs4s230084@heraldcollege.edu.np',
    to,
    subject: 'Your Booking Confirmation',
    html: `
      <h2> Booking Confirmed!</h2>

      <h3> Vehicle Details</h3>
      <p><strong>Brand:</strong> ${vehicle_brand}</p>
      <p><strong>Model:</strong> ${vehicle_model}</p>

      <h3> Booking Info</h3>
      <p><strong>Pickup Location:</strong> ${pickup_location}</p>
      <p><strong>Pickup Time:</strong> ${pickup_time}</p>
      <p><strong>Drop-off Location:</strong> ${dropoff_location}</p>
      <p><strong>Drop-off Time:</strong> ${dropoff_time}</p>
      <p><strong>Total Price:</strong> $${rental_price}</p>

      ${driver_name ? `
        <h3> Driver Details</h3>
        <p><strong>Name:</strong> ${driver_name}</p>
        <p><strong>Phone:</strong> ${driver_phone}</p>
        <p><strong>License:</strong> ${driver_license}</p>
      ` : `
        <h3> Driver:</h3>
        <p><em>No driver selected (self-drive).</em></p>
      `}

      <br/>
      <p>Thank you for booking with us. We hope you have a great trip!</p>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Booking confirmation email sent to:", to);
  } catch (error) {
    console.error("Error sending booking email:", error.message);
  }
};



module.exports = { sendOTP, verifyOTP, sendBookingConfirmation };
