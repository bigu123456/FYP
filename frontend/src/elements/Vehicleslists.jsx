import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Vehicles = () => {
  const [vehicles, setVehicles] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:5000/api/vehicles")
      .then((res) => res.json())
      .then((data) => setVehicles(data))
      .catch((err) => console.error(err));
  }, []);

  const handleViewDetails = (vehicle) => {
    navigate(`/details/${vehicle.id}`, { state: { vehicle } });
  };

  return (
    <div className="p-5">
      <button
        onClick={() => navigate(-1)}
        className="mb-4 bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-all font-bold"
      >
        Back
      </button>

      <h2 className="text-xl font-bold mb-4">Vehicle List</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {vehicles.map((vehicle) => (
          <div
            key={vehicle.id}
            className="bg-white p-5 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all"
          >
            <img
              src={`http://localhost:5000${vehicle.image_url}`}
              alt={vehicle.model}
              className="w-full h-48 object-cover rounded-lg mb-4"
            />
            <div className="space-y-2">
              <p><strong>Brand:</strong> {vehicle.brand}</p>
              <p><strong>Model:</strong> {vehicle.model}</p>
              <p><strong>Category:</strong> {vehicle.category}</p>
              <p><strong>Type:</strong> {vehicle.type}</p>
              <p><strong>Fuel Type:</strong> {vehicle.fuel_type}</p>
              <p><strong>Rental Price:</strong> ${vehicle.rental_price}</p>
              <p><strong>Available:</strong> {vehicle.availability ? "✅" : "❌"}</p>
            </div>

            <div className="mt-4">
              <button
                onClick={() => handleViewDetails(vehicle)}
                className="bg-yellow-400 text-white font-semibold px-4 py-2 rounded-lg hover:bg-yellow-500 transition-all"
              >
                Details
              </button>
            </div>


            
          </div>
        ))}
      </div>
    </div>
  );
};

export default Vehicles;
