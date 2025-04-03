import { Link } from "react-router-dom";
import { LayoutDashboard, Users, Car, UserCheck, Calendar } from "lucide-react";

const Sidebar = () => {
  return (
    <div className="w-64 min-h-screen bg-orange-600 text-white p-5">
      <h2 className="text-xl font-bold flex items-center gap-2">
        <Car size={24} /> Vehicle Rental System
      </h2>
      <ul className="mt-5">
        <li className="py-2">
          <Link
            to="/admin"
            className="flex items-center gap-3 p-2 hover:bg-orange-200 rounded text-white font-semibold"
          >
            <LayoutDashboard size={20} /> <span>Dashboard</span>
          </Link>
        </li>
        <li className="py-2">
          <Link
            to="/user-list"
            className="flex items-center gap-3 p-2 hover:bg-orange-200 rounded text-white font-semibold"
          >
            <Users size={20} /> <span>Users</span>
          </Link>
        </li>
        <li className="py-2">
          <Link
            to="/admin/AddVehicle"
            className="flex items-center gap-3 p-2 hover:bg-orange-200 rounded text-white font-semibold"
          >
            <Car size={20} /> <span>Add Vehicles</span>
          </Link>
        </li>
        <li className="py-2">
          <Link
            to="/admin/vehicles"
            className="flex items-center gap-3 p-2 hover:bg-orange-200 rounded text-white font-semibold"
          >
            <Car size={20} /> <span>Vehicle List</span>
          </Link>
        </li>
        <li className="py-2">
          <Link
            to="/admin/booking"
            className="flex items-center gap-3 p-2 hover:bg-orange-200 rounded text-white font-semibold"
          >
            <Calendar size={20} /> <span>Booking</span>
          </Link>
        </li>
        <li className="py-2">
          <Link
            to="/admin/Driverlist"
            className="flex items-center gap-3 p-2 hover:bg-orange-200 rounded text-white font-semibold"
          >
            <UserCheck size={20} /> <span>Drivers</span>
          </Link>
        </li>
        <li className="py-2">
          <Link
            to="/admin/Adddriver"
            className="flex items-center gap-3 p-2 hover:bg-orange-200 rounded text-white font-semibold"
          >
            <UserCheck size={20} /> <span>Add Driver</span>
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
