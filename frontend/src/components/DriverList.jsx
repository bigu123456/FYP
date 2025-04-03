
import { useEffect, useState } from "react";
import axios from "axios";

const DriverList = () => {
  const [drivers, setDrivers] = useState([]);

  useEffect(() => {
    const fetchDrivers = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/drivers");
        setDrivers(response.data.drivers);
      } catch (error) {
        console.error("Error fetching drivers:", error);
      }
    };

    fetchDrivers();
  }, []);

  return (
    <div>
      <h1>Drivers</h1>
      {drivers.map((driver) => (
        <div key={driver.id}>
          <h2>{driver.name}</h2>
          <p>{driver.phone}</p>
          <p>{driver.license_number}</p>
          {driver.image && (
            <img
              src={`http://localhost:5000/uploads/${driver.image}`}
              alt={`${driver.name}'s profile`}
              style={{ width: "200px" }}
            />
          )}
        </div>
      ))}
    </div>
  );
};

export default DriverList;
