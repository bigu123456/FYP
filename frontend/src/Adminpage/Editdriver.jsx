import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import heroImage from "../images/Hero-page.png";
import axios from "axios";
import { validateEditDriver } from "./validation";  // Import validation function

const EditDriver = () => {
  // Get the driver ID from the URL using useParams
  const { id } = useParams();
  const navigate = useNavigate();  // Hook to navigate programmatically
  // State to store the driver data and handle form submission
  const [driver, setDriver] = useState({
    name: "",
    phone: "",
    license_number: "",
    availability: false, // Added availability field to track if the driver is available
    image: null,
    currentImage: "", // To store the current image URL from the server (for updating)
  });
  
  // State for managing file input for image
  const [image, setImage] = useState(null);
  
  // State to handle error messages for the form validation
  const [errorMessages, setErrorMessages] = useState({
    name: "",
    phone: "",
    license_number: "",
    image: "",
  });

  // Fetch driver data when the component mounts and whenever the `id` changes
  useEffect(() => {
    const fetchDriver = async () => {
      try {
        // Fetch driver data using the id parameter
        const res = await axios.get(`http://localhost:5000/api/drivers/${id}`);
        // Set the state with the fetched data, including the current image
        setDriver({
          ...res.data.driver,
          currentImage: res.data.driver.image || "",
        });
      } catch (error) {
        console.error("Error fetching driver:", error); // Log any errors
      }
    };
    fetchDriver();
  }, [id]); // Dependency array ensures the effect runs when `id` changes

  // Handle changes in form fields (text inputs)
  const handleChange = (e) => {
    setDriver({ ...driver, [e.target.name]: e.target.value });
  };

  // Handle changes for the availability checkbox
  const handleCheckboxChange = (e) => {
    setDriver({ ...driver, availability: e.target.checked });
  };

  // Handle file change (for uploading a new driver image)
  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);  // Set the image state to the selected file
    }
  };

  // Handle form submission (when user clicks "Update")
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission

    // Validate the driver data and the image (if provided)
    const { isValid, errors } = validateEditDriver(driver, image, driver.currentImage);
    setErrorMessages(errors); // Set error messages in the state

    if (!isValid) {
      return; // If the form data is invalid, do not proceed with the submission
    }

    try {
      const formData = new FormData(); // Create a new FormData object for sending data
      // Append form fields to the FormData object
      formData.append("name", driver.name);
      formData.append("phone", driver.phone);
      formData.append("license_number", driver.license_number);
      formData.append("availability", driver.availability); // Include availability
      if (image) {
        formData.append("image", image); // If a new image is selected, append it
      } else {
        formData.append("image", driver.currentImage); // If no new image, use the current image
      }

      // Make a PUT request to update the driver
      await axios.put(`http://localhost:5000/api/drivers/${id}`, formData);
      alert("Driver updated successfully!"); // Show success message
      navigate("/admin"); // Navigate back to the admin page after successful update
    } catch (error) {
      console.error("Error updating driver:", error); // Log any errors during the update
      alert("Failed to update driver."); // Show error message if update fails
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
            <h2 className="text-2xl font-semibold mb-6 text-center text-gray-800">Edit Driver</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Driver Name Field */}
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
                {errorMessages.name && <p className="text-orange-600 text-sm">{errorMessages.name}</p>}
              </div>

              {/* Phone Number Field */}
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

              {/* License Number Field */}
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

              {/* Availability Checkbox */}
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={driver.availability}
                  onChange={handleCheckboxChange}
                  className="h-5 w-5 text-orange-600 focus:ring-orange-600"
                />
                <label className="ml-2 text-sm font-medium text-gray-700">Available for Rides</label>
              </div>

              {/* Driver Image Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Driver Image</label>
                <input
                  type="file"
                  name="image"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="w-full p-2 border border-gray-300 rounded-md text-sm"
                />
                {errorMessages.image && <p className="text-orange-600 text-sm">{errorMessages.image}</p>}
              </div>

              {/* Submit and Cancel Buttons */}
              <div className="flex space-x-4 mt-4">
                <button type="submit" className="p-2 bg-orange-600 text-white rounded-md">Update</button>
                <button type="button" onClick={() => navigate("/admin")} className="p-2 bg-orange-600 text-white rounded-md">Back</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditDriver;
