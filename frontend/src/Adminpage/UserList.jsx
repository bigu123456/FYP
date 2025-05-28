import React, { useEffect, useState, useCallback } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [updatingUser, setUpdatingUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchUsers = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/users", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch users.");
      }

      const data = await response.json();
      console.log("Fetched Users Data:", data);
      setUsers(data);
    } catch (err) {
      console.error("Error fetching users:", err);
      setError(err.message || "An error occurred while fetching users.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleRoleChange = useCallback(async (userId, newRole) => {
    setUpdatingUser(userId);

    try {
      const response = await fetch(`http://localhost:5000/api/users/${userId}/role`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ role: newRole }),
      });

      if (!response.ok) {
        throw new Error("Failed to update role.");
      }

      const data = await response.json();
      alert(data.message);

      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === userId ? { ...user, role: newRole } : user
        )
      );
    } catch (err) {
      alert(err.message || "Error updating role.");
    } finally {
      setUpdatingUser(null);
    }
  }, []);

  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <p className="text-center text-gray-600 mt-10">Loading...</p>;
  }

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col bg-gray-50 overflow-auto" style={{ paddingLeft: "260px" }}>
        {/* Header */}
        <Header />

        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold text-black">User List</h2>
            <input
              type="text"
              placeholder="Search by name or email"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="p-2 border rounded-md shadow-sm text-sm w-72 focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
          </div>

          {error && <p className="text-red-500 mb-4">{error}</p>}

          {/* User Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
                <div
                  key={user.id}
                  className="bg-white p-6 rounded-lg shadow-md flex flex-col gap-3 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 hover:bg-orange-300"
                >
                  <h3 className="text-xl font-bold mb-2">{user.name}</h3>
                  <p className="text-gray-700 mb-1">
                    <span className="font-semibold">Email:</span> {user.email}
                  </p>
                  <p className="text-gray-700 mb-1">
                    <span className="font-semibold">Role:</span> {user.role}
                  </p>
                  <p className="text-gray-700 mb-1">
                    <span className="font-semibold">Contact:</span> {user.contact_number}
                  </p>
                  <p className="text-gray-700 mb-1">
                    <span className="font-semibold">City:</span> {user.city}
                  </p>
                  <p className="text-gray-700 mb-4">
                    <span className="font-semibold">Age:</span> {user.age}
                  </p>

                  {/* Role changer */}
                  <div>
                    <label htmlFor={`role-${user.id}`} className="block text-sm font-medium text-gray-600 mb-1">
                      Change Role
                    </label>
                    <select
                      id={`role-${user.id}`}
                      value={user.role}
                      onChange={(e) => handleRoleChange(user.id, e.target.value)}
                      disabled={updatingUser === user.id}
                      className="w-28 p-1 border rounded-md text-sm bg-white text-gray-700 shadow-sm hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:opacity-50 cursor-pointer"
                    >
                      <option value="user">User</option>
                      <option value="admin">Admin</option>
                    </select>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-600">No matching users found.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserList;
