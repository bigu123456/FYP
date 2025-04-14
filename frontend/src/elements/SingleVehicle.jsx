import { useLocation, useNavigate } from "react-router-dom"; // 👈 Add useNavigate
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const VehicleDetails = () => {
  const { state } = useLocation();
  const { vehicle } = state;
  const navigate = useNavigate(); // 👈 Initialize navigate

  const handleBooking = () => {
    navigate(`/order/${vehicle.id}`, { state: { vehicle } }); // 👈 Navigate with state
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <Navbar />

      <div className="flex-1 p-6">
        <div className="mb-6">
          <h2 className="text-2xl font-semibold text-gray-700">
            📄 You are in <span className="text-orange-600">Vehicle Details</span> Page
          </h2>
        </div>

        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
          <img
            src={`http://localhost:5000${vehicle.image_url}`}
            alt={vehicle.model}
            className="w-full h-72 object-cover"
          />

          <div className="p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-700 text-lg">
              <p><strong>🚗 Brand:</strong> {vehicle.brand}</p>
              <p><strong>📍 Model:</strong> {vehicle.model}</p>
              <p><strong>🏷️ Category:</strong> {vehicle.category}</p>
              <p><strong>🔧 Type:</strong> {vehicle.type}</p>
              <p><strong>⛽ Fuel Type:</strong> {vehicle.fuel_type}</p>
              <p><strong>💵 Rental Price:</strong> ${vehicle.rental_price}</p>
              <p><strong>✅ Availability:</strong> {vehicle.availability ? "Available" : "Not Available"}</p>
            </div>

            {vehicle.description && (
              <div className="mt-6">
                <h3 className="text-xl font-semibold text-gray-700 mb-2">📋 Details</h3>
                <p className="text-gray-600 leading-relaxed">{vehicle.description}</p>
              </div>
            )}

            {/* 👇 Book Now Button */}
            <button
              onClick={handleBooking}
              className="mt-6 w-full bg-orange-500 text-white font-bold py-3 rounded-lg hover:bg-orange-600 transition-all shadow-md"
            >
              🚀 Book Now
            </button>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default VehicleDetails;
