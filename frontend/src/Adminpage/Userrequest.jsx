import { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "./Sidebar";

export default function UserRequestList() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const res = await axios.get("/api/vehicle-requests");
        setRequests(res.data);
      } catch (error) {
        console.error("Error fetching requests:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, []);

  return (
    <div className="flex">
      <Sidebar />
      <div className="ml-64 w-full p-6">
        <h1 className="text-2xl font-semibold mb-4">Vehicle Listing Requests</h1>
        {loading ? (
          <p>Loading requests...</p>
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
                      src={`http://localhost:5000/uploads/${req.photo}`}
                      alt="Vehicle"
                      className="w-full md:w-60 h-40 object-cover rounded"
                    />
                  )}
                  <div className="flex-1">
                    <h2 className="text-lg font-bold">
                      {req.brand} {req.model}
                    </h2>
                    <p>
                      <strong>Submitted by:</strong> {req.name} ({req.phone})
                    </p>
                    <p><strong>Vehicle Type:</strong> {req.vehicle_type}</p>
                    <p><strong>Category:</strong> {req.category}</p>
                    <p>
                      <strong>Fuel:</strong> {req.fuel_type} |{" "}
                      <strong>Transmission:</strong> {req.transmission}
                    </p>
                    <p>
                      <strong>Seats:</strong> {req.seats} |{" "}
                      <strong>Price/day:</strong> NPR {req.price}
                    </p>
                    <p><strong>Plate No:</strong> {req.number_plate}</p>
                    <p><strong>Description:</strong> {req.description}</p>
                    <p className="italic text-sm mt-2">Message: {req.message}</p>
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
