import React from "react";
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
                  <a href="http://" className="text-white text-[18px] font-semibold">Home</a>
                </li>
                <li>
                  <a href="http://" className="text-white text-[18px] font-semibold">Vehicle</a>
                </li>
                <li>
                  <a href="http://" className="text-white text-[18px] font-semibold">Service</a>
                </li>
                <li>
                  <a href="http://" className="text-white text-[18px] font-semibold">About Us</a>
                </li>
                <li>
                  <a href="http://" className="text-white text-[18px] font-semibold">Contact Us</a>
                </li>
            </div>
            <div className="flex items-center gap-[20px]">
              <a href="http://">
                <img src={InstaLogo} alt="" />
              </a>
              <a href="http://">
                <img src={FacebookLogo} alt="" />
              </a>
              <a href="http://">
                <img src={TwitterLogo} alt="" />
              </a>
              <a href="http://">
                <img src={YoutubeLogo} alt="" />
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Footer;
