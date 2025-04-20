import React, { useEffect, useState } from "react";
import axios from "axios";

const LoyaltyDashboard = () => {
  const [topUsers, setTopUsers] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:5000/api/loyalty/loyalty-users")
      .then(res => {
        if (res.data.success) {
          setTopUsers(res.data.users);
        }
      })
      .catch(err => console.error("Failed to load top users:", err));
  }, []);

  const getLevelColor = (level) => {
    switch (level) {
      case "Platinum": return "bg-gradient-to-r from-gray-300 to-white text-black";
      case "Gold": return "bg-yellow-400 text-white";
      case "Silver": return "bg-gray-400 text-white";
      case "Bronze": return "bg-orange-500 text-white";
      default: return "bg-gray-200 text-black";
    }
  };

  return (
    <div className="p-6 bg-white rounded-xl shadow-lg max-w-4xl mx-auto mt-10">
      <h2 className="text-3xl font-bold text-center mb-6 text-orange-600">🏆 Top Loyal Users</h2>
      <table className="min-w-full table-auto border border-gray-300 rounded-lg overflow-hidden">
        <thead className="bg-orange-100">
          <tr>
            <th className="border p-3 text-left">Name</th>
            <th className="border p-3 text-left">Email</th>
            <th className="border p-3 text-center">Points</th>
            <th className="border p-3 text-center">Level</th>
          </tr>
        </thead>
        <tbody>
          {topUsers.map((user, idx) => (
            <tr key={idx} className="hover:bg-orange-50 transition">
              <td className="border p-3">{user.name}</td>
              <td className="border p-3 text-blue-600 underline">{user.email}</td>
              <td className="border p-3 text-center font-medium">{user.loyalty_points}</td>
              <td className="border p-3 text-center">
                <span className={`px-3 py-1 rounded-full font-bold text-sm ${getLevelColor(user.loyalty_level)}`}>
                  {user.loyalty_level}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default LoyaltyDashboard;
