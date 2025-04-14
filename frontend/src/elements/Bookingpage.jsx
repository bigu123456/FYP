import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const BookingPage = () => {
  const [orders, setOrders] = useState([]); // State to store fetched orders
  const [error, setError] = useState(null); // Error state
  const navigate = useNavigate();
  const [userId, setUserId] = useState(null); // Store the user ID from localStorage

  // Fetch logged-in user ID from local storage
  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");
    if (storedUserId) {
      setUserId(parseInt(storedUserId, 10));  // Set userId from localStorage
    } else {
      // Redirect to login if the user is not logged in
      navigate("/login");
    }
  }, [navigate]);

  // Fetch orders when the component mounts
  useEffect(() => {
    if (userId) {
      fetch("http://localhost:5000/api/orders")
        .then((res) => res.json())
        .then((data) => {
          // Filter orders to show only those that belong to the logged-in user
          const userOrders = data.orders.filter(order => order.user_id === userId);
          console.log("User Orders fetched:", userOrders);
          setOrders(userOrders);
        })
        .catch((err) => {
          setError("Error fetching orders.");
          console.error("Error fetching orders:", err);
        });
    }
  }, [userId]);

  return (
    <>
      <Navbar />
      <div className="p-6 bg-gray-100">
        <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">
          Your Orders
        </h2>
        <div className="max-w-6xl mx-auto">
          {error && <p className="text-red-500 text-center">{error}</p>}
          {orders.length === 0 ? (
            <p className="text-center text-gray-600">No orders found.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {orders.map((order) => (
                <div key={order.id} className="bg-white p-4 rounded-lg shadow-md">
                  {order.vehicle_image ? (
                    <img
                      src={order.vehicle_image}
                      alt="Vehicle"
                      className="w-full h-40 object-cover rounded-md mb-3"
                    />
                  ) : (
                    <img
                      src="/path/to/default/image.jpg"
                      alt="Default Vehicle"
                      className="w-full h-40 object-cover rounded-md mb-3"
                    />
                  )}
                  <h3 className="text-xl font-semibold mb-2 text-gray-800">
                    Order ID: {order.id}
                  </h3>
                  <p><strong>User ID:</strong> {order.user_id}</p>
                  <p><strong>Vehicle ID:</strong> {order.vehicle_id}</p>
                  <p><strong>Driver ID:</strong> {order.driver_id ? order.driver_id : "Not assigned"}</p> {/* Display Driver ID */}
                  <p><strong>Rental Price:</strong> ${order.rental_price}</p>
                  <p><strong>Pickup Location:</strong> {order.pickup_location}</p>
                  <p><strong>Drop-off Location:</strong> {order.dropoff_location}</p>
                  <p>
                    <strong>Pickup Time:</strong>{" "}
                    {new Date(order.pickup_time).toLocaleString()}
                  </p>
                  <p>
                    <strong>Drop-off Time:</strong>{" "}
                    {new Date(order.dropoff_time).toLocaleString()}
                  </p>
                  <p>
                    <strong>Status:</strong>{" "}
                    <span className="text-blue-600">{order.status}</span>
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <Footer /> {/* Use Footer component */}
    </>
  );
};

export default BookingPage;
