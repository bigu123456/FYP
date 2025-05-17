<<<<<<< HEAD
import { useLocation, useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import Header from "./Header";

=======
import { useLocation } from "react-router-dom";
import Sidebar from "./Sidebar"; // Adjust path as needed
import Header from "./Header";   // Adjust path as needed
>>>>>>> 11994a839c9610f18e58ba2e77ba621b379f2522

const VehicleDetails = () => {
  const { state } = useLocation();
  const { vehicle } = state;
<<<<<<< HEAD
  const navigate = useNavigate();

  const handleBooking = () => {
    // You can customize navigation to booking page
    navigate("/booking", { state: { vehicle } });
  };

  const handleCancel = () => {
    navigate(-1); // Go back
  };
=======
>>>>>>> 11994a839c9610f18e58ba2e77ba621b379f2522

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
<<<<<<< HEAD
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

       
=======
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
>>>>>>> 11994a839c9610f18e58ba2e77ba621b379f2522
      </div>
    </div>
  );
};

export default VehicleDetails;
