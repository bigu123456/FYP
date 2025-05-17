import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [feedbackData, setFeedbackData] = useState({});
  const [submittedFeedback, setSubmittedFeedback] = useState({});
  const userId = localStorage.getItem("userId");

  // Load submitted feedback + orders on mount
  useEffect(() => {
    if (!userId) return;

    // Fetch orders
    axios
      .get(`http://localhost:5000/api/orders/user/${userId}`)
      .then((res) => {
        setOrders(res.data.orders || []);
      })
      .catch((err) => {
        console.error("Error fetching order history:", err);
      });

    // Fetch submitted feedback
    axios
      .get(`http://localhost:5000/api/feedback/user/${userId}`)
      .then((res) => {
        const feedbackMap = {};
        res.data.forEach((f) => {
          feedbackMap[f.order_id] = {
            comment: f.comment,
            vehicle_rating: f.vehicle_rating,
            driver_rating: f.driver_rating,
            vehicle_id: f.vehicle_id,
            driver_id: f.driver_id,
          };
        });
        setSubmittedFeedback(feedbackMap);
      })
      .catch((err) => {
        console.error("Error fetching feedback:", err);
      });

    // Load any unsaved feedback from localStorage
    const saved = localStorage.getItem("unsavedFeedback");
    if (saved) {
      try {
        setFeedbackData(JSON.parse(saved));
      } catch (e) {
        console.error("Error parsing saved feedback:", e);
      }
    }
  }, [userId]);

  // Save feedbackData to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("unsavedFeedback", JSON.stringify(feedbackData));
  }, [feedbackData]);

  // Render stars
  const renderStars = (orderId, type) => {
    const rating =
      feedbackData[orderId]?.[type] ??
      submittedFeedback[orderId]?.[type] ??
      0;

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
              comment: feedbackData[orderId]?.comment ?? submittedFeedback[orderId]?.comment ?? "",
              vehicle_id: submittedFeedback[orderId]?.vehicle_id ?? null,
              driver_id: submittedFeedback[orderId]?.driver_id ?? null,
              editing: true,
            },
          })
        }
      >
        ★
      </span>
    ));
  };

  // Submit or update feedback
  const handleSubmitFeedback = async (orderId) => {
    const feedback = feedbackData[orderId];
    if (
      !feedback ||
      !feedback.comment?.trim() ||
      !feedback.vehicle_rating ||
      !feedback.driver_rating
    ) {
      toast.warn("Please provide a comment and both ratings before submitting.", {
        position: "top-center",
        autoClose: 2000,
        pauseOnHover: false,
        closeOnClick: true,
        closeButton: false,
        draggable: false,
      });
      return;
    }

    try {
      await axios.post("http://localhost:5000/api/feedback/submit", {
        order_id: orderId,
        comment: feedback.comment,
        vehicle_rating: feedback.vehicle_rating,
        driver_rating: feedback.driver_rating,
        vehicle_id: feedback.vehicle_id,
        driver_id: feedback.driver_id,
        user_id: userId,
      });

      // Save to submittedFeedback
      setSubmittedFeedback((prev) => ({
        ...prev,
        [orderId]: {
          comment: feedback.comment,
          vehicle_rating: feedback.vehicle_rating,
          driver_rating: feedback.driver_rating,
          vehicle_id: feedback.vehicle_id,
          driver_id: feedback.driver_id,
        },
      }));

      // Remove from feedbackData
      setFeedbackData((prev) => {
        const updated = { ...prev };
        delete updated[orderId];
        return updated;
      });

      toast.success("Thank you for your feedback!", {
        position: "top-center",
        autoClose: 2000,
        pauseOnHover: false,
        closeOnClick: true,
        closeButton: false,
        draggable: false,
      });
    } catch (err) {
      console.error("Error submitting feedback:", err);
      toast.error("Something went wrong while submitting feedback.", {
        position: "top-center",
        autoClose: 2000,
        pauseOnHover: false,
        closeButton: false,
      });
    }
  };

  return (
    <>
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-12">
        <ToastContainer />
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-10">Your Order History</h1>
        <p className="mb-6 text-center text-gray-600">
          We hope you had a great experience. Your feedback helps us improve.
        </p>

        <div className="grid gap-8">
          {orders.length === 0 ? (
            <p className="text-center text-gray-600">No past orders found.</p>
          ) : (
            orders.map((order) => {
              const isEditing = feedbackData[order.order_id]?.editing;

              return (
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
                      <p><strong>Brand:</strong> {order.vehicle_brand}</p>
                      <p><strong>Model:</strong> {order.vehicle_model}</p>
                      <p><strong>Category:</strong> {order.vehicle_category}</p>
                      <p><strong>Fuel Type:</strong> {order.vehicle_fuel_type}</p>
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
                        <p><strong>Name:</strong> {order.driver_name}</p>
                        <p><strong>Phone:</strong> {order.driver_phone}</p>
                        <p><strong>License:</strong> {order.driver_license}</p>
                      </div>
                    )}

                    <div>
                      <h3 className="text-xl font-semibold mb-3 border-b border-gray-700 pb-2">Booking Info</h3>
                      <p><strong>Pickup:</strong> {order.pickup_location}</p>
                      <p><strong>Dropoff:</strong> {order.dropoff_location}</p>
                      <p><strong>Pickup Time:</strong> {new Date(order.pickup_time).toLocaleString()}</p>
                      <p><strong>Dropoff Time:</strong> {new Date(order.dropoff_time).toLocaleString()}</p>
                      <div className="mt-5 bg-gray-800 text-white p-4 rounded-lg">
                        <h4 className="text-lg font-semibold mb-3">Payment Summary</h4>
                        <p><strong>Original Price:</strong> ₹{order.original_price}</p>
                        
                        <p><strong>Discount Applied:</strong> {order.discount_applied}%</p>
                        <p><strong>You Saved:</strong> ₹{order.discount_amount}</p>
                        <p><strong>Final Price:</strong> ₹{order.rental_price}</p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 bg-white text-black p-4 rounded-xl shadow-sm">
                    <h4 className="text-lg font-semibold mb-4">Rate and Comment</h4>

                    {submittedFeedback[order.order_id] && !isEditing ? (
                      <div>
                        <p><strong>Vehicle Rating:</strong> {submittedFeedback[order.order_id].vehicle_rating} ★</p>
                        <p><strong>Driver Rating:</strong> {submittedFeedback[order.order_id].driver_rating} ★</p>
                        <p><strong>Comment:</strong> {submittedFeedback[order.order_id].comment}</p>
                        <button
                          className="mt-2 text-blue-600 hover:underline"
                          onClick={() => {
                            setFeedbackData({
                              ...feedbackData,
                              [order.order_id]: {
                                ...submittedFeedback[order.order_id],
                                editing: true,
                              },
                            });
                          }}
                        >
                          Edit Feedback
                        </button>
                      </div>
                    ) : (
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
                              value={
                                feedbackData[order.order_id]?.comment ??
                                submittedFeedback[order.order_id]?.comment ??
                                ""
                              }
                              onChange={(e) =>
                                setFeedbackData({
                                  ...feedbackData,
                                  [order.order_id]: {
                                    ...feedbackData[order.order_id],
                                    comment: e.target.value,
                                    vehicle_id: submittedFeedback[order.order_id]?.vehicle_id ?? order.vehicle_id,
                                    driver_id: submittedFeedback[order.order_id]?.driver_id ?? order.driver_id,
                                    editing: true,
                                  },
                                })
                              }
                            />
                          </div>

                          <button
                            onClick={() => handleSubmitFeedback(order.order_id)}
                            className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded"
                          >
                            {submittedFeedback[order.order_id] ? "Update Feedback" : "Submit Feedback"}
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default OrderHistory;