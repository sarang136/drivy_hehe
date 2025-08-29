import React from "react";
import { useGetAllBookingsQuery } from "../redux/apis/Bookingapi";
import { useNavigate } from "react-router-dom";

const BookingManagement = () => {
  const navigate = useNavigate();
  const { data: bookings, isLoading, isError } = useGetAllBookingsQuery();

  if (isLoading) return <p className="p-4">Loading...</p>;
  if (isError) return <p className="p-4 text-red-600">Error fetching bookings...</p>;

  // Reverse the bookings array so that newly added bookings come first
  const bookingsReversed = bookings ? [...bookings].reverse() : [];

  // Date format helper
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  console.log("bookings", bookingsReversed);

  return (
    <div className="p-4">
      <div className="overflow-x-auto">
        <table
          className="table-auto w-full border-separate"
          style={{ borderSpacing: "0 10px" }}
        >
          {/* Table Header */}
          <thead className="bg-white text-left shadow-md rounded-lg hidden lg:table-header-group">
            <tr>
              <th className="px-4 py-4 rounded-l-lg">User</th>
              <th className="px-4 py-2">Driver</th>
              <th className="px-4 py-2">From</th>
              <th className="px-4 py-2">To</th>
              <th className="px-4 py-2">Date and Time</th>
              <th className="px-4 py-2">Amount</th>
              <th className="px-4 py-2 rounded-r-lg">Status</th>
            </tr>
          </thead>

          {/* Table Body */}
          <tbody>
            {bookingsReversed?.map((item) => (
              <tr
                key={item._id}
                className="bg-white shadow-md rounded-lg lg:table-row block mb-4"
              >
                {/* User */}
                <td
                  className="px-4 py-2 block lg:table-cell rounded-t-lg lg:rounded-none lg:rounded-l-lg font-semibold cursor-pointer"
                  onClick={() =>
                    item?.userId &&
                    navigate("/booking-details", {state: {item}})
                  }
                >
                  <span className="lg:hidden font-medium">User: </span>
                  {item?.userId
                    ? item?.userId?.name || "Unknown User"
                    : "N/A"}
                </td>

                {/* Driver */}
                <td className="px-4 py-2 block lg:table-cell">
                  <span className="lg:hidden font-medium">Driver: </span>
                  {item?.driverId
                    ? item?.driverId?.name || "Unknown Driver"
                    : "N/A"}
                </td>

                {/* From Location */}
                <td className="px-4 py-2 block lg:table-cell">
                  <span className="lg:hidden font-medium">From: </span>
                  {item?.fromAddress || "NA"}
                </td>

                {/* To Location */}
                <td className="px-4 py-2 block lg:table-cell">
                  <span className="lg:hidden font-medium">To: </span>
                  {item?.toAddress}
                </td>

                {/* Date & Time */}
                <td className="px-4 py-2 block lg:table-cell">
                  <span className="lg:hidden font-medium">Date and Time: </span>
                  {formatDate(item?.from)} - {formatDate(item?.to)}
                </td>

                {/* Amount */}
                <td className="px-4 py-2 block lg:table-cell">
                  <span className="lg:hidden font-medium">Amount: </span>
                  ₹{item?.userId
                    ? item?.fareBreakdown?.totalFare || "0"
                    : "N/A"}
                </td>

                {/* Status */}
                <td className="px-4 py-2 block lg:table-cell rounded-b-lg lg:rounded-none lg:rounded-r-lg">
                  <span className="lg:hidden font-medium">Status: </span>
                  <p
                    className={`rounded-full text-center px-2 py-1 inline-block mt-1 lg:mt-0
                    ${
                      item.status === "cancelled"
                        ? "bg-[#FF9D9D5C] text-[#F75252]"
                        : item.status === "pending"
                        ? "bg-[#F0FF9082] text-[#A3A000CC]"
                        : item.status === "ongoing"
                        ? "bg-[#C6FFD1] text-[#008000CC]"
                        : item.status === "accepted"
                        ? "bg-[#C6FFD1] text-[#008000CC]"
                        : "bg-gray-200 text-gray-800"
                    }`}
                  >
                    {item.statusOfBooking || "N/A"}
                  </p>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Empty State */}
        {bookingsReversed?.length === 0 && (
          <p className="text-center mt-6 text-gray-500">No bookings found.</p>
        )}
      </div>
    </div>
  );
};

export default BookingManagement;
