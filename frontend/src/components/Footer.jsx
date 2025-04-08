import React from "react";
import { Link } from "react-router-dom"; // Import Link from react-router-dom
import FooterLogo from "../images/footer-logo.png";
import InstaLogo from "../images/instagram.svg";
import FacebookLogo from "../images/facebook.svg";
import TwitterLogo from "../images/twitter.svg";
import YoutubeLogo from "../images/youtube.svg";

const Footer = () => {
  return (
    <div>
      <section className="bg-[#F34900] pt-[65px] pb-[65px]">
        <div className="container">
          <div className="flex justify-between items-start">
            <div className="flex flex-col gap-[15px]">
              <img src={FooterLogo} alt="" className="w-[100px] h-auto" />
              <p className="text-white text-[16px] font-medium">
                Kathmandu-06, Nepal
              </p>
              <p className="text-white text-[16px] font-medium">9812546325</p>
            </div>
            <div className="flex items-center gap-[50px]">
              <li>
                <Link to="/" className="text-white text-[18px] font-semibold">
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/vehicleslists"
                  className="text-white text-[18px] font-semibold"
                >
                  Vehicle
                </Link>
              </li>
              <li>
                <Link
                  to="/service"
                  className="text-white text-[18px] font-semibold"
                >
                  Service
                </Link>
              </li>
              <li>
                <Link
                  to="/about-us"
                  className="text-white text-[18px] font-semibold"
                >
                  About Us
                </Link>
              </li>
              <li>
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
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Footer;
