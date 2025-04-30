import React, { useState, useEffect } from "react";
import axios from "axios";

const Usevehicles = () => {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); // Added state for error handling

  useEffect(() => {
    const fetchVehiclesUsage = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/vehicles/usage");

        setVehicles(response.data);  // Store the vehicle data
      } catch (error) {
        console.error("Error fetching vehicle data:", error);
        setError("Failed to load vehicle data. Please try again later."); // Set error message
      } finally {
        setLoading(false);
      }
    };

    fetchVehiclesUsage();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>; // Display error message
  }

  return (
    <div className="container mx-auto py-6">
      <h2 className="text-2xl font-semibold mb-4">Vehicle Availability</h2>

      <div className="overflow-x-auto bg-white shadow-md rounded-lg">
        <table className="min-w-full table-auto">
          <thead>
            <tr className="bg-orange-600 text-white">
              <th className="px-4 py-2 text-left">#</th>
              <th className="px-4 py-2 text-left">Model</th>
              <th className="px-4 py-2 text-left">Brand</th>
              <th className="px-4 py-2 text-left">Bookings</th>
              <th className="px-4 py-2 text-left">Status</th>
            </tr>
          </thead>
          <tbody>
            {vehicles.map((vehicle) => (
              <tr key={vehicle.id}>
                <td className="px-4 py-2">{vehicle.id}</td>
                <td className="px-4 py-2">{vehicle.model}</td>
                <td className="px-4 py-2">{vehicle.brand}</td>
                <td className="px-4 py-2">{vehicle.bookings}/10</td>
                <td className="px-4 py-2">
                  {vehicle.status === "Available" ? (
                    <span className="text-green-500">Available</span>
                  ) : (
                    <span className="text-red-500">Unavailable</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Usevehicles;
