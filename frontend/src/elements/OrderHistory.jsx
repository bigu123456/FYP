import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [feedbackData, setFeedbackData] = useState({});
  const [submittedFeedback, setSubmittedFeedback] = useState({});
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    if (!userId) return;

    axios
      .get(`http://localhost:5000/api/orders/user/${userId}`)
      .then((res) => {
        const orders = res.data.orders || [];
        setOrders(orders);
        setFilteredOrders(orders);
      })
      .catch((err) => {
        console.error("Error fetching order history:", err);
      });

    const local = localStorage.getItem("feedbackPersisted");
    if (local) {
      try {
        const parsed = JSON.parse(local);
        setSubmittedFeedback(parsed);
      } catch (e) {
        console.error("Failed to parse local feedback:", e);
      }
    }

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
        setSubmittedFeedback((prev) => ({ ...prev, ...feedbackMap }));
      })
      .catch((err) => {
        console.error("Error fetching feedback:", err);
      });
  }, [userId]);

  useEffect(() => {
    const combined = {
      ...submittedFeedback,
      ...feedbackData,
    };
    localStorage.setItem("feedbackPersisted", JSON.stringify(combined));
  }, [feedbackData, submittedFeedback]);

  useEffect(() => {
    if (!searchQuery) {
      setFilteredOrders(orders);
    } else {
      const lowerQuery = searchQuery.toLowerCase();
      const filtered = orders.filter((order) =>
        [order.vehicle_brand, order.vehicle_model, order.driver_name, order.pickup_location, order.dropoff_location,order.driver_name,orders.driver_phone]
          .filter(Boolean)
          .some((field) => field.toLowerCase().includes(lowerQuery))
      );
      setFilteredOrders(filtered);
    }
  }, [searchQuery, orders]);

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
          setFeedbackData((prev) => ({
            ...prev,
            [orderId]: {
              ...prev[orderId],
              [type]: i + 1,
              comment:
                prev[orderId]?.comment ??
                submittedFeedback[orderId]?.comment ??
                "",
              vehicle_id:
                submittedFeedback[orderId]?.vehicle_id ??
                orders.find((o) => o.order_id === orderId)?.vehicle_id,
              driver_id:
                submittedFeedback[orderId]?.driver_id ??
                orders.find((o) => o.order_id === orderId)?.driver_id,
              editing: true,
            },
          }))
        }
      >
        ★
      </span>
    ));
  };

  const handleSubmitFeedback = async (orderId) => {
    const feedback = feedbackData[orderId];
    if (!feedback || !feedback.comment?.trim() || !feedback.vehicle_rating || !feedback.driver_rating) {
      toast.warn("Please provide a comment and both ratings.");
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

      setSubmittedFeedback((prev) => ({
        ...prev,
        [orderId]: { ...feedback },
      }));

      setFeedbackData((prev) => {
        const updated = { ...prev };
        delete updated[orderId];
        return updated;
      });

      toast.success("Thank you for your feedback!", {
        autoClose: 2000,
      });
    } catch (err) {
      console.error("Error submitting feedback:", err);
      toast.error("Something went wrong while submitting feedback.");
    }
  };

  return (
    <>
      <Navbar />
      <ToastContainer />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <h1 className="text-4xl font-bold text-gray-800">Your Order History</h1>
          <input
            type="text"
            placeholder="Search by vehicle, driver, location..."
            className="w-full md:w-80 px-4 py-2 border border-gray-300 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-400"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <p className="mb-6 text-center text-gray-600">
          We hope you had a wonderful experience. Your feedback helps us improve.
        </p>

        <div className="grid gap-8">
          {filteredOrders.length === 0 ? (
            <p className="text-center text-gray-600">No matching orders found.</p>
          ) : (
            filteredOrders.map((order) => {
              const feedback =
                feedbackData[order.order_id] ||
                submittedFeedback[order.order_id] ||
                {};
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
                        <p><strong>Discount Applied:</strong> {order.loyalty_discount}%</p>
                        <p><strong>You Saved:</strong> ₹{order.loyalty_saved}</p>
                        <p><strong>Final Price:</strong> ₹{order.rental_price}</p>
                         <p>Payment Status: {order.payment_status || 'Completed'}</p>

                      </div>
                    </div>
                  </div>

                  <div className="mt-6 bg-white text-black p-4 rounded-xl shadow-sm">
                    <h4 className="text-lg font-semibold mb-4">Rate and Comment</h4>
                    
                    <div className="mb-2">
                      <p className="font-semibold">Driver Rating:</p>
                      {renderStars(order.order_id, "driver_rating")}
                    </div>
                    <textarea
                      className="w-full border border-gray-300 p-2 rounded-lg mt-3"
                      rows={3}
                      placeholder="Leave a comment..."
                      value={feedback.comment || ""}
                      disabled={submittedFeedback[order.order_id] && !feedbackData[order.order_id]?.editing}
                      onChange={(e) =>
                        setFeedbackData((prev) => ({
                          ...prev,
                          [order.order_id]: {
                            ...prev[order.order_id],
                            comment: e.target.value,
                            vehicle_id: order.vehicle_id,
                            driver_id: order.driver_id,
                            editing: true,
                          },
                        }))
                      }
                    />
                    <div className="flex justify-end mt-3">
                      {submittedFeedback[order.order_id] &&
                      !feedbackData[order.order_id]?.editing ? (
                        <button
                          className="px-3 py-1 text-sm bg-yellow-400 text-black rounded-full hover:bg-yellow-500 transition"
                          onClick={() =>
                            setFeedbackData((prev) => ({
                              ...prev,
                              [order.order_id]: {
                                ...submittedFeedback[order.order_id],
                                editing: true,
                              },
                            }))
                          }
                        >
                          Edit Feedback
                        </button>
                      ) : (
                        <button
                          className="px-3 py-1 text-sm bg-yellow-400 text-black rounded-full hover:bg-yellow-500 transition"
                          onClick={() => handleSubmitFeedback(order.order_id)}
                        >
                          {submittedFeedback[order.order_id] ? "Update Feedback" : "Submit Feedback"}
                        </button>
                      )}
                    </div>
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
