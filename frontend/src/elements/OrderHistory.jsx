import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [feedbackData, setFeedbackData] = useState({});
  const [submittedOrders, setSubmittedOrders] = useState([]);
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

  const renderStars = (orderId, type) => {
    const rating = feedbackData[orderId]?.[type] || 0;
    return Array.from({ length: 5 }, (_, i) => (
      <span
        key={i}
        className={`cursor-pointer text-xl ${i < rating ? "text-yellow-400" : "text-gray-400"}`}
        onClick={() =>
          setFeedbackData({
            ...feedbackData,
            [orderId]: {
              ...feedbackData[orderId],
              [type]: i + 1,
            },
          })
        }
      >
        ★
      </span>
    ));
  };

  const handleSubmitFeedback = async (orderId) => {
    const feedback = feedbackData[orderId];
    if (!feedback) return;
  
    try {
      await axios.post("http://localhost:5000/api/feedback/submit", {
        order_id: orderId,
        comment: feedback.comment || "",
        vehicle_rating: feedback.vehicle_rating || 0,
        driver_rating: feedback.driver_rating || 0,
        vehicle_id: feedback.vehicle_id,
        driver_id: feedback.driver_id,
        user_id: userId,
      });
  
      // ✅ This line marks the order as feedback submitted
      setSubmittedOrders((prev) => [...prev, orderId]);
  
      toast.success("Thank you for your feedback! We appreciate your review.", {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
  
    } catch (err) {
      console.error("Error submitting feedback:", err);
    }
  };
  

  return (
    <>
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-10">Your Order History</h1>
        <p className="text-bold-400 mb-6">We hope you had a wonderful experience using our services. Your feedback means a lot to us—it helps us improve. Please rate our service, driver, and vehicle.</p>

        <div className="grid gap-8">
          {orders.length === 0 ? (
            <p className="text-center text-gray-600">No past orders found.</p>
          ) : (
            orders.map((order) => (
              <div key={order.order_id} className="bg-black text-white rounded-2xl shadow-lg p-6">
                <div className="grid md:grid-cols-3 gap-6">
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

                  <div>
                    <h3 className="text-xl font-semibold mb-3 border-b border-gray-700 pb-2">Booking Information</h3>
                    <p><span className="font-medium">Pickup:</span> {order.pickup_location}</p>
                    <p><span className="font-medium">Dropoff:</span> {order.dropoff_location}</p>
                    <p><span className="font-medium">Pickup Time:</span> {new Date(order.pickup_time).toLocaleString()}</p>
                    <p><span className="font-medium">Dropoff Time:</span> {new Date(order.dropoff_time).toLocaleString()}</p>

                    <div className="mt-5 bg-gray-800 text-white p-4 rounded-lg">
                      <h4 className="text-lg font-semibold mb-3">Payment Summary</h4>
                      <p><span className="font-medium">Original Price:</span> ₹{order.original_price}</p>
                      <p><span className="font-medium">Discount Applied:</span> {order.discount_applied}%</p>
                      <p><span className="font-medium">You Saved:</span> ₹{order.discount_amount}</p>
                      <p><span className="font-medium">Final Price:</span> ₹{order.rental_price}</p>
                    </div>
                  </div>
                </div>

                {!submittedOrders.includes(order.order_id) && (
                  <div className="mt-6 bg-white text-black p-4 rounded-xl shadow-sm">
                    <h4 className="text-lg font-semibold mb-4">Rate and Comment</h4>
                    <div className="md:flex gap-6">
                      <div className="md:w-1/2 space-y-3">
                        <div className="flex items-center gap-2">
                          <label className="w-32 font-medium">Vehicle Rating:</label>
                          {renderStars(order.order_id, "vehicle_rating")}
                        </div>

                        <div className="flex items-center gap-2">
                          <label className="w-32 font-medium">Driver Rating:</label>
                          {renderStars(order.order_id, "driver_rating")}
                        </div>
                      </div>

                      <div className="md:w-1/2 space-y-4 mt-4 md:mt-0">
                        <div>
                          <label className="block font-medium">Comment</label>
                          <textarea
                            rows="4"
                            className="w-full p-2 rounded border"
                            placeholder="Write your feedback..."
                            onChange={(e) =>
                              setFeedbackData({
                                ...feedbackData,
                                [order.order_id]: {
                                  ...feedbackData[order.order_id],
                                  comment: e.target.value,
                                  vehicle_id: order.vehicle_id,
                                  driver_id: order.driver_id,
                                },
                              })
                            }
                          />
                        </div>

                        <button
                          onClick={() => handleSubmitFeedback(order.order_id)}
                          className="bg-orange-600 hover:bg-orange-700 text-white px-2 py-2"
                        >
                          Submit Feedback
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
      <Footer />
<ToastContainer />

    </>
  );
};

export default OrderHistory;
