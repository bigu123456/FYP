import React, { useState } from 'react';

const VehicleRequestForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    vehicleType: '',
    category: '',
    brand: '',
    model: '',
    numberPlate: '',
    fuelType: '',
    transmission: '',
    seats: '',
    price: '',
    photo: null,
    description: '',
    message: '',
  });

  const [preview, setPreview] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'photo') {
      const file = files[0];
      setFormData((prev) => ({ ...prev, photo: file }));
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreview(reader.result);
        };
        reader.readAsDataURL(file);
      } else {
        setPreview(null);
      }
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData); // Here you would send to server

    // Simulate submission
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({
        name: '',
        email: '',
        vehicleType: '',
        category: '',
        brand: '',
        model: '',
        numberPlate: '',
        fuelType: '',
        transmission: '',
        seats: '',
        price: '',
        photo: null,
        description: '',
        message: '',
      });
      setPreview(null);
    }, 3000);
  };

  return (
    <div className="p-6 max-w-3xl mx-auto bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-lg mt-8">
      <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
        Request to List Your Vehicle
      </h2>

      {submitted ? (
        <div className="text-green-600 text-lg font-semibold text-center py-10">
          Thank you! Your request has been sent to the admin.
        </div>
      ) : (
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {/* Name */}
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700 mb-1">Your Name</label>
            <input
              type="text"
              name="name"
              className="input-style"
              placeholder="John Doe"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          {/* Email */}
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700 mb-1">Your Email</label>
            <input
              type="email"
              name="email"
              className="input-style"
              placeholder="you@example.com"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          {/* Vehicle Type */}
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700 mb-1">Vehicle Type</label>
            <select
              name="vehicleType"
              className="input-style"
              value={formData.vehicleType}
              onChange={handleChange}
              required
            >
              <option value="">Select</option>
              <option value="Car">Car</option>
              <option value="Bike">Bike</option>
              <option value="Jeep">Jeep</option>
              <option value="Van">Van</option>
              <option value="Bus">Bus</option>
            </select>
          </div>

          {/* Category */}
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700 mb-1">Category</label>
            <select
              name="category"
              className="input-style"
              value={formData.category}
              onChange={handleChange}
              required
            >
              <option value="">Select</option>
              <option value="Economy">Economy</option>
              <option value="Luxury">Luxury</option>
              <option value="Off-road">Off-road</option>
              <option value="Tourist">Tourist</option>
            </select>
          </div>

          {/* Brand */}
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700 mb-1">Brand</label>
            <input
              type="text"
              name="brand"
              className="input-style"
              placeholder="Toyota"
              value={formData.brand}
              onChange={handleChange}
              required
            />
          </div>

          {/* Model */}
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700 mb-1">Model</label>
            <input
              type="text"
              name="model"
              className="input-style"
              placeholder="Hilux 2020"
              value={formData.model}
              onChange={handleChange}
              required
            />
          </div>

          {/* Number Plate */}
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700 mb-1">Number Plate</label>
            <input
              type="text"
              name="numberPlate"
              className="input-style"
              placeholder="BA 2 PA 1234"
              value={formData.numberPlate}
              onChange={handleChange}
              required
            />
          </div>

          {/* Fuel Type */}
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700 mb-1">Fuel Type</label>
            <select
              name="fuelType"
              className="input-style"
              value={formData.fuelType}
              onChange={handleChange}
              required
            >
              <option value="">Select</option>
              <option value="Petrol">Petrol</option>
              <option value="Diesel">Diesel</option>
              <option value="Electric">Electric</option>
              <option value="Hybrid">Hybrid</option>
            </select>
          </div>

          {/* Transmission */}
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700 mb-1">Transmission</label>
            <select
              name="transmission"
              className="input-style"
              value={formData.transmission}
              onChange={handleChange}
              required
            >
              <option value="">Select</option>
              <option value="Manual">Manual</option>
              <option value="Automatic">Automatic</option>
            </select>
          </div>

          {/* Seats */}
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700 mb-1">Seats</label>
            <input
              type="number"
              name="seats"
              className="input-style"
              placeholder="4"
              value={formData.seats}
              onChange={handleChange}
              required
            />
          </div>

          {/* Rental Price */}
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700 mb-1">Rental Price (NPR)</label>
            <input
              type="number"
              name="price"
              className="input-style"
              placeholder="5000"
              value={formData.price}
              onChange={handleChange}
              required
            />
          </div>

          {/* Upload Photo */}
          <div className="flex flex-col md:col-span-2">
            <label className="text-sm font-medium text-gray-700 mb-1">Upload Photo</label>
            <input
              type="file"
              name="photo"
              accept="image/*"
              className="input-style"
              onChange={handleChange}
            />
          </div>

          {/* Preview Image */}
          {preview && (
            <img
              src={preview}
              alt="Preview"
              className="w-full h-52 object-cover rounded-md md:col-span-2"
            />
          )}

          {/* Description */}
          <div className="flex flex-col md:col-span-2">
            <label className="text-sm font-medium text-gray-700 mb-1">Vehicle Description</label>
            <textarea
              name="description"
              rows="3"
              className="input-style"
              placeholder="Extra features, condition, etc."
              value={formData.description}
              onChange={handleChange}
            />
          </div>

          {/* Message */}
          <div className="flex flex-col md:col-span-2">
            <label className="text-sm font-medium text-gray-700 mb-1">Personal Message to Admin</label>
            <textarea
              name="message"
              rows="3"
              className="input-style"
              placeholder="Anything you'd like to add..."
              value={formData.message}
              onChange={handleChange}
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition md:col-span-2"
          >
            Submit Request
          </button>
        </form>
      )}
    </div>
  );
};

export default VehicleRequestForm;
