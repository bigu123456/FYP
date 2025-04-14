import { useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const BookingPage = () => {
  const location = useLocation();
  const { orderData } = location.state;

  const {
    vehicle_model,
    vehicle_brand,
    vehicle_fuel_type,
    vehicle_image,
    vehicle_description,

    driver_name,
    driver_phone,
    driver_license,
    driver_image,
    driver_description,

    pickup_location,
    dropoff_location,
    pickup_time,
    dropoff_time,
    rental_duration,
    rental_price
  } = orderData;

  return (
    <>
      <Navbar />
      <div className="p-6 bg-gray-100 min-h-screen">
        <div className="max-w-6xl mx-auto bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Booking Summary</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Vehicle Info */}
            <div className="bg-white p-4 rounded-lg shadow-lg">
              <h3 className="text-xl font-semibold mb-2">Vehicle Info</h3>
              {vehicle_image ? (
                <img
                  src={`http://localhost:5000${vehicle_image}`}
                  alt="Vehicle"
                  className="w-full h-44 object-cover rounded-md mb-4"
                />
              ) : (
                <div className="w-full h-44 bg-gray-200 flex items-center justify-center text-gray-500 rounded-md mb-4">
                  No Image Available
                </div>
              )}
              <p><strong>Model:</strong> {vehicle_model || "N/A"}</p>
              <p><strong>Brand:</strong> {vehicle_brand || "N/A"}</p>
              <p><strong>Fuel Type:</strong> {vehicle_fuel_type || "N/A"}</p>
              <p><strong>Description:</strong> {vehicle_description || "N/A"}</p>
              <p><strong>Rental Price:</strong> ${rental_price} total</p>
              <p><strong>Duration:</strong> {rental_duration} day(s)</p>
            </div>

            {/* Driver Info */}
            {driver_name && (
              <div className="bg-white p-4 rounded-lg shadow-lg">
                <h3 className="text-xl font-semibold mb-2">Driver Info</h3>
                {driver_image ? (
                  <img
                    src={`http://localhost:5000/uploads/${driver_image}`}
                    alt={driver_name}
                    className="w-full h-44 object-cover rounded-md mb-4"
                  />
                ) : null}
                <p><strong>Name:</strong> {driver_name}</p>
                <p><strong>Phone:</strong> {driver_phone}</p>
                <p><strong>License:</strong> {driver_license}</p>
                <p><strong>Description:</strong> {driver_description}</p>
              </div>
            )}

            {/* Order Details */}
            <div className="bg-white p-4 rounded-lg shadow-lg">
              <h3 className="text-xl font-semibold mb-2">Order Details</h3>
              <p><strong>Pickup Location:</strong> {pickup_location}</p>
              <p><strong>Drop-off Location:</strong> {dropoff_location}</p>
              <p><strong>Pickup Time:</strong> {new Date(pickup_time).toLocaleString()}</p>
              <p><strong>Drop-off Time:</strong> {new Date(dropoff_time).toLocaleString()}</p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default BookingPage;
