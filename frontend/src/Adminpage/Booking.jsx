import React, { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "./Sidebar";
import Header from "./Header";
import { toast } from "react-toastify";

const OrderHistory = () => {
  // State to store all fetched orders
  const [orders, setOrders] = useState([]);
  // State to store the current search term
  const [searchTerm, setSearchTerm] = useState("");

  // Function to fetch orders from the backend
  const fetchOrders = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/orders");
      setOrders(res.data.orders || []);
    } catch (err) {
      console.error("Error fetching order history:", err);
      toast.error("Failed to fetch orders.");
    }
  };

  // Fetch orders once on component mount
  useEffect(() => {
    fetchOrders();
  }, []);

  // Function to determine order status based on current time
  const getOrderStatus = (order) => {
    const now = new Date();
    const pickup = new Date(order.pickup_time);
    const dropoff = new Date(order.dropoff_time);

    if (now >= pickup && now <= dropoff) {
      return "Running";
    } else if (pickup > now) {
      return "Upcoming";
    } else {
      return "Completed";
    }
  };

  // Filter orders to show only "Running" or "Upcoming" and apply search
  const filteredOrders = orders
    .filter((order) => {
      const status = getOrderStatus(order);
      if (status === "Completed") return false; // Skip completed orders

      const term = searchTerm.toLowerCase();
      return (
        order.user_name?.toLowerCase().includes(term) ||
        order.user_email?.toLowerCase().includes(term) ||
        order.user_city?.toLowerCase().includes(term) ||
        order.vehicle_model?.toLowerCase().includes(term) ||
        order.driver_name?.toLowerCase().includes(term) ||
        order.driver_phone?.toLowerCase().includes(term)
      );
    })
    .sort((a, b) => new Date(a.pickup_time) - new Date(b.pickup_time)); // Sort by pickup time

  return (
    <div className="flex bg-black min-h-screen text-white">
      {/* Sidebar on the left */}
      <Sidebar />
      <div className="flex-1 ml-16">
        {/* Header bar at the top */}
        <Header />

        {/* Main content area */}
        <div className="flex flex-col px-6 py-8 max-w-screen-xl mx-auto w-full">
          {/* Header and search input */}
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-white">Current & Upcoming Orders</h1>

            {/* Search bar */}
            <div className="flex space-x-4 items-center">
              <input
                type="text"
                placeholder="Search by user, vehicle, driver..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="px-4 py-2 rounded-lg border border-gray-700 bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-orange-400 transition w-72"
              />
            </div>
          </div>

          {/* Order cards */}
          <div className="space-y-6">
            {filteredOrders.length === 0 ? (
              // Message when no orders match
              <p className="text-gray-400 text-center">No running or upcoming orders found.</p>
            ) : (
              // Map through filtered orders and display each one
              filteredOrders.map((order) => (
                <div
                  key={order.order_id}
                  className="bg-gray-900 shadow-lg rounded-xl p-6 border border-gray-700"
                >
                  {/* User Info */}
                  <div className="flex justify-between mb-4">
                    <div>
                      <h2 className="text-xl font-semibold text-blue-400">
                        Order ID: {order.order_id}
                      </h2>
                      <p><strong>Name:</strong> {order.user_name}</p>
                      <p><strong>Email:</strong> {order.user_email}</p>
                      <p><strong>Phone:</strong> {order.user_contact}</p>
                      <p><strong>City:</strong> {order.user_city}</p>
                      <p><strong>Age:</strong> {order.user_age}</p>
                      <p><strong>User ID:</strong> {order.user_id}</p>

                      {/* Display order status badge */}
                      <p className="mt-2">
                        <span
                          className={`inline-block px-3 py-1 rounded-full text-xs font-semibold
                            ${
                              getOrderStatus(order) === "Running"
                                ? "bg-green-700 text-white"
                                : "bg-yellow-600 text-white"
                            }`}
                        >
                          {getOrderStatus(order)}
                        </span>
                      </p>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-3 gap-6">
                    {/* Vehicle Info */}
                    <div>
                      <h3 className="font-semibold text-lg mb-2 text-blue-300">Vehicle</h3>
                      {order.vehicle_image && (
                        <img
                          src={`http://localhost:5000${order.vehicle_image}`}
                          alt={`${order.vehicle_brand} ${order.vehicle_model}`}
                          className="h-40 w-full object-cover rounded mb-2"
                        />
                      )}
                      <p><strong>Vehicle ID:</strong> {order.vehicle_id}</p>
                      <p><strong>Brand:</strong> {order.vehicle_brand}</p>
                      <p><strong>Model:</strong> {order.vehicle_model}</p>
                      <p><strong>Category:</strong> {order.vehicle_category}</p>
                      <p><strong>Fuel:</strong> {order.vehicle_fuel_type}</p>
                    </div>

                    {/* Driver Info */}
                    <div>
                      <h3 className="font-semibold text-lg mb-2 text-blue-300">Driver</h3>
                      {order.driver_image && (
                        <img
                          src={`http://localhost:5000/uploads/${order.driver_image}`}
                          alt={order.driver_name}
                          className="h-40 w-full object-cover rounded mb-2"
                        />
                      )}
                      {order.driver_name ? (
                        <>
                          <p><strong>Name:</strong> {order.driver_name}</p>
                          <p><strong>Phone:</strong> {order.driver_phone}</p>
                          <p><strong>License:</strong> {order.driver_license}</p>
                          <p><strong>Driver ID:</strong> {order.driver_id}</p>
                        </>
                      ) : (
                        <p className="text-gray-400">No driver assigned</p>
                      )}
                    </div>

                    {/* Booking Info */}
                    <div>
                      <h3 className="font-semibold text-lg mb-2 text-blue-300">Booking</h3>
                      <p><strong>Pickup:</strong> {new Date(order.pickup_time).toLocaleString()}</p>
                      <p><strong>Dropoff:</strong> {new Date(order.dropoff_time).toLocaleString()}</p>
                      <p><strong>Pickup Location:</strong> {order.pickup_location}</p>
                      <p><strong>Dropoff Location:</strong> {order.dropoff_location}</p>
                      <p className="mt-2"><strong>Original Price:</strong> ${order.original_price}</p>
                      <p><strong>Final Price:</strong> ${order.rental_price}</p>
                      <p><strong>Discount:</strong> {order.discount_applied || 0}%</p>
                      <p><strong>Discount Amount:</strong> ${order.discount_amount || 0}</p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderHistory;
