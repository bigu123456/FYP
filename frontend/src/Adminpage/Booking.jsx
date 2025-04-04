import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Sidebar from "./Sidebar";
import Header from "./Header"; // Optional header component


const Booking = () => {
  const [orders, setOrders] = useState([]); // State to store fetched orders
  const navigate = useNavigate();

  // Fetch orders when the component mounts
  useEffect(() => {
    fetch("http://localhost:5000/api/orders")
      .then((res) => res.json())
      .then((data) => {
        console.log("Orders fetched:", data.orders);
        setOrders(data.orders);
      })
      .catch((err) => console.error("Error fetching orders:", err));
  }, []);

  return (
    <>
      
      <div className="flex min-h-screen">
        {/* Sidebar stays fixed or sticky */}
        <Sidebar />

        {/* Main content area */}
        <div className="flex-1">
          {/* Optionally add a header for the page */}
          <Header />

          <div className="p-6 bg-gray-100">
            <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">
              Your Orders
            </h2>
            <div className="max-w-6xl mx-auto">
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
                      <p><strong>Vehicle ID:</strong> {order.vehicle_id}</p>
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
                      <button
                        className="mt-4 w-full bg-orange-500 text-white font-semibold py-2 rounded-lg hover:bg-orange-600 transition-all"
                        onClick={() => navigate(`/order-details/${order.id}`)}
                      >
                        View Details
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
    </>
  );
};

export default Booking;
