import { useState } from "react"; // Importing useState hook to manage state
import { useNavigate } from "react-router-dom"; // Importing useNavigate for navigation
import axios from "axios"; // Importing axios for API requests
import { validateAddDriver } from "./validation"; // Importing validation function
import heroImage from "../images/Hero-page.png"; // Importing an image for UI

const AddDriver = () => {
  // Initial state for driver details
  const [driver, setDriver] = useState({
    name: "",
    phone: "",
    license_number: "",
  });

  // State to store uploaded image
  const [image, setImage] = useState(null);

  // State for storing validation error messages
  const [errorMessages, setErrorMessages] = useState({
    name: "",
    phone: "",
    license_number: "",
    image: "",
  });

  const navigate = useNavigate(); // Hook for programmatic navigation

  // Function to handle input field changes
  const handleChange = (e) => {
    setDriver({ ...driver, [e.target.name]: e.target.value });
  };

  // Function to handle file (image) selection
  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]); // Set selected image to state
    }
  };

  // Function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission behavior

    // Validate driver data before submitting
    const { isValid, errors } = validateAddDriver(driver, image);
    setErrorMessages(errors); // Set validation error messages

    if (!isValid) {
      return; // Stop submission if validation fails
    }

    try {
      // Create FormData object to send text + image
      const formData = new FormData();
      formData.append("name", driver.name); // Add name field
      formData.append("phone", driver.phone); // Add phone field
      formData.append("license_number", driver.license_number); // Add license number field
      if (image) {
        formData.append("image", image); // Append image if selected
      }

      // Send API request to add driver
      await axios.post("http://localhost:5000/api/drivers", formData);
      alert("Driver added successfully!"); // Show success message

      // Reset form fields after successful submission
      setDriver({ name: "", phone: "", license_number: "" });
      setImage(null);
    } catch (error) {
      console.error("Error adding driver:", error);
      alert("An error occurred while adding the driver."); // Show error message
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-orange-600">
      {/* Main container for form */}
      <div className="flex bg-white rounded-lg shadow-xl overflow-hidden w-3/4 sm:w-full">
        
        {/* Left side: Image */}
        <div className="w-1/2 hidden sm:block">
          <img src={heroImage} alt="Hero" className="w-full h-full object-cover" />
        </div>

        {/* Right side: Form */}
        <div className="w-full sm:w-1/2 p-6">
          <div className="bg-white p-8 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-6 text-center text-gray-800">Add Driver</h2>

            {/* Form for adding driver */}
            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* Name Input Field */}
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

              {/* Phone Input Field */}
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

              {/* License Number Input Field */}
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

              {/* Image Upload Field */}
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

              {/* Buttons: Add and Back */}
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
