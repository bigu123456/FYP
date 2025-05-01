import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    if (userId) {
      axios
        .get(`http://localhost:5000/api/orders/user/${userId}`)
        .then((res) => {
          setOrders(res.data.orders || []);
        })
        .catch((err) => {
          console.error("Error fetching order history:", err);
        });
    }
  }, [userId]);

  return (
    <>
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-10">Your Order History</h1>
        <p className="text-bold-400">We hope you had a wonderful experience using our services and that your 
          journey was smooth, enjoyable, and memorable. Our team works hard to ensure every ride meets your expectations, 
          from vehicle quality to driver professionalism. Your feedback means a lot to us—it helps us improve and continue 
          delivering top-notch service. If you enjoyed your trip, we’d greatly appreciate it if you could take a moment
           to rate our service, driver, and vehicle
          . Thank you for choosing us, and we look forward to being part of your next adventure!</p>
        <div className="grid gap-8">
          {orders.length === 0 ? (
            <p className="text-center text-gray-600">No past orders found.</p>
          ) : (
            orders.map((order) => (
              <div key={order.order_id} className="bg-black text-white rounded-2xl shadow-lg p-6">
                <div className="grid md:grid-cols-3 gap-6">
                  {/* Vehicle Info */}
                  <div>
                    <h3 className="text-xl font-semibold mb-3 border-b border-gray-700 pb-2">Vehicle</h3>
                    {order.vehicle_image && (
                      <img
                        src={`http://localhost:5000${order.vehicle_image}`}
                        alt={`${order.vehicle_brand} ${order.vehicle_model}`}
                        className="h-40 w-full object-cover rounded-lg mb-3"
                      />
                    )}
                    <p><span className="font-medium">Brand:</span> {order.vehicle_brand}</p>
                    <p><span className="font-medium">Model:</span> {order.vehicle_model}</p>
                    <p><span className="font-medium">Category:</span> {order.vehicle_category}</p>
                    <p><span className="font-medium">Fuel Type:</span> {order.vehicle_fuel_type}</p>
                  </div>

                  {/* Driver Info */}
                  {order.driver_name && (
                    <div>
                      <h3 className="text-xl font-semibold mb-3 border-b border-gray-700 pb-2">Driver</h3>
                      {order.driver_image && (
                        <img
                          src={`http://localhost:5000/uploads/${order.driver_image}`}
                          alt={order.driver_name}
                          className="h-40 w-full object-cover rounded-lg mb-3"
                        />
                      )}
                      <p><span className="font-medium">Name:</span> {order.driver_name}</p>
                      <p><span className="font-medium">Phone:</span> {order.driver_phone}</p>
                      <p><span className="font-medium">License:</span> {order.driver_license}</p>
                    </div>
                  )}

                  {/* Booking Info */}
                  <div>
                    <h3 className="text-xl font-semibold mb-3 border-b border-gray-700 pb-2">Booking Information</h3>
                    <p><span className="font-medium">Pickup:</span> {order.pickup_location}</p>
                    <p><span className="font-medium">Dropoff:</span> {order.dropoff_location}</p>
                    <p><span className="font-medium">Pickup Time:</span> {new Date(order.pickup_time).toLocaleString()}</p>
                    <p><span className="font-medium">Dropoff Time:</span> {new Date(order.dropoff_time).toLocaleString()}</p>
                    

                    {/* Payment Summary */}
                    <div className="mt-5 bg-gray-800 text-white p-4 rounded-lg">
                      <h4 className="text-lg font-semibold mb-3">Payment Summary</h4>
                      <p><span className="font-medium">Original Price:</span> ₹{order.original_price}</p>
                      <p><span className="font-medium">Discount Applied:</span> {order.discount_applied}%</p>
                      <p><span className="font-medium">You Saved:</span> ₹{order.discount_amount}</p>
                      <p><span className="font-medium">Final Price:</span> ₹{order.rental_price}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default OrderHistory;
