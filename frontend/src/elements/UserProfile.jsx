import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // <-- Step 1

const UserProfile = ({ onClose }) => {
  const [user, setUser] = useState({});
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    age: '',
    city: '',
    contact_number: ''
  });

  const navigate = useNavigate(); // <-- Step 2
  const userId = localStorage.getItem('userId');

  useEffect(() => {
    if (!userId) {
      console.warn("User not logged in.");
      return;
    }

    axios.get(`http://localhost:5000/api/user/${userId}`)
      .then(res => {
        setUser(res.data);
        setFormData({
          name: res.data.name || '',
          email: res.data.email || '',
          age: res.data.age || '',
          city: res.data.city || '',
          contact_number: res.data.contact_number || ''
        });
      })
      .catch(err => console.error(err));
  }, [userId]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(
        `http://localhost:5000/api/user/${userId}/update-profile`,
        formData
      );
      alert('Profile updated successfully!');
      onClose(); // Optional if you want to do anything else after update
    } catch (err) {
      console.error('Update failed:', err);
      alert('Update failed!');
    }
  };

  const handleClose = () => {
    navigate('/'); // <-- Redirect to home
  };

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md relative">
        <button
          onClick={handleClose} // <-- Trigger redirect
          className="absolute top-2 right-2 text-gray-500 hover:text-black"
        >
          &times;
        </button>
        <h2 className="text-2xl font-semibold mb-4">
          {user.role === 'admin' ? 'Admin Profile' : 'User Profile'}
        </h2>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            value={formData.name}
            placeholder="Name"
            onChange={handleChange}
            className="mb-2 block w-full border px-3 py-2"
          />
          <input
            type="email"
            name="email"
            value={formData.email}
            placeholder="Email"
            onChange={handleChange}
            className="mb-2 block w-full border px-3 py-2"
          />
          <input
            type="text"
            name="age"
            value={formData.age}
            placeholder="Age"
            onChange={handleChange}
            className="mb-2 block w-full border px-3 py-2"
          />
          <input
            type="text"
            name="city"
            value={formData.city}
            placeholder="City"
            onChange={handleChange}
            className="mb-2 block w-full border px-3 py-2"
          />
          <input
            type="text"
            name="contact_number"
            value={formData.contact_number}
            placeholder="Contact Number"
            onChange={handleChange}
            className="mb-4 block w-full border px-3 py-2"
          />
          <button
            type="submit"
            className="bg-orange-500 text-white px-4 py-2 rounded"
          >
            Update Profile
          </button>
        </form>
      </div>
    </div>
  );
};

export default UserProfile;
