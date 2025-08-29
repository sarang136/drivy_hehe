import { useState } from "react";
import { FiLogOut } from "react-icons/fi";
import { FaUserCircle } from "react-icons/fa";
import { useLocation, useNavigate } from "react-router-dom";
import { useLogOutMutation } from "../redux/apis/Logoutapi";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../redux/slice"; // Optional: clear Redux

const Header = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  // const selector = useSelector((state) => state.auth);
  // console.log("selector", selector.token);
   
  // const token = selector.token;
  // console.log(token)


  const [logOut] = useLogOutMutation();

  const handleLogout = async () => {
    try {
      await logOut().unwrap(); 
      localStorage.removeItem("auth_token"); 
      dispatch(logout()); 
      navigate("/admin-login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const titles = {
    "/": "Dashboard",
    "/users": "User Management",
    "/drivers": "Driver Management",
    "/bookings": "Booking",
    "/transactions": "Transaction",
    "/user-booking": "User Booking",
    "/drivers-profile": "Driver Profile",
    "/new-requests": "New Request",
    "/pending-profiles": "Pending Profile",
    "/categories": "Categories",
    "Send Notification" : "Send Notification",
  };

  const pageTitle = titles[location.pathname] || "Dashboard";

  return (
    <>
      <header className="bg-white border-b flex items-center justify-between px-6 py-4 shadow z-40 relative">
        <h1 className="text-xl font-semibold text-gray-800 lg:ml-0 ml-10 mt-2">
          {pageTitle}
        </h1>
        <div
          className="cursor-pointer text-3xl text-gray-700"
          onClick={() => setIsSidebarOpen(true)}
        >
          <FaUserCircle />
        </div>
      </header>

      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-30 z-40"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <div
        className={`fixed top-0 right-0 h-full w-72 bg-white shadow-lg p-6 z-50 transform transition-transform duration-300 ${
          isSidebarOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold">Admin Info</h2>
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="text-xl font-bold"
          >
            &times;
          </button>
        </div>

        <div className="flex flex-col items-center text-center space-y-4">
          <FaUserCircle className="text-6xl text-gray-500" />
          <p className="text-lg font-semibold">Admin User</p>
          {/* <p className="text-sm text-gray-600">admin@example.com</p> */}
          <p className="text-sm text-gray-500 italic">Super Admin</p>
        </div>

        <div className="mt-10">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center px-4 py-2 text-red-600 border border-red-600 rounded hover:bg-red-50"
          >
            <FiLogOut className="mr-2" />
            Log Out
          </button>
        </div>
      </div>
    </>
  );
};

export default Header;
