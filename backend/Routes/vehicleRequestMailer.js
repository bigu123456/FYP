// vehicleRequestMailer.js

const nodemailer = require('nodemailer');

// Reuse your transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'np03cs4s230084@heraldcollege.edu.np',
    pass: 'drvs oidv kutj vtgw'
  }
});

const sendVehicleRequestStatusUpdate = async (to, vehicleDetails, status) => {
  const { brand, model } = vehicleDetails;

  const statusMessage = {
    approved: {
      title: "Congratulations!",
      body: "Your vehicle has been approved and is now listed on our platform."
    },
    rejected: {
      title: "We're Sorry",
      body: "Your vehicle request was rejected. Please contact support for further details."
    },
    pending: {
      title: "Request Pending",
      body: "Your request is pending review. We'll get back to you soon."
    }
  };

  const selectedStatus = statusMessage[status] || {
    title: "Status Update",
    body: "Your vehicle request status has been updated."
  };

  const mailOptions = {
    from: 'np03cs4s230084@heraldcollege.edu.np',
    to,
    subject: `Vehicle Request ${status.charAt(0).toUpperCase() + status.slice(1)}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee;">
        <h2 style="color: #4CAF50;">${selectedStatus.title}</h2>
        <p><strong>Vehicle:</strong> ${brand} ${model}</p>
        <p>${selectedStatus.body}</p>
        <br/>
        <p style="font-size: 14px; color: gray;">Thank you for being a part of our platform!</p>
      </div>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Vehicle request status email sent to: ${to}`);
  } catch (error) {
    console.error("Error sending vehicle request update email:", error.message);
  }
};

module.exports = {
  sendVehicleRequestStatusUpdate
};
