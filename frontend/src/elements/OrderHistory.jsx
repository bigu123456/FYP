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
  const handleDeleteOrder = async (orderId) => {
    const confirm = window.confirm("Are you sure you want to delete this order?");
    if (!confirm) return;
  
    try {
      const response = await axios.delete(`http://localhost:5000/api/orders/${orderId}`);
      if (response.data.success) {
        setOrders((prev) => prev.filter((order) => order.id !== orderId));
      }
    } catch (err) {
      console.error("Failed to delete order:", err);
      alert("Something went wrong while deleting the order.");
    }
  };
  

  return (
    <>
      <Navbar />
      <div className="max-w-screen-xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Your Order History</h1>
        <div className="grid gap-8">
          {orders.length === 0 ? (
            <p>No past orders found.</p>
          ) : (
            orders.map((order) => (
              <div key={order.id} className="bg-white shadow-md rounded-xl p-6">
                <div className="grid md:grid-cols-3 gap-4">
                  {/* Vehicle Info */}
                  <div>
                    <h3 className="font-semibold text-lg mb-2">Vehicle</h3>
                    {order.vehicle_image && (
                      <img
                        src={`http://localhost:5000${order.vehicle_image}`}
                        alt={`${order.vehicle_brand} ${order.vehicle_model}`}
                        className="h-40 w-full object-cover rounded mb-2"
                      />
                    )}
                    <p><strong>Brand:</strong> {order.vehicle_brand}</p>
                    <p><strong>Model:</strong> {order.vehicle_model}</p>
                    <p><strong>Category:</strong> {order.vehicle_category}</p>
                    <p><strong>Fuel Type:</strong> {order.vehicle_fuel_type}</p>
                    <p><strong>Price:</strong> ₹{order.rental_price}</p>
                    <p><strong>Description:</strong> {order.vehicle_description}</p>
                  </div>

                  {/* Driver Info */}
                  {order.driver_name && (
                    <div>
                      <h3 className="font-semibold text-lg mb-2">Driver</h3>
                      {order.driver_image && (
                        <img
                          src={`http://localhost:5000/uploads/${order.driver_image}`}
                          alt={order.driver_name}
                          className="h-40 w-full object-cover rounded mb-2"
                        />
                      )}
                      <p><strong>Name:</strong> {order.driver_name}</p>
                      <p><strong>Phone:</strong> {order.driver_phone}</p>
                      <p><strong>License:</strong> {order.driver_license}</p>
                      <p><strong>Description:</strong> {order.driver_description}</p>
                    </div>
                  )}

                  {/* Booking Info */}
                  <div>
                    <h3 className="font-semibold text-lg mb-2">Booking Info</h3>
                    <p><strong>Pickup:</strong> {order.pickup_location}</p>
                    <p><strong>Dropoff:</strong> {order.dropoff_location}</p>
                    <p><strong>Pickup Time:</strong> {new Date(order.pickup_time).toLocaleString()}</p>
                    <p><strong>Dropoff Time:</strong> {new Date(order.dropoff_time).toLocaleString()}</p>
                    <p><strong>Order ID:</strong> {order.id}</p>
                    <button
      onClick={() => handleDeleteOrder(order.id)}
      className="mt-4 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
    >
      Delete Order
    </button>
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
