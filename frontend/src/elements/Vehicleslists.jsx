import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate hook
import { FaSearch } from "react-icons/fa"; // Import FontAwesome search icon

import Footer from "../components/Footer";
import Navbar from "../components/Navbar";

const Vehicles = () => {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true); // State for loading
  const [error, setError] = useState(null); // State for error
  const [searchTerm, setSearchTerm] = useState(""); // State for search term
  const navigate = useNavigate(); // Initialize the navigate function

  useEffect(() => {
    fetch("http://localhost:5000/api/vehicles")
      .then((res) => res.json())
      .then((data) => {
        setVehicles(data);
        setLoading(false);
      })
      .catch((err) => {
        setError("Error fetching vehicles data.");
        setLoading(false);
      });
  }, []);

  // Function to navigate to the order page
  const handleOrder = (vehicle) => {
    navigate(`/order/${vehicle.id}`, { state: { vehicle } }); // Pass the selected vehicle data
  };

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Filter vehicles based on search term
  const filteredVehicles = vehicles.filter((vehicle) => {
    return (
      vehicle.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.type.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  if (loading) {
    return (
      <div>
        <Navbar />
        <div className="p-5">
          <p>Loading vehicles...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <Navbar />
        <div className="p-5">
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <div className="p-5 relative">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
          Vehicle List
        </h2>

        {/* Search Input - Positioned on Top Right */}
        <div className="absolute top-5 right-5 w-1/3 sm:w-1/4">
          <div className="relative w-full">
            <input
              type="text"
              placeholder="Search by brand, model, category, or type"
              value={searchTerm}
              onChange={handleSearchChange}
              className="w-full p-3 pl-10 pr-4 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-orange-500 bg-orange-400 text-black font-bold"
            />
            {/* Search Icon */}
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
        </div>

        {/* Vehicle Info Boxes */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-12">
          {filteredVehicles.length > 0 ? (
            filteredVehicles.map((vehicle) => (
              <div
                key={vehicle.id}
                className="bg-white p-5 rounded-lg shadow-lg border hover:bg-orange-500 hover:shadow-xl transition-all"
              >
                <img
                  src={`http://localhost:5000${vehicle.image_url}`}
                  alt={vehicle.model}
                  className="w-full h-40 object-cover rounded-lg"
                />
                <div className="mt-4 space-y-2 text-gray-700">
                  <p><strong>Brand:</strong> {vehicle.brand}</p>
                  <p><strong>Model:</strong> {vehicle.model}</p>
                  <p><strong>Category:</strong> {vehicle.category}</p>
                  <p><strong>Type:</strong> {vehicle.type}</p>
                  <p><strong>Fuel Type:</strong> {vehicle.fuel_type}</p>
                  <p><strong>Rental Price:</strong> ${vehicle.rental_price}</p>
                  <p><strong>Available:</strong> {vehicle.availability ? " Available" : " Not Available"}</p>
                </div>

                {/* Order Button */}
                <button
                  onClick={() => handleOrder(vehicle)}
                  className="mt-4 w-full bg-orange-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-green-600 transition-all shadow-md"
                >
                  Order Now
                </button>
              </div>
            ))
          ) : (
            <p>No vehicles available.</p> // Message when no vehicles are available
          )}
        </div>

      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Vehicles;
