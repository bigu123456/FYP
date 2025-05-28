import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { validateEditDriver } from "./validation"; // Your validation function
import Sidebar from "./Sidebar"; // Sidebar component
import Header from "./Header"; // Header component
import heroImage from "../images/Hero-page.png";

const EditDriver = () => {
  const { id } = useParams();
  const navigate = useNavigate();

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
    currentImage: "",
  });
  const [image, setImage] = useState(null);
  const [errorMessages, setErrorMessages] = useState({
    name: "",
    phone: "",
    email: "",
    license_number: "",
    description: "",
    price_per_day: "",
    image: "",
  });
  const [submitError, setSubmitError] = useState("");
  const [submitSuccess, setSubmitSuccess] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchDriver = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/drivers/${id}`);
        const fetchedDriver = res.data.driver;
        setDriver({
          ...fetchedDriver,
          initialAvailability: fetchedDriver.availability,
          currentImage: fetchedDriver.image || "",
        });
      } catch (error) {
        console.error("Error fetching driver:", error);
      }
    };
    fetchDriver();
  }, [id]);

  const handleChange = (e) => {
    setDriver({ ...driver, [e.target.name]: e.target.value });
  };

  const handleCheckboxChange = (e) => {
    setDriver({ ...driver, availability: e.target.checked });
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setSubmitError("");
    setSubmitSuccess("");

    const { isValid, errors } = validateEditDriver(
      driver,
      image,
      driver.currentImage,
      driver.availability !== driver.initialAvailability
    );
    setErrorMessages(errors);
    if (!isValid) return;

    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("name", driver.name);
      formData.append("phone", driver.phone);
      formData.append("email", driver.email);
      formData.append("license_number", driver.license_number);
      formData.append("price_per_day", driver.price_per_day);
      formData.append("description", driver.description);
      formData.append("availability", driver.availability);

      if (image) {
        formData.append("image", image);
      } else {
        formData.append("image", driver.currentImage);
      }

      await axios.put(`http://localhost:5000/api/drivers/${id}`, formData);

      setSubmitSuccess("Driver updated successfully!");
      setTimeout(() => {
        navigate("/admin/Driverlist");
      }, 1500);
    } catch (error) {
      console.error("Error updating driver:", error);
      setSubmitError("Failed to update driver.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1">
        <Header />
        <div className="flex justify-center items-center min-h-screen bg-gray-800">
          <div className="bg-black text-white p-8 rounded-lg shadow-lg max-w-4xl w-full">
            <h2 className="text-3xl font-semibold text-center mb-8">Edit Driver</h2>
            <form onSubmit={handleSubmit} className="space-y-6" noValidate>
              {/* Name */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium">
                  Driver Name
                </label>
                <input
                  id="name"
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
                <label htmlFor="phone" className="block text-sm font-medium">
                  Phone Number
                </label>
                <input
                  id="phone"
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
                <label htmlFor="email" className="block text-sm font-medium">
                  Email
                </label>
                <input
                  id="email"
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
                <label htmlFor="price_per_day" className="block text-sm font-medium">
                  Price Per Day
                </label>
                <input
                  id="price_per_day"
                  type="text"
                  name="price_per_day"
                  value={driver.price_per_day}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-700 bg-gray-800 text-white rounded-md"
                />
                {errorMessages.price_per_day && (
                  <p className="text-red-500 text-sm">{errorMessages.price_per_day}</p>
                )}
              </div>

              {/* License Number */}
              <div>
                <label htmlFor="license_number" className="block text-sm font-medium">
                  License Number
                </label>
                <input
                  id="license_number"
                  type="text"
                  name="license_number"
                  value={driver.license_number}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-700 bg-gray-800 text-white rounded-md"
                />
                {errorMessages.license_number && (
                  <p className="text-red-500 text-sm">{errorMessages.license_number}</p>
                )}
              </div>

              {/* Availability */}
              <div className="flex items-center">
                <input
                  id="availability"
                  type="checkbox"
                  checked={driver.availability}
                  onChange={handleCheckboxChange}
                  className="h-5 w-5 text-orange-600 focus:ring-orange-600"
                />
                <label htmlFor="availability" className="ml-2 text-sm">
                  Available for Rides
                </label>
              </div>

              {/* Description */}
              <div>
                <label htmlFor="description" className="block text-sm font-medium">
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={driver.description}
                  onChange={handleChange}
                  rows="4"
                  className="w-full p-3 border border-gray-700 bg-gray-800 text-white rounded-md"
                />
                {errorMessages.description && (
                  <p className="text-red-500 text-sm">{errorMessages.description}</p>
                )}
              </div>

              {/* Image Upload */}
              <div>
                <label htmlFor="image" className="block text-sm font-medium">
                  Driver Image
                </label>
                <input
                  id="image"
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
                    alt="Current Driver"
                    className="mt-2 h-24 object-cover rounded"
                  />
                )}
              </div>

              {/* Submit / Back Buttons */}
              <div className="flex space-x-4 mt-6">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`p-3 rounded-md text-white ${
                    isSubmitting ? "bg-gray-500 cursor-not-allowed" : "bg-orange-600"
                  }`}
                >
                  {isSubmitting ? "Updating..." : "Update"}
                </button>
                <button
                  type="button"
                  onClick={() => navigate("/admin/Driverlist")}
                  className="p-3 bg-gray-700 text-white rounded-md"
                  disabled={isSubmitting}
                >
                  Back
                </button>
              </div>

              {/* Submission feedback */}
              {submitSuccess && <p className="text-green-500 mt-4">{submitSuccess}</p>}
              {submitError && <p className="text-red-500 mt-4">{submitError}</p>}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditDriver;
