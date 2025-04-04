import React, { useState } from 'react';
import axios from 'axios';

const PaymentForm = () => {
    const [amount, setAmount] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [description, setDescription] = useState('');

    const handlePayment = async () => {
        try {
            const response = await axios.post('http://localhost:5000/payment', {
                amount,
                phone,
                email,
                description,
            });
            // Redirect the user to the eSewa payment page
            window.location.href = response.data.paymentUrl;
        } catch (error) {
            console.error('Payment initiation failed', error);
        }
    };

    return (
        <div className="flex justify-center items-center h-screen bg-orange-500">
            <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
                <h1 className="text-2xl font-semibold text-gray-800 mb-6 text-center">Pay for Vehicle Rental</h1>
                <form className="space-y-6">
                    <div>
                        <label className="block text-gray-700 text-sm font-medium mb-2">Amount:</label>
                        <input
                            type="number"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            placeholder="Enter Amount"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700 text-sm font-medium mb-2">Phone Number:</label>
                        <input
                            type="text"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            placeholder="Enter Your Phone Number"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700 text-sm font-medium mb-2">Email:</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter Your Email"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700 text-sm font-medium mb-2">Description:</label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Description of Payment (Optional)"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                        />
                    </div>
                    <button
                        type="button"
                        onClick={handlePayment}
                        className="w-full py-3 bg-orange-500 text-white font-semibold rounded-lg transition duration-300 hover:bg-orange-600 focus:outline-none"
                    >
                        Pay Now
                    </button>
                </form>
            </div>
        </div>
    );
};

export default PaymentForm;
