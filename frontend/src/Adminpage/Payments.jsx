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
  const [searchQuery, setSearchQuery] = useState("");

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
    return date.toLocaleString("default", { month: "short" });
  };

  const calculateTotalAmount = () => {
    return transactions
      .filter((t) => t.status === "COMPLETED")
      .reduce((total, t) => total + parseFloat(t.amount), 0)
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
    const statusMonthData = transactions.reduce((acc, t) => {
      const month = formatMonth(t.created_at);
      const key = `${t.status} - ${month}`;
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {});

    const labels = Object.keys(statusMonthData);
    const data = Object.values(statusMonthData);
    const backgroundColor = generateColors(labels.length);

    return {
      labels,
      datasets: [{ label: "Transactions", data, backgroundColor }],
    };
  };

  // 🔍 Filtered transactions based on search
  const filteredTransactions = transactions.filter((t) => {
    const query = searchQuery.toLowerCase();
    return (
      t.user_name?.toLowerCase().includes(query) ||
      t.user_contact_number?.toLowerCase().includes(query) ||
      t.product_name?.toLowerCase().includes(query)
    );
  });

  if (loading) return <div>Loading...</div>;

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 pl-64">
        <Header />
        <div className="container mx-auto py-6">
          <h2 className="text-2xl font-semibold mb-4">Payment Transactions</h2>

          {/* 🔍 Search input */}
          <div className="mb-4">
            <input
              type="text"
              placeholder="Search by name, phone, or product"
              className="border px-4 py-2 rounded w-full md:w-96"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Total Payments */}
          <div className="text-xl font-semibold mb-6">
            <p>Total Payments: ₹{calculateTotalAmount()}</p>
          </div>

          {/* Pie Chart */}
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

          {/* Table */}
          <div className="overflow-x-auto bg-white shadow-md rounded-lg">
            <table className="min-w-full table-auto">
              <thead>
                <tr className="bg-orange-600 text-white">
                  <th className="px-4 py-2 text-left">#</th>
                  <th className="px-4 py-2 text-left">User ID</th>
                  <th className="px-4 py-2 text-left">User Name</th>
                  <th className="px-4 py-2 text-left">Phone Number</th>
                  <th className="px-4 py-2 text-left">Product</th>
                  <th className="px-4 py-2 text-left">Transaction ID</th>
                  <th className="px-4 py-2 text-left">Vehicle Model</th>
                  <th className="px-4 py-2 text-left">Amount</th>
                  <th className="px-4 py-2 text-left">Payment Gateway</th>
                  <th className="px-4 py-2 text-left">Status</th>
                  <th className="px-4 py-2 text-left">Date</th>
                </tr>
              </thead>
              <tbody>
                {filteredTransactions.map((t) => (
                  <tr className="border-b" key={t.id}>
                    <td className="px-4 py-2">{t.id}</td>
                    <td className="px-4 py-2">{t.userid}</td>
                    <td className="px-4 py-2">{t.user_name}</td>
                    <td className="px-4 py-2">{t.user_contact_number}</td>
                    <td className="px-4 py-2">{t.product_name}</td>
                    <td className="px-4 py-2">{t.product_id}</td>
                    <td className="px-4 py-2">{t.vehiclemodel}</td>
                    <td className="px-4 py-2">{`₹${parseFloat(t.amount).toFixed(2)}`}</td>
                    <td className="px-4 py-2">{t.payment_gateway}</td>
                    <td className={`px-4 py-2 ${t.status === "COMPLETED" ? "text-green-500" : "text-red-500"}`}>
                      {t.status === "COMPLETED" ? "Completed" : "Pending"}
                    </td>
                    <td className="px-4 py-2">{new Date(t.created_at).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredTransactions.length === 0 && (
              <div className="p-4 text-center text-gray-500">No transactions found.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payments;
