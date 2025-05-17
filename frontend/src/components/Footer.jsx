import React from "react";
<<<<<<< HEAD
import { Link } from "react-router-dom";
=======
import { Link } from "react-router-dom"; // Import Link from react-router-dom
>>>>>>> 11994a839c9610f18e58ba2e77ba621b379f2522
import FooterLogo from "../images/footer-logo.png";
import InstaLogo from "../images/instagram.svg";
import FacebookLogo from "../images/facebook.svg";
import TwitterLogo from "../images/twitter.svg";
import YoutubeLogo from "../images/youtube.svg";

const Footer = () => {
  return (
    <div>
      <section className="bg-[#F34900] pt-[65px] pb-[65px]">
<<<<<<< HEAD
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-start gap-8">
            {/* Logo and contact info */}
            <div className="flex flex-col gap-[15px]">
              <img src={FooterLogo} alt="Logo" className="w-[100px] h-auto" />
=======
        <div className="container">
          <div className="flex justify-between items-start">
            <div className="flex flex-col gap-[15px]">
              <img src={FooterLogo} alt="" className="w-[100px] h-auto" />
>>>>>>> 11994a839c9610f18e58ba2e77ba621b379f2522
              <p className="text-white text-[16px] font-medium">
                Kathmandu-06, Nepal
              </p>
              <p className="text-white text-[16px] font-medium">9812546325</p>
            </div>
<<<<<<< HEAD

            {/* Navigation links */}
            <ul className="flex flex-col md:flex-row items-start gap-[15px] md:gap-[30px]">
              <li>
                <Link to="/" className="text-white text-[18px] font-semibold hover:underline">
=======
            <div className="flex items-center gap-[50px]">
              <li>
                <Link to="/" className="text-white text-[18px] font-semibold">
>>>>>>> 11994a839c9610f18e58ba2e77ba621b379f2522
                  Home
                </Link>
              </li>
              <li>
<<<<<<< HEAD
                <Link to="/vehicleslists" className="text-white text-[18px] font-semibold hover:underline">
=======
                <Link
                  to="/vehicleslists"
                  className="text-white text-[18px] font-semibold"
                >
>>>>>>> 11994a839c9610f18e58ba2e77ba621b379f2522
                  Vehicle
                </Link>
              </li>
              <li>
<<<<<<< HEAD
                <Link to="/service" className="text-white text-[18px] font-semibold hover:underline">
=======
                <Link
                  to="/service"
                  className="text-white text-[18px] font-semibold"
                >
>>>>>>> 11994a839c9610f18e58ba2e77ba621b379f2522
                  Service
                </Link>
              </li>
              <li>
<<<<<<< HEAD
                <Link to="/about-us" className="text-white text-[18px] font-semibold hover:underline">
=======
                <Link
                  to="/about-us"
                  className="text-white text-[18px] font-semibold"
                >
>>>>>>> 11994a839c9610f18e58ba2e77ba621b379f2522
                  About Us
                </Link>
              </li>
              <li>
<<<<<<< HEAD
                <Link to="/contactus" className="text-white text-[18px] font-semibold hover:underline">
                  Contact Us
                </Link>
              </li>
            </ul>

            {/* Social media links */}
            <div className="flex items-center gap-[20px]">
              <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer">
                <img src={InstaLogo} alt="Instagram" className="w-6 h-6 hover:opacity-75 transition" />
              </a>
              <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer">
                <img src={FacebookLogo} alt="Facebook" className="w-6 h-6 hover:opacity-75 transition" />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
                <img src={TwitterLogo} alt="Twitter" className="w-6 h-6 hover:opacity-75 transition" />
              </a>
              <a href="https://www.youtube.com" target="_blank" rel="noopener noreferrer">
                <img src={YoutubeLogo} alt="YouTube" className="w-6 h-6 hover:opacity-75 transition" />
=======
                <Link
                  to="/contactus"
                  className="text-white text-[18px] font-semibold"
                >
                  Contact Us
                </Link>
              </li>
            </div>
            <div className="flex items-center gap-[20px]">
              <a href="http://" target="_blank" rel="noopener noreferrer">
                <img src={InstaLogo} alt="Instagram" />
              </a>
              <a href="http://" target="_blank" rel="noopener noreferrer">
                <img src={FacebookLogo} alt="Facebook" />
              </a>
              <a href="http://" target="_blank" rel="noopener noreferrer">
                <img src={TwitterLogo} alt="Twitter" />
              </a>
              <a href="http://" target="_blank" rel="noopener noreferrer">
                <img src={YoutubeLogo} alt="Youtube" />
>>>>>>> 11994a839c9610f18e58ba2e77ba621b379f2522
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Footer;
