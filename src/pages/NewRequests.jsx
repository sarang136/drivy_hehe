import React from "react";
import { useNavigate } from "react-router-dom";
import { HiArrowLeft } from "react-icons/hi";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import {
  useGetAllDriverQuery,
  useApproveDriverMutation,
  useRejectDriverMutation,
} from "../redux/apis/Driverapi";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css'

const NewRequests = () => {
  const selector = useSelector((state) => state.auth);
  const token = selector.token;

  const navigate = useNavigate();

  const { data, isLoading, isError, refetch } = useGetAllDriverQuery();

  const [approveDriver] = useApproveDriverMutation();
  const [rejectDriver] = useRejectDriverMutation();

  const handleApprove = async (id) => {
    try {
      const response = await approveDriver({ id, status: "Approved" }).unwrap();
      refetch();
      toast.success("Driver approved successfully")
    } catch (error) {
      console.error(" Approval failed:", error?.data || error);
      toast.error("Failed to approve driver")
    }
  };

  const handleReject = async (id) => {
  try {
    
    await rejectDriver({ id, status: "Rejected" }).unwrap();
    refetch(); // refresh the list
    toast.error("Driver request rejected successfully!");
  } catch (error) {
    console.error("Reject failed:", error?.data || error);
    toast.error("Failed to reject driver request.");
  }
};



  // Get the driver list and reverse it so that newly added requests come first
  const driverList = Array.isArray(data?.data)
    ? [...data.data].reverse()
    : Array.isArray(data)
    ? [...data].reverse()
    : [];

  const pendingDrivers = driverList.filter(
    (driver) => driver.status?.toLowerCase() === "pending"
  );

  console.log("pendingDrivers", pendingDrivers);

  if (isLoading) return <p className="text-center py-10">Loading...</p>;
  if (isError)
    return (
      <p className="text-center py-10 text-red-500">Error loading drivers.</p>
    );

  return (
    <div className="p-4">
      <div className="flex gap-2 items-center mb-4">
        <button onClick={() => navigate("/drivers")}>
          <HiArrowLeft size={32} />
        </button>
        <p className="font-semibold text-2xl">Pending Approval</p>
      </div>

      {pendingDrivers.length === 0 ? (
        <p className="text-center text-gray-500">
          No pending driver requests found.
        </p>
      ) : (
        <table
          className="table-auto border-separate w-full mt-4"
          style={{ borderSpacing: "0 10px" }}
        >
          <thead className="bg-white text-left shadow-md rounded-lg">
            <tr>
              <th className="px-4 py-4 rounded-l-lg">Name</th>
              <th className="px-4 py-2">Email</th>
              <th className="px-4 py-2">Phone</th>
              <th className="px-4 py-2">Number Of Trips</th>
              <th className="px-4 py-2">Submission Date</th>
              <th className="px-4 py-2">Status</th>
              <th className="px-4 py-2 rounded-r-lg">Actions</th>
            </tr>
          </thead>
          <tbody>
            {pendingDrivers.map((user) => (
              <tr key={user._id} className="bg-white shadow-md rounded">
                <td
                  className="px-4 py-4 cursor-pointer rounded-l-lg"
                  onClick={() =>
                    navigate("/drivers-profile", {
                      state: { userId: user._id },
                    })
                  }
                >
                  {user.name || "N/A"}
                </td>
                <td className="px-4 py-2">{user.email || "N/A"}</td>
                <td className="px-4 py-2">{user.phone || "N/A"}</td>
                <td className="px-4 py-2">{user.noOfTrips || "N/A"}</td>
                <td className="px-4 py-2">
                  {user.joiningDate
                    ? new Date(user.joiningDate).toLocaleDateString("en-IN", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })
                    : "N/A"}
                </td>
                <td className="px-4 py-2">
                  <span className="py-1 px-3 rounded-full text-sm font-semibold bg-yellow-200 text-yellow-800">
                    {user.status}
                  </span>
                </td>
                <td className="px-4 py-5 rounded-r-lg flex items-center gap-4 text-xl">
                  <button
                    title="Approve"
                    onClick={() => handleApprove(user._id)}
                  >
                    <FaCheckCircle className="text-green-600 hover:text-green-700" />
                  </button>
                  <button title="Reject" onClick={() => handleReject(user._id)}>
                    <FaTimesCircle className="text-red-500 hover:text-red-600 " />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default NewRequests;
