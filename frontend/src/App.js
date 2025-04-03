import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./elements/Home";
import LoginPage from "./elements/LoginPage";
import RegisterPage from "./elements/Register";
import Contactus from "./elements/Contactus";
import OrderPage from "./elements/OrderPage";
import Vehicleslists from "./elements/Vehicleslists";
import SelectDriverPage from "./elements/SelectDriverPage";
import Booking from "./Adminpage/Booking";

// Admin Pages
import Admin from "./Adminpage/Admin";
import Adddriver from "./Adminpage/Adddriver";
import Vehicles from "./Adminpage/Vehicles";
import AddVehicle from "./Adminpage/AddVehicle";
import Driverlist from "./Adminpage/Driverlist";
import Editdriver from "./Adminpage/Editdriver";
import UserList from "./Adminpage/UserList";  
import AdminLayout from "./layouts/AdminLayout";

import PrivateRoute from './PrivateRoute';  

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/vehicleslists" element={<Vehicleslists />} />
        <Route path="/contactus" element={<Contactus />} />
        <Route path="/order/:id" element={<OrderPage />} />
        <Route path="/select-driver/:id" element={<SelectDriverPage />} />

        {/* Admin Routes (Protected with PrivateRoute) */}
        <Route element={<PrivateRoute />}>
        <Route element={<AdminLayout />}></Route>
          <Route path="/admin" element={<Admin />} />
          <Route path="/admin/adddriver" element={<Adddriver />} />
          <Route path="/admin/vehicles" element={<Vehicles />} />
          <Route path="/admin/addvehicle" element={<AddVehicle />} />
          <Route path="/admin/Driverlist" element={<Driverlist />} />
          <Route path="/admin/Editdriver/:id" element={<Editdriver />} />
          <Route path="/user-list" element={<UserList />} />
          <Route path="Booking" element={<Booking/>}/>
          
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
