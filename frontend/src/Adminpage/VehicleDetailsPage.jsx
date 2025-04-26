import { useLocation } from "react-router-dom";
import Sidebar from "./Sidebar"; // Adjust path as needed
import Header from "./Header";   // Adjust path as needed

const VehicleDetails = () => {
  const { state } = useLocation();
  const { vehicle } = state;

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 ml-64"> {/* Added ml-64 to push content away from sidebar */}
        {/* Header */}
        <Header />

        <div className="p-6">
          {/* Breadcrumb / Page Indicator */}
          <div className="mb-6">
            <h2 className="text-2xl font-semibold text-gray-700">
              📄 You are in <span className="text-orange-600">Vehicle Details</span> Page
            </h2>
          </div>

          {/* Vehicle Details Card */}
          <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
            <img
              src={`http://localhost:5000${vehicle.image_url}`}
              alt={vehicle.model}
              className="w-full h-72 object-cover"
            />

            <div className="p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-700 text-lg">
                <p><strong>Brand:</strong> {vehicle.brand}</p>
                <p><strong> Model:</strong> {vehicle.model}</p>
                <p><strong> Category:</strong> {vehicle.category}</p>
                <p><strong> Type:</strong> {vehicle.type}</p>
                <p><strong> Fuel Type:</strong> {vehicle.fuel_type}</p>
                <p><strong> Rental Price:</strong> ${vehicle.rental_price}</p>
                <p><strong> Availability:</strong> {vehicle.availability ? "Available" : "Not Available"}</p>
              </div>

              {/* Description Section */}
              {vehicle.description && (
                <div className="mt-6">
                  <h3 className="text-xl font-semibold text-gray-700 mb-2">📝 Description</h3>
                  <p className="text-gray-600 leading-relaxed">{vehicle.description}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VehicleDetails;
