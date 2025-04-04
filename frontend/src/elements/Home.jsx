import React from "react";
import Navbar from "../components/Navbar";
import HeroPhoto from "../images/Hero-page.png";
import InputCar from "../images/inputcar.svg";
import SearchBtn from "../images/searchbtn.svg";
import "../App.css";
import Vehiclelist from "../components/Vehiclelist";
import RedBoxPhoto from "../images/red-box-photo.png";
import WhiteBoxPhoto from "../images/HireDriver.png";
import DriverPhoto from "../images/DriverPhoto.png"
import Footer from "../components/Footer";


const Home = () => {
  return (
    <div>
      <Navbar />
      <div className="flex justify-center mt-[40px]">
        <img
          src={HeroPhoto}
          alt=""
          className="w-[1400px] h-auto object-contain"
        />
      </div>
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
      <div className="container">
        <div className="text-center">
          <h2 className="text-[#000] text-[30px] font-semibold">
            Our Services
          </h2>
          <p className="mt-[30px] text-[18px] font-medium text-[#636363]">
            Get on the road with ease your journey, your ride, your way
          </p>
        </div>
        <div className="grid grid-cols-2 gap-[20px] mt-[90px] pb-[150px]">
          <div className="red-box text-center">
            <img
              src={RedBoxPhoto}
              alt=""
              className="w-[220px] h-auto object-cover"
            />
            <h3 className="mt-[20px] ">Vehicle Rental</h3>
            <p className="text-center">
              Our vehicle rental service offers reliable, affordable, and
              flexible transportation options for every need. Choose from a
              variety of well-maintained cars, SUVs, and vans with transparent
              pricing and excellent customer support. Travel with confidence and
              comfort, knowing our vehicles are inspected and sanitized for your
              safety!
            </p>
          </div>
          <div className="white-box text-center">
            <img
              src={WhiteBoxPhoto}
              alt=""
              className="w-[220px] h-auto object-cover"
            />
            <h3 className="mt-[20px] ">Vehicle Rental</h3>
            <p className="text-center">
              Our vehicle rental service offers reliable, affordable, and
              flexible transportation options for every need. Choose from a
              variety of well-maintained cars, SUVs, and vans with transparent
              pricing and excellent customer support. Travel with confidence and
              comfort, knowing our vehicles are inspected and sanitized for your
              safety!
            </p>
          </div>
        </div>
      </div>
      <div className="container">
        <div className="text-center">
          <h2 className="text-[#000] text-[30px] font-semibold">
            Our Professional Driver
          </h2>
          <p className="mt-[30px] text-[18px] font-medium text-[#636363]">
            Need a reliable driver? Our professional driver hire service is here
            for you! Whether it's a short trip, a long journey, or daily
            commuting, our skilled drivers ensure your travel is safe,
            comfortable, and stress-free. Punctual, experienced, and courteous,
            they handle all types of vehicles with care. Let us take the wheel
            while you enjoy the ride!
          </p>
        </div>
        <div className="driver-grid grid grid-cols-4 pb-[95px] mt-[60px] gap-[20px]">
          <div className="driver-card ">
            <img src={DriverPhoto} alt="" className="h-[210px] w-auto object-contain"/>
            <div className="rating mt-[20px] mb-[15px]">
              <input
                type="radio"
                name="rating-2"
                className="mask mask-star-2 bg-orange-400"
              />
              <input
                type="radio"
                name="rating-2"
                className="mask mask-star-2 bg-orange-400"
                defaultChecked
              />
              <input
                type="radio"
                name="rating-2"
                className="mask mask-star-2 bg-orange-400"
              />
              <input
                type="radio"
                name="rating-2"
                className="mask mask-star-2 bg-orange-400"
              />
              <input
                type="radio"
                name="rating-2"
                className="mask mask-star-2 bg-orange-400"
              />
            </div>
            <h3>Driver Name</h3>
            <p>Get on the road with ease your journey your ride, your way</p>
          </div>
          <div className="driver-card ">
            <img src={DriverPhoto} alt="" className="h-[210px] w-auto object-contain"/>
            <div className="rating mt-[20px] mb-[15px]">
              <input
                type="radio"
                name="rating-2"
                className="mask mask-star-2 bg-orange-400"
              />
              <input
                type="radio"
                name="rating-2"
                className="mask mask-star-2 bg-orange-400"
                defaultChecked
              />
              <input
                type="radio"
                name="rating-2"
                className="mask mask-star-2 bg-orange-400"
              />
              <input
                type="radio"
                name="rating-2"
                className="mask mask-star-2 bg-orange-400"
              />
              <input
                type="radio"
                name="rating-2"
                className="mask mask-star-2 bg-orange-400"
              />
            </div>
            <h3>Driver Name</h3>
            <p>Get on the road with ease your journey your ride, your way</p>
          </div>
          <div className="driver-card ">
            <img src={DriverPhoto} alt="" className="h-[210px] w-auto object-contain"/>
            <div className="rating mt-[20px] mb-[15px]">
              <input
                type="radio"
                name="rating-2"
                className="mask mask-star-2 bg-orange-400"
              />
              <input
                type="radio"
                name="rating-2"
                className="mask mask-star-2 bg-orange-400"
                defaultChecked
              />
              <input
                type="radio"
                name="rating-2"
                className="mask mask-star-2 bg-orange-400"
              />
              <input
                type="radio"
                name="rating-2"
                className="mask mask-star-2 bg-orange-400"
              />
              <input
                type="radio"
                name="rating-2"
                className="mask mask-star-2 bg-orange-400"
              />
            </div>
            <h3>Driver Name</h3>
            <p>Get on the road with ease your journey your ride, your way</p>
          </div>
          <div className="driver-card ">
            <img src={DriverPhoto} alt="" className="h-[210px] w-auto object-contain"/>
            <div className="rating mt-[20px] mb-[15px]">
              <input
                type="radio"
                name="rating-2"
                className="mask mask-star-2 bg-orange-400"
              />
              <input
                type="radio"
                name="rating-2"
                className="mask mask-star-2 bg-orange-400"
                defaultChecked
              />
              <input
                type="radio"
                name="rating-2"
                className="mask mask-star-2 bg-orange-400"
              />
              <input
                type="radio"
                name="rating-2"
                className="mask mask-star-2 bg-orange-400"
              />
              <input
                type="radio"
                name="rating-2"
                className="mask mask-star-2 bg-orange-400"
              />
            </div>
            <h3>Driver Name</h3>
            <p>Get on the road with ease your journey your ride, your way</p>
          </div>
        </div>
      </div>
      <div>
      <Footer/>
      </div>
     
    </div>
  );
};

export default Home;
