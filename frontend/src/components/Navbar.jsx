import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { FaUserCircle } from 'react-icons/fa'; // User icon
import Logo from '../images/nav-logo.png';
import CarIcon from '../images/caricon.svg';

const Navbar = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('userId');
    localStorage.removeItem('role'); // Remove role when logging out
    navigate('/login');
  };

  const userRole = localStorage.getItem('role'); // 'user' or 'admin'

  return (
    <div className="bg-white shadow-md">
      <div className="container mx-auto px-6">
        <div className="navbar flex justify-between items-center pt-[30px] pb-[20px]">
          {/* Logo */}
          <img src={Logo} alt="Logo" className="w-16 h-auto object-cover" />

          {/* Navigation Links */}
          <ul className="flex items-center gap-14">
            <li className="list-none">
              <NavLink
                to="/"
                className="text-black text-base font-medium"
                activeClassName="text-[#F34900]"
              >
                Home
              </NavLink>
            </li>
            <li className="list-none">
              <NavLink
                to="/vehicleslists"
                className="text-black text-base font-medium"
                activeClassName="text-[#F34900]"
              >
                Vehicles
              </NavLink>
            </li>
            <li className="list-none">
              <NavLink
                to="/ServicePage"
               

                className="text-black text-base font-medium"
                activeClassName="text-[#F34900]"
              >
                Service
              </NavLink>
            </li>
            <li className="list-none">
              <NavLink
                to="/Aboutus"
                className="text-black text-base font-medium"
                activeClassName="text-[#F34900]"
              >
                About Us
              </NavLink>
            </li>
            <li className="list-none">
              <NavLink
                to="/Contactus"
                className="text-black text-base font-medium"
                activeClassName="text-[#F34900]"
              >
                Contact Us
              </NavLink>
            </li>
          </ul>

          {/* Buttons + Dropdown */}
          <div className="two-btn flex gap-4 items-center relative">
            {/* Conditional Login Button */}
            {!localStorage.getItem('userId') && (
              <Link
                to="/login"
                className="pt-[10px] pb-[10px] pl-[40px] pr-[40px] bg-[#f3490024] text-[#F34900] rounded-md"
              >
                Login
              </Link>
            )}

            {/* User Role Display (Admin or User) */}
            {userRole && (
              <span className="text-[#F34900] text-sm font-medium">
                {userRole === 'admin' ? 'Admin' : 'User'}
              </span>
            )}

            <NavLink
              to="/vehicleslists"
              className="flex items-center gap-[8px] bg-[#F34900] pt-[8px] pb-[8px] pl-[10px] pr-[10px] text-white rounded-md"
              activeClassName="bg-[#e83c00]"
            >
              Rent Vehicle <img src={CarIcon} alt="Car Icon" />
            </NavLink>

            {/* User Profile Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowDropdown((prev) => !prev)}
                className="text-[#F34900] hover:text-[#e83c00] focus:outline-none ml-2"
              >
                <FaUserCircle size={28} />
              </button>
              {showDropdown && (
                <div className="absolute right-0 mt-2 w-44 bg-white shadow-md rounded-md border z-50">
                  <Link to="/userprofile" className="block px-4 py-2 text-sm hover:bg-gray-100">
                    👤 Profile
                  </Link>
                  <Link
                    to="/Admin"
                    onClick={() => setShowDropdown(false)}
                    className="block px-4 py-2 text-sm hover:bg-gray-100"
                  >
                    🧭 Dashboard
                  </Link>

                  <Link
                    to="/orderhistory"
                    onClick={() => setShowDropdown(false)}
                    className="block px-4 py-2 text-sm hover:bg-gray-100"
                  >
                    📦 Orders History
                  </Link>

                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                  >
                    🚪 Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
