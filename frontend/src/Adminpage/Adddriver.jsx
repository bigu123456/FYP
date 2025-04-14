import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { validateAddDriver } from "./validation";
import heroImage from "../images/Hero-page.png";

const AddDriver = () => {
  // Initial state for driver details
  const [driver, setDriver] = useState({
    name: "",
    phone: "",
    license_number: "",
    description: "", // Adding state for description
  });

  // State to store uploaded image
  const [image, setImage] = useState(null);

  // State for storing validation error messages
  const [errorMessages, setErrorMessages] = useState({
    name: "",
    phone: "",
    license_number: "",
    image: "",
    description: "", // Adding error state for description
  });

  const navigate = useNavigate(); // Hook for programmatic navigation

  // Function to handle input field changes
  const handleChange = (e) => {
    setDriver({ ...driver, [e.target.name]: e.target.value });
  };

  // Function to handle file (image) selection
  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  // Function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate driver data before submitting
    const { isValid, errors } = validateAddDriver(driver, image);
    setErrorMessages(errors);

    if (!isValid) {
      return;
    }

    try {
      // Create FormData object to send text + image
      const formData = new FormData();
      formData.append("name", driver.name);
      formData.append("phone", driver.phone);
      formData.append("license_number", driver.license_number);
      formData.append("description", driver.description); // Add description to formData
      if (image) {
        formData.append("image", image);
      }

      // Send API request to add driver
      await axios.post("http://localhost:5000/api/drivers", formData);
      alert("Driver added successfully!");

      // Reset form fields after successful submission
      setDriver({ name: "", phone: "", license_number: "", description: "" });
      setImage(null);
    } catch (error) {
      console.error("Error adding driver:", error);
      alert("An error occurred while adding the driver.");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-orange-600">
      <div className="flex bg-white rounded-lg shadow-xl overflow-hidden w-3/4 sm:w-full">
        <div className="w-1/2 hidden sm:block">
          <img src={heroImage} alt="Hero" className="w-full h-full object-cover" />
        </div>

        <div className="w-full sm:w-1/2 p-6">
          <div className="bg-white p-8 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-6 text-center text-gray-800">Add Driver</h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">Driver Name</label>
                <input
                  type="text"
                  name="name"
                  value={driver.name}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-md text-sm"
                  required
                />
                {errorMessages.name && <p className="text-red-500 text-sm">{errorMessages.name}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Phone Number</label>
                <input
                  type="text"
                  name="phone"
                  value={driver.phone}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-md text-sm"
                  required
                />
                {errorMessages.phone && <p className="text-red-500 text-sm">{errorMessages.phone}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">License Number</label>
                <input
                  type="text"
                  name="license_number"
                  value={driver.license_number}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-md text-sm"
                  required
                />
                {errorMessages.license_number && <p className="text-red-500 text-sm">{errorMessages.license_number}</p>}
              </div>

              {/* Description Input Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Driver Description</label>
                <textarea
                  name="description"
                  value={driver.description}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-md text-sm"
                  rows="4"
                  placeholder="Provide a description of the driver..."
                />
                {errorMessages.description && <p className="text-red-500 text-sm">{errorMessages.description}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Driver Image</label>
                <input
                  type="file"
                  name="image"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="w-full p-2 border border-gray-300 rounded-md text-sm"
                />
                {errorMessages.image && <p className="text-red-500 text-sm">{errorMessages.image}</p>}
              </div>

              <div className="flex space-x-4 mt-4">
                <button type="submit" className="p-2 bg-orange-600 text-white rounded-md">Add</button>
                <button type="button" onClick={() => navigate("/admin")} className="p-2 bg-gray-500 text-white rounded-md">Back</button>
              </div>

            </form>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AddDriver;
