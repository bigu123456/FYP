import { Car, CheckCircle, User, DollarSign } from "lucide-react";

import React, { useEffect, useState } from "react";

const Dashboard = () => {
  const [vehicles, setVehicles] = useState([]); // State to store all vehicles
  const [availableVehicles, setAvailableVehicles] = useState(0); // State to store count of available vehicles

  useEffect(() => {
    // Fetch all vehicles from the backend
    fetch("http://localhost:5000/api/vehicles")
      .then((res) => res.json())
      .then((data) => {
        setVehicles(data); // Set all vehicles data
        // Calculate the number of available vehicles
        const available = data.filter(vehicle => vehicle.status === "available").length;
        setAvailableVehicles(available); // Set the count of available vehicles
      })
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="p-5">
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded shadow flex items-center gap-4 transition-transform duration-300 hover:scale-105 hover:shadow-lg">
          <Car size={32} className="text-orange-600" />
          <div>
            <h3 className="text-lg font-semibold">Total Vehicles</h3>
            <p className="text-2xl font-bold">{vehicles.length}</p> {/* Display the total number of vehicles */}
          </div>
        </div>
        <div className="bg-white p-4 rounded shadow flex items-center gap-4 transition-transform duration-300 hover:scale-105 hover:shadow-lg">
          <CheckCircle size={32} className="text-green-600" />
          <div>
            <h3 className="text-lg font-semibold">Available</h3>
            <p className="text-2xl font-bold">{availableVehicles}</p> {/* Display the number of available vehicles */}
          </div>
        </div>
        <div className="bg-white p-4 rounded shadow flex items-center gap-4 transition-transform duration-300 hover:scale-105 hover:shadow-lg">
          <User size={32} className="text-blue-600" />
          <div>
            <h3 className="text-lg font-semibold">With Drivers</h3>
            <p className="text-2xl font-bold">0</p> {/* Update this based on your data */}
          </div>
        </div>
        <div className="bg-white p-4 rounded shadow flex items-center gap-4 transition-transform duration-300 hover:scale-105 hover:shadow-lg">
          <DollarSign size={32} className="text-yellow-600" />
          <div>
            <h3 className="text-lg font-semibold">Revenue Potential</h3>
            <p className="text-2xl font-bold">$250.00</p> {/* Example revenue potential */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
