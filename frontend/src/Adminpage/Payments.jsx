import React, { useState, useEffect } from "react";
import axios from "axios";
import { Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";

import Header from "./Header";
import Sidebar from "./Sidebar";

// Register chart components
ChartJS.register(ArcElement, Tooltip, Legend);

const Payments = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/transactions");
        setTransactions(response.data);
      } catch (error) {
        console.error("Error fetching transactions:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  const formatMonth = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString("default", { month: "short" }); // e.g. Apr
  };

  const calculateTotalAmount = () => {
    return transactions
      .filter(transaction => transaction.status === "COMPLETED")
      .reduce((total, transaction) => total + parseFloat(transaction.amount), 0)
      .toFixed(2);
  };

  const generateColors = (num) => {
    const baseColors = [
      "#4caf50", "#f44336", "#2196f3", "#ff9800", "#9c27b0",
      "#00bcd4", "#8bc34a", "#ffeb3b", "#795548", "#607d8b",
    ];
    return Array.from({ length: num }, (_, i) => baseColors[i % baseColors.length]);
  };

  const getPaymentStatusByMonthPieData = () => {
    const statusMonthData = transactions.reduce((acc, transaction) => {
      const month = formatMonth(transaction.created_at);
      const key = `${transaction.status} - ${month}`;
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {});

    const labels = Object.keys(statusMonthData);
    const data = Object.values(statusMonthData);
    const backgroundColor = generateColors(labels.length);

    return {
      labels,
      datasets: [
        {
          label: "Transactions",
          data,
          backgroundColor,
        },
      ],
    };
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 pl-64">
        <Header />
        <div className="container mx-auto py-6">
          <h2 className="text-2xl font-semibold mb-4">Payment Transactions</h2>

          {/* Total Payment Amount */}
          <div className="text-xl font-semibold mb-6">
            <p>Total Payments: ₹{calculateTotalAmount()}</p>
          </div>

          {/* Pie Chart for Status by Month */}
          <div className="mb-6" style={{ maxWidth: "700px", margin: "0 auto" }}>
            <Pie
              data={getPaymentStatusByMonthPieData()}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: { position: "bottom" },
                  tooltip: {
                    callbacks: {
                      label: function (context) {
                        const label = context.label || "";
                        const value = context.parsed;
                        const total = context.dataset.data.reduce((a, b) => a + b, 0);
                        const percentage = ((value / total) * 100).toFixed(1);
                        return `${label}: ${value} (${percentage}%)`;
                      },
                    },
                  },
                },
              }}
              height={300}
            />
          </div>

          {/* Payment Transactions Table */}
          <div className="overflow-x-auto bg-white shadow-md rounded-lg">
            <table className="min-w-full table-auto">
              <thead>
                <tr className="bg-orange-600 text-white">
                  <th className="px-4 py-2 text-left">#</th>
                  <th className="px-4 py-2 text-left">User ID</th>
                  <th className="px-4 py-2 text-left">User Name</th>
                  <th className="px-4 py-2 text-left">Phone Number</th>
                  <th className="px-4 py-2 text-left">Product</th>
                  <th className="px-4 py-2 text-left">Vehicle Model</th>
                  <th className="px-4 py-2 text-left">Amount</th>
                  <th className="px-4 py-2 text-left">Payment Gateway</th>
                  <th className="px-4 py-2 text-left">Status</th>
                  <th className="px-4 py-2 text-left">Date</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((transaction) => (
                  <tr className="border-b" key={transaction.id}>
                    <td className="px-4 py-2">{transaction.id}</td>
                    <td className="px-4 py-2">{transaction.userid}</td>
                    <td className="px-4 py-2">{transaction.user_name}</td>
                    <td className="px-4 py-2">{transaction.user_contact_number}</td>
                    <td className="px-4 py-2">{transaction.product_name}</td>
                    <td className="px-4 py-2">{transaction.vehiclemodel}</td>
                    <td className="px-4 py-2">{`₹${parseFloat(transaction.amount).toFixed(2)}`}</td>
                    <td className="px-4 py-2">{transaction.payment_gateway}</td>
                    <td className={`px-4 py-2 ${transaction.status === "COMPLETED" ? "text-green-500" : "text-red-500"}`}>
                      {transaction.status === "COMPLETED" ? "Completed" : "Pending"}
                    </td>
                    <td className="px-4 py-2">{new Date(transaction.created_at).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payments;
