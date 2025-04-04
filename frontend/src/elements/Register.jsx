import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Import useNavigate from react-router-dom
import Logo from '../images/nav-logo.png';
import LoginPhoto from "../images/loginimage.png";
import MailLogo from "../images/mail.svg";
import PasswordLogo from "../images/password.svg";
import GoogleLogo from "../images/google.svg";
import "../App.css";
import { validateRegistration } from './validateRegistration';

const RegisterPage = () => {
  const navigate = useNavigate(); // Initialize useNavigate
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [number, setNumber] = useState('');
  const [city, setCity] = useState('');
  const [age, setAge] = useState('');
  const [error, setError] = useState('');

  const submithandler = async (e) => {
    e.preventDefault();

    // Validate the form data
    const errors = validateRegistration({ name, email, password, confirmPassword, number, city, age });
    if (errors.length > 0) {
      setError(errors.join(', '));
      return;
    }
    setError(""); // Clear the error message

    // Prepare the data to be sent
    const userData = { name, email, password, contact_number: number, city, age };

    try {
      const response = await fetch("http://localhost:5000/api/register", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        throw new Error('Failed to register user');
      }

      const data = await response.json();
      alert('User registered successfully:', data);

      // Redirect to the login page after successful registration
      navigate("/login"); // This will redirect to the login page
    } catch (error) {
      setError('Registration failed. Please try again.');
      console.error('Error during registration:', error);
    }

    // Reset form fields after submission
    setName('');
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setNumber('');
    setCity('');
    setAge('');
  };

  return (
    <form onSubmit={submithandler}>
      <div className="relative flex min-h-screen">
        {/* Left Side (Image + Orange Background) */}
        <div className="relative w-1/2 bg-orange-600 flex items-center justify-center">
          <img src={LoginPhoto} alt="Car" className="w-[85%] h-auto" />
        </div>

        {/* Right Side (Form) */}
        <div className="w-1/2 flex flex-col items-center justify-center bg-white p-10">
          {/* Logo */}
          <img src={Logo} alt="Logo" className="w-[100px] mb-5" />

          {/* Title */}
          <h3 className="text-2xl font-semibold text-black mb-2">Create your account</h3>
          <p className="text-gray-500 text-lg mb-6 text-center w-[400px]">
            Enter your details below to create your account
          </p>

          {/* Error Message */}
          {error && <p className="text-red-500 text-center mb-4">{error}</p>}

          {/* Form Fields */}
          <div className="w-full max-w-md space-y-4">
            {/* Full Name */}
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              type="text"
              placeholder="Full Name"
              className="input-class"
            />

            {/* Email */}
            <div className="relative">
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                placeholder="Email"
                className="input-class pl-12"
              />
              <img src={MailLogo} alt="" className="absolute left-4 top-3 w-5" />
            </div>

            {/* Password */}
            <div className="relative">
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                placeholder="Password"
                className="input-class pl-12"
              />
              <img src={PasswordLogo} alt="" className="absolute left-4 top-3 w-5" />
            </div>

            {/* Confirm Password */}
            <div className="relative">
              <input
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                type="password"
                placeholder="Confirm Password"
                className="input-class pl-12"
              />
              <img src={PasswordLogo} alt="" className="absolute left-4 top-3 w-5" />
            </div>

            {/* Contact Number & City (Side by Side) */}
            <div className="flex gap-3">
              <input
                value={number}
                onChange={(e) => setNumber(e.target.value)}
                type="text"
                placeholder="Contact Number"
                className="input-class w-1/2"
              />
              <input
                value={city}
                onChange={(e) => setCity(e.target.value)}
                type="text"
                placeholder="City"
                className="input-class w-1/2"
              />
            </div>

            {/* Age */}
            <div className="flex gap-3">
              <input
                value={age}
                onChange={(e) => setAge(e.target.value)}
                type="number"
                placeholder="Age"
                className="input-class w-1/2"
              />
            </div>

            {/* Register Button */}
            <button className="w-full bg-orange-600 hover:bg-orange-700 text-white font-semibold py-3 rounded-md transition-all duration-300 text-lg shadow-md">
              Register Now
            </button>
          </div>

          {/* Social Signup & Login */}
          <div className="text-center mt-5">
            <p>
              Already have an account?{" "}
              <Link to="/login" className="text-orange-600 font-semibold">
                Login Now
              </Link>
            </p>
            <p className="mt-3">Or</p>
            <a
              href="#"
              className="w-full flex items-center justify-center gap-2 mt-3 py-3 border rounded-md text-gray-700 hover:bg-gray-100 transition"
            >
              <img src={GoogleLogo} alt="" />
              Continue with Google
            </a>
          </div>
        </div>
      </div>
    </form>
  );
};

export default RegisterPage;
