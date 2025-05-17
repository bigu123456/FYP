import { Outlet } from "react-router-dom";
import Sidebar from "../Adminpage/Sidebar";
import Header from "../Adminpage/Header";  // Assuming you have a Header component

const AdminLayout = () => {
  return (
    <div className="admin-layout">
      <Sidebar />  {/* Sidebar will stay constant */}
      <div className="content">
        <Header />  {/* Optional Header */}
        <Outlet />  {/* This will render the content of the nested route */}
      </div>
    </div>
  );
};

export default AdminLayout;
