import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const OrderPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { id } = useParams();

  const [vehicle, setVehicle] = useState(location.state?.vehicle || null);
  const [selectedDriver, setSelectedDriver] = useState(location.state?.driver || null);
  const [userId, setUserId] = useState(null);
  const [pickupLocation, setPickupLocation] = useState('');
  const [dropoffLocation, setDropoffLocation] = useState('');
  const [pickupTime, setPickupTime] = useState('');
  const [dropoffTime, setDropoffTime] = useState('');

  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");
    if (storedUserId) {
      setUserId(parseInt(storedUserId, 10));
    } else {
      alert("You need to log in before placing an order.");
      navigate("/login");
    }
  }, [navigate]);

  useEffect(() => {
    if (!vehicle) {
      fetch(`http://localhost:5000/api/vehicles/${id}`)
        .then((res) => res.json())
        .then((vehicleData) => setVehicle(vehicleData))
        .catch((err) => console.error("Error fetching vehicle:", err));
    }
  }, [id, vehicle]);

  useEffect(() => {
    if (location.state?.driver) {
      setSelectedDriver(location.state.driver);
    }
  }, [location.state]);

  const handleConfirmOrder = () => {
    if (!userId) {
      alert("User ID not found. Please log in first.");
      return;
    }

    // Validate form input
    if (!pickupLocation || !dropoffLocation || !pickupTime || !dropoffTime) {
      alert("All fields must be filled in.");
      return;
    }

    // Parse pickup and dropoff times as Date objects
    const pickupDate = new Date(pickupTime);
    const dropoffDate = new Date(dropoffTime);

    // Check if dropoff time is after pickup time
    const rentalDuration = Math.ceil((dropoffDate - pickupDate) / (1000 * 3600 * 24));
    if (rentalDuration <= 0) {
      alert("Dropoff time must be after pickup time.");
      return;
    }

    // Calculate rental cost
    const rentalCost = rentalDuration * vehicle.rental_price;

    // Prepare the data to send to the new page
    const orderData = {
      // Core user & rental data
      user_id: userId,
      vehicle_id: vehicle.id,
      driver_id: selectedDriver?.id || null,
      rental_price: rentalCost,
      pickup_location: pickupLocation,
      dropoff_location: dropoffLocation,
      pickup_time: pickupTime,
      dropoff_time: dropoffTime,
      rental_duration: rentalDuration,
    
      // Vehicle Details
      vehicle_model: vehicle.model,
      vehicle_brand: vehicle.brand,
      vehicle_fuel_type: vehicle.fuel_type,
      vehicle_image: vehicle.image_url,
      vehicle_description: vehicle.description,
    
      // Driver Details
      driver_name: selectedDriver?.name || null,
      driver_phone: selectedDriver?.phone || null,
      driver_license: selectedDriver?.license_number || null,
      driver_description: selectedDriver?.description || null,
      driver_image: selectedDriver?.image || null,
    };
    
    // Navigate to the confirmation page and pass the data as state
    navigate("/Bookingpage", { state: { orderData } });
  };

  return (
    <>
      <Navbar />
      <div className="p-6 bg-gray-100 min-h-screen">
        {/* Main Info Section */}
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
          
          {/* Driver Info */}
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-2xl font-semibold mb-4 text-gray-800">Driver Info</h3>
            {selectedDriver ? (
              <div>
                {selectedDriver.image && (
                  <img
                    src={`http://localhost:5000/uploads/${selectedDriver.image}`}
                    alt={selectedDriver.name}
                    className="w-full h-44 object-cover rounded-md mb-4"
                  />
                )}
                <p><strong>Name:</strong> {selectedDriver.name}</p>
                <p><strong>Phone:</strong> {selectedDriver.phone}</p>
                <p><strong>License No:</strong> {selectedDriver.license_number}</p>
                <p><strong>Description:</strong> {selectedDriver.description}</p>
              </div>
            ) : (
              <p className="text-gray-600">No driver selected.</p>
            )}
            <button
              onClick={() => navigate(`/select-driver/${id}`, { state: { vehicle } })}
              className="mt-4 w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition"
            >
              {selectedDriver ? "Change Driver" : "Select Driver (Optional)"}
            </button>
          </div>

          {/* Vehicle Info */}
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-2xl font-semibold mb-4 text-gray-800">Vehicle Info</h3>
            {vehicle ? (
              <div>
                <img
                  src={`http://localhost:5000${vehicle.image_url}`}
                  alt={vehicle.model}
                  className="w-full h-44 object-cover rounded-md mb-4"
                />
                <p><strong>Brand:</strong> {vehicle.brand}</p>
                <p><strong>Model:</strong> {vehicle.model}</p>
                <p><strong>Category:</strong> {vehicle.category}</p>
                <p><strong>Fuel Type:</strong> {vehicle.fuel_type}</p>
                <p><strong>Rental Price:</strong> ${vehicle.rental_price} / day</p>
                <p><strong>Availability:</strong> {vehicle.availability ? "✅ Available" : "❌ Not Available"}</p>
                <p><strong>Description:</strong> {vehicle.description}</p>
              </div>
            ) : (
              <p className="text-red-600 font-semibold">Vehicle not found!</p>
            )}
            <button
              onClick={() => navigate(`/select-vehicle/${id}`, { state: { driver: selectedDriver } })}
              className="mt-4 w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition"
            >
              {vehicle ? "Change Vehicle" : "Select Vehicle"}
            </button>
          </div>
        </div>

        {/* Booking Form Section */}
        <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Rental Details</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="pickupLocation" className="block mb-1 font-medium text-gray-700">Pickup Location</label>
              <input
                type="text"
                id="pickupLocation"
                className="w-full p-3 border border-gray-300 rounded-md"
                value={pickupLocation}
                onChange={(e) => setPickupLocation(e.target.value)}
                placeholder="Enter pickup location"
              />
            </div>

            <div>
              <label htmlFor="dropoffLocation" className="block mb-1 font-medium text-gray-700">Drop-off Location</label>
              <input
                type="text"
                id="dropoffLocation"
                className="w-full p-3 border border-gray-300 rounded-md"
                value={dropoffLocation}
                onChange={(e) => setDropoffLocation(e.target.value)}
                placeholder="Enter drop-off location"
              />
            </div>

            <div>
              <label htmlFor="pickupTime" className="block mb-1 font-medium text-gray-700">Pickup Time</label>
              <input
                type="datetime-local"
                id="pickupTime"
                className="w-full p-3 border border-gray-300 rounded-md"
                value={pickupTime}
                onChange={(e) => setPickupTime(e.target.value)}
              />
            </div>

            <div>
              <label htmlFor="dropoffTime" className="block mb-1 font-medium text-gray-700">Drop-off Time</label>
              <input
                type="datetime-local"
                id="dropoffTime"
                className="w-full p-3 border border-gray-300 rounded-md"
                value={dropoffTime}
                onChange={(e) => setDropoffTime(e.target.value)}
              />
            </div>
          </div>

          <button
            onClick={handleConfirmOrder}
            className="mt-6 w-full bg-orange-500 text-white font-semibold py-3 rounded-lg hover:bg-orange-600 transition-all shadow-md"
          >
            Confirm Order
          </button>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default OrderPage;
