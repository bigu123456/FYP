import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import axios from "axios";

const SelectDriverPage = () => {
  const [drivers, setDrivers] = useState([]);
  const [onlyAvailable, setOnlyAvailable] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();
  const vehicle = location.state?.vehicle;

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

  if (!vehicle) {
    return <p>Error: Vehicle data not found. Please go back and select again.</p>;
  }

  const viewDriverDetails = (driver) => {
    navigate(`/driver-details/${driver.id}`, {
      state: { driver, vehicle },
    });
  };

  const filteredDrivers = drivers.filter((driver) =>
    onlyAvailable ? driver.availability : true
  );

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

      {/* Toggle Available */}
      <div className="flex justify-end items-center mb-6">
        <label className="flex items-center gap-2 text-gray-700">
          <input
            type="checkbox"
            checked={onlyAvailable}
            onChange={(e) => setOnlyAvailable(e.target.checked)}
            className="w-4 h-4"
          />
          Show only available
        </label>
      </div>

      {/* Drivers Grid */}
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {filteredDrivers.map((driver) => (
          <div
            key={driver.id}
            className={`bg-white rounded-lg shadow-md overflow-hidden flex flex-col transform transition-all duration-300 ${
              driver.availability
                ? "hover:shadow-xl hover:bg-orange-500 hover:text-white"
                : "opacity-50"
            }`}
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
              <p>
                <span className="font-medium">Email:</span>{" "}
                <a href={`mailto:${driver.email}`} className="underline hover:text-blue-200">
                  {driver.email}
                </a>
              </p>
              <p>
                <span className="font-medium">Availability:</span>{" "}
                {driver.availability ? "Available" : "Not Available"}
              </p>

              <button
                onClick={() => viewDriverDetails(driver)}
                className={`mt-4 w-full px-4 py-2 rounded-md text-white transition-all ${
                  driver.availability
                    ? "bg-blue-500 hover:bg-blue-700"
                    : "bg-gray-400 cursor-not-allowed"
                }`}
                disabled={!driver.availability}
              >
                See Details
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SelectDriverPage;
