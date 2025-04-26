import { useState } from "react";
import Sidebar from "./Sidebar"; // Import Sidebar component
import Header from "./Header";   // Import Header component
import LoginImage from "../images/loginimage.png"; // Ensure correct path to image

const AddVehicle = () => {
  const [formData, setFormData] = useState({
    brand: "",
    model: "",
    category: "",
    type: "",
    fuel_type: "",
    rental_price: "",
    image: null,
    description: "", // New description field
  });

  const [message, setMessage] = useState(""); // Success or error message
  
  // Handle input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle image file change
  const handleImageChange = (e) => {
    setFormData({ ...formData, image: e.target.files[0] });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append("brand", formData.brand);
    data.append("model", formData.model);
    data.append("category", formData.category);
    data.append("type", formData.type);
    data.append("fuel_type", formData.fuel_type);
    data.append("rental_price", formData.rental_price);
    data.append("description", formData.description); // Append description
    if (formData.image) {
      data.append("image", formData.image);
    }

    try {
      const res = await fetch("http://localhost:5000/api/vehicles", {
        method: "POST",
        body: data,
      });

      const responseData = await res.json();
      console.log("Response Data:", responseData);

      if (responseData.success) {
        alert("Vehicle added successfully!");

        // Reset form fields after successful submission
        setFormData({
          brand: "",
          model: "",
          category: "",
          type: "",
          fuel_type: "",
          rental_price: "",
          image: null,
          description: "", // Reset description
        });
         // Navigate to driver list (or any other page)
      
    } else {
      setMessage("Failed to add vehicle. Please check your inputs!");
    }
  } catch (err) {
    console.error("Error:", err);
    setMessage("Error adding vehicle. Please try again.");
  }
};

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <Sidebar />
      
      <div className="flex-1 ml-16">
        {/* Header */}
        <Header />
        
        {/* Right side: Form */}
        <div className="flex justify-center items-center min-h-screen bg-white p-6">
          <div className="bg-orange-200 p-6 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-2xl font-bold text-center mb-4">Add Vehicle</h2>

            {/* Success/Error Message */}
            {message && (
              <div className="mb-4 text-center text-white p-2 rounded bg-green-500">
                {message}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-3">
              <input
                type="text"
                name="brand"
                placeholder="Brand"
                value={formData.brand}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                required
              />
              <input
                type="text"
                name="model"
                placeholder="Model"
                value={formData.model}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                required
              />
              <input
                type="text"
                name="category"
                placeholder="Category"
                value={formData.category}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                required
              />
              <input
                type="text"
                name="type"
                placeholder="Type"
                value={formData.type}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                required
              />
              <input
                type="text"
                name="fuel_type"
                placeholder="Fuel Type"
                value={formData.fuel_type}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                required
              />
              <input
                type="number"
                name="rental_price"
                placeholder="Rental Price"
                value={formData.rental_price}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                required
              />
              
              {/* Description Input */}
              <textarea
                name="description"
                placeholder="Vehicle Description"
                value={formData.description}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                rows="4"
                required
              />

              {/* Image Upload */}
              <input
                type="file"
                name="image"
                onChange={handleImageChange}
                className="w-full p-2 border rounded"
                accept="image/*"
                required
              />

              {/* Buttons */}
              <div className="flex justify-between mt-4">
                <button
                  type="submit"
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-all"
                >
                  Add Vehicle
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddVehicle;
