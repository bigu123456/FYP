import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { validateRegistration } from './validateRegistration';

const UserProfile = ({ onClose }) => {
  const [user, setUser] = useState({});
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
          contact_number: res.data.contact_number || '',
          password: '',
          confirmPassword: ''
        });
      })
      .catch(err => console.error(err));
  }, [userId]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form fields
    const errors = validateRegistration({
      name: formData.name,
      email: formData.email,
      password: formData.password ? formData.password : 'DummyPassword123',
      confirmPassword: formData.password ? formData.confirmPassword : 'DummyPassword123',
      number: formData.contact_number,
      city: formData.city,
      age: formData.age
    });

    if (errors.length > 0) {
      alert(errors.join('\n'));
      return;
    }

    if (isNaN(formData.age) || formData.age === '') {
      formData.age = null;
    }

    if (formData.contact_number === '') {
      formData.contact_number = null;
    }

    const payload = {
      name: formData.name,
      email: formData.email,
      age: formData.age,
      city: formData.city,
      contact_number: formData.contact_number
    };

    if (formData.password) {
      payload.password = formData.password; // Only add password if user entered it
    }

    try {
      const res = await axios.put(
        `http://localhost:5000/api/user/${userId}/update-profile`,
        payload
      );

      localStorage.setItem('userInfo', JSON.stringify(res.data));
      alert('Profile updated successfully!');
      onClose();
    } catch (err) {
      console.error('Update failed:', err);
      alert('Update failed!');
    }
  };

  const handleClose = () => {
    navigate('/');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center overflow-auto">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md relative">
        <button
          onClick={handleClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-black text-2xl"
        >
          &times;
        </button>
        <h2 className="text-2xl font-semibold mb-4 text-center">
          {user.role === 'admin' ? 'Admin Profile' : 'User Profile'}
        </h2>

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

          {/* Password fields */}
          <input
            type="password"
            name="password"
            value={formData.password}
            placeholder="New Password (optional)"
            onChange={handleChange}
            className="mb-2 block w-full border px-3 py-2 rounded"
          />
          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            placeholder="Confirm New Password"
            onChange={handleChange}
            className="mb-4 block w-full border px-3 py-2 rounded"
          />

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
