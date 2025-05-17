import Sidebar from "./Sidebar";
import Header from "./Header";
import Dashboard from "./Dashboard";

const Admin = () => {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar: fixed on the left */}
      <div className="w-64 h-screen fixed top-0 left-0 z-10">
        <Sidebar />
      </div>

      {/* Main content: pushed to the right */}
      <div className="ml-64 flex-1 flex flex-col min-h-screen">
        <Header />
        <main className="flex-1 overflow-y-auto p-4 bg-gray-50">
          <Dashboard />
        </main>
      </div>
    </div>
  );
};

export default Admin;
