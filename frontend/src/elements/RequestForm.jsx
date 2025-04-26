import { useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import toast, { Toaster } from "react-hot-toast";

export default function RequestForm() {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    message: "",
    vehicleType: "",
    brand: "",
    model: "",
    numberPlate: "",
    category: "",
    fuelType: "",
    transmission: "",
    seats: "",
    price: "",
    description: "",
    photo: null,
  });

  const [submitted, setSubmitted] = useState(false);
  const [preview, setPreview] = useState(null);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      setFormData((prev) => ({ ...prev, [name]: files[0] }));
      setPreview(URL.createObjectURL(files[0]));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    for (const key in formData) {
      data.append(key, formData[key]);
    }

    try {
      await axios.post("/api/vehicle-requests", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setSubmitted(true);
      toast.success("Request submitted successfully!");
    } catch (error) {
      console.error("Error submitting request:", error);
      toast.error("Failed to submit. Try again.");
    }
  };

  return (
    <>
      <Navbar />
      <Toaster position="top-right" />

      <div className="p-4 max-w-2xl mx-auto bg-white rounded-xl shadow-md mt-6">
        <h2 className="text-2xl font-semibold mb-4">Request to List Your Vehicle</h2>
        {submitted ? (
          <p className="text-green-600 font-medium">Thank you! Your request has been sent to the admin.</p>
        ) : (
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              name="name"
              placeholder="Your Name"
              className="p-2 border rounded"
              value={formData.name}
              onChange={handleChange}
              required
            />
            <input
              type="tel"
              name="phone"
              placeholder="Phone Number"
              className="p-2 border rounded"
              value={formData.phone}
              onChange={handleChange}
              required
            />
            <select
              name="vehicleType"
              className="p-2 border rounded"
              value={formData.vehicleType}
              onChange={handleChange}
              required
            >
              <option value="">Select Vehicle Type</option>
              <option value="Car">Car</option>
              <option value="Bike">Bike</option>
              <option value="Jeep">Jeep</option>
              <option value="Van">Van</option>
              <option value="Bus">Bus</option>
            </select>
            <select
              name="category"
              className="p-2 border rounded"
              value={formData.category}
              onChange={handleChange}
              required
            >
              <option value="">Category</option>
              <option value="Economy">Economy</option>
              <option value="Luxury">Luxury</option>
              <option value="Off-road">Off-road</option>
              <option value="Tourist">Tourist</option>
            </select>
            <input
              type="text"
              name="brand"
              placeholder="Brand (e.g., Toyota)"
              className="p-2 border rounded"
              value={formData.brand}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="model"
              placeholder="Model (e.g., Hilux 2020)"
              className="p-2 border rounded"
              value={formData.model}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="numberPlate"
              placeholder="Vehicle Number Plate"
              className="p-2 border rounded"
              value={formData.numberPlate}
              onChange={handleChange}
              required
            />
            <select
              name="fuelType"
              className="p-2 border rounded"
              value={formData.fuelType}
              onChange={handleChange}
              required
            >
              <option value="">Fuel Type</option>
              <option value="Petrol">Petrol</option>
              <option value="Diesel">Diesel</option>
              <option value="Electric">Electric</option>
              <option value="Hybrid">Hybrid</option>
            </select>
            <select
              name="transmission"
              className="p-2 border rounded"
              value={formData.transmission}
              onChange={handleChange}
              required
            >
              <option value="">Transmission</option>
              <option value="Manual">Manual</option>
              <option value="Automatic">Automatic</option>
            </select>
            <input
              type="number"
              name="seats"
              placeholder="Seating Capacity"
              className="p-2 border rounded"
              value={formData.seats}
              onChange={handleChange}
              required
            />
            <input
              type="number"
              name="price"
              placeholder="Rental Price per Day (NPR)"
              className="p-2 border rounded"
              value={formData.price}
              onChange={handleChange}
              required
            />
            <input
              type="file"
              name="photo"
              accept="image/*"
              className="p-2 border rounded col-span-1 md:col-span-2"
              onChange={handleChange}
            />
            {preview && (
              <img
                src={preview}
                alt="Preview"
                className="w-full h-48 object-cover rounded col-span-1 md:col-span-2"
              />
            )}
            <textarea
              name="description"
              placeholder="Additional Description or Notes..."
              className="p-2 border rounded col-span-1 md:col-span-2"
              rows="3"
              value={formData.description}
              onChange={handleChange}
            />
            <textarea
              name="message"
              placeholder="Your personal message or comment to admin..."
              className="p-2 border rounded col-span-1 md:col-span-2"
              rows="3"
              value={formData.message}
              onChange={handleChange}
            />
            <button
              type="submit"
              className="bg-blue-600 text-white font-semibold py-2 rounded col-span-1 md:col-span-2"
            >
              Submit Request
            </button>
          </form>
        )}
      </div>

      <Footer />
    </>
  );
}
