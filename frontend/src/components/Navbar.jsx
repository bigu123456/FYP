import React from 'react';
import { Link, NavLink } from 'react-router-dom'; // Import NavLink from react-router-dom
import Logo from '../images/nav-logo.png';
import CarIcon from '../images/caricon.svg';

const Navbar = () => {
  return (
    <div>
      <div className="container">
        <div className="navbar flex justify-between items-center pt-[50px] pb-[30px]">
          <img src={Logo} alt="Logo" className="w-16 h-auto object-cover" />
          <ul className="flex items-center gap-14">
            <li className="list-none">
              <NavLink 
                to="/" 
                className="text-black size-4 font-medium" 
                activeClassName="text-[#F34900]" // Adds orange color when active
              >
                Home
              </NavLink>
            </li>
            <li className="list-none">
              <NavLink 
                to="/vehicleslists" 
                className="text-black size-4 font-medium" 
                activeClassName="text-[#F34900]" // Adds orange color when active
              >
                Vehicles
              </NavLink>
            </li>
            <li className="list-none">
              <NavLink 
                to="/service" 
                className="text-black size-4 font-medium" 
                activeClassName="text-[#F34900]" // Adds orange color when active
              >
                Service
              </NavLink>
            </li>
            <li className="list-none">
              <NavLink 
                to="/Aboutus" 
                className="text-black size-4 font-medium" 
                activeClassName="text-[#F34900]" // Adds orange color when active
              >
                About Us
              </NavLink>
            </li>
            <li className="list-none">
              <NavLink 
                to="/Contactus" 
                className="text-black size-4 font-medium" 
                activeClassName="text-[#F34900]" // Adds orange color when active
              >
                Contact Us
              </NavLink>
            </li>
          </ul>
          <div className="two-btn flex gap-4 items-center">
            <Link
              to="/login"
              className="pt-[10px] pb-[10px] pl-[40px] pr-[40px] bg-[#f3490024] text-[#F34900] rounded-md"
            >
              Login
            </Link>
            <NavLink // Use NavLink for Rent Vehicle to make it active
              to="/Vehicleslists"
              className="flex items-center gap-[8px] bg-[#F34900] pt-[8px] pb-[8px] pl-[10px] pr-[10px] text-white rounded-md"
              activeClassName="bg-[#e83c00]" // Darker orange when active
            >
              Rent Vehicle <img src={CarIcon} alt="Car Icon" />
            </NavLink>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
