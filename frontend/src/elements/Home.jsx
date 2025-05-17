import React, { useState } from "react";
import Navbar from "../components/Navbar";
import HeroPhoto from "../images/Hero-page.png";
<<<<<<< HEAD
=======
import InputCar from "../images/inputcar.svg";
import SearchBtn from "../images/searchbtn.svg";
import "../App.css";
import Vehiclelist from "../components/Vehiclelist";
>>>>>>> 11994a839c9610f18e58ba2e77ba621b379f2522
import RedBoxPhoto from "../images/red-box-photo.png";
import WhiteBoxPhoto from "../images/HireDriver.png";
import DriverPhoto from "../images/DriverPhoto.png";
import Footer from "../components/Footer";
<<<<<<< HEAD
import Vehiclelist from "../components/Vehiclelist";
import UserProfile from "../elements/UserProfile";
import "../App.css";
=======
import UserProfile from "../elements/UserProfile";
>>>>>>> 11994a839c9610f18e58ba2e77ba621b379f2522

const Home = () => {
  const [showProfile, setShowProfile] = useState(false);

  return (
    <div className="relative">
      <Navbar />

<<<<<<< HEAD
      {/* Optional: Trigger for Profile Modal */}
      {/* <button onClick={() => setShowProfile(true)} className="absolute top-5 right-5 z-50 bg-orange-600 text-white px-4 py-2 rounded-lg">Profile</button> */}
=======
      
>>>>>>> 11994a839c9610f18e58ba2e77ba621b379f2522

      {/* Modal Overlay */}
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

<<<<<<< HEAD
      {/* Hero Image */}
      <div className="flex justify-center mt-[40px]">
        <img
          src={HeroPhoto}
          alt="Hero"
=======
      <div className="flex justify-center mt-[40px]">
        <img
          src={HeroPhoto}
          alt=""
>>>>>>> 11994a839c9610f18e58ba2e77ba621b379f2522
          className="w-[1400px] h-auto object-contain"
        />
      </div>

<<<<<<< HEAD
      {/* Vehicle List */}
      <Vehiclelist />

      {/* Services Section */}
=======
      <div className="main flex justify-center mt-[50px]">
        <div className="input-red rounded-[30px] bg-[#fff] p-[50px] flex items-center gap-5">
          <div className="input-name flex items-center gap-2 p-3 ">
            <img src={InputCar} alt="" />
            <input
              type="text"
              placeholder="Vehicle Name"
              className="border-none"
            />
          </div>
          <div className="input-name p-3">
            <input
              type="date"
              name="date"
              id="date"
              placeholder="Start Date"
              className="border-none"
            />
          </div>
          <div className="input-name p-3">
            <input
              type="text"
              name="text"
              id="text"
              placeholder="Duration"
              className="border-none"
            />
          </div>
          <a
            href="http://"
            className="flex rounded-lg gap-2 p-3 bg-[#F34900] text-white items-center"
          >
            <img src={SearchBtn} alt="" />
            Search Vehicle
          </a>
        </div>
      </div>

      <Vehiclelist />

>>>>>>> 11994a839c9610f18e58ba2e77ba621b379f2522
      <div className="container">
        <div className="text-center">
          <h2 className="text-[#000] text-[30px] font-semibold">Our Services</h2>
          <p className="mt-[30px] text-[18px] font-medium text-[#636363]">
            Get on the road with ease your journey, your ride, your way
          </p>
        </div>

        <div className="grid grid-cols-2 gap-[20px] mt-[90px] pb-[150px]">
          <div className="red-box text-center">
<<<<<<< HEAD
            <img src={RedBoxPhoto} alt="Vehicle Rental" className="w-[220px] h-auto object-cover" />
            <h3 className="mt-[20px]">Vehicle Rental</h3>
            <p>
=======
            <img src={RedBoxPhoto} alt="" className="w-[220px] h-auto object-cover" />
            <h3 className="mt-[20px]">Vehicle Rental</h3>
            <p className="text-center">
>>>>>>> 11994a839c9610f18e58ba2e77ba621b379f2522
              Our vehicle rental service offers reliable, affordable, and flexible transportation options for every need...
            </p>
          </div>
          <div className="white-box text-center">
<<<<<<< HEAD
            <img src={WhiteBoxPhoto} alt="Vehicle Rental 2" className="w-[220px] h-auto object-cover" />
            <h3 className="mt-[20px]">Vehicle Rental</h3>
            <p>
=======
            <img src={WhiteBoxPhoto} alt="" className="w-[220px] h-auto object-cover" />
            <h3 className="mt-[20px]">Vehicle Rental</h3>
            <p className="text-center">
>>>>>>> 11994a839c9610f18e58ba2e77ba621b379f2522
              Choose from a variety of well-maintained cars, SUVs, and vans with transparent pricing and excellent customer support...
            </p>
          </div>
        </div>
      </div>

<<<<<<< HEAD
      {/* Drivers Section */}
=======
>>>>>>> 11994a839c9610f18e58ba2e77ba621b379f2522
      <div className="container">
        <div className="text-center">
          <h2 className="text-[#000] text-[30px] font-semibold">
            Our Professional Driver
          </h2>
          <p className="mt-[30px] text-[18px] font-medium text-[#636363]">
            Need a reliable driver? Our professional driver hire service is here for you!
          </p>
        </div>

        <div className="driver-grid grid grid-cols-4 pb-[95px] mt-[60px] gap-[20px]">
          {[1, 2, 3, 4].map((_, index) => (
<<<<<<< HEAD
            <div key={index} className="driver-card text-center">
              <img
                src={DriverPhoto}
                alt="Driver"
                className="h-[210px] w-auto object-contain"
              />
              <div className="rating mt-[20px] mb-[15px] flex justify-center">
=======
            <div key={index} className="driver-card">
              <img
                src={DriverPhoto}
                alt=""
                className="h-[210px] w-auto object-contain"
              />
              <div className="rating mt-[20px] mb-[15px]">
>>>>>>> 11994a839c9610f18e58ba2e77ba621b379f2522
                {[1, 2, 3, 4, 5].map((_, i) => (
                  <input
                    key={i}
                    type="radio"
                    name={`rating-${index}`}
                    className="mask mask-star-2 bg-orange-400"
                    defaultChecked={i === 1}
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
