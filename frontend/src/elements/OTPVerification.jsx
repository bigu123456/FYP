import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const OTPVerification = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [otp, setOtp] = useState('');
  const [error, setError] = useState(null);
  const email = location.state?.email;

  const handleOTPSubmit = async (e) => {
    e.preventDefault();
    
    // Validate OTP input
    if (!otp) {
      setError("Please enter the OTP.");
      return;
    }

    try {
      // Send the OTP and email to your API endpoint for verification
      const response = await fetch('http://localhost:5000/api/auth/verifyOtp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ otp, email }),
      });

      const data = await response.json();
      
      if (response.ok) {
        // If OTP is verified successfully, navigate to the home page or other desired route
        console.log("OTP verified successfully", data);
        navigate('/'); // redirect to home page after successful OTP verification
      } else {
        // Show error message if OTP verification fails
        setError(data.message);
      }
    } catch (err) {
      // Handle API errors
      setError("OTP verification failed. Please try again.");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleOTPSubmit}
        className="bg-white p-8 rounded-lg shadow-lg w-full max-w-sm"
      >
        <h2 className="text-2xl font-semibold text-center mb-6">Enter OTP</h2>
        
        <div className="mb-4">
          <input
            type="text"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            placeholder="Enter OTP"
            maxLength={6}
            className="w-full px-4 py-2 text-xl border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>
        
        {/* Display error message */}
        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
        
        <div className="mt-6">
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg text-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Verify OTP
          </button>
        </div>
      </form>
    </div>
  );
};

export default OTPVerification;
