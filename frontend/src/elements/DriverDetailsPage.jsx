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
      navigate(-1); // Go back if state is missing
    }
  }, [driver, vehicle, navigate]);

  if (!driver || !vehicle) return null;

  const handleProceedToOrder = () => {
    navigate(`/order/${vehicle.id}`, {
      state: { vehicle, driver },
    });
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-100 p-6">
        <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
          {driver.image && (
            <img
              src={`http://localhost:5000/uploads/${driver.image}`}
              alt={driver.name}
              className="w-full h-64 object-cover"
            />
          )}
          <div className="p-6">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">{driver.name}</h2>
            <p className="text-lg text-gray-700 mb-2">
              <strong>Phone:</strong> {driver.phone}
            </p>
            <p className="text-lg text-gray-700 mb-2">
              <strong>License Number:</strong> {driver.license_number}
            </p>
            <p className="text-lg text-gray-700 mb-2">
              <strong>Availability:</strong> {driver.availability ? "✅ Available" : "❌ Not Available"}
            </p>
            <p className="text-md text-gray-700 mt-4">
              <strong>Description:</strong> <br /> {driver.description}
            </p>

            <button
              onClick={handleProceedToOrder}
              className="mt-6 w-full bg-orange-500 text-white py-3 rounded-md hover:bg-orange-600 transition"
            >
              Proceed with this Driver
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default DriverDetailsPage;
