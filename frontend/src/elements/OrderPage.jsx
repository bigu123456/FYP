import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const OrderPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { id } = useParams();
  const [vehicle, setVehicle] = useState(location.state?.vehicle || null);
  const [selectedDriver, setSelectedDriver] = useState(null);
  const [userId, setUserId] = useState(null);
  const [pickupLocation, setPickupLocation] = useState('');
  const [dropoffLocation, setDropoffLocation] = useState('');
  const [pickupTime, setPickupTime] = useState('');
  const [dropoffTime, setDropoffTime] = useState('');

  // Fetch logged-in user ID from local storage
  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");
    if (storedUserId) {
      setUserId(parseInt(storedUserId, 10)); 
    } else {
      alert("You need to log in before placing an order.");
      navigate("/login"); 
    }
  }, [navigate]);

  // Fetch vehicle details if not passed via state
  useEffect(() => {
    if (!vehicle) {
      fetch(`http://localhost:5000/api/vehicles/${id}`)
        .then((res) => res.json())
        .then((vehicleData) => setVehicle(vehicleData))
        .catch((err) => console.error("Error fetching vehicle:", err));
    }
  }, [id, vehicle]);

  // Handle order confirmation
  const handleConfirmOrder = async () => {
    if (!userId) {
      alert("User ID not found. Please log in first.");
      return;
    }

    // Validate if required fields are filled
    if (!pickupLocation || !dropoffLocation || !pickupTime || !dropoffTime) {
      alert("All fields must be filled in. Please provide pickup and dropoff locations, as well as times.");
      return;
    }

    // Calculate rental duration
    const pickupDate = new Date(pickupTime);
    const dropoffDate = new Date(dropoffTime);
    const rentalDuration = Math.ceil((dropoffDate - pickupDate) / (1000 * 3600 * 24)); // In days
    
    // Check if the rental duration is valid
    if (rentalDuration <= 0) {
      alert("Dropoff time must be after pickup time.");
      return;
    }

    const rentalCost = rentalDuration * vehicle.rental_price; // Calculate total cost based on rental days

    try {
      const response = await fetch("http://localhost:5000/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          vehicle_id: vehicle.id,
          user_id: userId, 
          driver_id: selectedDriver ? selectedDriver.id : null,
          rental_price: rentalCost,  // Use the calculated rental cost
          pickup_location: pickupLocation,
          dropoff_location: dropoffLocation,
          pickup_time: pickupTime,
          dropoff_time: dropoffTime, // Include dropoff time
          image: vehicle.image_url
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(`Server error: ${data.message || response.status}`);
      }

      alert("Order placed successfully!");
      navigate("/Bookingpage"); 
    } catch (error) {
      console.error("Error placing order:", error);
      alert("Failed to place order. Please try again.");
    }
  };

  return (
    <>
      <Navbar />
      <div className="p-6 bg-gray-100 min-h-screen">
        <div className="max-w-5xl mx-auto bg-black p-8 rounded-lg shadow-lg flex items-center text-white">
          <div className="w-1/2 mr-6">
            <img
              src={`http://localhost:5000${vehicle.image_url}`}
              alt={vehicle.model}
              className="w-full h-auto rounded-lg shadow-md"
            />
          </div>
          <div className="w-1/2 text-gray-200 space-y-5">
            <h2 className="text-4xl font-bold mb-6 text-center">
              Vehicle Order Details
            </h2>
            {vehicle ? (
              <>
                <p className="text-lg"><strong>Brand:</strong> {vehicle.brand}</p>
                <p className="text-lg"><strong>Model:</strong> {vehicle.model}</p>
                <p className="text-lg"><strong>Category:</strong> {vehicle.category}</p>
                <p className="text-lg"><strong>Fuel Type:</strong> {vehicle.fuel_type}</p>
                <p className="text-lg"><strong>Rental Price:</strong> ${vehicle.rental_price} / day</p>
                <p className="text-lg"><strong>Available:</strong> {vehicle.availability ? "✅ Available" : "❌ Not Available"}</p>

                {/* Choose Driver Button */}
                <button
                  onClick={() => navigate(`/select-driver/${id}`, { state: { vehicle } })}
                  className="mt-4 w-full bg-blue-500 text-white font-semibold py-3 rounded-lg hover:bg-blue-600 transition-all shadow-md"
                >
                  Choose a Driver
                </button>

                {/* Driver Dropdown (Optional) */}
                <div className="mt-4">
                  <label htmlFor="driverSelect" className="block text-gray-200">Select Driver (Optional)</label>
                  <select
                    id="driverSelect"
                    className="w-full p-3 border border-gray-300 rounded-md"
                    onChange={(e) => {
                      const selectedDriver = e.target.value ? JSON.parse(e.target.value) : null;
                      setSelectedDriver(selectedDriver);
                    }}
                    defaultValue=""
                  >
                    <option value="">Select Driver</option>
                    {location.state?.drivers?.map((driver) => (
                      <option key={driver.id} value={JSON.stringify(driver)}>
                        {driver.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Pickup Location Input */}
                <div className="mt-4">
                  <label htmlFor="pickupLocation" className="block text-gray-200">Pickup Location</label>
                  <input
                    type="text"
                    id="pickupLocation"
                    className="w-full p-3 border border-gray-300 rounded-md"
                    value={pickupLocation}
                    onChange={(e) => setPickupLocation(e.target.value)}
                    placeholder="Enter pickup location"
                  />
                </div>

                {/* Drop-off Location Input */}
                <div className="mt-4">
                  <label htmlFor="dropoffLocation" className="block text-gray-200">Drop-off Location</label>
                  <input
                    type="text"
                    id="dropoffLocation"
                    className="w-full p-3 border border-gray-300 rounded-md"
                    value={dropoffLocation}
                    onChange={(e) => setDropoffLocation(e.target.value)}
                    placeholder="Enter drop-off location"
                  />
                </div>

                {/* Pickup Time */}
                <div className="mt-4">
                  <label htmlFor="pickupTime" className="block text-gray-200">Pickup Time</label>
                  <input
                    type="datetime-local"
                    id="pickupTime"
                    className="w-full p-3 border border-gray-300 rounded-md"
                    value={pickupTime}
                    onChange={(e) => setPickupTime(e.target.value)}
                  />
                </div>

                {/* Drop-off Time */}
                <div className="mt-4">
                  <label htmlFor="dropoffTime" className="block text-gray-200">Drop-off Time</label>
                  <input
                    type="datetime-local"
                    id="dropoffTime"
                    className="w-full p-3 border border-gray-300 rounded-md"
                    value={dropoffTime}
                    onChange={(e) => setDropoffTime(e.target.value)}
                  />
                </div>

                {/* Confirm Order Button */}
                <button
                  onClick={handleConfirmOrder}
                  className="mt-6 w-full bg-orange-500 text-white font-semibold py-3 rounded-lg hover:bg-orange-600 transition-all shadow-md"
                >
                  Confirm Order
                </button>
              </>
            ) : (
              <p className="text-center text-red-600 text-lg font-bold">
                Vehicle not found!
              </p>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default OrderPage;
