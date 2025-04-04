import Sidebar from "./Sidebar";
import Header from "./Header";
import Dashboard from "./Dashboard";

const Admin = () => {
  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1">
        <Header />
        <Dashboard />
      </div>
    </div>
  );
};

export default Admin;
