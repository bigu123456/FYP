import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useEffect } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const DriverDetailsPage = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { driver, vehicle } = location.state || {};

  useEffect(() => {
    if (!driver || !vehicle) {
      alert("Missing driver or vehicle data.");
<<<<<<< HEAD
      navigate(-1);
=======
      navigate(-1); // Go back if state is missing
>>>>>>> 11994a839c9610f18e58ba2e77ba621b379f2522
    }
  }, [driver, vehicle, navigate]);

  if (!driver || !vehicle) return null;

  const handleProceedToOrder = () => {
    navigate(`/order/${vehicle.id}`, {
      state: { vehicle, driver },
    });
  };

  const handleCancel = () => {
<<<<<<< HEAD
    navigate(-1);
=======
    navigate(-1); // Go back to Select Driver page
>>>>>>> 11994a839c9610f18e58ba2e77ba621b379f2522
  };

  return (
    <>
      <Navbar />
<<<<<<< HEAD
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-8">
        <div className="max-w-6xl mx-auto bg-white shadow-lg rounded-2xl overflow-hidden flex flex-col md:flex-row transition-all duration-300">
          
          {/* Image Section */}
=======
      <div className="min-h-screen bg-gray-100 py-10 px-4">
        <div className="max-w-5xl mx-auto bg-white shadow-xl rounded-lg overflow-hidden flex flex-col md:flex-row">
          
          {/* Left - Image */}
>>>>>>> 11994a839c9610f18e58ba2e77ba621b379f2522
          {driver.image ? (
            <div className="md:w-1/2 w-full h-80 md:h-auto">
              <img
                src={`http://localhost:5000/uploads/${driver.image}`}
                alt={driver.name}
                className="w-full h-full object-cover"
              />
            </div>
          ) : (
            <div className="md:w-1/2 w-full h-80 flex items-center justify-center bg-gray-200">
              <span className="text-gray-500 text-lg">No Image Available</span>
            </div>
          )}

<<<<<<< HEAD
          {/* Info Section */}
          <div className="md:w-1/2 w-full p-8 flex flex-col justify-between">
            <div>
              <h2 className="text-3xl font-bold text-orange-600 mb-4">{driver.name}</h2>
              
              <div className="space-y-2 text-gray-700 text-lg">
                <p><strong>Phone:</strong> {driver.phone}</p>
                <p><strong>License Number:</strong> {driver.license_number}</p>
                <p>
                  <strong>Availability:</strong>{" "}
                  {driver.availability ? (
                    <span className="text-green-600">✅ Available</span>
                  ) : (
                    <span className="text-red-500">❌ Not Available</span>
                  )}
                </p>
                <p><strong>Price per Day:</strong> ₹{driver.price_per_day}</p>
              </div>

              <div className="mt-6">
                <h3 className="text-lg font-semibold mb-1 text-gray-800">Description:</h3>
                <p className="text-gray-600 text-md leading-relaxed whitespace-pre-line">
                  {driver.description || "No description provided."}
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-8 flex flex-col sm:flex-row gap-4">
             <button
  onClick={handleProceedToOrder}
  className="flex-1 bg-orange-500 text-white py-3 px-6 rounded-full shadow-md hover:bg-orange-600 text-base font-semibold transition duration-300"
>
  Proceed with this Driver
</button>

<button
  onClick={handleCancel}
  className="flex-1 bg-gray-200 text-gray-800 py-3 px-6 rounded-full shadow hover:bg-gray-300 text-base font-semibold transition duration-300"
>
  Cancel
</button>

=======
          {/* Right - Details */}
          <div className="md:w-1/2 w-full p-6 flex flex-col justify-between">
            <div>
              <h2 className="text-3xl font-bold text-gray-800 mb-4">{driver.name}</h2>
              <p className="text-lg text-gray-700 mb-2">
                <strong>Phone:</strong> {driver.phone}
              </p>
              <p className="text-lg text-gray-700 mb-2">
                <strong>License Number:</strong> {driver.license_number}
              </p>
              <p className="text-lg text-gray-700 mb-2">
                <strong>Availability:</strong>{" "}
                {driver.availability ? "✅ Available" : "❌ Not Available"}
              </p>
              <p className="text-lg text-gray-700 mb-2">
                <strong>Price per Day:</strong> ₹{driver.price_per_day}
              </p>
              <p className="text-md text-gray-700 mt-4">
                <strong>Description:</strong> <br />
                {driver.description}
              </p>
            </div>

            {/* Buttons */}
            <div className="mt-6 flex flex-col sm:flex-row gap-4">
              <button
                onClick={handleProceedToOrder}
                className="flex-1 bg-orange-500 text-white py-2 rounded-md hover:bg-orange-600 transition"
              >
                Proceed with this Driver
              </button>
              <button
                onClick={handleCancel}
                className="flex-1 bg-gray-300 text-gray-800 py-2 rounded-md hover:bg-gray-400 transition"
              >
                Cancel
              </button>
>>>>>>> 11994a839c9610f18e58ba2e77ba621b379f2522
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default DriverDetailsPage;
