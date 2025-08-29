import React, { useEffect, useState } from 'react';
import { MdDelete } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import {
  useGetAllDriverQuery,
  useDeleteDriverMutation,
} from '../redux/apis/Driverapi';
import Loader from '../components/Loader';
import { toast } from 'react-toastify';

const DriverManagement = () => {
  const [active, setActive] = useState(false);
  const navigate = useNavigate();
  const { data, isLoading, isError, refetch } = useGetAllDriverQuery(
    );
  console.log(data)
  const [deleteDriver] = useDeleteDriverMutation();


  const handleClick = () => {
    setActive(!active);
    navigate("/new-requests");
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this driver?")) return;
    try {
      await deleteDriver(id).unwrap();
      toast.success("Driver deleted successfully!");
    } catch (error) {
      console.error("Delete error:", error);
      toast.error(error?.data?.message || "Failed to delete driver.");
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  if (isLoading) return <div><Loader/></div>;
  if (isError) return <p className="p-4 text-red-600">Error fetching drivers...</p>;


  const newRequestCount = data?.data?.filter(
    (driver) => driver.status?.toLowerCase() === "pending"
  ).length || 0;

  function capitalizeFirstLetter(str) {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  // Reverse the drivers array so newly added drivers come first
  const drivers = data?.data ? [...data.data].filter(driver => driver.status?.toLowerCase() === "approved").reverse() : [];

  return (
    <div className="p-4 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Drivers Management</h2>
        <button
          onClick={handleClick}
          className="bg-white shadow relative px-4 py-2 rounded-md text-sm font-medium"
        >
          New Request
          {newRequestCount > 0 && (
            <span className="absolute top-0 -right-2 bg-red-500 text-white text-xs rounded-full px-2 py-[1px]">
              {newRequestCount}
            </span>
          )}
        </button>
      </div>

      <div className="overflow-x-auto">
        <table
          className="min-w-full text-sm border-separate"
          style={{ borderSpacing: '0 12px' }}
        >
          <thead className="text-left bg-white rounded-lg shadow hidden lg:table-header-group">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Address</th>
              {/* licenseNumber */}
              <th className="px-4 py-3">License Number</th>

              <th className="px-4 py-3">Phone</th>
              <th className="px-4 py-3">Joining Date</th>
              <th className="px-4 py-3">Trips</th>
              <th className="px-4 py-3">Earnings</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {drivers.map((driver) => (
              <tr
                key={driver._id}
                className="bg-white shadow rounded-lg lg:table-row block mb-4"
              >
                <td
                  className="px-4 py-3 font-medium text-blue-600 cursor-pointer"
                  onClick={() =>
                    navigate("/drivers-profile", { state: { userId: driver._id } })
                  }
                >
                  {capitalizeFirstLetter(driver.name) || "N/A"}
                </td>
                <td className="px-4 py-3">{driver.email || "N/A"}</td>
                <td className="px-4 py-3">{driver.address || "N/A"}</td>
                <td className="px-4 py-3">{driver.licenseNumber || "N/A"}</td>
                <td className="px-4 py-3">{driver.phone || "N/A"}</td>

                <td className="px-4 py-3">
                  {driver.joiningDate ? formatDate(driver.joiningDate) : "N/A"}
                </td>

                <td className="px-4 py-3">{driver.noOfTrips || 0}</td>
                <td className="px-4 py-3 text-green-600 font-semibold">
                  ₹{driver.points || "0"}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`px-3 py-1 text-xs font-semibold rounded-full inline-block ${
                      driver.status?.toLowerCase() === "online"
                        ? "bg-[#B7F8CB] text-green-700"
                        : driver.status?.toLowerCase() === "offline"
                        ? "bg-[#E0E0E0] text-gray-600"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {driver.status
                      ? driver.status.charAt(0).toUpperCase() +
                        driver.status.slice(1).toLowerCase()
                      : "Unknown"}
                  </span>
                </td>
                <td className="px-4 py-3 text-red-500 text-xl hover:text-red-600">
                  <MdDelete
                    className="cursor-pointer"
                    onClick={() => handleDelete(driver._id)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DriverManagement;
