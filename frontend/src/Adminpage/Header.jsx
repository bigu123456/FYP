import { LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear any stored authentication data (like tokens)
    localStorage.removeItem("authToken"); // If you're using localStorage for authentication

    // Redirect to Home Page
    navigate("/");
  };

  return (
    <div className="bg-orange-500 text-white flex justify-between p-4">
      <h2 className="text-lg font-bold">Dashboard</h2>
      <button onClick={handleLogout} className="flex items-center gap-2 hover:text-gray-300 transition">
        <LogOut size={20} /> GO to home page
      </button>
    </div>
  );
};

export default Header;
