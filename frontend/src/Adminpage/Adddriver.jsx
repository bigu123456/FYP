import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { validateAddDriver } from "./validation";
import heroImage from "../images/Hero-page.png";
import Sidebar from "./Sidebar";
import Header from "./Header";

const AddDriver = () => {
  const [driver, setDriver] = useState({
    name: "",
    phone: "",
    email: "",
    license_number: "",
    description: "",
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { isValid, errors } = validateAddDriver(driver, image);
    setErrorMessages(errors);
    if (!isValid) return;

    try {
      const formData = new FormData();
      formData.append("name", driver.name);
      formData.append("phone", driver.phone);
      formData.append("email", driver.email);
      formData.append("license_number", driver.license_number);
      formData.append("description", driver.description);
      if (image) formData.append("image", image);

      await axios.post("http://localhost:5000/api/drivers", formData);
      alert("Driver added successfully!");
      setDriver({
        name: "",
        phone: "",
        email: "",
        license_number: "",
        description: "",
      });
      setImage(null);
    } catch (error) {
      console.error("Error adding driver:", error);
      alert("An error occurred while adding the driver.");
    }
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />

      <div className="flex-1 flex flex-col">
        <Header />

        <div className="flex flex-1">
          {/* Left Hero Section */}
          <div className="hidden md:flex w-1/2 bg-orange-100 items-center justify-center border-r-2 border-orange-200">
            <img
              src={heroImage}
              alt="Hero"
              className="max-w-full max-h-full object-contain p-4"
            />
          </div>

          {/* Right Form Section */}
          <div className="w-full md:w-1/2 bg-white flex items-center justify-center p-10">
            <div className="w-full max-w-md">
              <h2 className="text-3xl font-bold text-orange-600 text-center mb-6">
                Add Driver
              </h2>

              <form onSubmit={handleSubmit} className="space-y-5">
                {[ 
                  { label: "Driver Name", name: "name", type: "text" },
                  { label: "Phone Number", name: "phone", type: "text" },
                  { label: "Email Address", name: "email", type: "email" },
                  { label: "License Number", name: "license_number", type: "text" },
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
                      className="w-full p-2 border border-gray-300 rounded-md text-sm"
                      required
                    />
                    {errorMessages[field.name] && (
                      <p className="text-red-500 text-sm">{errorMessages[field.name]}</p>
                    )}
                  </div>
                ))}

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Driver Description
                  </label>
                  <textarea
                    name="description"
                    value={driver.description}
                    onChange={handleChange}
                    rows="3"
                    className="w-full p-2 border border-gray-300 rounded-md text-sm"
                    placeholder="Description..."
                  />
                  {errorMessages.description && (
                    <p className="text-red-500 text-sm">{errorMessages.description}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Driver Image
                  </label>
                  <input
                    type="file"
                    name="image"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="w-full p-2 border border-gray-300 rounded-md text-sm"
                  />
                  {errorMessages.image && (
                    <p className="text-red-500 text-sm">{errorMessages.image}</p>
                  )}
                </div>

                <div className="flex justify-between">
                  <button
                    type="submit"
                    className="w-full bg-orange-600 hover:bg-orange-700 text-white font-semibold py-2 px-4 rounded-md transition duration-200 mr-2"
                  >
                    Add
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddDriver;
