import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const DriverList = () => {
  const [drivers, setDrivers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDrivers = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/drivers");
        setDrivers(res.data.drivers);
      } catch (error) {
        console.error("Error fetching drivers:", error);
      }
    };
    fetchDrivers();
  }, []);

  const deleteDriver = async (id) => {
    if (!window.confirm("Are you sure you want to delete this driver?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/drivers/${id}`);
      setDrivers((prev) => prev.filter((driver) => driver.id !== id));
      alert("Driver deleted successfully!");
    } catch (error) {
      console.error("Error deleting driver:", error);
      alert("Failed to delete driver.");
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value.toLowerCase());
  };

  const handleSort = (e) => {
    setSortBy(e.target.value);
  };

  const filteredDrivers = drivers
    .filter((driver) =>
      [driver.name, driver.phone, driver.license_number, driver.email]
        .join(" ")
        .toLowerCase()
        .includes(searchTerm)
    )
    .sort((a, b) => {
      if (sortBy === "availability") {
        return a.availability === b.availability ? 0 : a.availability ? -1 : 1;
      } else if (sortBy === "name") {
        return (a.name || "").localeCompare(b.name || "");
      }
      return 0;
    });

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <button
        onClick={() => navigate(-1)}
        className="mb-6 px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-orange-600 transition-all"
      >
        ← Back
      </button>

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Driver List</h1>

        {/* Compact Search Box */}
        <div className="relative">
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={handleSearch}
            className="w-40 sm:w-48 pl-4 pr-10 py-2 bg-gray-800 text-white rounded-full focus:outline-none focus:ring-2 focus:ring-orange-400 placeholder:text-gray-300"
          />
          <button className="absolute top-1 right-1 w-8 h-8 rounded-full bg-white flex items-center justify-center">
            <svg
              className="w-4 h-4 text-gray-800"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-4.35-4.35M11 18a7 7 0 100-14 7 7 0 000 14z"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Sort Dropdown */}
      <div className="flex justify-end mb-6">
        <select
          value={sortBy}
          onChange={handleSort}
          className="px-4 py-2 border border-gray-300 rounded-md"
        >
          <option value="">Sort By</option>
          <option value="availability">Availability</option>
          <option value="name">Name</option>
        </select>
      </div>

      {/* Driver Cards */}
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {filteredDrivers.map((driver) => (
          <div
            key={driver.id}
            className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col transition duration-300 hover:shadow-xl hover:bg-orange-500 hover:text-white"
          >
            {driver.image ? (
              <img
                src={`http://localhost:5000/uploads/${driver.image}`}
                alt={`${driver.name}'s profile`}
                className="w-full h-48 object-cover hover:opacity-80"
              />
            ) : (
              <div className="w-full h-48 flex items-center justify-center bg-gray-200">
                <span className="text-gray-500">No Image</span>
              </div>
            )}

            <div className="p-4 flex-1 flex flex-col">
              <h2 className="text-xl font-semibold mb-2">{driver.name}</h2>
              <p><span className="font-medium">Phone:</span> {driver.phone}</p>
              <p><span className="font-medium">License:</span> {driver.license_number}</p>
              <p>
                <span className="font-medium">Email:</span>{" "}
                <a href={`mailto:${driver.email}`} className="underline hover:text-blue-300">
                  {driver.email}
                </a>
              </p>
              <p>
                <span className="font-medium">Availability:</span>{" "}
                <span className={driver.availability ? "text-green-600" : "text-red-600"}>
                  {driver.availability ? "Available" : "Not Available"}
                </span>
              </p>
              {driver.created_at && (
                <p className="text-sm mt-2">
                  Added on: {new Date(driver.created_at).toLocaleDateString()}
                </p>
              )}
              <div className="mt-4 flex justify-between">
                <button
                  onClick={() => navigate(`/admin/Editdriver/${driver.id}`)}
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-700"
                >
                  Edit
                </button>
                <button
                  onClick={() => deleteDriver(driver.id)}
                  className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DriverList;
