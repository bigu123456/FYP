import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { validateEditDriver } from "./validation"; // Import validation function
import Sidebar from "./Sidebar"; // Sidebar component
import Header from "./Header"; // Header component

const EditDriver = () => {
  const { id } = useParams(); // Get driver ID from URL params
  const navigate = useNavigate(); // Use navigate for redirection

  const [driver, setDriver] = useState({
    name: "",
    phone: "",
    email: "",
    license_number: "",
    description: "",
    price_per_day: "",
    availability: false,
    initialAvailability: false,
    image: null,
    currentImage: "", // Track current image URL
  });

  const [image, setImage] = useState(null); // State to handle the new image

  const [errorMessages, setErrorMessages] = useState({
    name: "",
    phone: "",
    email: "",
    license_number: "",
    description: "",
    price_per_day: "",
    image: "",
  });

  // Fetch driver data when component mounts
  useEffect(() => {
    const fetchDriver = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/drivers/${id}`);
        const fetchedDriver = res.data.driver;
        setDriver({
          ...fetchedDriver,
          initialAvailability: fetchedDriver.availability, // Set initial availability state
          currentImage: fetchedDriver.image || "", // If no image, keep empty
        });
      } catch (error) {
        console.error("Error fetching driver:", error);
      }
    };
    fetchDriver();
  }, [id]);

  // Handle form field changes
  const handleChange = (e) => {
    setDriver({ ...driver, [e.target.name]: e.target.value });
  };

  // Handle checkbox change (availability)
  const handleCheckboxChange = (e) => {
    setDriver({ ...driver, availability: e.target.checked });
  };

  // Handle file change (image upload)
  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form input
    const { isValid, errors } = validateEditDriver(
      driver,
      image,
      driver.currentImage,
      driver.availability !== driver.initialAvailability
    );
    setErrorMessages(errors);
    if (!isValid) return;

    try {
      // Prepare form data for submission
      const formData = new FormData();
      formData.append("name", driver.name);
      formData.append("phone", driver.phone);
      formData.append("email", driver.email);
      formData.append("license_number", driver.license_number);
      formData.append("price_per_day", driver.price_per_day);
      formData.append("description", driver.description);
      formData.append("availability", driver.availability);

      // If there's a new image, append it to the form data
      if (image) {
        formData.append("image", image);
      } else {
        formData.append("image", driver.currentImage); // Otherwise, keep current image
      }

      // Make the API call to update the driver
      const response = await axios.put(`http://localhost:5000/api/drivers/${id}`, formData);

      // Assuming the backend responds with the updated driver data
      const updatedDriver = response.data.driver;
      setDriver({
        ...updatedDriver,
        currentImage: updatedDriver.image || driver.currentImage, // Update the current image
      });

      alert("Driver updated successfully!"); // Show success alert
      navigate("/admin/Driverlist"); // Redirect to Driverlist after successful update
    } catch (error) {
      console.error("Error updating driver:", error);
      alert("Failed to update driver."); // Show error alert
    }
  };

  return (
    <div className="flex">
      <Sidebar /> {/* Sidebar component */}
      <div className="flex-1">
        <Header /> {/* Header component */}
        <div className="flex justify-center items-center min-h-screen bg-gray-800">
          <div className="bg-black text-white p-8 rounded-lg shadow-lg max-w-4xl w-full">
            <h2 className="text-3xl font-semibold text-center mb-8">Edit Driver</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Driver Name */}
              <div>
                <label className="block text-sm font-medium">Driver Name</label>
                <input
                  type="text"
                  name="name"
                  value={driver.name}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-700 bg-gray-800 text-white rounded-md"
                />
                {errorMessages.name && <p className="text-red-500 text-sm">{errorMessages.name}</p>}
              </div>

              {/* Phone Number */}
              <div>
                <label className="block text-sm font-medium">Phone Number</label>
                <input
                  type="text"
                  name="phone"
                  value={driver.phone}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-700 bg-gray-800 text-white rounded-md"
                />
                {errorMessages.phone && <p className="text-red-500 text-sm">{errorMessages.phone}</p>}
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium">Email</label>
                <input
                  type="email"
                  name="email"
                  value={driver.email}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-700 bg-gray-800 text-white rounded-md"
                />
                {errorMessages.email && <p className="text-red-500 text-sm">{errorMessages.email}</p>}
              </div>

              {/* Price Per Day */}
              <div>
                <label className="block text-sm font-medium">Price Per Day</label>
                <input
                  type="text"
                  name="price_per_day"
                  value={driver.price_per_day}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-700 bg-gray-800 text-white rounded-md"
                />
                {errorMessages.price_per_day && <p className="text-red-500 text-sm">{errorMessages.price_per_day}</p>}
              </div>

              {/* License Number */}
              <div>
                <label className="block text-sm font-medium">License Number</label>
                <input
                  type="text"
                  name="license_number"
                  value={driver.license_number}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-700 bg-gray-800 text-white rounded-md"
                />
                {errorMessages.license_number && <p className="text-red-500 text-sm">{errorMessages.license_number}</p>}
              </div>

              {/* Availability Checkbox */}
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={driver.availability}
                  onChange={handleCheckboxChange}
                  className="h-5 w-5 text-orange-600 focus:ring-orange-600"
                />
                <label className="ml-2 text-sm">Available for Rides</label>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium">Description</label>
                <textarea
                  name="description"
                  value={driver.description}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-700 bg-gray-800 text-white rounded-md"
                  rows="4"
                />
                {errorMessages.description && <p className="text-red-500 text-sm">{errorMessages.description}</p>}
              </div>

              {/* Image Upload */}
              <div>
                <label className="block text-sm font-medium">Driver Image</label>
                <input
                  type="file"
                  name="image"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="w-full p-3 border border-gray-700 bg-gray-800 text-white rounded-md"
                />
                {errorMessages.image && <p className="text-red-500 text-sm">{errorMessages.image}</p>}
                {driver.currentImage && !image && (
                  <img
                    src={`http://localhost:5000/uploads/${driver.currentImage}`}
                    alt="Current"
                    className="mt-2 h-24 object-cover rounded"
                  />
                )}
              </div>

              {/* Buttons */}
              <div className="flex space-x-4 mt-6">
                <button type="submit" className="p-3 bg-orange-600 text-white rounded-md">
                  Update
                </button>
                <button
                  type="button"
                  onClick={() => navigate("/admin/Driverlist")}
                  className="p-3 bg-gray-700 text-white rounded-md"
                >
                  Back
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditDriver;
