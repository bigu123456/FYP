import React, { useEffect, useState, useCallback } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";

const UserList = () => {
  const [users, setUsers] = useState([]); // Store users data
  const [error, setError] = useState(""); // Error state
  const [loading, setLoading] = useState(true); // Loading state
  const [updatingUser, setUpdatingUser] = useState(null); // Track updating user

  useEffect(() => {
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
        setUsers(data);
      } catch (err) {
        setError(err.message || "An error occurred while fetching users.");
      } finally {
        setLoading(false);
      }
    };

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

  if (loading) {
    return <p className="text-center text-gray-600">Loading...</p>;
  }

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1">
        {/* Header */}
        <Header />

        <div className="p-6">
          <h2 className="text-2xl font-semibold mb-6 text-black">User List</h2>
          {error && <p className="text-red-500 mb-4">{error}</p>}

          <table className="w-full table-auto border-collapse shadow-md rounded-lg overflow-hidden">
            <thead>
              <tr className="bg-orange-400 text-white">
                <th className="border px-6 py-4 text-left">Name</th>
                <th className="border px-6 py-4 text-left">Email</th>
                <th className="border px-6 py-4 text-left">Role</th>
                <th className="border px-6 py-4 text-left">Contact Number</th>
                <th className="border px-6 py-4 text-left">Action</th>
              </tr>
            </thead>
            <tbody>
              {users.length > 0 ? (
                users.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50 transition duration-300">
                    <td className="border px-6 py-4">{user.name}</td>
                    <td className="border px-6 py-4">{user.email}</td>
                    <td className="border px-6 py-4">{user.role}</td>
                    <td className="border px-6 py-4">{user.contact_number}</td>
                    <td className="border px-6 py-4">
                      <label htmlFor={`role-${user.id}`} className="sr-only">
                        Change Role
                      </label>
                      <select
                        id={`role-${user.id}`}
                        value={user.role}
                        onChange={(e) => handleRoleChange(user.id, e.target.value)}
                        disabled={updatingUser === user.id}
                        className="bg-blue-100 p-2 rounded-md text-sm font-medium text-gray-700 hover:bg-blue-200 transition duration-200 disabled:opacity-50"
                      >
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                      </select>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center border px-6 py-4">
                    No users found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default UserList;
