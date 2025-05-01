import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from 'react-toastify';
import Home from "./elements/Home";
import LoginPage from "./elements/LoginPage";
import RegisterPage from "./elements/Register";
import Contactus from "./elements/Contactus";
import AboutUs from "./elements/Aboutus";
import OrderPage from "./elements/OrderPage";
import Vehicleslists from "./elements/Vehicleslists";
import SelectDriverPage from "./elements/SelectDriverPage";
import Booking from "./Adminpage/Booking";

import OTPVerification from './elements/OTPVerification'; // OTPVerification Component
import Bookingpage from "./elements/Bookingpage";
import SingleVehicle from "./elements/SingleVehicle";
import DriverDetailsPage from "./elements/DriverDetailsPage";
import OrderHistory from "./elements/OrderHistory"; // or the correct path if different
import UserProfile from "./elements/UserProfile";
import LoyaltyDashboard from "./elements/LoyaltyDashboard";
import RequestForm from "./elements/RequestForm"
import Test from "./elements/Test";

// Admin Pages
import Admin from "./Adminpage/Admin";
import Adddriver from "./Adminpage/Adddriver";
import Vehicles from "./Adminpage/Vehicles";
import AddVehicle from "./Adminpage/AddVehicle";
import Driverlist from "./Adminpage/Driverlist";
import Editdriver from "./Adminpage/Editdriver";
import UserList from "./Adminpage/UserList";  
import AdminLayout from "./layouts/AdminLayout";
import VehicleDetailsPage from "./Adminpage/VehicleDetailsPage";


import PrivateRoute from './PrivateRoute';  
import PaymentComponent from "./components/PaymentForm";
import Success from "./components/Success";
import Failure from "./components/Failure";
import UserRequestList from "./Adminpage/Userrequest";
import Payments from "./Adminpage/Payments";
import Usevehicles from "./Adminpage/usevehicles";
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
        <Route path ="/Aboutus" element={<AboutUs/>}/>
        <Route path="/order/:id" element={<OrderPage />} />
        <Route path="/select-driver/:id" element={<SelectDriverPage />} />
        
        
        
       
        <Route path="/otp-verification" element={<OTPVerification />} />
        <Route path ="Bookingpage" element={<Bookingpage/>}/>
        <Route path="/details/:id" element={<SingleVehicle />} />
        <Route path="/driver-details/:id" element={<DriverDetailsPage />} />
        <Route path="/orderhistory" element={<OrderHistory />} />
        <Route path="/userprofile" element={<UserProfile/>}/>
        <Route path="/payment" element={<PaymentComponent/>}/>
          <Route path="/payment-success" element={<Success/>} />
          <Route path="/payment-failure" element={<Failure/>} />
          <Route path ="/LoyaltyDashboard"element={<LoyaltyDashboard/>} />
         
          <Route path="RequestForm"element={<RequestForm/>} />
          <Route path="Test"element={<Test/>}/>
         
         
        


        

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
          <Route path="/vehicle-details/:id" element={<VehicleDetailsPage />} />
          <Route path="/admin/userrequest" element={<UserRequestList />} />
          <Route path ="payments" element={<Payments/>}/>
          <Route path="usevehicles" element={<Usevehicles/>} />


         

        </Route>
      </Routes>
      {/* 🔥 Toast Container should be placed here! */}
      <ToastContainer />
    
    </Router>
  );
};

export default App;
