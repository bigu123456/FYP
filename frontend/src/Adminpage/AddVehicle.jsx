import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify"; 
import 'react-toastify/dist/ReactToastify.css'; 
import Sidebar from "./Sidebar";
import Header from "./Header";

const AddVehicle = () => {
  const [formData, setFormData] = useState({
    brand: "",
    model: "",
    category: "",
    type: "",
    fuel_type: "",
    rental_price: "",
    image: null,
    description: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    setFormData({ ...formData, image: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    Object.keys(formData).forEach((key) => {
      if (formData[key]) {
        data.append(key, formData[key]);
      }
    });

    try {
      const res = await fetch("http://localhost:5000/api/vehicles", {
        method: "POST",
        body: data,
      });

      const responseData = await res.json();
      console.log("Response Data:", responseData);

      if (responseData.success) {
        toast.success("Vehicle added successfully! 🚗", { autoClose: 1500 });

        setFormData({
          brand: "",
          model: "",
          category: "",
          type: "",
          fuel_type: "",
          rental_price: "",
          image: null,
          description: "",
        });

        setTimeout(() => {
          navigate("/admin/vehicles");
        }, 1600);
      } else {
        toast.error("Failed to add vehicle. Please check your inputs! ❌");
      }
    } catch (err) {
      console.error("Error:", err);
      toast.error("Error adding vehicle. Please try again. ❌");
    }
  };

  return (
    <div className="flex min-h-screen overflow-x-hidden">
      <Sidebar />

      <div className="flex-1 flex flex-col bg-gray-900 overflow-y-auto">
        <Header />

        <div className="flex flex-1 justify-center items-center p-8">
          <div className="w-full max-w-xl bg-black p-8 rounded-lg shadow-lg hover:shadow-2xl transition duration-300">
            <h2 className="text-3xl font-bold text-orange-500 text-center mb-6">
              Add Vehicle
            </h2>

            <form onSubmit={handleSubmit} className="space-y-5">
              {[
                { name: "brand", placeholder: "Brand" },
                { name: "model", placeholder: "Model" },
                { name: "category", placeholder: "Category" },
                { name: "type", placeholder: "Type" },
                { name: "fuel_type", placeholder: "Fuel Type" },
                { name: "rental_price", placeholder: "Rental Price", type: "number" },
              ].map((field) => (
                <div key={field.name}>
                  <input
                    type={field.type || "text"}
                    name={field.name}
                    placeholder={field.placeholder}
                    value={formData[field.name]}
                    onChange={handleChange}
                    className="w-full p-3 bg-gray-800 text-white border border-gray-600 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                    required
                  />
                </div>
              ))}

              <div>
                <textarea
                  name="description"
                  placeholder="Vehicle Description"
                  value={formData.description}
                  onChange={handleChange}
                  rows="4"
                  className="w-full p-3 bg-gray-800 text-white border border-gray-600 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                  required
                />
              </div>

              <div>
                <input
                  type="file"
                  name="image"
                  onChange={handleImageChange}
                  className="w-full p-3 bg-gray-800 text-white border border-gray-600 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                  accept="image/*"
                  required
                />
              </div>

              <div className="flex justify-center">
                <button
                  type="submit"
                  className="bg-orange-600 hover:bg-orange-700 text-white text-sm font-semibold py-2 px-6 rounded-md transition"
                >
                  Add Vehicle
                </button>
              </div>

            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddVehicle;
