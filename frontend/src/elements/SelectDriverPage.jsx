import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

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
    return <p className="text-center text-red-500 mt-10">Error: Vehicle data not found.</p>;
  }

  const viewDriverDetails = (driver) => {
    navigate(`/driver-details/${driver.id}`, {
      state: { driver, vehicle },
    });
  };

  const renderRating = (rating) => {
    if (rating === null) return <span>No ratings yet</span>;
    const stars = Array(5)
      .fill(false)
      .map((_, index) => index < rating);
    return (
      <div className="flex items-center">
        {stars.map((star, index) => (
          <span key={index} className={`text-yellow-500 ${star ? "text-xl" : "text-base"}`}>
            {star ? "★" : "☆"}
          </span>
        ))}
        <span className="ml-2 text-sm text-gray-600">({rating})</span>
      </div>
    );
  };

  const filteredDrivers = drivers.filter((driver) =>
    onlyAvailable ? driver.availability : true
  );

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 text-gray-800 font-sans">
      <Navbar />
      <main className="flex-1 px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-4xl font-bold text-center mb-6 text-orange-600">Select a Driver</h1>

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

        <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredDrivers.map((driver) => (
            <div
              key={driver.id}
              className={`rounded-xl border border-gray-200 shadow-md overflow-hidden flex flex-col transition-transform duration-300 ${
                driver.availability ? "hover:scale-105 bg-white" : "opacity-60 bg-gray-100"
              }`}
            >
              {driver.image ? (
                <img
                  src={`http://localhost:5000/uploads/${driver.image}`}
                  alt={`${driver.name}'s profile`}
                  className="w-full h-48 object-cover"
                />
              ) : (
                <div className="w-full h-48 flex items-center justify-center bg-gray-200 text-gray-500">
                  No Image
                </div>
              )}

              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <h2 className="text-xl font-semibold mb-1">{driver.name}</h2>
                  <p className="text-sm mb-1"><strong>Phone:</strong> {driver.phone}</p>
                  <p className="text-sm mb-1"><strong>License:</strong> {driver.license_number}</p>
                  <p className="text-sm mb-1">
                    <strong>Email:</strong>{" "}
                    <a
                      href={`mailto:${driver.email}`}
                      className="text-blue-600 hover:underline"
                    >
                      {driver.email}
                    </a>
                  </p>
                  <div className="mb-3">
                    <strong>Rating:</strong> {renderRating(driver.average_driver_rating)}
                  </div>
                </div>

                <div className="mt-4">
                  <p className="text-lg font-bold text-orange-600 mb-3">
                    ₹{driver.price_per_day} / day
                  </p>
                  <button
                    onClick={() => viewDriverDetails(driver)}
                    className={`w-full py-3 px-6 rounded-full text-white text-base font-semibold shadow-md transition-all duration-300 ${
                      driver.availability
                        ? "bg-orange-500 hover:bg-orange-600 hover:shadow-lg hover:scale-[1.02]"
                        : "bg-gray-400 cursor-not-allowed"
                    }`}
                    disabled={!driver.availability}
                  >
                    See Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default SelectDriverPage;
