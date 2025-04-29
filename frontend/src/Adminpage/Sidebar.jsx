import { Link } from "react-router-dom";
import { LayoutDashboard, Users, Car, UserCheck, Calendar, UserPlus } from "lucide-react";
import { useEffect } from "react";
import { io } from "socket.io-client";

// Notification sound
const notificationSound = new Audio('/sounds/notification.mp3');

// Socket connection 
const socket = io('http://localhost:5000'); 

const Sidebar = () => {
  useEffect(() => {
    // Request permission for browser notifications
    if (Notification.permission !== "granted") {
      Notification.requestPermission();
    }

    // Listen for newBooking event
    socket.on('newBooking', (data) => {
      console.log('New booking received in Sidebar!', data);

      // Play notification sound
      notificationSound.play().catch(error => {
        console.error("Audio play error:", error);
      });

      // Show browser notification
      if (Notification.permission === "granted") {
        new Notification("🚗 New Booking!", {
          body: `User ${data.userName || "Someone"} just booked a vehicle.`,
          icon: "/icons/booking-icon.png", // Optional: set your icon here
        });
      }
    });

    // Clean up the socket listener on unmount
    return () => {
      socket.off('newBooking');
    };
  }, []);

  return (
    <div className="fixed top-0 left-0 w-64 min-h-screen bg-orange-600 text-white p-5 z-10">
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
            to="/booking"
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
        <li className="py-2">
          <Link
            to="/admin/userrequest"
            className="flex items-center gap-3 p-2 hover:bg-orange-200 rounded text-white font-semibold"
          >
            <UserPlus size={20} /> <span>User Requests</span>
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
