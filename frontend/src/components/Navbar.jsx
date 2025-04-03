import React from 'react';
import { Link } from 'react-router-dom'; // Import Link from react-router-dom
import Logo from '../images/nav-logo.png';
import CarIcon from '../images/caricon.svg';

const Navbar = () => {
  return (
    <div>
      <div className="container">
        <div className="navbar flex justify-between items-center pt-[50px] pb-[30px]">
          <img src={Logo} alt="" className="w-16 h-auto object-cover" />
          <ul className="flex items-center gap-14">
            <li className="list-none">
              <Link to="/" className="text-black size-4 font-medium active">
                Home
              </Link>
            </li>
            <li className="list-none">
              <Link to="/vehicleslists" className="text-black size-4 font-medium">
                Vehicles
              </Link>
            </li>
            <li className="list-none">
              <Link to="/service" className="text-black size-4 font-medium">
                Service
              </Link>
            </li>
            <li className="list-none">
              <Link to="/about-us" className="text-black size-4 font-medium">
                About Us
              </Link>
            </li>
            <li className="list-none">
              <Link to="/Contactus" className="text-black size-4 font-medium">
                Contact Us
              </Link>
            </li>
          </ul>
          <div className="two-btn flex gap-4 items-center">
            <Link
              to="/login"
              className="pt-[10px] pb-[10px] pl-[40px] pr-[40px] bg-[#f3490024] text-[#F34900] rounded-md"
            >
              Login
            </Link>
            <Link
              to="/Vehiclelist"
              className="flex items-center gap-[8px] bg-[#F34900] pt-[8px] pb-[8px] pl-[10px] pr-[10px] text-white rounded-md"
            >
              Rent Vehicle <img src={CarIcon} alt="" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
