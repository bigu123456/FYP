import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Sidebar from './Sidebar'; // Adjust the path as needed
import Header from './Header';   // Adjust the path as needed

const AdminFeedback = () => {
  const [feedbacks, setFeedbacks] = useState([]);

  useEffect(() => {
    axios.get('/api/admin/feedback')
      .then(res => setFeedbacks(res.data))
      .catch(err => console.error('Error fetching feedback:', err));
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 font-sans flex">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content with padding to avoid overlap */}
      <div className="flex-1 flex flex-col pl-64"> {/* <-- Add pl-64 here */}
        {/* Header */}
        <Header />

        {/* Feedback Section */}
        <main className="p-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">Vehicle Feedback</h2>
          {feedbacks.length === 0 ? (
            <p className="text-gray-600">No feedback yet.</p>
          ) : (
            <div className="space-y-6">
              {feedbacks.map((fb) => (
                <div key={fb.id} className="bg-white rounded-xl shadow-md p-6">
                  <div className="text-xl font-semibold text-gray-800">{fb.user_name || 'N/A'}</div>
                  <div className="text-sm text-gray-500">{fb.user_phone || 'N/A'}</div>
                  <div className="mt-4 text-gray-700 font-medium">Comment:</div>
                  <p className="mt-2 p-4 bg-gray-50 border rounded-lg text-gray-700">
                    {fb.comment || 'No comment'}
                  </p>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default AdminFeedback;
