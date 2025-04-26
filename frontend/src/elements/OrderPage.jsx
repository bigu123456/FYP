import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const OrderPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { id } = useParams();

  const [vehicle, setVehicle] = useState(location.state?.vehicle || null);
  const [selectedDriver, setSelectedDriver] = useState(location.state?.driver || null);
  const [userId, setUserId] = useState(null);
  const [loyaltyLevel, setLoyaltyLevel] = useState("Bronze");
  const [showConfirmationBox, setShowConfirmationBox] = useState(false);

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
    if (location.state?.vehicle) {
      setVehicle(location.state.vehicle);
    } else {
      fetch(`http://localhost:5000/api/vehicles/${id}`)
        .then((res) => res.json())
        .then((vehicleData) => setVehicle(vehicleData))
        .catch((err) => console.error("Error fetching vehicle:", err));
    }
  }, [id, location.state?.vehicle]);

  useEffect(() => {
    if (location.state?.driver !== undefined) {
      setSelectedDriver(location.state.driver);
    }
  }, [location.state?.driver]);

  useEffect(() => {
    if (userId) {
      axios.get(`http://localhost:5000/api/loyalty/${userId}`)
        .then(res => setLoyaltyLevel(res.data.level))
        .catch(err => console.error("Error fetching loyalty level:", err));
    }
  }, [userId]);

  const getLoyaltyDiscount = (level) => {
    switch (level) {
      case "Silver": return 5;
      case "Gold": return 10;
      case "Platinum": return 15;
      default: return 0;
    }
  };

  const calculateFinalPrice = () => {
    if (!pickupTime || !dropoffTime || !vehicle) return { originalCost: 0, discount: 0, saved: 0, finalPrice: 0 };

    const pickupDate = new Date(pickupTime);
    const dropoffDate = new Date(dropoffTime);
    const duration = Math.ceil((dropoffDate - pickupDate) / (1000 * 3600 * 24));
    if (duration <= 0) return { originalCost: 0, discount: 0, saved: 0, finalPrice: 0 };

    const vehicleCost = duration * vehicle.rental_price;
    const driverCost = selectedDriver ? duration * selectedDriver.price_per_day : 0;
    const originalCost = vehicleCost + driverCost;
    const discount = getLoyaltyDiscount(loyaltyLevel);
    const saved = (originalCost * discount) / 100;
    const finalPrice = originalCost - saved;

    return { originalCost, discount, saved, finalPrice, duration };
  };

  const handleConfirmOrder = async () => {
    const { originalCost, discount, saved, finalPrice, duration } = calculateFinalPrice();

    if (!pickupLocation || !dropoffLocation || !pickupTime || !dropoffTime) {
      alert("All fields must be filled in.");
      return;
    }

    if (duration <= 0) {
      alert("Dropoff time must be after pickup time.");
      return;
    }

    const orderData = {
      user_id: userId,
      vehicle_id: vehicle.id,
      driver_id: selectedDriver?.id || null,
      rental_price: finalPrice,
      pickup_location: pickupLocation,
      dropoff_location: dropoffLocation,
      pickup_time: pickupTime,
      dropoff_time: dropoffTime,
      rental_duration: duration,
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
      loyalty_discount: discount,
      loyalty_saved: saved,
    };

    try {
      await axios.post("http://localhost:5000/api/orders", orderData);

      if (selectedDriver?.id) {
        await axios.put(`http://localhost:5000/api/drivers/${selectedDriver.id}/availability`, {
          availability: false,
        });
      }

      setShowConfirmationBox(true);
    } catch (error) {
      console.error("Error during order confirmation:", error);
      alert("Something went wrong. Please try again.");
    }
  };

  const { originalCost, discount, saved, finalPrice } = calculateFinalPrice();

  const handleConfirmationClose = () => {
    setShowConfirmationBox(false);
    navigate("/orderhistory");
  };

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-[#f7f8fa] px-4 py-10">
        {/* Confirmation Modal */}
        {showConfirmationBox && (
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
              <h2 className="text-lg font-bold mb-4 text-gray-800">Order Confirmed</h2>
              <p><strong>Loyalty Discount:</strong> {discount}%</p>
              <p><strong>Original Price:</strong> ₹{originalCost.toFixed(2)}</p>
              <p><strong>You Saved:</strong> ₹{saved.toFixed(2)}</p>
              <p className="text-xl font-bold text-green-600 mt-4">Final Price: ₹{finalPrice.toFixed(2)}</p>
              <button
                className="mt-4 w-full bg-orange-500 text-white py-2 rounded-md hover:bg-orange-600"
                onClick={handleConfirmationClose}>
                Go to Order History
              </button>
            </div>
          </div>
        )}

        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Vehicle Card */}
          <div className="bg-white shadow-md rounded-2xl overflow-hidden border border-gray-200">
            <img src={`http://localhost:5000${vehicle?.image_url}`} className="w-full h-48 object-cover" alt="Vehicle" />
            <div className="p-6">
              <h2 className="text-lg font-bold mb-2 text-gray-800">Vehicle Info</h2>
              <p className="text-sm text-gray-600"><strong>Brand:</strong> {vehicle?.brand}</p>
              <p className="text-sm text-gray-600"><strong>Model:</strong> {vehicle?.model}</p>
              <p className="text-sm text-gray-600"><strong>Fuel:</strong> {vehicle?.fuel_type}</p>
              <p className="text-sm text-gray-600"><strong>category:</strong> {vehicle?.category}</p>
              <p className="text-sm text-gray-600"><strong>Price:</strong> ₹{vehicle?.rental_price} /day</p>
              <p className="text-xs text-gray-500 mt-2">{vehicle?.description}</p>
              <button
                className="mt-4 w-full bg-orange-500 text-white text-sm py-2 rounded-md hover:bg-orange-600"
                onClick={() => navigate("/vehicleslists", { state: { driver: selectedDriver } })}>
                Change Vehicle
              </button>
            </div>
          </div>

          {/* Driver Card */}
          <div className="bg-white shadow-md rounded-2xl overflow-hidden border border-gray-200">
            {selectedDriver?.image && (
              <img src={`http://localhost:5000/uploads/${selectedDriver.image}`} className="w-full h-48 object-cover" alt="Driver" />
            )}
            <div className="p-6">
              <h2 className="text-lg font-bold mb-2 text-gray-800">Driver Info</h2>
              {selectedDriver ? (
                <>
                  <p className="text-sm text-gray-600"><strong>Name:</strong> {selectedDriver.name}</p>
                  <p className="text-sm text-gray-600"><strong>Phone:</strong> {selectedDriver.phone}</p>
                  <p className="text-sm text-gray-600"><strong>License:</strong> {selectedDriver.license_number}</p>
                  <p className="text-sm text-gray-600"><strong>Price/day:</strong> ₹{selectedDriver.price_per_day}</p>
                  <p className="text-xs text-gray-500 mt-2">{selectedDriver.description}</p>
                </>
              ) : <p className="text-sm text-gray-500">No driver selected.</p>}
              <button
                className="mt-4 w-full bg-orange-500 text-white text-sm py-2 rounded-md hover:bg-orange-600"
                onClick={() => navigate(`/select-driver/${id}`, { state: { vehicle } })}>
                {selectedDriver ? "Change Driver" : "Select Driver (Optional)"}
              </button>
            </div>
          </div>

          {/* Rental Form */}
          <div className="bg-white shadow-md rounded-2xl border border-gray-200 p-6">
            <h2 className="text-lg font-bold text-gray-800 mb-4">Rental Details</h2>
            <div className="space-y-3">
              <input type="text" placeholder="Pickup Location" value={pickupLocation} onChange={(e) => setPickupLocation(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md text-sm" />
              <input type="text" placeholder="Drop-off Location" value={dropoffLocation} onChange={(e) => setDropoffLocation(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md text-sm" />
              <input type="datetime-local" value={pickupTime} onChange={(e) => setPickupTime(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md text-sm" />
              <input type="datetime-local" value={dropoffTime} onChange={(e) => setDropoffTime(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md text-sm" />
              <button onClick={handleConfirmOrder}
                className="w-full bg-orange-500 text-white py-2 text-sm rounded-md hover:bg-orange-600 mt-1">
                Confirm Order
              </button>
            </div>

            {pickupTime && dropoffTime && vehicle && (
              <div className="mt-6 p-4 bg-gray-50 rounded-md">
                <h3 className="text-md font-semibold text-gray-700 mb-2">Payment Summary</h3>
                <p className="text-sm"><strong>Original Price:</strong> ₹{originalCost.toFixed(2)}</p>
                <p className="text-sm"><strong>Discount:</strong> {discount}%</p>
                <p className="text-sm"><strong>You Saved:</strong> ₹{saved.toFixed(2)}</p>
                <p className="text-xl font-bold text-green-600 mt-2">Final Price: ₹{finalPrice.toFixed(2)}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default OrderPage;
