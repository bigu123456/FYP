import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import CarImage from "../images/car.png";

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

  // Always respect latest vehicle from location or fallback to fetch
  useEffect(() => {
    if (location.state?.vehicle) {
      setVehicle(location.state.vehicle);
    } else {
      fetch(`http://localhost:5000/api/vehicles/${id}`)
        .then((res) => res.json())
        .then((vehicleData) => {
          setVehicle(vehicleData);
        })
        .catch((err) => console.error("Error fetching vehicle:", err));
    }
  }, [id, location.state?.vehicle]);

  // Preserve or update driver only if explicitly passed
  useEffect(() => {
    if (location.state?.driver !== undefined) {
      setSelectedDriver(location.state.driver);
    }
  }, [location.state?.driver]);

  const handleConfirmOrder = async () => {
    if (!userId) {
      alert("User ID not found. Please log in first.");
      return;
    }

    if (!pickupLocation || !dropoffLocation || !pickupTime || !dropoffTime) {
      alert("All fields must be filled in.");
      return;
    }

    const pickupDate = new Date(pickupTime);
    const dropoffDate = new Date(dropoffTime);
    const rentalDuration = Math.ceil((dropoffDate - pickupDate) / (1000 * 3600 * 24));
    if (rentalDuration <= 0) {
      alert("Dropoff time must be after pickup time.");
      return;
    }

    const vehicleCost = rentalDuration * vehicle.rental_price;
    const driverCost = selectedDriver ? rentalDuration * selectedDriver.price_per_day : 0;
    const rentalCost = vehicleCost + driverCost;

    const orderData = {
      user_id: userId,
      vehicle_id: vehicle.id,
      driver_id: selectedDriver?.id || null,
      rental_price: rentalCost,
      pickup_location: pickupLocation,
      dropoff_location: dropoffLocation,
      pickup_time: pickupTime,
      dropoff_time: dropoffTime,
      rental_duration: rentalDuration,
      vehicle_model: vehicle.model,
      vehicle_brand: vehicle.brand,
      vehicle_fuel_type: vehicle.fuel_type,
      vehicle_image: vehicle.image_url,
      vehicle_description: vehicle.description,
      driver_name: selectedDriver?.name || null,
      driver_phone: selectedDriver?.phone || null,
      driver_license: selectedDriver?.license_number || null,
      driver_description: selectedDriver?.description || null,
      driver_image: selectedDriver?.image || null,
    };

    try {
      const response = await axios.post("http://localhost:5000/api/orders", orderData);

      if (selectedDriver?.id) {
        await axios.put(`http://localhost:5000/api/drivers/${selectedDriver.id}/availability`, {
          availability: false,
        });
      }

      alert("Order confirmed! Check your email for booking details.\nYou can also view your booking in the Order History page.");
      navigate("/orderhistory");
    } catch (error) {
      console.error("Error during order confirmation:", error);
      alert("Something went wrong. Please try again.");
    }
  };

  const calculateRentalCost = () => {
    if (!pickupTime || !dropoffTime || !vehicle) return 0;
    const pickupDate = new Date(pickupTime);
    const dropoffDate = new Date(dropoffTime);
    const duration = Math.ceil((dropoffDate - pickupDate) / (1000 * 3600 * 24));
    if (duration <= 0) return 0;
    const vehicleCost = duration * vehicle.rental_price;
    const driverCost = selectedDriver ? duration * selectedDriver.price_per_day : 0;
    return vehicleCost + driverCost;
  };

  return (
    <>
      <Navbar />

      <div
        className="min-h-screen bg-cover bg-center px-4 py-10"
        style={{ backgroundImage: `url(${CarImage})` }}
      >
        <div className="max-w-screen-xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-12">

          <div className="col-span-3 mb-6 text-center text-lg font-semibold text-white bg-black bg-opacity-40 p-2 rounded">
            User ID: {userId ? userId : "Loading..."}
          </div>

          {/* Vehicle Info */}
          <div className="bg-white bg-opacity-90 rounded-xl p-6 shadow-md">
            <h3 className="text-xl font-bold text-gray-800 mb-3">Vehicle Info</h3>
            {vehicle ? (
              <div>
                <img
                  src={`http://localhost:5000${vehicle.image_url}`}
                  alt={vehicle.model}
                  className="w-full h-40 object-cover rounded-md mb-4"
                />
                <p><strong>Vehicle ID:</strong> {vehicle.id}</p>
                <p><strong>Brand:</strong> {vehicle.brand}</p>
                <p><strong>Model:</strong> {vehicle.model}</p>
                <p><strong>Category:</strong> {vehicle.category}</p>
                <p><strong>Fuel Type:</strong> {vehicle.fuel_type}</p>
                <p><strong>Rental Price:</strong> ₹{vehicle.rental_price} / day</p>
                <p><strong>Availability:</strong> {vehicle.availability ? "✅ Available" : "❌ Not Available"}</p>
                <p><strong>Description:</strong> {vehicle.description}</p>
                <button
                  onClick={() => navigate("/vehicleslists", { state: { driver: selectedDriver } })}
                  className="mt-3 w-full bg-orange-500 text-white py-2 rounded hover:bg-orange-600 transition duration-300"
                >
                  {vehicle ? "Change Vehicle" : "Select Vehicle"}
                </button>
              </div>
            ) : (
              <p className="text-red-500">Vehicle not found.</p>
            )}
          </div>

          {/* Driver Info */}
          <div className="bg-white bg-opacity-90 rounded-xl p-6 shadow-md">
            <h3 className="text-xl font-bold text-gray-800 mb-3">Driver Info</h3>
            {selectedDriver ? (
              <div>
                {selectedDriver.image && (
                  <img
                    src={`http://localhost:5000/uploads/${selectedDriver.image}`}
                    alt={selectedDriver.name}
                    className="w-full h-40 object-cover rounded-md mb-4"
                  />
                )}
                <p><strong>Driver ID:</strong> {selectedDriver.id}</p>
                <p><strong>Name:</strong> {selectedDriver.name}</p>
                <p><strong>Phone:</strong> {selectedDriver.phone}</p>
                <p><strong>License No:</strong> {selectedDriver.license_number}</p>
                <p><strong>Price Per Day:</strong> ₹{selectedDriver.price_per_day}</p>
                <p><strong>Description:</strong> {selectedDriver.description}</p>
              </div>
            ) : (
              <p className="text-gray-600">No driver selected.</p>
            )}
            <button
              onClick={() => navigate(`/select-driver/${id}`, { state: { vehicle } })}
              className="mt-3 w-full bg-orange-500 text-white py-2 rounded hover:bg-orange-600"
            >
              {selectedDriver ? "Change Driver" : "Select Driver (Optional)"}
            </button>
          </div>

          {/* Rental Form */}
          <div className="bg-white bg-opacity-90 rounded-xl p-6 shadow-md">
            <h3 className="text-xl font-bold text-gray-800 mb-3">Rental Details</h3>
            <div className="grid gap-3">
              <input
                type="text"
                placeholder="Pickup Location"
                value={pickupLocation}
                onChange={(e) => setPickupLocation(e.target.value)}
                className="p-2 border border-gray-300 rounded"
              />
              <input
                type="text"
                placeholder="Drop-off Location"
                value={dropoffLocation}
                onChange={(e) => setDropoffLocation(e.target.value)}
                className="p-2 border border-gray-300 rounded"
              />
              <input
                type="datetime-local"
                value={pickupTime}
                onChange={(e) => setPickupTime(e.target.value)}
                className="p-2 border border-gray-300 rounded"
              />
              <input
                type="datetime-local"
                value={dropoffTime}
                onChange={(e) => setDropoffTime(e.target.value)}
                className="p-2 border border-gray-300 rounded"
              />

              <button
                onClick={handleConfirmOrder}
                className="mt-2 bg-orange-500 text-white py-2 rounded hover:bg-orange-600"
              >
                Confirm Order
              </button>

              {pickupTime && dropoffTime && vehicle && (
                <div className="text-lg font-semibold text-gray-700 mt-3">
                  Total Rental Cost: ₹{calculateRentalCost()}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default OrderPage;
