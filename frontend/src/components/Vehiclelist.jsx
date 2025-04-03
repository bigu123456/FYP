import React from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import OrangeArrow from "../images/orangearrow.svg";
import CarPhoto from "../images/CarPhoto.png";
import CarIcon from "../images/caricon.svg";

const Vehiclelist = () => {
  const navigate = useNavigate(); // Initialize navigate

  return (
    <div>
      <div className="container mt-[120px]">
        <div className="flex items-center justify-between">
          <div className="text">
            <h2 className="text-black text-[28px] font-semibold mb-[15px]">
              Vehicle List
            </h2>
            <p className="text-[#636363] font-medium">
              Get on the road with ease your journey, your ride, your way
            </p>
          </div>
          {/* Navigate to Vehicle Page */}
          <button
            onClick={() => navigate("/vehiclelists")}
            className="text-[#F34900] font-medium flex items-center gap-2"
          >
            View All
            <img src={OrangeArrow} alt="" />
          </button>
        </div>

        <div className="card-many grid grid-cols-4 gap-[30px] mt-[30px] pb-36">
          <div className="card">
            <img src={CarPhoto} alt="Car" />
            <div className="flex items-center justify-between mb-[15px]">
              <h3 className="text-[#252525] text-[18px] font-semibold">
                Vehicle Name
              </h3>
              <p className="text-[16px] text-[#F34900] font-medium">
                NPR 2500/DAY
              </p>
            </div>
            <p className="mb-[15px] text-[#636363] text-[16px] font-medium">
              Get on the road with ease your journey your ride, your way
            </p>
            <div className="flex items-center justify-between">
              <button
                onClick={() => navigate("/vehicleslists")}
                className="text-[#F34900] font-medium flex items-center gap-2"
              >
                View All
                <img src={OrangeArrow} alt="Arrow" />
              </button>
              <a
                href="#"
                className="flex items-center gap-[8px] bg-[#F34900] pt-[8px] pb-[8px] pl-[10px] pr-[10px] text-white rounded-md"
              >
                Rent Vehicle <img src={CarIcon} alt="Car Icon" />
              </a>
            </div>
          </div>

          <div className="card">
            <img src={CarPhoto} alt="Car" />
            <div className="flex items-center justify-between mb-[15px]">
              <h3 className="text-[#252525] text-[18px] font-semibold">
                Vehicle Name
              </h3>
              <p className="text-[16px] text-[#F34900] font-medium">
                NPR 2500/DAY
              </p>
            </div>
            <p className="mb-[15px] text-[#636363] text-[16px] font-medium">
              Get on the road with ease your journey your ride, your way
            </p>
            <div className="flex items-center justify-between">
              <button
                onClick={() => navigate("/vehicleslists")}
                className="text-[#F34900] font-medium flex items-center gap-2"
              >
                View All
                <img src={OrangeArrow} alt="Arrow" />
              </button>
              <a
                href="#"
                className="flex items-center gap-[8px] bg-[#F34900] pt-[8px] pb-[8px] pl-[10px] pr-[10px] text-white rounded-md"
              >
                Rent Vehicle <img src={CarIcon} alt="Car Icon" />
              </a>
            </div>
          </div>

          <div className="card">
            <img src={CarPhoto} alt="Car" />
            <div className="flex items-center justify-between mb-[15px]">
              <h3 className="text-[#252525] text-[18px] font-semibold">
                Vehicle Name
              </h3>
              <p className="text-[16px] text-[#F34900] font-medium">
                NPR 2500/DAY
              </p>
            </div>
            <p className="mb-[15px] text-[#636363] text-[16px] font-medium">
              Get on the road with ease your journey your ride, your way
            </p>
            <div className="flex items-center justify-between">
              <button
                onClick={() => navigate("/vehicleslists")}
                className="text-[#F34900] font-medium flex items-center gap-2"
              >
                View All
                <img src={OrangeArrow} alt="Arrow" />
              </button>
              <a
                href="#"
                className="flex items-center gap-[8px] bg-[#F34900] pt-[8px] pb-[8px] pl-[10px] pr-[10px] text-white rounded-md"
              >
                Rent Vehicle <img src={CarIcon} alt="Car Icon" />
              </a>
            </div>
          </div>

          <div className="card">
            <img src={CarPhoto} alt="Car" />
            <div className="flex items-center justify-between mb-[15px]">
              <h3 className="text-[#252525] text-[18px] font-semibold">
                Vehicle Name
              </h3>
              <p className="text-[16px] text-[#F34900] font-medium">
                NPR 2500/DAY
              </p>
            </div>
            <p className="mb-[15px] text-[#636363] text-[16px] font-medium">
              Get on the road with ease your journey your ride, your way
            </p>
            <div className="flex items-center justify-between">
              <button
                onClick={() => navigate("/Vehicleslists")}
                className="text-[#F34900] font-medium flex items-center gap-2"
              >
                View All
                <img src={OrangeArrow} alt="Arrow" />
              </button>
              <a
                href="#"
                className="flex items-center gap-[8px] bg-[#F34900] pt-[8px] pb-[8px] pl-[10px] pr-[10px] text-white rounded-md"
              >
                Rent Vehicle <img src={CarIcon} alt="Car Icon" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Vehiclelist;
