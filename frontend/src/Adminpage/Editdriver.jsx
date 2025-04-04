import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import heroImage from "../images/Hero-page.png";
import axios from "axios";
import { validateEditDriver } from "./validation";  // Import validation function

const EditDriver = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [driver, setDriver] = useState({
    name: "",
    phone: "",
    license_number: "",
    availability: false, // Added availability field
    image: null,
    currentImage: "",
  });
  const [image, setImage] = useState(null);
  const [errorMessages, setErrorMessages] = useState({
    name: "",
    phone: "",
    license_number: "",
    image: "",
  });

  useEffect(() => {
    const fetchDriver = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/drivers/${id}`);
        setDriver({
          ...res.data.driver,
          currentImage: res.data.driver.image || "",
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

    const { isValid, errors } = validateEditDriver(driver, image, driver.currentImage);
    setErrorMessages(errors);

    if (!isValid) {
      return;
    }

    try {
      const formData = new FormData();
      formData.append("name", driver.name);
      formData.append("phone", driver.phone);
      formData.append("license_number", driver.license_number);
      formData.append("availability", driver.availability); // Include availability
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
