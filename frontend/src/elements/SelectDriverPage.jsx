import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import axios from "axios";

const SelectDriverPage = () => {
  const [drivers, setDrivers] = useState([]);
  const [successMessage, setSuccessMessage] = useState(null); // State to hold success message
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();
  const vehicle = location.state?.vehicle; // Get vehicle from location.state

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

  // Ensure vehicle exists before proceeding
  if (!vehicle) {
    return (
      <div>
        <p>Error: Vehicle data not found. Please go back and select again.</p>
      </div>
    );
  }

  const selectDriver = async (driver) => {
    try {
      // Update driver availability in backend
      const updatedDriver = { ...driver, availability: false };

      await axios.put(`http://localhost:5000/api/drivers/${driver.id}`, updatedDriver);

      // Update local state to reflect the driver's new availability status
      setDrivers((prevDrivers) =>
        prevDrivers.map((d) =>
          d.id === driver.id ? { ...d, availability: false } : d
        )
      );

      // Show success message
      setSuccessMessage(`Driver ${driver.name} selected successfully!`);
      setTimeout(() => setSuccessMessage(null), 3000);

      // Navigate to the Order page with the selected driver
      navigate(`/order/${id}`, { state: { vehicle, driver: updatedDriver } });
    } catch (error) {
      console.error("Error updating driver availability:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="mb-6 px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-orange-600 transition-all"
      >
        ← Back
      </button>

      <h1 className="text-center text-3xl font-bold text-gray-800 mb-8">
        Select a Driver
      </h1>

      {/* Success Message */}
      {successMessage && (
        <div className="mb-4 p-4 bg-green-500 text-white text-center rounded-md">
          {successMessage}
        </div>
      )}

      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {drivers.map((driver) => (
          <div
            key={driver.id}
            className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col transform transition-all duration-300 hover:shadow-xl hover:bg-orange-500 hover:text-white"
          >
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
            <div className="p-4 flex-1 flex flex-col">
              <h2 className="text-xl font-semibold mb-2">{driver.name}</h2>
              <p><span className="font-medium">Phone:</span> {driver.phone}</p>
              <p><span className="font-medium">License:</span> {driver.license_number}</p>
              <p><span className="font-medium">Availability:</span> {driver.availability ? "Available" : "Not Available"}</p>

              {/* Select Driver Button */}
              <button
                onClick={() => selectDriver(driver)}
                className="mt-4 w-full px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-700 transition-all"
                disabled={!driver.availability} // Disable button if driver is not available
              >
                Select Driver
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SelectDriverPage;
