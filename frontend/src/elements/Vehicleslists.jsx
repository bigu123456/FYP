import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiSearch } from "react-icons/fi";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const Vehicles = () => {
  const [vehicles, setVehicles] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Fetch vehicles from API on component mount
  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        setLoading(true);
        const response = await fetch("http://localhost:5000/api/vehicles");
        if (!response.ok) throw new Error(`Server error: ${response.status}`);
        const data = await response.json();
        setVehicles(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchVehicles();
  }, []);

  // Navigate to vehicle details page
  const handleViewDetails = (vehicle) => {
    navigate(`/details/${vehicle.id}`, { state: { vehicle } });
  };

  // Update search term as user types
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Filter vehicles based on availability and search term
  const filteredVehicles = vehicles
    .filter((vehicle) => vehicle.is_available)
    .filter((vehicle) =>
      [vehicle.brand, vehicle.model, vehicle.category, vehicle.type, vehicle.fuel_type]
        .join(" ")
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    );

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-white p-5 relative text-gray-900">
        {/* Page title */}
        <h2 className="text-2xl font-bold mb-6">Vehicle List</h2>

        {/* Search box */}
        <div className="absolute top-5 right-5 flex items-center border border-gray-300 rounded-lg overflow-hidden bg-white shadow-md">
          <input
            type="text"
            placeholder="Search vehicles..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="p-2 w-64 text-sm text-black border-none focus:outline-none"
          />
          <button className="bg-orange-400 p-2 text-white hover:bg-yellow-500">
            <FiSearch size={20} />
          </button>
        </div>

        {/* Loading, error, or empty message */}
        {loading && <p className="mt-10 text-gray-600">Loading vehicles...</p>}
        {error && <p className="mt-10 text-red-500">Error: {error}</p>}
        {!loading && !error && filteredVehicles.length === 0 && (
          <p className="mt-10 text-gray-600">No available vehicles match your search.</p>
        )}

        {/* Vehicle list */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-12">
          {filteredVehicles.map((vehicle) => (
            <div
              key={vehicle.id}
              className="bg-white text-gray-800 p-5 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all"
            >
              <img
                src={`http://localhost:5000${vehicle.image_url}`}
                alt={`${vehicle.brand} ${vehicle.model}`}
                className="w-full h-48 object-cover rounded-lg mb-4"
              />
              <div className="space-y-1">
                <p><strong>Brand:</strong> {vehicle.brand}</p>
                <p><strong>Model:</strong> {vehicle.model}</p>
                <p><strong>Category:</strong> {vehicle.category}</p>
                <p><strong>Type:</strong> {vehicle.type}</p>
                <p><strong>Fuel Type:</strong> {vehicle.fuel_type}</p>
                <p><strong>Rental Price:</strong> ₹{vehicle.rental_price}</p>
              </div>
              <div className="mt-4">
                <button
                  onClick={() => handleViewDetails(vehicle)}
                  className="bg-orange-600 text-white font-semibold px-4 py-2 rounded-lg hover:bg-orange-500 transition-all"
                >
                  View Details
                </button>
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
