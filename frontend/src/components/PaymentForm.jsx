import React, { useState } from "react";
import axios from "axios";
import { generateUniqueId } from "../utils/helpers.js";

const PaymentComponent = () => {
  const [formData, setFormData] = useState({
    customerName: "",
    customerEmail: "",
    customerPhone: "",
    productName: "",
    amount: "",
    paymentGateway: "esewa",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const productId = generateUniqueId();
      sessionStorage.setItem("current_transaction_id", productId);

      const response = await axios.post(
        "http://localhost:5000/api/initiate-payment",
        {
          ...formData,
          productId,
        }
      );

      if (response.data.url) {
        window.location.href = response.data.url;
      } else {
        console.error("Error: Payment URL is undefined.");
        alert("Payment URL is invalid. Please try again.");
      }
    } catch (error) {
      console.error("Error initiating payment:", error);
      alert("Payment failed. Please check the console for details.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-indigo-50 to-white flex items-center justify-center p-4">
      <div className="bg-white shadow-2xl rounded-2xl p-8 max-w-xl w-full">
        <h1 className="text-3xl font-bold text-indigo-600 mb-2 text-center">
          Payment Integration
        </h1>
        <p className="text-gray-600 text-center mb-6">
          Fill in the details to proceed with payment
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {[
            { id: "customerName", type: "text", label: "Full Name", placeholder: "Enter your full name" },
            { id: "customerEmail", type: "email", label: "Email", placeholder: "Enter your email" },
            { id: "customerPhone", type: "tel", label: "Phone Number", placeholder: "Enter your phone number" },
            { id: "productName", type: "text", label: "Product/Service Name", placeholder: "Enter product/service name" },
            { id: "amount", type: "number", label: "Amount (NPR)", placeholder: "Enter amount", min: 1 },
          ].map(({ id, type, label, placeholder, min }) => (
            <div key={id}>
              <label htmlFor={id} className="block text-sm font-medium text-gray-700">
                {label}
              </label>
              <input
                type={type}
                id={id}
                name={id}
                value={formData[id]}
                onChange={handleChange}
                required
                min={min}
                placeholder={placeholder}
                className="mt-1 w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          ))}

          <div>
            <label htmlFor="paymentGateway" className="block text-sm font-medium text-gray-700">
              Payment Method
            </label>
            <select
              id="paymentGateway"
              name="paymentGateway"
              value={formData.paymentGateway}
              onChange={handleChange}
              required
              className="mt-1 w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="esewa">eSewa</option>
              <option value="khalti">Khalti</option>
            </select>
          </div>

          <button
            type="submit"
            className={`w-full py-2 px-4 rounded-lg text-white font-semibold transition duration-300 ${
              isSubmitting
                ? "bg-indigo-300 cursor-not-allowed"
                : "bg-indigo-600 hover:bg-indigo-700"
            }`}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Processing..." : "Proceed to Payment"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default PaymentComponent;
