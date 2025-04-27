import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const UserProfile = ({ onClose }) => {
  const [user, setUser] = useState({});
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    age: '',
    city: '',
    contact_number: '',
    profile_image: null // To store the selected image
  });

  const navigate = useNavigate();
  const userId = localStorage.getItem('userId');

  // Fetch user data on component mount
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
          profile_image: res.data.profile_image || null
        });
      })
      .catch(err => console.error(err));
  }, [userId]);

  // Handle form input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle file input change (profile image)
  const handleFileChange = (e) => {
    setFormData({ ...formData, profile_image: e.target.files[0] });
  };

  // Submit form data to the backend
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate numeric fields
    if (isNaN(formData.age) || formData.age === '') {
      formData.age = null; // Set to null if invalid
    }

    if (formData.contact_number === '') {
      formData.contact_number = null; // Set to null if empty
    }

    const data = new FormData();
    data.append('name', formData.name);
    data.append('email', formData.email);
    data.append('age', formData.age);
    data.append('city', formData.city);
    data.append('contact_number', formData.contact_number);

    if (formData.profile_image) {
      data.append('profile_image', formData.profile_image); // Append image file if available
    }

    try {
      await axios.put(
        `http://localhost:5000/api/user/${userId}/update-profile`,
        data,
        { headers: { 'Content-Type': 'multipart/form-data' } } // Important for file upload
      );
      alert('Profile updated successfully!');
      onClose(); // Close the profile form after successful update
    } catch (err) {
      console.error('Update failed:', err);
      alert('Update failed!');
    }
  };

  // Close the profile modal
  const handleClose = () => {
    navigate('/'); // Navigate to the homepage
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
          <input
            type="file"
            name="profile_image"
            onChange={handleFileChange}
            className="mb-4 block w-full"
          />
          <button
            type="submit"
            className="bg-orange-500 text-white px-4 py-2 rounded w-full"
          >
            Update Profile
          </button>
        </form>

       
      </div>
    </div>
  );
};

export default UserProfile;
