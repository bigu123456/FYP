import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const VehicleDetails = () => {
  const { state } = useLocation();
  const { vehicle } = state;
  const navigate = useNavigate();

  const handleBooking = () => {
    navigate(`/order/${vehicle.id}`, { state: { vehicle } });
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />

      <div className="flex-1 p-8">
        <div className="mb-6 text-center">
          <h1 className="text-3xl font-bold text-orange-500">
             You are in <span className="text-black">Vehicle Details</span> Page
          </h1>
        </div>

        <div className="flex flex-col lg:flex-row rounded-lg overflow-hidden shadow-lg">
          {/* Orange background with car image */}
          <div className="w-full lg:w-1/2 bg-orange-500 flex justify-center items-center p-6">
            <img
              src={`http://localhost:5000${vehicle.image_url}`}
              alt={vehicle.model}
              className="h-[400px] w-auto object-contain rounded-lg shadow-md"
            />
          </div>

          {/* Details Section */}
          <div className="w-full lg:w-1/2 p-8 bg-white text-gray-700 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-lg">
              <p><strong> Brand:</strong> {vehicle.brand}</p>
              <p><strong> Model:</strong> {vehicle.model}</p>
              <p><strong>Category:</strong> {vehicle.category}</p>
              <p><strong> Type:</strong> {vehicle.type}</p>
              <p><strong> Fuel Type:</strong> {vehicle.fuel_type}</p>
              <p><strong>Rental Price:</strong> ${vehicle.rental_price}</p>
              <p><strong> Availability:</strong> {vehicle.availability ? "Available" : "Not Available"}</p>
            </div>

            {vehicle.description && (
              <div className="mt-4">
                <h3 className="text-xl font-semibold mb-2">📋 Description</h3>
                <p className="leading-relaxed">{vehicle.description}</p>
              </div>
            )}

            <button
              onClick={handleBooking}
              className="mt-6 w-full bg-orange-500 text-white font-bold py-3 rounded-lg hover:bg-orange-600 transition-all"
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
