import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
<<<<<<< HEAD
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const SelectDriverPage = () => {
  const [drivers, setDrivers] = useState([]);
=======

const SelectDriverPage = () => {
  const [drivers, setDrivers] = useState([]);
  const [onlyAvailable, setOnlyAvailable] = useState(false);

>>>>>>> 11994a839c9610f18e58ba2e77ba621b379f2522
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();
  const vehicle = location.state?.vehicle;

  useEffect(() => {
    const fetchDrivers = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/drivers");
<<<<<<< HEAD
        const availableDrivers = res.data.drivers.filter((driver) => driver.availability);
        setDrivers(availableDrivers);
=======
        setDrivers(res.data.drivers);
>>>>>>> 11994a839c9610f18e58ba2e77ba621b379f2522
      } catch (error) {
        console.error("Error fetching drivers:", error);
      }
    };
    fetchDrivers();
  }, []);

  if (!vehicle) {
<<<<<<< HEAD
    return <p className="text-center text-red-500 mt-10">Error: Vehicle data not found.</p>;
=======
    return <p>Error: Vehicle data not found. Please go back and select again.</p>;
>>>>>>> 11994a839c9610f18e58ba2e77ba621b379f2522
  }

  const viewDriverDetails = (driver) => {
    navigate(`/driver-details/${driver.id}`, {
      state: { driver, vehicle },
    });
  };

<<<<<<< HEAD
  const renderRating = (rating) => {
    if (rating === null) {
      return <span>No ratings yet</span>;
    }
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

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 text-gray-800 font-sans">
      <Navbar />

      <main className="flex-1 px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-4xl font-bold text-center mb-10 text-orange-600">
          Select a Driver
        </h1>

        {/* Full-Width Driver Grid */}
        <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {drivers.map((driver) => (
            <div
              key={driver.id}
              className="rounded-xl border border-gray-200 shadow-md overflow-hidden flex flex-col transition-transform hover:scale-105 duration-300 bg-white"
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
                    <strong>Rating: </strong>
                    {renderRating(driver.average_driver_rating)}
                  </div>
                </div>

                <div className="mt-4">
                  <p className="text-lg font-bold text-orange-600 mb-3">
                    ₹{driver.price_per_day} / day
                  </p>
                  <button
                    onClick={() => viewDriverDetails(driver)}
                    className="w-full py-3 px-6 rounded-full text-white text-base font-semibold shadow-md bg-orange-500 hover:bg-orange-600 hover:shadow-lg hover:scale-[1.02] transition-all duration-300"
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
=======
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
              <p className="mt-1 font-semibold text-orange-600">
                ₹{driver.price_per_day} / day
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
>>>>>>> 11994a839c9610f18e58ba2e77ba621b379f2522
    </div>
  );
};

export default SelectDriverPage;
