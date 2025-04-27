import { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "./Sidebar";

export default function UserRequestList() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const res = await axios.get("/api/vehicle-requests");
        setRequests(res.data);
      } catch (error) {
        setError("Error fetching vehicle requests.");
        console.error("Error fetching requests:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, []);

  const handleUpdateStatus = async (id, newStatus) => {
    try {
      await axios.put(`/api/vehicle-requests/${id}`, { status: newStatus });
      setRequests(prevRequests =>
        prevRequests.map(req =>
          req.id === id ? { ...req, status: newStatus } : req
        )
      );
    } catch (error) {
      console.error("Error updating request status:", error);
      setError("Error updating request status.");
    }
  };

  return (
    <div className="flex">
      <Sidebar />
      <div className="ml-64 w-full p-6">
        <h1 className="text-2xl font-semibold mb-4">Vehicle Listing Requests</h1>

        {loading ? (
          <div className="flex justify-center items-center h-40">
            <div className="loader">Loading...</div>
          </div>
        ) : error ? (
          <div className="text-red-600">{error}</div>
        ) : requests.length === 0 ? (
          <p>No vehicle requests found.</p>
        ) : (
          <div className="grid gap-4">
            {requests.map((req) => (
              <div
                key={req.id}
                className="bg-white rounded-xl shadow p-4 border hover:shadow-lg transition"
              >
                <div className="flex flex-col md:flex-row gap-4">
                  {req.photo && (
                    <img
                      src={`${
                        process.env.REACT_APP_API_URL || "http://localhost:5000"
                      }/uploads/${req.photo}`}
                      alt="Vehicle"
                      className="w-full md:w-60 h-40 object-cover rounded"
                    />
                  )}
                  <div className="flex-1">
                    <h2 className="text-lg font-bold">
                      {req.brand} {req.model}
                    </h2>
                    <p>
                      <strong>Submitted by:</strong> {req.name} (
                      <a href={`mailto:${req.email}`} className="text-blue-600 underline">
                        {req.email}
                      </a>
                      )
                    </p>
                    <p><strong>Vehicle Type:</strong> {req.vehicle_type}</p>
                    <p><strong>Category:</strong> {req.category}</p>
                    <p><strong>Fuel:</strong> {req.fuel_type} | <strong>Transmission:</strong> {req.transmission}</p>
                    <p><strong>Seats:</strong> {req.seats} | <strong>Price/day:</strong> NPR {req.price}</p>
                    <p><strong>Plate No:</strong> {req.number_plate}</p>
                    <p><strong>Description:</strong> {req.description}</p>
                    <p className="italic text-sm mt-2">Message: {req.message}</p>

                    <p className="mt-2">
                      <strong>Status:</strong>{" "}
                      <span
                        className={
                          req.status === 'approved'
                            ? "text-green-600"
                            : req.status === 'rejected'
                            ? "text-red-600"
                            : "text-gray-600"
                        }
                      >
                        {req.status || 'Pending'}
                      </span>
                    </p>

                    {req.status === "pending" ? (
                      <div className="flex gap-2 mt-4">
                        <button
                          onClick={() => handleUpdateStatus(req.id, "approved")}
                          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleUpdateStatus(req.id, "rejected")}
                          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
                        >
                          Reject
                        </button>
                      </div>
                    ) : (
                      <div className="flex gap-2 mt-4">
                        <button
                          onClick={() => handleUpdateStatus(req.id, "pending")}
                          className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 transition"
                        >
                          Cancel
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
