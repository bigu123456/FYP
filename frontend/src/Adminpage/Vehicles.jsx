import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import Header from "./Header";

const Vehicles = () => {
  const [vehicles, setVehicles] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingVehicle, setEditingVehicle] = useState(null);
  const [editForm, setEditForm] = useState({
    brand: "",
    model: "",
    category: "",
    type: "",
    fuel_type: "",
    rental_price: "",
    description: "",
    availability: true,
    image: null,
  });

  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:5000/api/vehicles")
      .then((res) => res.json())
      .then((data) => {
        console.log("Fetched vehicles:", data); // Debug log to check the fetched data
        setVehicles(data);
      })
      .catch((err) => console.error("Error fetching vehicles:", err));
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this vehicle?")) return;

    try {
      const res = await fetch(`http://localhost:5000/api/vehicles/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to delete the vehicle");
      }

      alert("Vehicle deleted successfully!");
      setVehicles(vehicles.filter((vehicle) => vehicle.id !== id));
    } catch (err) {
      console.error("Error:", err);
      alert(err.message);
    }
  };

  const handleViewDetails = (vehicle) => {
    navigate(`/vehicle-details/${vehicle.id}`, { state: { vehicle } });
  };

  const openEditModal = (vehicle) => {
    setEditingVehicle(vehicle);
    setEditForm({
      brand: vehicle.brand,
      model: vehicle.model,
      category: vehicle.category,
      type: vehicle.type,
      fuel_type: vehicle.fuel_type,
      rental_price: vehicle.rental_price,
      description: vehicle.description,
      availability: vehicle.availability,
      image: null,
    });
  };

  const handleEditChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image") {
      setEditForm((prev) => ({ ...prev, image: files[0] }));
    } else if (name === "availability") {
      setEditForm((prev) => ({ ...prev, availability: value === "true" }));
    } else {
      setEditForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    Object.entries(editForm).forEach(([key, value]) => {
      if (value !== null) formData.append(key, value);
    });

    try {
      const res = await fetch(`http://localhost:5000/api/vehicles/${editingVehicle.id}`, {
        method: "PUT",
        body: formData,
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.message || "Update failed");

      alert("Vehicle updated successfully!");
      setVehicles((prev) =>
        prev.map((v) => (v.id === editingVehicle.id ? result.vehicle : v))
      );
      setEditingVehicle(null);
    } catch (err) {
      console.error("Update error:", err);
      alert(err.message);
    }
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Filter vehicles based on search term
  const filteredVehicles = vehicles.filter((vehicle) =>
    vehicle.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vehicle.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vehicle.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vehicle.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vehicle.fuel_type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Filter vehicles based on availability
  const availableVehicles = filteredVehicles.filter((v) => v.availability);

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 p-5 ml-64">
        <Header />
        <h2 className="text-xl font-bold mb-4">Vehicle List</h2>

        {/* Search Box */}
        <div className="mb-4">
          <input
            type="text"
            placeholder="Search vehicles..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="p-2 w-full sm:w-64 border rounded"
          />
        </div>

        {availableVehicles.length === 0 ? (
          <p>No available vehicles found.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {availableVehicles.map((vehicle) => (
              <div
                key={vehicle.id}
                className="bg-white p-5 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all"
              >
                <img
                  src={`http://localhost:5000${vehicle.image_url}`}
                  alt={vehicle.model}
                  className="w-full h-48 object-cover rounded-lg mb-4"
                />
                <div className="space-y-1">
                  <p><strong>Brand:</strong> {vehicle.brand}</p>
                  <p><strong>Model:</strong> {vehicle.model}</p>
                  <p><strong>Category:</strong> {vehicle.category}</p>
                  <p><strong>Type:</strong> {vehicle.type}</p>
                  <p><strong>Fuel:</strong> {vehicle.fuel_type}</p>
                  <p><strong>Price:</strong> ${vehicle.rental_price}</p>
                  <p><strong>Available:</strong> ✅</p>
                </div>

                <div className="mt-4 flex gap-2">
                  <button
                    onClick={() => handleViewDetails(vehicle)}
                    className="bg-blue-600 text-white text-sm px-3 py-1 rounded hover:bg-blue-700"
                  >
                    View
                  </button>
                  <button
                    onClick={() => openEditModal(vehicle)}
                    className="bg-yellow-500 text-white text-sm px-3 py-1 rounded hover:bg-yellow-600"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(vehicle.id)}
                    className="bg-red-600 text-white text-sm px-3 py-1 rounded hover:bg-red-700"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Edit Modal */}
        {editingVehicle && (
          <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-40 flex items-center justify-center z-50">
            <form
              onSubmit={handleEditSubmit}
              className="bg-white p-6 rounded-lg w-full max-w-lg space-y-4"
            >
              <h3 className="text-xl font-bold">Edit Vehicle</h3>
              {["brand", "model", "category", "type", "fuel_type", "rental_price", "description"].map((field) => (
                <input
                  key={field}
                  type="text"
                  name={field}
                  value={editForm[field]}
                  onChange={handleEditChange}
                  placeholder={field.replace("_", " ").toUpperCase()}
                  className="w-full p-2 border rounded"
                  required={field !== "description"}
                />
              ))}

              {/* Availability Dropdown */}
              <select
                name="availability"
                value={editForm.availability ? "true" : "false"}
                onChange={handleEditChange}
                className="w-full p-2 border rounded"
              >
                <option value="true">Available</option>
                <option value="false">Unavailable</option>
              </select>

              <input
                type="file"
                name="image"
                accept="image/*"
                onChange={handleEditChange}
                className="w-full"
              />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingVehicle(null)}
                  className="bg-gray-400 text-white px-4 py-2 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default Vehicles;
