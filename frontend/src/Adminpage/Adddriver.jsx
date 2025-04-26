import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { validateAddDriver } from "./validation";
import Sidebar from "./Sidebar";
import Header from "./Header";

const AddDriver = () => {
  const [driver, setDriver] = useState({
    name: "",
    phone: "",
    email: "",
    license_number: "",
    description: "",
    price_per_day: "",
  });

  const [image, setImage] = useState(null);
  const [errorMessages, setErrorMessages] = useState({});
  const navigate = useNavigate();

  const handleChange = (e) => {
    setDriver({ ...driver, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handleReset = () => {
    setDriver({
      name: "",
      phone: "",
      email: "",
      license_number: "",
      description: "",
      price_per_day: "",
    });
    setImage(null);
    setErrorMessages({});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { isValid, errors } = validateAddDriver(driver, image);
    setErrorMessages(errors);
    if (!isValid) return;

    try {
      const formData = new FormData();
      Object.keys(driver).forEach((key) => formData.append(key, driver[key]));
      if (image) formData.append("image", image);

      await axios.post("http://localhost:5000/api/drivers", formData);
      alert("Driver added successfully!");
      handleReset();
    } catch (error) {
      console.error("Error adding driver:", error);
      alert("An error occurred while adding the driver.");
    }
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />

      <div className="flex-1 flex flex-col bg-gray-50">
        <Header />

        <div className="flex flex-1 justify-center items-center p-8">
          {/* Form Section */}
          <div className="w-full max-w-xl bg-white p-8 rounded-lg shadow-md">
            <h2 className="text-3xl font-bold text-orange-600 text-center mb-6">
              Add Driver
            </h2>

            <form onSubmit={handleSubmit} className="space-y-5">
              {[ 
                { label: "Driver Name", name: "name", type: "text" },
                { label: "Phone Number", name: "phone", type: "text" },
                { label: "Email Address", name: "email", type: "email" },
                { label: "License Number", name: "license_number", type: "text" },
                { label: "Price Per Day", name: "price_per_day", type: "number" },
              ].map((field) => (
                <div key={field.name}>
                  <label className="block text-sm font-medium text-gray-700">
                    {field.label}
                  </label>
                  <input
                    type={field.type}
                    name={field.name}
                    value={driver[field.name]}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-md text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                    required
                  />
                  {errorMessages[field.name] && (
                    <p className="text-red-500 text-sm mt-1">{errorMessages[field.name]}</p>
                  )}
                </div>
              ))}

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Driver Description
                </label>
                <textarea
                  name="description"
                  value={driver.description}
                  onChange={handleChange}
                  rows="3"
                  className="w-full p-3 border border-gray-300 rounded-md text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="Brief description about the driver..."
                />
                {errorMessages.description && (
                  <p className="text-red-500 text-sm mt-1">{errorMessages.description}</p>
                )}
              </div>

              {/* Image */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Driver Image
                </label>
                <input
                  type="file"
                  name="image"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="w-full p-3 border border-gray-300 rounded-md text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
                {errorMessages.image && (
                  <p className="text-red-500 text-sm mt-1">{errorMessages.image}</p>
                )}
              </div>

              {/* Buttons Row */}
              <div className="flex justify-between gap-2">
                <button
                  type="submit"
                  className="flex-1 bg-orange-600 hover:bg-orange-700 text-white text-sm font-medium py-3 rounded-md transition"
                >
                  Add Driver
                </button>
                <button
                  type="button"
                  onClick={handleReset}
                  className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 text-sm font-medium py-3 rounded-md transition"
                >
                  Reset
                </button>
                <button
                  type="button"
                  onClick={() => navigate(-1)}
                  className="flex-1 bg-red-100 hover:bg-red-200 text-red-600 text-sm font-medium py-3 rounded-md transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddDriver;
