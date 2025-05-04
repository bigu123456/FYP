import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { generateUniqueId } from "../utils/helpers.js";
import { MapPinIcon, CalendarIcon, TruckIcon, UserIcon, CurrencyRupeeIcon } from "@heroicons/react/24/outline";

const OrderPage = () => {
  const userInfo = JSON.parse(localStorage.getItem("userInfo")) || {};
  const [isSubmitting, setIsSubmitting] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { id } = useParams();

  const [vehicle, setVehicle] = useState(location.state?.vehicle || null);
  const [selectedDriver, setSelectedDriver] = useState(location.state?.driver || null);
  const [userId, setUserId] = useState(null);
  const [loyaltyLevel, setLoyaltyLevel] = useState("Bronze");
  const [loyaltyLoading, setLoyaltyLoading] = useState(true);
  const [showConfirmationBox, setShowConfirmationBox] = useState(false);

  const [pickupLocation, setPickupLocation] = useState('');
  const [dropoffLocation, setDropoffLocation] = useState('');
  const [pickupTime, setPickupTime] = useState('');
  const [dropoffTime, setDropoffTime] = useState('');
  const [priceSummary, setPriceSummary] = useState({
    originalCost: 0,
    discount: 0,
    saved: 0,
    finalPrice: 0,
    duration: 0
  });
  const [formErrors, setFormErrors] = useState({});

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
    if (!vehicle && id) {
      // Fetch vehicle data if we have an ID but no vehicle data
      axios.get(`http://localhost:5000/api/vehicles/${id}`)
        .then(res => {
          setVehicle(res.data);
        })
        .catch(err => {
          console.error("Error fetching vehicle:", err);
          alert("Could not load vehicle information.");
        });
    }
  }, [vehicle, id]);

  useEffect(() => {
    if (location.state?.driver !== undefined) {
      setSelectedDriver(location.state.driver);
    }
  }, [location.state?.driver]);

  useEffect(() => {
    if (userId) {
      axios.get(`http://localhost:5000/api/loyalty/${userId}`)
        .then(res => {
          setLoyaltyLevel(res.data.level);
          setLoyaltyLoading(false);
        })
        .catch(err => {
          console.error("Error fetching loyalty level:", err);
          setLoyaltyLoading(false);
        });
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

  useEffect(() => {
    if (loyaltyLoading || !pickupTime || !dropoffTime || !vehicle) return;

    const pickupDate = new Date(pickupTime);
    const dropoffDate = new Date(dropoffTime);
    const durationMs = dropoffDate - pickupDate;
    
    if (durationMs <= 0) {
      setFormErrors(prev => ({
        ...prev,
        time: "Dropoff time must be after pickup time"
      }));
      return;
    } else {
      setFormErrors(prev => {
        const newErrors = {...prev};
        delete newErrors.time;
        return newErrors;
      });
    }

    const duration = Math.ceil(durationMs / (1000 * 3600 * 24));
    const vehicleCost = duration * vehicle.rental_price;
    const driverCost = selectedDriver ? duration * selectedDriver.price_per_day : 0;
    const originalCost = vehicleCost + driverCost;
    const discount = getLoyaltyDiscount(loyaltyLevel);
    const saved = (originalCost * discount) / 100;
    const finalPrice = originalCost - saved;

    setPriceSummary({ originalCost, discount, saved, finalPrice, duration });
  }, [pickupTime, dropoffTime, vehicle, loyaltyLevel, selectedDriver, loyaltyLoading]);

  const validateForm = () => {
    const errors = {};
    
    if (!pickupLocation) errors.pickupLocation = "Pickup location is required";
    if (!dropoffLocation) errors.dropoffLocation = "Dropoff location is required";
    if (!pickupTime) errors.pickupTime = "Pickup time is required";
    if (!dropoffTime) errors.dropoffTime = "Dropoff time is required";
    
    if (pickupTime && dropoffTime) {
      const pickupDate = new Date(pickupTime);
      const dropoffDate = new Date(dropoffTime);
      
      if (dropoffDate <= pickupDate) {
        errors.time = "Dropoff time must be after pickup time";
      }
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleConfirmOrder = async () => {
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    const productId = generateUniqueId();
    sessionStorage.setItem("current_transaction_id", productId);
  
    const orderData = {
      user_id: userId || userInfo.id,
      vehicle_id: vehicle.id,
      driver_id: selectedDriver?.id || null,
      rental_price: priceSummary.finalPrice,
      pickup_location: pickupLocation,
      dropoff_location: dropoffLocation,
      pickup_time: pickupTime,
      dropoff_time: dropoffTime,
      rental_duration: priceSummary.duration,
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
      loyalty_discount: priceSummary.discount,
      loyalty_saved: priceSummary.saved,
      transaction_id: productId,
    };
    
    const formData = {
  amount: priceSummary.finalPrice,  // Ensure this value is properly calculated
  userId: userId || userInfo.id,  // Ensure user info is available
  paymentGateway: 'esewa',  // Can also be 'khalti', depending on the selected gateway
  productName: vehicle.brand,  // Vehicle brand name
  vehicleModel: vehicle.model,  // Vehicle model
  productId,  // Unique product ID
};
  
    try {
      const orderResponse = await axios.post("http://localhost:5000/api/orders", orderData);
  
      if (selectedDriver?.id) {
        await axios.put(`http://localhost:5000/api/drivers/${selectedDriver.id}/availability`, {
          availability: false,
        });
      }
  
      const paymentResponse = await axios.post("http://localhost:5000/api/initiate-payment", formData);
  
      if (paymentResponse.data.url) {
        window.location.href = paymentResponse.data.url;
      } else {
        console.error("Error: Payment URL is undefined.");
        alert("Payment URL is invalid. Please try again.");
      }
    } catch (error) {
      console.error("Error confirming order or initiating payment:", error);
      alert("Something went wrong. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleConfirmationClose = () => {
    setShowConfirmationBox(false);
    navigate("/orderhistory");
  };

  if (!vehicle) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-[#f7f8fa] flex items-center justify-center">
          <div className="text-center p-8 bg-white rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Loading vehicle information...</h2>
            <p className="text-gray-600">Please wait a moment</p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 px-4 py-12">
        {showConfirmationBox && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 backdrop-blur-sm">
            <div className="bg-white p-8 rounded-xl shadow-xl max-w-md w-full border border-gray-200">
              <div className="flex justify-center mb-4">
                <div className="rounded-full bg-green-100 p-3">
                  <svg className="h-8 w-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>
              <h2 className="text-2xl font-bold mb-4 text-center text-gray-800">Order Confirmed</h2>
              <div className="space-y-2 mb-6">
                <div className="flex justify-between">
                  <p className="text-gray-600">Original Price:</p>
                  <p className="font-medium">₹{priceSummary.originalCost.toFixed(2)}</p>
                </div>
                <div className="flex justify-between">
                  <p className="text-gray-600">Loyalty Discount:</p>
                  <p className="font-medium text-orange-600">{priceSummary.discount}%</p>
                </div>
                <div className="flex justify-between">
                  <p className="text-gray-600">You Saved:</p>
                  <p className="font-medium text-green-600">₹{priceSummary.saved.toFixed(2)}</p>
                </div>
                <div className="border-t border-gray-200 pt-2 mt-2"></div>
                <div className="flex justify-between">
                  <p className="font-bold text-gray-800">Final Price:</p>
                  <p className="text-xl font-bold text-green-600">₹{priceSummary.finalPrice.toFixed(2)}</p>
                </div>
              </div>
              <p className="text-center text-green-600 font-medium mb-6">Thank you for your order!</p>
              <button
                className="w-full bg-orange-500 text-white py-3 rounded-lg hover:bg-orange-600 transition-colors font-medium shadow-md"
                onClick={handleConfirmationClose}>
                View Order History
              </button>
            </div>
          </div>
        )}

        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">Complete Your Booking</h1>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Vehicle Card */}
            <div className="bg-white shadow-lg rounded-2xl overflow-hidden border border-gray-200 transition-transform hover:shadow-xl">
              <div className="relative">
                <img 
                  src={`http://localhost:5000${vehicle?.image_url}`} 
                  className="w-full h-56 object-cover" 
                  alt={`${vehicle?.brand} ${vehicle?.model}`} 
                />
                <div className="absolute top-0 right-0 bg-orange-500 text-white px-3 py-1 m-2 rounded-full text-sm font-medium">
                  ₹{vehicle?.rental_price}/day
                </div>
              </div>
              <div className="p-6">
                <h2 className="text-xl font-bold mb-3 text-gray-800 flex items-center">
                  <TruckIcon className="h-5 w-5 mr-2 text-orange-500" />
                  Vehicle Details
                </h2>
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div>
                    <p className="text-xs text-gray-500">BRAND</p>
                    <p className="font-medium text-gray-800">{vehicle?.brand}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">MODEL</p>
                    <p className="font-medium text-gray-800">{vehicle?.model}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">FUEL TYPE</p>
                    <p className="font-medium text-gray-800">{vehicle?.fuel_type}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">CATEGORY</p>
                    <p className="font-medium text-gray-800">{vehicle?.category}</p>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mb-4 line-clamp-3">{vehicle?.description}</p>
                <button
                  className="w-full bg-white border border-orange-500 text-orange-500 py-2.5 rounded-lg hover:bg-orange-50 transition-colors font-medium flex items-center justify-center"
                  onClick={() => navigate("/vehicleslists", { state: { driver: selectedDriver } })}>
                  <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Change Vehicle
                </button>
              </div>
            </div>

            {/* Driver Card */}
            <div className="bg-white shadow-lg rounded-2xl overflow-hidden border border-gray-200 transition-transform hover:shadow-xl">
              <div className="relative">
                {selectedDriver?.image ? (
                  <img 
                    src={`http://localhost:5000/uploads/${selectedDriver.image}`} 
                    className="w-full h-56 object-cover" 
                    alt={selectedDriver.name} 
                  />
                ) : (
                  <div className="w-full h-56 bg-gray-200 flex items-center justify-center">
                    <UserIcon className="h-16 w-16 text-gray-400" />
                  </div>
                )}
                {selectedDriver && (
                  <div className="absolute top-0 right-0 bg-orange-500 text-white px-3 py-1 m-2 rounded-full text-sm font-medium">
                    ₹{selectedDriver.price_per_day}/day
                  </div>
                )}
              </div>
              <div className="p-6">
                <h2 className="text-xl font-bold mb-3 text-gray-800 flex items-center">
                  <UserIcon className="h-5 w-5 mr-2 text-orange-500" />
                  Driver Details
                </h2>
                {selectedDriver ? (
                  <>
                    <div className="grid grid-cols-2 gap-3 mb-4">
                      <div>
                        <p className="text-xs text-gray-500">NAME</p>
                        <p className="font-medium text-gray-800">{selectedDriver.name}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">PHONE</p>
                        <p className="font-medium text-gray-800">{selectedDriver.phone}</p>
                      </div>
                      <div colSpan="2">
                        <p className="text-xs text-gray-500">LICENSE</p>
                        <p className="font-medium text-gray-800">{selectedDriver.license_number}</p>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mb-4 line-clamp-3">{selectedDriver.description}</p>
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center py-8 mb-4">
                    <p className="text-gray-500 mb-2">No driver selected</p>
                    <p className="text-sm text-gray-400">Select a driver or drive yourself</p>
                  </div>
                )}
                <button
                  className="w-full bg-white border border-orange-500 text-orange-500 py-2.5 rounded-lg hover:bg-orange-50 transition-colors font-medium flex items-center justify-center"
                  onClick={() => navigate(`/select-driver/${id}`, { state: { vehicle } })}>
                  <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                  </svg>
                  {selectedDriver ? "Change Driver" : "Add a Driver"}
                </button>
              </div>
            </div>

            {/* Rental Form */}
            <div className="bg-white shadow-lg rounded-2xl border border-gray-200 p-6 transition-transform hover:shadow-xl">
              <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                <CalendarIcon className="h-5 w-5 mr-2 text-orange-500" />
                Booking Details
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Pickup Location</label>
                  <div className="relative">
                    <MapPinIcon className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                    <input 
                      type="text" 
                      placeholder="Enter pickup location" 
                      value={pickupLocation} 
                      onChange={(e) => setPickupLocation(e.target.value)}
                      className={`w-full p-3 pl-10 border ${formErrors.pickupLocation ? 'border-red-500' : 'border-gray-300'} rounded-lg text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all`} 
                    />
                  </div>
                  {formErrors.pickupLocation && (
                    <p className="text-red-500 text-xs mt-1">{formErrors.pickupLocation}</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Dropoff Location</label>
                  <div className="relative">
                    <MapPinIcon className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                    <input 
                      type="text" 
                      placeholder="Enter dropoff location" 
                      value={dropoffLocation} 
                      onChange={(e) => setDropoffLocation(e.target.value)}
                      className={`w-full p-3 pl-10 border ${formErrors.dropoffLocation ? 'border-red-500' : 'border-gray-300'} rounded-lg text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all`}
                    />
                  </div>
                  {formErrors.dropoffLocation && (
                    <p className="text-red-500 text-xs mt-1">{formErrors.dropoffLocation}</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Pickup Date & Time</label>
                  <div className="relative">
                    <CalendarIcon className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                    <input 
                      type="datetime-local" 
                      value={pickupTime} 
                      onChange={(e) => setPickupTime(e.target.value)}
                      className={`w-full p-3 pl-10 border ${formErrors.pickupTime ? 'border-red-500' : 'border-gray-300'} rounded-lg text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all`}
                    />
                  </div>
                  {formErrors.pickupTime && (
                    <p className="text-red-500 text-xs mt-1">{formErrors.pickupTime}</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Dropoff Date & Time</label>
                  <div className="relative">
                    <CalendarIcon className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                    <input 
                      type="datetime-local" 
                      value={dropoffTime} 
                      onChange={(e) => setDropoffTime(e.target.value)}
                      className={`w-full p-3 pl-10 border ${formErrors.dropoffTime || formErrors.time ? 'border-red-500' : 'border-gray-300'} rounded-lg text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all`}
                    />
                  </div>
                  {formErrors.dropoffTime && (
                    <p className="text-red-500 text-xs mt-1">{formErrors.dropoffTime}</p>
                  )}
                  {formErrors.time && (
                    <p className="text-red-500 text-xs mt-1">{formErrors.time}</p>
                  )}
                </div>

                {/* Payment Summary */}
                {loyaltyLoading ? (
                  <div className="mt-6 p-4 bg-gray-50 rounded-lg text-center animate-pulse">
                    <p className="text-gray-600">Calculating payment summary...</p>
                  </div>
                ) : (
                  pickupTime && dropoffTime && vehicle && !formErrors.time && (
                    <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
                      <h3 className="text-lg font-semibold text-gray-700 mb-3 flex items-center">
                        <CurrencyRupeeIcon className="h-5 w-5 mr-2 text-green-600" />
                        Payment Summary
                      </h3>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <p className="text-gray-600">Duration:</p>
                          <p className="font-medium">{priceSummary.duration} day{priceSummary.duration !== 1 ? 's' : ''}</p>
                        </div>
                        <div className="flex justify-between">
                          <p className="text-gray-600">Vehicle Cost:</p>
                          <p className="font-medium">₹{(vehicle.rental_price * priceSummary.duration).toFixed(2)}</p>
                        </div>
                        {selectedDriver && (
                          <div className="flex justify-between">
                            <p className="text-gray-600">Driver Cost:</p>
                            <p className="font-medium">₹{(selectedDriver.price_per_day * priceSummary.duration).toFixed(2)}</p>
                          </div>
                        )}
                        <div className="flex justify-between">
                          <p className="text-gray-600">Loyalty Level:</p>
                          <p className="font-medium text-orange-600">{loyaltyLevel}</p>
                        </div>
                        <div className="flex justify-between">
                          <p className="text-gray-600">Discount:</p>
                          <p className="font-medium text-green-600">{priceSummary.discount}%</p>
                        </div>
                        <div className="flex justify-between">
                          <p className="text-gray-600">You Save:</p>
                          <p className="font-medium text-green-600">₹{priceSummary.saved.toFixed(2)}</p>
                        </div>
                        <div className="border-t border-gray-200 pt-2 mt-2"></div>
                        <div className="flex justify-between">
                          <p className="font-bold text-gray-800">Total:</p>
                          <p className="text-xl font-bold text-green-600">₹{priceSummary.finalPrice.toFixed(2)}</p>
                        </div>
                      </div>
                    </div>
                  )
                )}
                
                <button 
                  onClick={handleConfirmOrder}
                  disabled={isSubmitting || loyaltyLoading || Object.keys(formErrors).length > 0}
                  className={`w-full ${
                    isSubmitting || loyaltyLoading || Object.keys(formErrors).length > 0 
                      ? 'bg-gray-400 cursor-not-allowed' 
                      : 'bg-orange-500 hover:bg-orange-600'
                  } text-white py-3 rounded-lg transition-colors font-medium shadow-md mt-4 flex items-center justify-center`}>
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin h-5 w-5 mr-2 text-white" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </>
                  ) : "Confirm & Proceed to Payment"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default OrderPage;