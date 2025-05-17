import React from "react";
import { Link } from "react-router-dom";
import FooterLogo from "../images/footer-logo.png";
import InstaLogo from "../images/instagram.svg";
import FacebookLogo from "../images/facebook.svg";
import TwitterLogo from "../images/twitter.svg";
import YoutubeLogo from "../images/youtube.svg";

const Footer = () => {
  return (
    <div>
      <section className="bg-[#F34900] pt-[65px] pb-[65px]">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-start gap-8">
            {/* Logo and contact info */}
            <div className="flex flex-col gap-[15px]">
              <img src={FooterLogo} alt="Logo" className="w-[100px] h-auto" />
              <p className="text-white text-[16px] font-medium">
                Kathmandu-06, Nepal
              </p>
              <p className="text-white text-[16px] font-medium">9812546325</p>
            </div>

            {/* Navigation links */}
            <ul className="flex flex-col md:flex-row items-start gap-[15px] md:gap-[30px]">
              <li>
                <Link to="/" className="text-white text-[18px] font-semibold hover:underline">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/vehicleslists" className="text-white text-[18px] font-semibold hover:underline">
                  Vehicle
                </Link>
              </li>
              <li>
                <Link to="/service" className="text-white text-[18px] font-semibold hover:underline">
                  Service
                </Link>
              </li>
              <li>
                <Link to="/about-us" className="text-white text-[18px] font-semibold hover:underline">
                  About Us
                </Link>
              </li>
              <li>
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
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Footer;
