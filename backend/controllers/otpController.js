const nodemailer = require('nodemailer');
const crypto = require('crypto');

const Store = {}; // { [email]: { otp: '123456', expiresAt: Date } }

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'np03cs4s230084@heraldcollege.edu.np',
    pass: 'drvs oidv kutj vtgw'
  }
});

const generateOTP = () => crypto.randomInt(100000, 999999).toString();

const sendOTPEmail = async (email, otp) => {
  const mailOptions = {
    from: 'np03cs4s230084@heraldcollege.edu.np',
    to: email,
    subject: 'Your OTP Code',
    text: `Your OTP code is: ${otp}`
  };
  await transporter.sendMail(mailOptions);
};

const sendOTP = async (req, res) => {
  const { email } = req.body;
  try {
    const otp = generateOTP();
    const expiresAt = Date.now() + 7 * 24 * 60 * 60 * 1000; // 7 days

    Store[email] = { otp, expiresAt };
    await sendOTPEmail(email, otp);
    res.status(200).json({ message: 'OTP sent successfully', success: true });
  } catch (error) {
    console.error('Error generating OTP:', error);
    res.status(500).json({ message: 'Server error', success: false });
  }
};

const verifyOTP = async (req, res) => {
  const { email, otp } = req.body;
  const stored = Store[email];

  if (!stored || Date.now() > stored.expiresAt) {
    return res.status(400).json({ success: false, message: 'OTP expired or invalid' });
  }

  if (stored.otp === otp) {
    Store[email] = null;
    return res.status(200).json({ success: true });
  }

  res.status(400).json({ success: false, message: 'Invalid OTP' });
};

const sendConfirmation = async (to, orderDetails) => {
  const {
    vehicle_brand, vehicle_model, pickup_location, pickup_time,
    dropoff_location, dropoff_time, rental_price,
    driver_name, driver_license
  } = orderDetails;

  const mailOptions = {
    from: 'np03cs4s230084@heraldcollege.edu.np',
    to,
    subject: 'Your Booking Confirmation',
    html: `
      <h2>Booking Confirmed!</h2>
      <h3>Vehicle Details</h3>
      <p><strong>Brand:</strong> ${vehicle_brand}</p>
      <p><strong>Model:</strong> ${vehicle_model}</p>

      <h3>Booking Info</h3>
      <p><strong>Pickup Location:</strong> ${pickup_location}</p>
      <p><strong>Pickup Time:</strong> ${pickup_time}</p>
      <p><strong>Drop-off Location:</strong> ${dropoff_location}</p>
      <p><strong>Drop-off Time:</strong> ${dropoff_time}</p>
      <p><strong>Total Price:</strong> ₹${rental_price}</p>

      ${driver_name ? `
        <h3>Driver Details</h3>
        <p><strong>Name:</strong> ${driver_name}</p>
        <p><strong>License:</strong> ${driver_license}</p>
      ` : `<h3>Driver:</h3><p><em>No driver selected (self-drive).</em></p>`}

      <br/>
      <p>Thank you for booking with us. We hope you have a great trip!</p>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Booking confirmation email sent to user:", to);
  } catch (error) {
    console.error("Error sending booking email to user:", error.message);
  }
};

const sendDriverNotification = async (driverEmail, orderDetails, userDetails) => {
  const {
    driver_name, pickup_location, pickup_time, dropoff_location,
    dropoff_time, vehicle_brand, vehicle_model
  } = orderDetails;

  const mailOptions = {
    from: 'np03cs4s230084@heraldcollege.edu.np',
    to: driverEmail,
    subject: 'New Driving Assignment',
    html: `
      <h2>New Booking Assigned</h2>
      <h3>Driver Info</h3>
      <p><strong>Name:</strong> ${driver_name}</p>

      <h3>Vehicle</h3>
      <p><strong>Brand:</strong> ${vehicle_brand}</p>
      <p><strong>Model:</strong> ${vehicle_model}</p>

      <h3>Booking Info</h3>
      <p><strong>Pickup Location:</strong> ${pickup_location}</p>
      <p><strong>Pickup Time:</strong> ${pickup_time}</p>
      <p><strong>Drop-off Location:</strong> ${dropoff_location}</p>
      <p><strong>Drop-off Time:</strong> ${dropoff_time}</p>

      <h3>User Contact</h3>
      <p><strong>Name:</strong> ${userDetails?.name || 'N/A'}</p>
      <p><strong>Email:</strong> ${userDetails?.email || 'N/A'}</p>

      <p>Please ensure you're on time and contact the user if needed. Thank you!</p>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Booking assignment email sent to driver:", driverEmail);
  } catch (error) {
    console.error("Error sending email to driver:", error.message);
  }
};

module.exports = {
  sendOTP,
  verifyOTP,
  sendConfirmation,
  sendDriverNotification
};
