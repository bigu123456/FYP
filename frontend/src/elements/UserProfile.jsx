import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { validateRegistration } from './validateRegistration';

// UserProfile component displays and allows editing of the user's profile details
const UserProfile = () => {
  // State to store user data from backend
  const [user, setUser] = useState({});

  // State to store user's loyalty level
  const [loyaltyLevel, setLoyaltyLevel] = useState('');

  // Form input state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    age: '',
    city: '',
    contact_number: '',
    password: '',
    confirmPassword: ''
  });

  const navigate = useNavigate();
  const userId = localStorage.getItem('userId'); // Retrieve user ID from localStorage

  useEffect(() => {
    if (!userId) return;

    // Fetch user details from backend
    const fetchUserData = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/user/${userId}`);
        const data = res.data;

        setUser(data);

        // Populate form with user data (excluding password fields)
        setFormData({
          name: data.name || '',
          email: data.email || '',
          age: data.age || '',
          city: data.city || '',
          contact_number: data.contact_number || '',
          password: '',
          confirmPassword: ''
        });
      } catch (err) {
        toast.error('Failed to load user data.', { position: 'top-center' });
      }
    };

    // Fetch loyalty level for the user
    const fetchLoyaltyLevel = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/loyalty/${userId}`);
        setLoyaltyLevel(res.data.level);
      } catch (err) {
        console.error('Failed to fetch loyalty level:', err);
        setLoyaltyLevel('Bronze'); // Default fallback level
      }
    };

    fetchUserData();
    fetchLoyaltyLevel();
  }, [userId]);

  // Handle form input changes
  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form input using existing validator
    const errors = validateRegistration({
      name: formData.name,
      email: formData.email,
      password: formData.password || 'Dummy123', // Use dummy values if password not changed
      confirmPassword: formData.password ? formData.confirmPassword : 'Dummy123',
      number: formData.contact_number,
      city: formData.city,
      age: formData.age
    });

    if (errors.length > 0) {
      toast.error(errors.join('\n'), { position: 'top-center' });
      return;
    }

    // Prepare payload for update request
    const payload = {
      name: formData.name,
      email: formData.email,
      age: formData.age || null,
      city: formData.city,
      contact_number: formData.contact_number || null
    };

    // Include password in payload only if it was entered
    if (formData.password) {
      payload.password = formData.password;
    }

    try {
      // Send update request to backend
      const res = await axios.put(
        `http://localhost:5000/api/user/${userId}/update-profile`,
        payload
      );

      // Store updated info and redirect to homepage
      localStorage.setItem('userInfo', JSON.stringify(res.data));
      toast.success('Profile updated successfully!', {
        position: 'top-center',
        autoClose: 2000,
        onClose: () => navigate('/')
      });

    } catch (err) {
      toast.error('Profile update failed!', { position: 'top-center' });
    }
  };

  return (
    // Modal-style overlay
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center overflow-auto">
      <ToastContainer />

      {/* Profile form card */}
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md relative">
        {/* Close button */}
        <button
          onClick={() => navigate('/')}
          className="absolute top-2 right-2 text-gray-600 hover:text-black text-2xl"
        >
          &times;
        </button>

        {/* Profile header */}
        <h2 className="text-2xl font-semibold mb-2 text-center">
          {user.role === 'admin' ? 'Admin Profile' : 'User Profile'}
        </h2>

        {/* Loyalty level display */}
        <p className="text-center mb-4 text-sm text-gray-700">
          Loyalty Level: <span className="font-semibold text-orange-600">{loyaltyLevel}</span>
        </p>

        {/* Profile update form */}
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            value={formData.name}
            placeholder="Name"
            onChange={handleChange}
            className="mb-2 block w-full border px-3 py-2 rounded"
          />
          <input
            type="email"
            name="email"
            value={formData.email}
            placeholder="Email"
            onChange={handleChange}
            className="mb-2 block w-full border px-3 py-2 rounded"
          />
          <input
            type="text"
            name="age"
            value={formData.age}
            placeholder="Age"
            onChange={handleChange}
            className="mb-2 block w-full border px-3 py-2 rounded"
          />
          <input
            type="text"
            name="city"
            value={formData.city}
            placeholder="City"
            onChange={handleChange}
            className="mb-2 block w-full border px-3 py-2 rounded"
          />
          <input
            type="text"
            name="contact_number"
            value={formData.contact_number}
            placeholder="Contact Number"
            onChange={handleChange}
            className="mb-4 block w-full border px-3 py-2 rounded"
          />
          <input
            type="text"
            name="password"
            value={formData.password}
            placeholder="New Password (optional)"
            onChange={handleChange}
            className="mb-2 block w-full border px-3 py-2 rounded"
          />
          <input
            type="text"
            name="confirmPassword"
            value={formData.confirmPassword}
            placeholder="Confirm New Password"
            onChange={handleChange}
            className="mb-4 block w-full border px-3 py-2 rounded"
          />

          {/* Submit button */}
          <button
            type="submit"
            className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded w-full"
          >
            Update Profile
          </button>
        </form>
      </div>
    </div>
  );
};

export default UserProfile;
