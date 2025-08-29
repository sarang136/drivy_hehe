import React, { useState } from "react";
import { MdDelete } from "react-icons/md";
import { FaEye, FaEdit } from "react-icons/fa";
import { useLocation, useNavigate } from "react-router-dom";
import { useGetUserDetailsQuery } from "../redux/apis/Userapi";

const UserBooking = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Get userId from location.state, handle if not present
  const userId =
    location?.state?.user?._id || location?.state?._id || location?.state;

  // State for tab switching
  const [activeTab, setActiveTab] = useState("details");

  // Fetch user details
  const { data, isLoading, isError, error } = useGetUserDetailsQuery(userId);

  // Extract bookings
  const bookings = data?.bookings || [];

  // Always get user and cars from state if available, fallback to API if not
  // This ensures personal/vehicle details are shown even if bookings are not found
  const userFromState =
    location?.state?.user ||
    (typeof location?.state === "object" ? location?.state : {}) ||
    {};
  const user =
    userFromState && Object.keys(userFromState).length > 0
      ? userFromState
      : data?.user || data?.bookings?.[0]?.userId || {};
  const cars =
    Array.isArray(userFromState?.Car) && userFromState.Car.length > 0
      ? userFromState.Car
      : Array.isArray(user?.Car) && user.Car.length > 0
      ? user.Car
      : [];

  if (isLoading) return <div className="p-4">Loading...</div>;

  // Don't block details tab if bookings not found, only show error in bookings tab
  // So, don't return error here

  return (
    <div className="p-4 font-[Poppins]">
      {/* Tabs */}
      <div className="border-b flex gap-4 mb-4">
        <button
          className={`pb-2 px-2 font-semibold ${
            activeTab === "details"
              ? "border-b-2 border-blue-500 text-blue-600"
              : "text-gray-600"
          }`}
          onClick={() => setActiveTab("details")}
        >
          Personal & Vehicle Details
        </button>
        <button
          className={`pb-2 px-2 font-semibold ${
            activeTab === "bookings"
              ? "border-b-2 border-blue-500 text-blue-600"
              : "text-gray-600"
          }`}
          onClick={() => setActiveTab("bookings")}
        >
          Bookings
        </button>
      </div>

      {/* Details Tab */}
      {activeTab === "details" && (
        <div>
          {/* Personal & Vehicle Details Card */}
          <div className="bg-white shadow-md rounded-lg p-4 mb-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold mb-2">Personal Details</h3>
                <p>
                  Full Name:{" "}
                  {user?.name ? (
                    user.name
                  ) : (
                    <span className="italic text-gray-500">No Data Found</span>
                  )}
                </p>
                <p>
                  Phone Number:{" "}
                  {user?.phone ? (
                    user.phone
                  ) : (
                    <span className="italic text-gray-500">No Data Found</span>
                  )}
                </p>
                <p>
                  Email:{" "}
                  {user?.email ? (
                    user.email
                  ) : (
                    <span className="italic text-gray-500">No Data Found</span>
                  )}
                </p>
              </div>

              <div>
                <h2 className="text-lg font-semibold mb-2">Vehicle Details</h2>
                {Array.isArray(cars) && cars.length > 0 ? (
                  cars.map((car, index) => (
                    <div
                      key={car._id || index}
                      className="border rounded p-3 mb-2 bg-gray-100"
                    >
                      <p>
                        <strong>Model:</strong>{" "}
                        {car.model || (
                          <span className="italic text-gray-500">N/A</span>
                        )}
                      </p>
                      <p>
                        <strong>Number:</strong>{" "}
                        {car.vehicleNumber || (
                          <span className="italic text-gray-500">N/A</span>
                        )}
                      </p>
                      <p>
                        <strong>Manufacturing Year : </strong>{" "}
                        {car.mfgYear || (
                          <span className="italic text-gray-500">N/A</span>
                        )}
                      </p>
                      <p>
                        <strong>Vehicle Type : </strong>{" "}
                        {car.vehicleType || (
                          <span className="italic text-gray-500">N/A</span>
                        )}
                      </p>
                    </div>
                  ))
                ) : (
                  <span className="italic text-gray-500">
                    No vehicle details Found
                  </span>
                )}
              </div>
            </div>

            {/* Note Box */}
            <div className="mt-4">
              <label className="block mb-2 font-semibold">Admin Note</label>
              <textarea
                placeholder="Type here..."
                className="w-full border rounded-lg p-2 mb-2"
              ></textarea>
              <button className="bg-[#CDFF00] px-4 py-2 rounded-md font-semibold">
                Send Note
              </button>
            </div>
          </div>

          {/* Documents Table */}
          <div className="bg-white shadow-md rounded-lg p-4">
            <h3 className="font-semibold mb-4">Documents</h3>
            <table className="w-full text-left">
              <thead>
                <tr className="border-b">
                  <th className="pb-2">Document Name</th>
                  <th className="pb-2">Status</th>
                  <th className="pb-2">Action</th>
                </tr>
              </thead>
              <tbody>
                {Array.isArray(cars) && cars.length > 0 ? (
                  cars.map((car, index) => (
                    <React.Fragment key={car._id || index}>
                      <tr className="border-b last:border-none">
                        <td className="py-2">Vehicle RC</td>
                        <td>
                          <span className="text-blue-500 font-medium">
                            {car.vehicleRc ? "Uploaded" : "Not Uploaded"}
                          </span>
                        </td>
                        <td className="flex items-center gap-3 py-2">
                          {car.vehicleRc && (
                            <FaEye
                              className="text-green-500 cursor-pointer"
                              onClick={() =>
                                window.open(car.vehicleRc, "_blank")
                              }
                            />
                          )}
                        </td>
                      </tr>
                      
                      <tr className="border-b last:border-none">
                        <td className="py-2">Insurance</td>
                        <td>
                          <span className="text-blue-500 font-medium">
                            {car.vehicleInsurance ? "Uploaded" : "Not Uploaded"}
                          </span>
                        </td>
                        <td className="flex items-center gap-3 py-2">
                          {car.vehicleInsurance && (
                            <FaEye
                              className="text-green-500 cursor-pointer"
                              onClick={() =>
                                window.open(car.vehicleInsurance, "_blank")
                              }
                            />
                          )}
                        </td>
                      </tr>
                    </React.Fragment>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3" className="text-center py-4 text-gray-500">
                      <span className="italic text-gray-500">
                        No Documents Found
                      </span>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Bookings Tab */}
      {activeTab === "bookings" && (
        <div className="bg-white shadow-md rounded-lg p-4">
          <h3 className="font-semibold text-lg mb-4">Bookings</h3>
          <table className="w-full text-left">
            <thead>
              <tr className="border-b">
                <th className="pb-2">Driver</th>
                <th className="pb-2">Date & Time</th>
                <th className="pb-2">Email</th>
                <th className="pb-2">Amount</th>
                <th className="pb-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {isError ? (
                <tr>
                  <td
                    colSpan="5"
                    className="text-center py-4 italic text-gray-500"
                  >
                    {error?.data?.message || "Error fetching bookings"}
                  </td>
                </tr>
              ) : bookings.length > 0 ? (
                bookings.map((booking) => (
                  <tr key={booking._id} className="border-b last:border-none">
                    <td
                      className="py-2 cursor-pointer text-blue-600 hover:underline"
                      onClick={() =>
                        booking?.driverId?._id &&
                        navigate("/drivers-profile", {
                          state: { userId: booking?.driverId?._id },
                        })
                      }
                    >
                      {booking.driverId?.name || (
                        <span className="italic text-red-600">
                          No Name Found
                        </span>
                      )}
                    </td>
                    <td className="py-2">
                      {booking.from
                        ? new Date(booking.from).toLocaleString()
                        : ""}
                    </td>
                    <td className="py-2">
                      {booking?.driverId?.email || (
                        <span className="italic text-red-600">
                          No mail found
                        </span>
                      )}
                    </td>
                    <td className="py-2">
                      {booking?.fareBreakdown?.totalFare ? (
                        `${booking.fareBreakdown.totalFare}/-`
                      ) : (
                        <span className="italic text-gray-500">N/A</span>
                      )}
                    </td>
                    <td className="text-green-500 font-medium">
                      {booking?.driverId?.status || "NA"}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center py-4 text-gray-500">
                    <span className="italic text-gray-500">
                      No Data Found
                    </span>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default UserBooking;
