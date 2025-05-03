import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { base64Decode } from "../utils/helpers";

const Success = () => {
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [verificationError, setVerificationError] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);
  const token = queryParams.get("data");
  const decoded = token ? base64Decode(token) : null;

  const product_id =
    decoded?.transaction_uuid || queryParams.get("purchase_order_id");

  const isKhalti = queryParams.get("pidx") !== null;
  const rawAmount =
    decoded?.total_amount ||
    queryParams.get("total_amount") ||
    queryParams.get("amount");
  const total_amount = isKhalti ? rawAmount / 100 : rawAmount;

  useEffect(() => {
    verifyPaymentAndUpdateStatus();
  }, [product_id]);

  const verifyPaymentAndUpdateStatus = async () => {
    if (!product_id) {
      setIsLoading(false);
      setVerificationError(true);
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:5000/api/payment-status",
        {
          product_id,
          pidx: queryParams.get("pidx"),
        }
      );

      setIsLoading(false);
      if (response.status === 200 && response.data.status === "COMPLETED") {
        setPaymentStatus("COMPLETED");
      } else {
        navigate("/payment-failure", {
          search: `?purchase_order_id=${product_id}`,
        });
      }
    } catch (error) {
      console.error("Error confirming payment:", error);
      setIsLoading(false);
      setVerificationError(true);

      if (error.response?.status === 400) {
        navigate("/payment-failure", {
          search: `?purchase_order_id=${product_id}`,
        });
      }
    }
  };

  if (isLoading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 text-gray-600">
        Loading...
      </div>
    );

  if (verificationError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
        <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-yellow-100 text-yellow-600 p-4 rounded-full">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="40"
                height="40"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12.01" y2="16"></line>
              </svg>
            </div>
          </div>
          <h1 className="text-xl font-semibold text-gray-800 mb-2">
            Oops! Error verifying payment
          </h1>
          <p className="text-gray-600 mb-4">
            We couldn't confirm your payment status right now.
          </p>
          <div className="bg-gray-50 rounded-lg p-4 text-left text-sm text-gray-700 mb-6">
            <p>
              <strong>Reference ID:</strong>{" "}
              {product_id || queryParams.get("pidx") || "Unknown"}
            </p>
            <p>
              If the amount was deducted, please contact our support team. We'll
              help you sort it out.
            </p>
          </div>
          <button
            onClick={() => navigate("/OrderHistory")}
            className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-medium py-2 px-4 rounded-lg transition duration-200"
          >
            thnak you for paymnet:
             GO to Order page
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full text-center">
        <div className="flex justify-center mb-4">
          <div className="bg-green-100 text-green-600 p-4 rounded-full">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="40"
              height="40"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
          </div>
        </div>
        <h1 className="text-2xl font-semibold text-gray-800 mb-2">
          Payment Successful!
        </h1>
        <p className="text-gray-600 mb-4">
          Thank you! Your transaction was completed successfully.
        </p>

        <div className="bg-gray-50 rounded-lg p-4 text-left text-sm text-gray-700 mb-6">
          <p>
            <strong>Amount Paid:</strong> NPR {total_amount}
          </p>
          <p>
            <strong>Transaction ID:</strong> {product_id}
          </p>
          <p>
            <strong>Payment Method:</strong> {isKhalti ? "Khalti" : "eSewa"}
          </p>
          <p>
            <strong>Status:</strong> Completed
          </p>
        </div>

        <button
       onClick={() => navigate("/OrderHistory")}
          className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg transition duration-200"
        >
           thank u! Click here to go
           your order page.
        </button>
      </div>
    </div>
  );
};

export default Success;
