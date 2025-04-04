import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const DriverList = () => {
  const [drivers, setDrivers] = useState([]);
  const navigate = useNavigate();

  // Fetch all drivers from the backend
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

  // Delete a driver by ID
  const deleteDriver = async (id) => {
    if (!window.confirm("Are you sure you want to delete this driver?")) return;

    try {
      await axios.delete(`http://localhost:5000/api/drivers/${id}`);
      setDrivers((prevDrivers) => prevDrivers.filter((driver) => driver.id !== id));
      alert("Driver deleted successfully!");
    } catch (error) {
      console.error("Error deleting driver:", error);
      alert("Failed to delete driver.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* Back button */}
      <button
        onClick={() => navigate(-1)}
        className="mb-6 px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-orange-600 transition-all"
      >
        ← Back
      </button>

      <h1 className="text-center text-3xl font-bold text-gray-800 mb-8">
        Driver List
      </h1>

      {/* Display drivers in a grid */}
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {drivers.map((driver) => (
          <div
            key={driver.id}
            className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col transform transition-all duration-300 hover:shadow-xl hover:bg-orange-500 hover:text-white"
          >
            {/* Display driver image */}
            {driver.image ? (
              <img
                src={`http://localhost:5000/uploads/${driver.image}`}
                alt={`${driver.name}'s profile`}
                className="w-full h-48 object-cover transition-all duration-300 hover:opacity-80"
              />
            ) : (
              <div className="w-full h-48 flex items-center justify-center bg-gray-200">
                <span className="text-gray-500">No Image</span>
              </div>
            )}

            {/* Driver details */}
            <div className="p-4 flex-1 flex flex-col">
              <h2 className="text-xl font-semibold mb-2">{driver.name}</h2>
              <p><span className="font-medium">Phone:</span> {driver.phone}</p>
              <p><span className="font-medium">License:</span> {driver.license_number}</p>
              
              {/* Driver availability */}
              <p>
                <span className="font-medium">Availability:</span>{" "}
                <span className={driver.availability ? "text-green-600" : "text-red-600"}>
                  {driver.availability ? "Available" : "Not Available"}
                </span>
              </p>

              {/* Display date when driver was added */}
              {driver.created_at && (
                <p className="text-sm mt-2">
                  Added on: {new Date(driver.created_at).toLocaleDateString()}
                </p>
              )}

              {/* Buttons to edit and delete driver */}
              <div className="mt-4 flex justify-between">
                <button
                  onClick={() => navigate(`/admin/Editdriver/${driver.id}`)}
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-700 transition-all"
                >
                  Edit
                </button>
                <button
                  onClick={() => deleteDriver(driver.id)}
                  className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-700 transition-all"
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
