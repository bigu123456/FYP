import { useLocation, useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import Header from "./Header";


const VehicleDetails = () => {
  const { state } = useLocation();
  const { vehicle } = state;
  const navigate = useNavigate();

  const handleBooking = () => {
    // You can customize navigation to booking page
    navigate("/booking", { state: { vehicle } });
  };

  const handleCancel = () => {
    navigate(-1); // Go back
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 ml-64 flex flex-col">
        <Header />

        <div className="flex-1 p-8">
          {/* Page Heading */}
          <div className="mb-6 text-center">
            <h1 className="text-3xl font-bold text-orange-500">
              You are in <span className="text-black">Vehicle Details</span> Page
            </h1>
          </div>

          {/* Vehicle Details Card */}
          <div className="flex flex-col lg:flex-row rounded-lg overflow-hidden shadow-lg">
            {/* Left: Image Section */}
            <div className="w-full lg:w-1/2 bg-orange-500 flex justify-center items-center p-6">
              <img
                src={`http://localhost:5000${vehicle.image_url}`}
                alt={vehicle.model}
                className="h-[400px] w-auto object-contain rounded-lg shadow-md"
              />
            </div>

            {/* Right: Details Section */}
            <div className="w-full lg:w-1/2 p-8 bg-white text-gray-700 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-lg">
                <p><strong>Brand:</strong> {vehicle.brand}</p>
                <p><strong>Model:</strong> {vehicle.model}</p>
                <p><strong>Category:</strong> {vehicle.category}</p>
                <p><strong>Type:</strong> {vehicle.type}</p>
                <p><strong>Fuel Type:</strong> {vehicle.fuel_type}</p>
                <p><strong>Rental Price:</strong> ${vehicle.rental_price}</p>
                <p><strong>Availability:</strong> {vehicle.availability ? "Available" : "Not Available"}</p>
              </div>

              {vehicle.description && (
                <div className="mt-4">
                  <h3 className="text-xl font-semibold mb-2">Description</h3>
                  <p className="leading-relaxed">{vehicle.description}</p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 mt-6">
               
                <button
                  onClick={handleCancel}
                  className="w-full sm:w-auto px-6 py-2 bg-gray-300 text-gray-800 font-semibold rounded-lg hover:bg-gray-400 transition-all"
                >
                  back
                </button>
              </div>
            </div>
          </div>
        </div>

       
      </div>
    </div>
  );
};

export default VehicleDetails;
