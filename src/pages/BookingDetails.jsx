import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useGetUserDetailsQuery } from '../redux/apis/Userapi';

const BookingDetails = () => {
  const location = useLocation();
  const item = location?.state?.item;

  if (!item) {
    return <div className="p-4 text-red-600">No booking details found.</div>;
  }

  const { data, isLoading, isError } = useGetUserDetailsQuery(item?.userId?._id);

  const [activeTab, setActiveTab] = useState('userDetails');
  const [modalImage, setModalImage] = useState(null);

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const user = item.userId || {};
  const car = Array.isArray(user.Car) && user.Car.length > 0 ? user.Car[0] : {};
  const category = item.categoryInfo || item.category || {};
  const bookings = data?.bookings || [];
  const vehicleRc = car.vehicleRc;
  const vehicleInsurance = car.vehicleInsurance;
  const vehicleImage = car.vehicleImage;

  return (
    <div className="max-w-5xl mx-auto p-4 font-[Poppins]">
      {/* Tabs */}
      <div className="flex border-b border-gray-200 mb-4">
        <button
          className={`px-4 py-2 text-sm font-semibold focus:outline-none ${
            activeTab === "userDetails"
              ? "border-b-2 border-blue-600 text-blue-700 bg-white"
              : "text-gray-600"
          }`}
          onClick={() => setActiveTab("userDetails")}
        >
          Personal & Vehicle Details
        </button>
        <button
          className={`px-4 py-2 text-sm font-semibold focus:outline-none ${
            activeTab === "bookings"
              ? "border-b-2 border-blue-600 text-blue-700 bg-white"
              : "text-gray-600"
          }`}
          onClick={() => setActiveTab("bookings")}
        >
          Bookings
        </button>
      </div>

      {/* User Details Tab */}
      {activeTab === "userDetails" && (
        <div className="space-y-6">
          {/* Personal & Vehicle Details Card */}
          <div className="bg-white rounded shadow p-4 flex flex-col md:flex-row gap-6">
            {/* Personal Details */}
            <div className="flex-1">
              <div className="font-semibold text-gray-700 mb-2">Personal Details</div>
              <div className="text-sm text-gray-800">
                <div>
                  <span className="font-medium">Full Name:</span> {user.name || "N/A"}
                </div>
                <div>
                  <span className="font-medium">Phone Number:</span> {user.phone || "N/A"}
                </div>
                <div>
                  <span className="font-medium">Email:</span> {user.email || "N/A"}
                </div>
              </div>
            </div>
            {/* Vehicle Details */}
            <div className="flex-1">
              <div className="font-semibold text-gray-700 mb-2">Vehicle Details</div>
              <div className="bg-gray-100 rounded p-3 text-sm text-gray-800">
                <div>
                  <span className="font-medium">Model:</span> {car.model || "N/A"}
                </div>
                <div>
                  <span className="font-medium">Number:</span> {car.vehicleNumber || "N/A"}
                </div>
                <div>
                  <span className="font-medium">Manufacturing Year:</span> {car.mfgYear || "N/A"}
                </div>
                <div>
                  <span className="font-medium">Vehicle Type:</span> {car.vehicleType || "N/A"}
                </div>
              </div>
            </div>
          </div>

          {/* Documents Section */}
          <div className="bg-white rounded shadow p-4">
            <div className="font-semibold text-gray-700 mb-2">Documents</div>
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="bg-gray-100 text-gray-700">
                    <th className="py-2 px-4 text-left">Document Name</th>
                    <th className="py-2 px-4 text-left">Status</th>
                    <th className="py-2 px-4 text-left">Action</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td className="py-2 px-4">Vehicle RC</td>
                    <td className="py-2 px-4">
                      {vehicleRc ? (
                        <span className="text-blue-600 underline cursor-pointer">Uploaded</span>
                      ) : (
                        <span className="text-gray-500 italic">Not Uploaded</span>
                      )}
                    </td>
                    <td className="py-2 px-4">
                      {vehicleRc && (
                        <a
                          href={vehicleRc}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-green-600 hover:underline"
                          title="View RC"
                        >
                          <span role="img" aria-label="view">&#128065;</span>
                        </a>
                      )}
                    </td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2 px-4">Insurance</td>
                    <td className="py-2 px-4">
                      {vehicleInsurance ? (
                        <span className="text-blue-600 underline cursor-pointer">Uploaded</span>
                      ) : (
                        <span className="text-gray-500 italic">Not Uploaded</span>
                      )}
                    </td>
                    <td className="py-2 px-4">
                      {vehicleInsurance && (
                        <a
                          href={vehicleInsurance}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-green-600 hover:underline"
                          title="View Insurance"
                        >
                          <span role="img" aria-label="view">&#128065;</span>
                        </a>
                      )}
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2 px-4">Vehicle Image</td>
                    <td className="py-2 px-4">
                      {vehicleImage ? (
                        <span className="text-blue-600 underline cursor-pointer">Uploaded</span>
                      ) : (
                        <span className="text-gray-500 italic">Not Uploaded</span>
                      )}
                    </td>
                    <td className="py-2 px-4">
                      {vehicleImage && (
                        <button
                          className="text-green-600 hover:underline"
                          title="View Vehicle"
                          onClick={() => setModalImage(vehicleImage)}
                        >
                          <span role="img" aria-label="view">&#128065;</span>
                        </button>
                      )}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Booking Information Section */}
          <div className="bg-white rounded shadow p-4">
            <div className="font-semibold text-gray-700 mb-2">Booking Information</div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2 text-sm text-gray-800">
              <div>
                <span className="font-medium">Category:</span> {category.name || "N/A"}
              </div>
              <div>
                <span className="font-medium">From:</span> {item.fromAddress || "N/A"}
              </div>
              <div>
                <span className="font-medium">To:</span> {item.toAddress || "N/A"}
              </div>
              <div>
                <span className="font-medium">Start Date & Time:</span> {formatDate(item.from)}
              </div>
              <div>
                <span className="font-medium">End Date & Time:</span> {formatDate(item.to)}
              </div>
              <div>
                <span className="font-medium">Amount:</span> ₹{item.fareBreakdown?.totalFare || "0"}
              </div>
              <div>
                <span className="font-medium">Status:</span> {item.statusOfBooking || item.status || "N/A"}
              </div>
              <div>
                <span className="font-medium">Created At:</span> {formatDate(item.createdAt)}
              </div>
              <div>
                <span className="font-medium">Updated At:</span> {formatDate(item.updatedAt)}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Bookings Tab */}
      {activeTab === "bookings" && (
        <div className="bg-white rounded shadow p-4">
          <div className="font-semibold text-gray-700 mb-4">All Bookings for User</div>
          {isLoading ? (
            <div>Loading bookings...</div>
          ) : isError ? (
            <div className="text-red-600">Error loading bookings.</div>
          ) : bookings.length === 0 ? (
            <div className="italic text-gray-500">No bookings found for this user.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="bg-gray-100 text-gray-700">
                    <th className="py-2 px-4 text-left">Driver Name</th>
                    <th className="py-2 px-4 text-left">Number</th>
                    <th className="py-2 px-4 text-left">Experience</th>
                    <th className="py-2 px-4 text-left">Amount</th>
                    <th className="py-2 px-4 text-left">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map((b) => (
                    <tr key={b._id} className="border-b">
                      <td className="py-2 px-4">{b.driverId?.name || "NA"}</td>
                      <td className="py-2 px-4">{b?.driverId?.phone || "N/A"}</td>
                      <td className="py-2 px-4">{b?.driverId?.yearofexperience || "N/A"}</td>
                      <td className="py-2 px-4">₹{b?.driverId?.points || "0"}</td>
                      <td className="py-2 px-4">{b?.driverId?.status || b.status || "N/A"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Modal for vehicle image zoom */}
      {modalImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70"
          onClick={() => setModalImage(null)}
        >
          <div
            className="bg-white rounded-lg shadow-lg p-4 relative max-w-full max-h-full flex flex-col items-center"
            onClick={e => e.stopPropagation()}
          >
            <button
              className="absolute top-2 right-2 text-gray-700 text-2xl font-bold"
              onClick={() => setModalImage(null)}
              aria-label="Close"
            >
              &times;
            </button>
            <img
              src={modalImage}
              alt="Zoomed Vehicle"
              className="max-h-[80vh] max-w-[90vw] object-contain rounded"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingDetails;