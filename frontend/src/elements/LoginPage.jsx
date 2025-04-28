import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { jwtDecode } from 'jwt-decode';
import Logo from '../images/nav-logo.png';
import LoginPhoto from "../images/loginimage.png";
import MailLogo from "../images/mail.svg";
import PasswordLogo from "../images/password.svg";
import GoogleLogo from "../images/google.svg";
import Loginvalidation from './Loginvalidation';

// Helper sleep function
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [key, setKey] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    setEmail('');
    setPassword('');
    setError(null);
    localStorage.removeItem('email');
    sessionStorage.removeItem('email');
    setKey(prev => prev + 1);
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);

    const validationErrors = Loginvalidation({ email, password });
    if (Object.keys(validationErrors).length > 0) {
      const errorMessage = Object.values(validationErrors).join(" | ");
      setError(errorMessage);
      toast.error(errorMessage, { autoClose: 2000 });
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Login failed');

      if (data.token) {
        const decodedToken = jwtDecode(data.token);
        if (!decodedToken.role || !decodedToken.userId) {
          setError('User data is missing from the token');
          toast.error('User data is missing from the token', { autoClose: 2000 });
          return;
        }

        localStorage.setItem("token", data.token);
        localStorage.setItem("isAuthenticated", "true");
        localStorage.setItem("userRole", decodedToken.role);
        localStorage.setItem("userId", decodedToken.userId);

        if (decodedToken.role === 'admin') {
          toast.success('Logged in successfully as Admin!', { autoClose: 2000 });
          await sleep(1000);
          navigate('/Admin');
        } else {
          const otpResponse = await fetch('http://localhost:5000/api/auth/generateOtp', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email }),
          });

          const res = await otpResponse.json();
          if (res.success) {
            if (res.otpRequired) {
              toast.info('OTP sent, please verify.', { autoClose: 2000 });
              await sleep(2000);
              navigate('/otp-verification', { state: { email } });
            } else {
              toast.success('Logged in successfully!', { autoClose: 2000 });
              await sleep(2000);
              navigate('/');
            }
          } else {
            toast.error('Failed to generate OTP', { autoClose: 2000 });
          }
        }
      } else {
        setError("Token is missing from response!");
        toast.error("Token is missing from response!", { autoClose: 2000 });
      }

    } catch (err) {
      console.error("Login Error:", err.message);
      setError(err.message);
      toast.error(err.message, { autoClose: 2000 });
    }
  };

  return (
    <div key={key}>
      <ToastContainer autoClose={2000} />
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

          {error && <p className="text-red-500">{error}</p>}

          <form onSubmit={handleLogin}>
            <div className="relative">
              <input
                type="email"
                placeholder="Email"
                className="font-medium text-[18px] pt-[10px] pb-[10px] pl-[40px] rounded-[4px] text-[#676767] border-[2px] border-[#cacaca] bg-white w-full"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="off"
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
                autoComplete="new-password"
                required
              />
              <img src={PasswordLogo} alt="Password" className="absolute left-2 top-[12px]" />
              <button
                type="button"
                className="absolute right-2 top-[12px] text-[#676767]"
                onClick={() => setShowPassword(prev => !prev)}
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
            <a href="/userprofile" className="text-[#F34900]">
              Forgot Password?
            </a>
          </div>

          <div className="flex flex-col items-center justify-center mt-5 gap-[15px]">
            <div className="flex">
              <p>Don't have an account?</p>
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
