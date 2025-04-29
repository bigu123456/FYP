import { useEffect, useState } from "react";
import { data, useNavigate } from "react-router-dom";
import { FiSearch } from "react-icons/fi";
import bus from "../images/bus.png";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const Vehicles = () => {
  const [vehicles, setVehicles] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  fetch("http://localhost:5000/api/vehicles")
  .then((res) => {
    if (!res.ok) throw new Error(`Server error: ${res.status}`);
    return res.json();
  })
  .then((data) => {
    console.log("Fetched vehicles:", data);
    setVehicles(data);
  })
  .catch((err) => console.error("Fetch error:", err));


  const handleViewDetails = (vehicle) => {
    navigate(`/details/${vehicle.id}`, { state: { vehicle } });
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredVehicles = vehicles.filter((vehicle) =>
    vehicle.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vehicle.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vehicle.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vehicle.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vehicle.fuel_type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <Navbar />

      <div
        className="min-h-screen bg-cover bg-center p-5 relative"
        style={{ backgroundImage: `url(${bus})` }}
      >
        <button
          onClick={() => navigate(-1)}
          className="mb-4 bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-all font-bold"
        >
          Back
        </button>

        <h2 className="text-xl font-bold mb-4 text-white drop-shadow">
          Vehicle List
        </h2>

        {/* Search box */}
        <div className="absolute top-5 right-5 flex items-center border border-gray-300 rounded-lg overflow-hidden bg-white shadow-md">
          <input
            type="text"
            placeholder="Search vehicles..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="p-2 w-64 text-sm border-none focus:outline-none"
          />
          <button className="bg-orange-400 p-2 text-white hover:bg-yellow-500">
            <FiSearch size={20} />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-12">
          {filteredVehicles.map((vehicle) => (
            <div
              key={vehicle.id}
              className="bg-white bg-opacity-90 p-5 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all"
            >
              <img
                src={`http://localhost:5000${vehicle.image_url}`}
                alt={vehicle.model}
                className="w-full h-48 object-cover rounded-lg mb-4"
              />
              <div className="space-y-2 text-gray-800">
                <p><strong>Brand:</strong> {vehicle.brand}</p>
                <p><strong>Model:</strong> {vehicle.model}</p>
                <p><strong>Category:</strong> {vehicle.category}</p>
                <p><strong>Type:</strong> {vehicle.type}</p>
                <p><strong>Fuel Type:</strong> {vehicle.fuel_type}</p>
                <p><strong>Rental Price:</strong> ${vehicle.rental_price}</p>
                <p><strong>Available:</strong> {vehicle.availability ? "✅" : "❌"}</p>
              </div>

              <div className="mt-4">
                {vehicle.availability ? (
                  <button
                    onClick={() => handleViewDetails(vehicle)}
                    className="bg-orange-600 text-white font-semibold px-4 py-2 rounded-lg hover:bg-orange-500 transition-all"
                  >
                    Details
                  </button>
                ) : (
                  <button
                    disabled
                    className="bg-gray-400 text-white font-semibold px-4 py-2 rounded-lg cursor-not-allowed opacity-70"
                    title="This vehicle is fully booked"
                  >
                    Unavailable
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <Footer />
    </>
  );
};

export default Vehicles;
