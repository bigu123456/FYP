import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const DriversPage = () => {
  const [drivers, setDrivers] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/drivers") // Ensure correct API endpoint
      .then((res) => res.json())
      .then((data) => setDrivers(data))
      .catch((err) => console.error("Error fetching drivers:", err));
  }, []);

  return (
    <>
      <Navbar />
      <div className="p-6 bg-gray-100 min-h-screen">
        <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">Driver List</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {drivers.length > 0 ? (
              drivers.map((driver) => (
                <div key={driver.id} className="bg-gray-50 p-4 rounded-lg shadow">
                  <p><strong>Name:</strong> {driver.name}</p>
                  <p><strong>Phone:</strong> {driver.phone}</p>
                  <p><strong>License:</strong> {driver.license_number}</p>
                  <p><strong>Status:</strong> {driver.availability ? "✅ Available" : "❌ Not Available"}</p>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-600">No drivers found.</p>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default DriversPage;
