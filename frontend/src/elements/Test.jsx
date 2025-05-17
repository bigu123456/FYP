import React, { useState } from 'react';

const Test = () => {
  const [name, setname] = useState('');
  const [phone, setphone] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault(); // ✅ Prevents form from refreshing the page
    console.log('Submitted:', { name, phone });
  
    // Clear form state
    setname("");
    setphone("");
  
    try {
      const response = await fetch('http://localhost:5000/api/bigu', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: name,
          phone: phone,
        }),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        alert('Contact saved successfully!');
      } else {
        alert('Error saving contact');
        console.log(data.message);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred');
    }
  };
  

  return (
    <>
      <h1 className="text-2xl font-bold mb-4">Hello everybody</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="block font-semibold mb-1">Email:</label>
          <input
            type="email"
            id="email"
            placeholder="Enter your email"
            value={name}
            onChange={(e) => setname(e.target.value)}
            className="border border-gray-300 p-2 w-full rounded"
          />
        </div>
        <div>
          <label htmlFor="phone" className="block font-semibold mb-1">Phone:</label>
          <input
            type="tel"
            id="phone"
            placeholder="Enter your phone number"
            value={phone}
            onChange={(e) => setphone(e.target.value)}
            className="border border-gray-300 p-2 w-full rounded"
          />
        </div>
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Submit
        </button>
      </form>
    </>
  );
};

export default Test;
