import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Logo from '../images/nav-logo.png';
import LoginPhoto from "../images/loginimage.png";
import MailLogo from "../images/mail.svg";
import PasswordLogo from "../images/password.svg";
import GoogleLogo from "../images/google.svg";
import Loginvalidation from './Loginvalidation';
import { jwtDecode } from 'jwt-decode';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [key, setKey] = useState(0); // Key for re-rendering
  const navigate = useNavigate();

  useEffect(() => {
    // Reset state when the component mounts
    setEmail('');
    setPassword('');
    setError(null);

    // Clear saved email/password from storage
    localStorage.removeItem('email');
    sessionStorage.removeItem('email');

    // Force component to re-render
    setKey((prev) => prev + 1);
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null); 
    setEmail('');
    setPassword('');

    // Validate form inputs
    const validationErrors = Loginvalidation({ email, password });
    if (Object.keys(validationErrors).length > 0) {
      setError(Object.values(validationErrors).join(" | "));
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      console.log("API Response:", data); // Log API response

      if (!response.ok) throw new Error(data.message || 'Login failed');

      if (data.token) {
        console.log("Received Token:", data.token); // Log raw token
        

        // Decode JWT token
        const decodedToken = jwtDecode(data.token);
        console.log("Decoded Token:", decodedToken); // Log decoded token

        if (!decodedToken.role) {
          console.error("User role is missing from the token!");
          setError('User role is missing from the token');
          return;
        }

        // Store values in localStorage
        localStorage.setItem("token", data.token);
        localStorage.setItem("isAuthenticated", "true");
        localStorage.setItem("userRole", decodedToken.role);

        console.log("Stored in localStorage:");
        console.log("token:", localStorage.getItem("token"));
        console.log("isAuthenticated:", localStorage.getItem("isAuthenticated"));
        console.log("userRole:", localStorage.getItem("userRole"));

       
        if (decodedToken.role === 'admin') {
          navigate('/Admin'); // Admin page
        } else {
          const response = await fetch('http://localhost:5000/api/auth/generateOtp', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email }),
          });
        
          const res = await response.json(); // Assuming the response is JSON
        
          if (res) {
            navigate('/otp-verification', { state: { email } });
          } else {
            alert('failed');
          }
        }
      } else {
        setError("Token is missing from response!");
        console.error("Token is missing from response!");
      }

      // Clear form fields after successful login
      setEmail('');
      setPassword('');
    } catch (err) {
      console.error("Login Error:", err.message);
      setError(err.message); // Display error message if login fails
    }
  };

  return (
    <div key={key}> {/* Forces re-render when visiting login */}
      <div className="relative z-10 grid grid-cols-2 justify-items-center pt-[80px] pb-[93px] items-center h-screen">
        <div className="left-grid">
          <img src={LoginPhoto} alt="Login" className="w-full h-auto" />
        </div>
        <div className="right-grid">
          <img src={Logo} alt="Logo" className="w-[100px] h-auto mb-[25px]" />
          <h3 className="text-black text-[24px] font-semibold mb-[10px]">Login to your account</h3>
          <p className="text-[#636363] text-[18px] font-medium mb-[30px] w-[450px]">
            Enter your valid email and password to log in.
          </p>

          {/* Display error */}
          {error && <p className="text-red-500">{error}</p>}

          <form onSubmit={handleLogin}>
            <div className="relative">
              <input
                type="email"
                placeholder="Email"
                className="font-medium text-[18px] pt-[10px] pb-[10px] pl-[40px] rounded-[4px] text-[#676767] border-[2px] border-[#cacaca] bg-white w-full"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="off"  // Disable autofill
                required
              />
              <img src={MailLogo} alt="Mail" className="absolute left-2 top-[12px]" />
            </div>

            <div className="relative mt-[15px]">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                className="font-medium text-[18px] pt-[10px] pb-[10px] pl-[40px] w-full rounded-[4px] text-[#676767] border-[2px] border-[#cacaca] bg-white"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="new-password"  // Prevent browser autofill
                required
              />
              <img src={PasswordLogo} alt="Password" className="absolute left-2 top-[12px]" /> 

              {/* Show/Hide Password Button */}
              <button
                type="button"
                className="absolute right-2 top-[12px] text-[#676767]"
                onClick={() => setShowPassword((prev) => !prev)}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>

            <button
              type="submit"
              className="rounded-[4px] bg-[#F34900] text-white text-[18px] font-medium flex items-center justify-center pt-[14px] pb-[14px] mt-[20px] w-full"
            >
              Login Now
            </button>
          </form>

          <div className="flex items-center justify-between mt-5">
            <div className="flex items-center gap-3">
              <input type="checkbox" name="remember" id="remember" />
              <p>Remember Me</p>
            </div>
            <a href="/forgot-password" className="text-[#F34900]">
              Forgot Password?
            </a>
          </div>

          <div className="flex flex-col items-center justify-center mt-5 gap-[15px]">
            <div className="flex">
              <p>Don't have an account? </p>
              <a href="/register" className="text-[#F34900] ml-1">
                Register Now
              </a>
            </div>
            <p>Or</p>
            <button className="w-full border-class flex items-center justify-center gap-2 pt-[16px] pb-[16px] text-[#676767] text-[18px] font-medium">
              <img src={GoogleLogo} alt="Google" />
              Continue with Google
            </button>
          </div>
        </div>
        <div className="absolute w-[472px] h-screen bg-[#F34900] left-0 -z-10"></div>
      </div>
    </div>
  );
};

export default LoginPage;
