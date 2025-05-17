import React, { useEffect, useState } from "react";
import { Car, CheckCircle, User, Truck } from "lucide-react";

const Dashboard = () => {
  const [vehicles, setVehicles] = useState([]);
  const [orders, setOrders] = useState([]);
  const [drivers, setDrivers] = useState([]);

  useEffect(() => {
    // Fetch vehicles (with availability logic from backend)
    fetch("http://localhost:5000/api/vehicles")
      .then((res) => res.json())
      .then((data) => setVehicles(data))
      .catch((err) => console.error(err));

    // Fetch orders
    fetch("http://localhost:5000/api/orders")
      .then((res) => res.json())
      .then((data) => setOrders(data))
      .catch((err) => console.error(err));

    // Fetch drivers
    fetch("http://localhost:5000/api/drivers")
      .then((res) => res.json())
      .then((data) => setDrivers(data.drivers || []))
      .catch((err) => console.error(err));
  }, []);

  // === Vehicle Stats ===
  const totalVehicles = vehicles.length;
  const availableVehicles = vehicles.filter((v) => v.availability === true).length;
  const bookedVehicles = totalVehicles - availableVehicles;

  // === Driver Stats ===
  const totalDrivers = drivers.length;
  const availableDrivers = drivers.filter((d) => d.availability === true).length;
  const bookedDrivers = totalDrivers - availableDrivers;

  return (
    <div className="p-5">
      <div className="grid grid-cols-3 gap-4">
        {/* Total Vehicles */}
        <StatCard icon={<Car size={32} className="text-orange-600" />} label="Total Vehicles" value={totalVehicles} />

        {/* Available Vehicles */}
        <StatCard icon={<CheckCircle size={32} className="text-green-600" />} label="Available Vehicles" value={availableVehicles} />

        {/* Booked Vehicles */}
        <StatCard icon={<CheckCircle size={32} className="text-red-600" />} label="Booked Vehicles" value={bookedVehicles} />

        {/* Total Drivers */}
        <StatCard icon={<Truck size={32} className="text-blue-600" />} label="Total Drivers" value={totalDrivers} />

        {/* Available Drivers */}
        <StatCard icon={<User size={32} className="text-yellow-600" />} label="Available Drivers" value={availableDrivers} />

        {/* Booked Drivers */}
        <StatCard icon={<CheckCircle size={32} className="text-purple-600" />} label="Booked Drivers" value={bookedDrivers} />
      </div>
    </div>
  );
};

// A small reusable component to keep things clean
const StatCard = ({ icon, label, value }) => (
  <div className="bg-white p-4 rounded shadow flex items-center gap-4 hover:shadow-lg hover:scale-105 transition-transform duration-300">
    {icon}
    <div>
      <h3 className="text-lg font-semibold">{label}</h3>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  </div>
);

export default Dashboard;
