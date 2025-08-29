import { useEffect } from "react";
import { Routes, Route, useNavigate, BrowserRouter, HashRouter } from "react-router-dom";
import MainLayout from './Layout/MainLayout';
import Dashboard from './pages/Dashboard';
import UserManagement from './pages/UserManagement';
import DriverManagement from './pages/DriverManagement';
import BookingManagement from './pages/BookingManagement';
import Transactions from './pages/Transactions';
import UserBooking from "./pages/UserBooking";
import DriverProfile from "./pages/DriverProfile";
import AdminLogin from './pages/AdminLogin';
import NewRequests from "./pages/NewRequests";
import PendingProfiles from "./pages/PendingProfiles";
import ProtectedRoute from './components/ProtectedRout'; 
import Categories from "./pages/Categories";

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import PaymentRequests from "./pages/PaymentRequests";
import SendNotification from "./pages/SendNotification";
import BookingDetails from "./pages/BookingDetails";

// Helper function to check if any cookies exist
function hasCookies() {
  return document.cookie && document.cookie !== "";
}

// Custom wrapper to use useNavigate outside of Router
function AppWrapper() {
  return (
    <HashRouter>
      <App />
    </HashRouter>
  );
}

function App() {
  const navigate = useNavigate();

  // useEffect(() => {

  //   if (!hasCookies()) {
  //     localStorage.removeItem("auth_token");
      
  //     if (window.location.hash !== "#/admin-login"){
  //       navigate("/admin-login", { replace: true });
  //     }
  //   }

  // }, []);

  return (
    <>
      <ToastContainer position="top-right" autoClose={2000} />

      <Routes>
        {/* Public Route */}
        <Route path="/admin-login" element={<AdminLogin />} />
        {/* Protected Routes */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <MainLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="users" element={<UserManagement />} />
          <Route path="drivers" element={<DriverManagement />} />
          <Route path="bookings" element={<BookingManagement />} />
          <Route path="booking-details" element={<BookingDetails />} />
          <Route path="transactions" element={<Transactions />} />
          <Route path="user-booking" element={<UserBooking />} />
          <Route path="drivers-profile" element={<DriverProfile />} />
          <Route path="new-requests" element={<NewRequests />} />
          <Route path="pending-profiles" element={<PendingProfiles />} />
          <Route path="categories" element={<Categories />} />
          <Route path="payment-newrequests" element={<PaymentRequests />} />
          <Route path="send-notification" element={<SendNotification />} />
        </Route>
      </Routes>
    </>
  );
}

export default AppWrapper;
