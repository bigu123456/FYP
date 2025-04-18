import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [editedComments, setEditedComments] = useState({});
  const [ratings, setRatings] = useState({});
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    if (userId) {
      axios.get(`http://localhost:5000/api/orders/user/${userId}`)
        .then(res => {
          setOrders(res.data.orders || []);
        })
        .catch(err => {
          console.error("Error fetching order history:", err);
        });
    }
  }, [userId]);

  const handleCommentChange = (orderId, value) => {
    setEditedComments(prev => ({ ...prev, [orderId]: value }));
  };

  const handleRatingChange = (orderId, type, value) => {
    setRatings(prev => ({
      
      ...prev,
      [orderId]: { ...prev[orderId], [type]: value }
      
    }));
  };

  const handleSubmit = async (orderId) => {
    const order = orders.find(o => o.id === orderId);
  
    const comment = editedComments[orderId] ?? order?.comment ?? "";
  
    // Strong type checking to avoid undefined
    const vehicle_rating_raw = ratings[orderId]?.vehicle_rating;
    const driver_rating_raw = ratings[orderId]?.driver_rating;
  
    const vehicle_rating = Number.isInteger(vehicle_rating_raw)
      ? vehicle_rating_raw
      : Number(order?.vehicle_rating) || 0;
  
    const driver_rating = Number.isInteger(driver_rating_raw)
      ? driver_rating_raw
      : Number(order?.driver_rating) || 0;
  
    console.log(" Submitting feedback:", {
      comment,
      vehicle_rating,
      driver_rating
    });
  
    try {
      await axios.post(`http://localhost:5000/api/orders/${orderId}/feedback`, {
        
      
      });
  
      
      
    } catch (err) {
      console.error(" Error submitting feedback:", err);
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
            orders.map(order => (
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

                    {/* Comment Section */}
                    <div className="mt-4">
                      
                      
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
