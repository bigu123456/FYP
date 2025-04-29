import React, { useState, useEffect } from "react";
import axios from "axios";

const Payments = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch transaction data on component mount
  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/transactions");
        setTransactions(response.data); // Save data to state
      } catch (error) {
        console.error("Error fetching transactions:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto py-6">
      <h2 className="text-2xl font-semibold mb-4">Payment Transactions</h2>
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
                <td className="px-4 py-2">{transaction.user_contact_number}</td> {/* Corrected to user_contact_number */}
                <td className="px-4 py-2">{transaction.product_name}</td>
                <td className="px-4 py-2">{transaction.vechilemodel}</td>
                <td className="px-4 py-2">
                  {`₹${parseFloat(transaction.amount).toFixed(2)}`} {/* Ensure amount is treated as a float */}
                </td>
                <td className="px-4 py-2">{transaction.payment_gateway}</td>
                <td className="px-4 py-2 text-green-500">
                  {transaction.status === "COMPLETED" ? "Completed" : "Pending"}
                </td>
                <td className="px-4 py-2">{new Date(transaction.created_at).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Payments;
