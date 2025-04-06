// src/components/OTPVerification.jsx
import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';

const OTPVerification = () => {
  const location = useLocation();
  const [otp, setOtp] = useState('');
  const [error, setError] = useState(null);
  const email = location.state?.email;

  const handleOTPSubmit = async (e) => {
    e.preventDefault();
    if (!otp) {
      setError("Please enter the OTP.");
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp }),
      });

      const data = await response.json();
      if (response.ok) {
        console.log("OTP verified", data);
        // Redirect to dashboard or home page after successful login
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError("OTP verification failed.");
    }
  };

  return (
    <div>
      <h2>Enter OTP</h2>
      <form onSubmit={handleOTPSubmit}>
        <input
          type="text"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          placeholder="Enter OTP"
        />
        {error && <p className="text-red-500">{error}</p>}
        <button type="submit">Verify OTP</button>
      </form>
    </div>
  );
};

export default OTPVerification;
