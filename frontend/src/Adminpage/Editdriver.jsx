import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
<<<<<<< HEAD
import axios from "axios";
import { validateEditDriver } from "./validation"; // Import validation function
import Sidebar from "./Sidebar"; // Sidebar component
import Header from "./Header"; // Header component

const EditDriver = () => {
  const { id } = useParams(); // Get driver ID from URL params
  const navigate = useNavigate(); // Use navigate for redirection
=======
import heroImage from "../images/Hero-page.png";
import axios from "axios";
import { validateEditDriver } from "./validation"; // ✅ Use the correct named export

const EditDriver = () => {
  const { id } = useParams();
  const navigate = useNavigate();
>>>>>>> 11994a839c9610f18e58ba2e77ba621b379f2522

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
<<<<<<< HEAD
    currentImage: "", // Track current image URL
  });

  const [image, setImage] = useState(null); // State to handle the new image
=======
    currentImage: "",
  });

  const [image, setImage] = useState(null);
>>>>>>> 11994a839c9610f18e58ba2e77ba621b379f2522

  const [errorMessages, setErrorMessages] = useState({
    name: "",
    phone: "",
    email: "",
    license_number: "",
    description: "",
    price_per_day: "",
    image: "",
  });

<<<<<<< HEAD
  // Fetch driver data when component mounts
=======
>>>>>>> 11994a839c9610f18e58ba2e77ba621b379f2522
  useEffect(() => {
    const fetchDriver = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/drivers/${id}`);
<<<<<<< HEAD
        const fetchedDriver = res.data.driver;
        setDriver({
          ...fetchedDriver,
          initialAvailability: fetchedDriver.availability, // Set initial availability state
          currentImage: fetchedDriver.image || "", // If no image, keep empty
=======
        setDriver({
          ...res.data.driver,
          initialAvailability: res.data.driver.availability,
          currentImage: res.data.driver.image || "",
>>>>>>> 11994a839c9610f18e58ba2e77ba621b379f2522
        });
      } catch (error) {
        console.error("Error fetching driver:", error);
      }
    };
    fetchDriver();
  }, [id]);

<<<<<<< HEAD
  // Handle form field changes
=======
>>>>>>> 11994a839c9610f18e58ba2e77ba621b379f2522
  const handleChange = (e) => {
    setDriver({ ...driver, [e.target.name]: e.target.value });
  };

<<<<<<< HEAD
  // Handle checkbox change (availability)
=======
>>>>>>> 11994a839c9610f18e58ba2e77ba621b379f2522
  const handleCheckboxChange = (e) => {
    setDriver({ ...driver, availability: e.target.checked });
  };

<<<<<<< HEAD
  // Handle file change (image upload)
=======
>>>>>>> 11994a839c9610f18e58ba2e77ba621b379f2522
  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

<<<<<<< HEAD
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form input
=======
  const handleSubmit = async (e) => {
    e.preventDefault();

>>>>>>> 11994a839c9610f18e58ba2e77ba621b379f2522
    const { isValid, errors } = validateEditDriver(
      driver,
      image,
      driver.currentImage,
      driver.availability !== driver.initialAvailability
    );
<<<<<<< HEAD
=======

>>>>>>> 11994a839c9610f18e58ba2e77ba621b379f2522
    setErrorMessages(errors);
    if (!isValid) return;

    try {
<<<<<<< HEAD
      // Prepare form data for submission
=======
>>>>>>> 11994a839c9610f18e58ba2e77ba621b379f2522
      const formData = new FormData();
      formData.append("name", driver.name);
      formData.append("phone", driver.phone);
      formData.append("email", driver.email);
      formData.append("license_number", driver.license_number);
      formData.append("price_per_day", driver.price_per_day);
      formData.append("description", driver.description);
      formData.append("availability", driver.availability);
<<<<<<< HEAD

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
=======
      if (image) {
        formData.append("image", image);
      } else {
        formData.append("image", driver.currentImage);
      }

      await axios.put(`http://localhost:5000/api/drivers/${id}`, formData);
      alert("Driver updated successfully!");
      navigate("/admin");
    } catch (error) {
      console.error("Error updating driver:", error);
      alert("Failed to update driver.");
>>>>>>> 11994a839c9610f18e58ba2e77ba621b379f2522
    }
  };

  return (
<<<<<<< HEAD
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
=======
    <div className="flex justify-center items-center h-screen bg-orange-600">
      <div className="flex bg-white rounded-lg shadow-xl overflow-hidden w-3/4 sm:w-full">
        <div className="w-1/2 hidden sm:block">
          <img src={heroImage} alt="Hero" className="w-full h-full object-cover" />
        </div>

        <div className="w-full sm:w-1/2 p-6">
          <div className="bg-white p-8 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-6 text-center text-gray-800">Edit Driver</h2>
            <form onSubmit={handleSubmit} className="space-y-6">

              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Driver Name</label>
>>>>>>> 11994a839c9610f18e58ba2e77ba621b379f2522
                <input
                  type="text"
                  name="name"
                  value={driver.name}
                  onChange={handleChange}
<<<<<<< HEAD
                  className="w-full p-3 border border-gray-700 bg-gray-800 text-white rounded-md"
                />
                {errorMessages.name && <p className="text-red-500 text-sm">{errorMessages.name}</p>}
              </div>

              {/* Phone Number */}
              <div>
                <label className="block text-sm font-medium">Phone Number</label>
=======
                  className="w-full p-2 border border-gray-300 rounded-md text-sm"
                />
                {errorMessages.name && <p className="text-orange-600 text-sm">{errorMessages.name}</p>}
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Phone Number</label>
>>>>>>> 11994a839c9610f18e58ba2e77ba621b379f2522
                <input
                  type="text"
                  name="phone"
                  value={driver.phone}
                  onChange={handleChange}
<<<<<<< HEAD
                  className="w-full p-3 border border-gray-700 bg-gray-800 text-white rounded-md"
=======
                  className="w-full p-2 border border-gray-300 rounded-md text-sm"
>>>>>>> 11994a839c9610f18e58ba2e77ba621b379f2522
                />
                {errorMessages.phone && <p className="text-red-500 text-sm">{errorMessages.phone}</p>}
              </div>

              {/* Email */}
              <div>
<<<<<<< HEAD
                <label className="block text-sm font-medium">Email</label>
=======
                <label className="block text-sm font-medium text-gray-700">Email</label>
>>>>>>> 11994a839c9610f18e58ba2e77ba621b379f2522
                <input
                  type="email"
                  name="email"
                  value={driver.email}
                  onChange={handleChange}
<<<<<<< HEAD
                  className="w-full p-3 border border-gray-700 bg-gray-800 text-white rounded-md"
=======
                  className="w-full p-2 border border-gray-300 rounded-md text-sm"
>>>>>>> 11994a839c9610f18e58ba2e77ba621b379f2522
                />
                {errorMessages.email && <p className="text-red-500 text-sm">{errorMessages.email}</p>}
              </div>

              {/* Price Per Day */}
              <div>
<<<<<<< HEAD
                <label className="block text-sm font-medium">Price Per Day</label>
=======
                <label className="block text-sm font-medium text-gray-700">Price Per Day</label>
>>>>>>> 11994a839c9610f18e58ba2e77ba621b379f2522
                <input
                  type="text"
                  name="price_per_day"
                  value={driver.price_per_day}
                  onChange={handleChange}
<<<<<<< HEAD
                  className="w-full p-3 border border-gray-700 bg-gray-800 text-white rounded-md"
=======
                  className="w-full p-2 border border-gray-300 rounded-md text-sm"
>>>>>>> 11994a839c9610f18e58ba2e77ba621b379f2522
                />
                {errorMessages.price_per_day && <p className="text-red-500 text-sm">{errorMessages.price_per_day}</p>}
              </div>

<<<<<<< HEAD
              {/* License Number */}
              <div>
                <label className="block text-sm font-medium">License Number</label>
=======
              {/* License */}
              <div>
                <label className="block text-sm font-medium text-gray-700">License Number</label>
>>>>>>> 11994a839c9610f18e58ba2e77ba621b379f2522
                <input
                  type="text"
                  name="license_number"
                  value={driver.license_number}
                  onChange={handleChange}
<<<<<<< HEAD
                  className="w-full p-3 border border-gray-700 bg-gray-800 text-white rounded-md"
=======
                  className="w-full p-2 border border-gray-300 rounded-md text-sm"
>>>>>>> 11994a839c9610f18e58ba2e77ba621b379f2522
                />
                {errorMessages.license_number && <p className="text-red-500 text-sm">{errorMessages.license_number}</p>}
              </div>

<<<<<<< HEAD
              {/* Availability Checkbox */}
=======
              {/* Availability */}
>>>>>>> 11994a839c9610f18e58ba2e77ba621b379f2522
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={driver.availability}
                  onChange={handleCheckboxChange}
                  className="h-5 w-5 text-orange-600 focus:ring-orange-600"
                />
<<<<<<< HEAD
                <label className="ml-2 text-sm">Available for Rides</label>
=======
                <label className="ml-2 text-sm font-medium text-gray-700">Available for Rides</label>
>>>>>>> 11994a839c9610f18e58ba2e77ba621b379f2522
              </div>

              {/* Description */}
              <div>
<<<<<<< HEAD
                <label className="block text-sm font-medium">Description</label>
=======
                <label className="block text-sm font-medium text-gray-700">Description</label>
>>>>>>> 11994a839c9610f18e58ba2e77ba621b379f2522
                <textarea
                  name="description"
                  value={driver.description}
                  onChange={handleChange}
<<<<<<< HEAD
                  className="w-full p-3 border border-gray-700 bg-gray-800 text-white rounded-md"
                  rows="4"
                />
                {errorMessages.description && <p className="text-red-500 text-sm">{errorMessages.description}</p>}
              </div>

              {/* Image Upload */}
              <div>
                <label className="block text-sm font-medium">Driver Image</label>
=======
                  className="w-full p-2 border border-gray-300 rounded-md text-sm"
                  rows="4"
                />
                {errorMessages.description && <p className="text-orange-600 text-sm">{errorMessages.description}</p>}
              </div>

              {/* Image */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Driver Image</label>
>>>>>>> 11994a839c9610f18e58ba2e77ba621b379f2522
                <input
                  type="file"
                  name="image"
                  accept="image/*"
                  onChange={handleFileChange}
<<<<<<< HEAD
                  className="w-full p-3 border border-gray-700 bg-gray-800 text-white rounded-md"
                />
                {errorMessages.image && <p className="text-red-500 text-sm">{errorMessages.image}</p>}
=======
                  className="w-full p-2 border border-gray-300 rounded-md text-sm"
                />
                {errorMessages.image && <p className="text-orange-600 text-sm">{errorMessages.image}</p>}
>>>>>>> 11994a839c9610f18e58ba2e77ba621b379f2522
                {driver.currentImage && !image && (
                  <img
                    src={`http://localhost:5000/uploads/${driver.currentImage}`}
                    alt="Current"
                    className="mt-2 h-24 object-cover rounded"
                  />
                )}
              </div>

              {/* Buttons */}
<<<<<<< HEAD
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
=======
              <div className="flex space-x-4 mt-4">
                <button type="submit" className="p-2 bg-orange-600 text-white rounded-md">Update</button>
                <button type="button" onClick={() => navigate("/admin")} className="p-2 bg-orange-600 text-white rounded-md">Back</button>
              </div>

>>>>>>> 11994a839c9610f18e58ba2e77ba621b379f2522
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditDriver;
