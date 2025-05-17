// src/elements/LoyaltyInfo.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";

const LoyaltyInfo = ({ userId }) => {
  const [loyalty, setLoyalty] = useState(null);

  useEffect(() => {
    const fetchLoyalty = async () => {
      try {
        const res = await axios.get(`/api/loyalty/user/${userId}`);
        setLoyalty(res.data.loyalty);
      } catch (err) {
        console.error("Error fetching loyalty info:", err);
      }
    };

    if (userId) fetchLoyalty();
  }, [userId]);

  if (!loyalty) return null;

  return (
    <div className="bg-white p-4 shadow rounded-xl mt-4">
      <h3 className="text-xl font-semibold text-orange-600">Loyalty Status</h3>
      <p className="mt-2 text-gray-700">
        Level: <span className="font-bold">{loyalty.level}</span>
      </p>
      <p className="text-gray-700">
        Points: <span className="font-bold">{loyalty.points}</span>
      </p>
    </div>
  );
};

export default LoyaltyInfo;
