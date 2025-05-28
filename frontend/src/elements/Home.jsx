import React, { useState } from "react";
import Navbar from "../components/Navbar";
import HeroPhoto from "../images/Hero-page.png";

import "../App.css";
import Vehiclelist from "../components/Vehiclelist";
import RedBoxPhoto from "../images/red-box-photo.png";
import WhiteBoxPhoto from "../images/HireDriver.png";
import DriverPhoto from "../images/DriverPhoto.png";
import Footer from "../components/Footer";
import UserProfile from "../elements/UserProfile";

const Home = () => {
  const [showProfile, setShowProfile] = useState(false);

  return (
    <div className="relative">
      <Navbar />

      {/* Profile Modal */}
      {showProfile && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex items-center justify-center">
          <div className="relative bg-white p-8 rounded-xl shadow-2xl w-full max-w-md">
            <button
              onClick={() => setShowProfile(false)}
              className="absolute top-3 right-4 text-gray-500 hover:text-black text-2xl font-bold"
            >
              &times;
            </button>
            <UserProfile />
          </div>
        </div>
      )}

      {/* Hero Image */}
      <div className="flex justify-center mt-[40px]">
        <img
          src={HeroPhoto}
          alt="Hero"
          className="w-[1400px] h-auto object-contain"
        />
      </div>

      

      {/* Vehicle List */}
      <Vehiclelist />

      {/* Services Section */}
      <div className="container">
        <div className="text-center">
          <h2 className="text-black text-[30px] font-semibold">Our Services</h2>
          <p className="mt-[30px] text-[18px] font-medium text-[#636363]">
            Get on the road with ease your journey, your ride, your way
          </p>
        </div>

        <div className="grid grid-cols-2 gap-[20px] mt-[90px] pb-[150px]">
          <div className="red-box text-center">
            <img
              src={RedBoxPhoto}
              alt="Vehicle Rental"
              className="w-[220px] h-auto object-cover"
            />
            <h3 className="mt-[20px]">Vehicle Rental</h3>
            <p>
              Our vehicle rental service offers reliable, affordable, and flexible transportation options for every need...
            </p>
          </div>
          <div className="white-box text-center">
            <img
              src={WhiteBoxPhoto}
              alt="Vehicle Rental 2"
              className="w-[220px] h-auto object-cover"
            />
            <h3 className="mt-[20px]">Vehicle Rental</h3>
            <p>
              Choose from a variety of well-maintained cars, SUVs, and vans with transparent pricing and excellent customer support...
            </p>
          </div>
        </div>
      </div>

      {/* Drivers Section */}
      <div className="container">
        <div className="text-center">
          <h2 className="text-black text-[30px] font-semibold">
            Our Professional Driver
          </h2>
          <p className="mt-[30px] text-[18px] font-medium text-[#636363]">
            Need a reliable driver? Our professional driver hire service is here for you!
          </p>
        </div>

        <div className="driver-grid grid grid-cols-4 pb-[95px] mt-[60px] gap-[20px]">
          {[1, 2, 3, 4].map((_, index) => (
            <div key={index} className="driver-card text-center">
              <img
                src={DriverPhoto}
                alt={`Driver ${index + 1}`}
                className="h-[210px] w-auto object-contain"
              />
              <div className="rating mt-[20px] mb-[15px] flex justify-center">
                {[1, 2, 3, 4, 5].map((_, i) => (
                  <input
                    key={i}
                    type="radio"
                    name={`rating-${index}`}
                    className="mask mask-star-2 bg-orange-400"
                    defaultChecked={i === 1}
                    readOnly
                  />
                ))}
              </div>
              <h3>Driver Name</h3>
              <p>Get on the road with ease your journey your ride, your way</p>
            </div>
          ))}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Home;
