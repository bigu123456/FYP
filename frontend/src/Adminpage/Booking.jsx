import React, { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "./Sidebar";
import Header from "./Header";
import { toast } from "react-toastify";

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/orders")
      .then((res) => {
        setOrders(res.data.orders || []);
      })
      .catch((err) => {
        console.error("Error fetching order history:", err);
        toast.error("Failed to fetch orders.");
      });
  }, []);

<<<<<<< HEAD
 
=======
  const handleDeleteOrder = async (orderId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this order?");
    if (!confirmDelete) return;

    try {
      const response = await axios.delete(`http://localhost:5000/api/orders/${orderId}`);
      if (response.data.success) {
        setOrders((prevOrders) => prevOrders.filter((order) => order.order_id !== orderId));
        toast.success("Order deleted successfully!",{ autoClose: 2000 });
      }
    } catch (err) {
      console.error("Failed to delete order:", err);
      toast.error("Something went wrong while deleting the order.",{ autoClose: 2000 });
    }
  };
>>>>>>> 11994a839c9610f18e58ba2e77ba621b379f2522

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 ml-16">
        <Header />
        <div className="flex justify-center items-center min-h-screen px-4 py-8">
          <div className="max-w-screen-xl w-full">
            <h1 className="text-3xl font-bold mb-6 text-center">All Orders</h1>
            <div className="grid gap-8">
              {orders.length === 0 ? (
                <p>No past orders found.</p>
              ) : (
                orders.map((order) => (
                  <div key={order.order_id} className="bg-white shadow-md rounded-xl p-6">
                    {/* Order Info */}
<<<<<<< HEAD
                    <div className="mb-4 flex justify-between items-start">
                      <div>
                        <h2 className="text-xl font-semibold text-blue-700">Order ID: {order.order_id}</h2>
                        <p className="text-gray-600"><strong>Name:</strong> {order.user_name}</p>
                        <p className="text-gray-600"><strong>Email:</strong> {order.user_email}</p>
                        <p className="text-gray-600"><strong>Phone:</strong> {order.user_contact}</p>
                        <p className="text-gray-600"><strong>City:</strong> {order.user_city}</p>
                        <p className="text-gray-600"><strong>Age:</strong> {order.user_age}</p>
                      </div>
                      
=======
                    <div className="mb-4 flex justify-between items-center">
                      <div>
                        <h2 className="text-xl font-semibold text-blue-700">Order ID: {order.order_id}</h2>
                        <p className="text-gray-600"><strong>User ID:</strong> {order.user_id}</p>
                      </div>
                      <button
                        onClick={() => handleDeleteOrder(order.order_id)}
                        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                      >
                        Delete
                      </button>
>>>>>>> 11994a839c9610f18e58ba2e77ba621b379f2522
                    </div>

                    <div className="grid md:grid-cols-3 gap-6">
                      {/* Vehicle Info */}
                      <div>
                        <h3 className="font-semibold text-lg mb-2">Vehicle</h3>
                        <p className="text-sm text-gray-600 mb-1"><strong>Vehicle ID:</strong> {order.vehicle_id}</p>
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
                      </div>

                      {/* Driver Info */}
                      <div>
                        <h3 className="font-semibold text-lg mb-2">Driver</h3>
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
                          <p className="text-gray-500">No driver assigned</p>
                        )}
                      </div>

<<<<<<< HEAD
                      {/* Booking Info */}
=======
                      {/* Pickup & Pricing Info */}
>>>>>>> 11994a839c9610f18e58ba2e77ba621b379f2522
                      <div>
                        <h3 className="font-semibold text-lg mb-2">Booking Details</h3>
                        <p><strong>Pickup:</strong> {new Date(order.pickup_time).toLocaleString()}</p>
                        <p><strong>Dropoff:</strong> {new Date(order.dropoff_time).toLocaleString()}</p>
                        <p><strong>Pickup Location:</strong> {order.pickup_location}</p>
                        <p><strong>Dropoff Location:</strong> {order.dropoff_location}</p>
                        <p className="mt-2"><strong>Original Price:</strong> ${order.original_price}</p>
                        <p><strong>Final Price:</strong> ${order.rental_price}</p>
                        <p><strong>Discount Applied:</strong> {order.discount_applied || 0}%</p>
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
    </div>
  );
};

export default OrderHistory;
