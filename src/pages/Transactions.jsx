import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGetAllBookingsQuery } from '../redux/apis/Bookingapi';

const ANIMATION_CLASSES =
  "transition-all duration-500 ease-in-out transform";

const highlightColor = "#CDFF00";
const Transactions = () => {
  const navigate = useNavigate();
  const { data, isLoading, isError } = useGetAllBookingsQuery();

  // Search and filter state
  const [search, setSearch] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  // Helper for date formatting
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

  // Filtered bookings, reversed so newest first
  const acceptedBookings = useMemo(() => {
    if (!data) return [];
    return [...data]
      .reverse()
      .filter((booking) => booking.statusOfBooking === "Confirm")
      .filter((booking) => {
        // Search by name or email (case-insensitive)
        const name = booking.userId?.name || '';
        const email = booking.userId?.email || '';
        const searchLower = search.trim().toLowerCase();
        if (searchLower) {
          if (
            !name.toLowerCase().includes(searchLower) &&
            !email.toLowerCase().includes(searchLower)
          ) {
            return false;
          }
        }
        // Filter by date range
        if (dateFrom) {
          const bookingDate = new Date(booking.createdAt);
          const fromDate = new Date(dateFrom);
          if (bookingDate < fromDate) return false;
        }
        if (dateTo) {
          // Add 1 day to include the end date fully
          const bookingDate = new Date(booking.createdAt);
          const toDate = new Date(dateTo);
          toDate.setHours(23, 59, 59, 999);
          if (bookingDate > toDate) return false;
        }
        return true;
      });
  }, [data, search, dateFrom, dateTo]);

  return (
    <div className="p-4 min-h-[80vh] bg-white overflow-hidden">
      <div className="flex justify-end mb-6">
        <button
          className="px-4 py-2 rounded-lg font-semibold shadow"
          style={{
            background: highlightColor,
            color: "#222",
            transition: "background 0.2s",
          }}
          onClick={() => navigate('/payment-newrequests')}
        >
          New Requests
        </button>
      </div>

      {/* Search and Filter Bar */}
      <div className="flex flex-col md:flex-row md:items-end gap-4 mb-6">
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-1">Search by Name or Email</label>
          <input
            type="text"
            placeholder="Search by name or email..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-lime-300"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">From Date</label>
          <input
            type="date"
            value={dateFrom}
            onChange={e => setDateFrom(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-lime-300"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">To Date</label>
          <input
            type="date"
            value={dateTo}
            onChange={e => setDateTo(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-lime-300"
          />
        </div>
        {(search || dateFrom || dateTo) && (
          <button
            className="mt-6 md:mt-0 px-4 py-2 rounded-lg font-semibold shadow bg-gray-200 hover:bg-gray-300 transition"
            onClick={() => {
              setSearch('');
              setDateFrom('');
              setDateTo('');
            }}
          >
            Clear
          </button>
        )}
      </div>

      {/* Accepted Transactions Table */}
      <div className="relative h-screen">
        <div
          className={`${ANIMATION_CLASSES} absolute w-full opacity-100 scale-100 pointer-events-auto`}
        >
          <h2 className="text-2xl font-bold mb-4 text-left" style={{ color: highlightColor }}>
            Accepted Transactions
          </h2>
          {isLoading ? (
            <p className="text-center py-10">Loading...</p>
          ) : isError ? (
            <p className="text-center py-10 text-red-500">Error loading transactions.</p>
          ) : acceptedBookings?.length === 0 ? (
            <p className="text-left text-gray-500">No accepted transactions found.</p>
          ) : (
            <div className="overflow-x-auto">
              <div
                className="h-full"
                style={{ minHeight: "200px" }}
              >
                <table className="min-w-full bg-white rounded-lg shadow border-separate" style={{ borderSpacing: "0 10px" }}>
                  <thead>
                    <tr style={{ background: highlightColor }}>
                      <th className="px-4 py-3 rounded-l-lg text-left">User Name</th>
                      <th className="px-4 py-3 text-left">Email</th>
                      <th className="px-4 py-3 text-left">Phone</th>
                      <th className="px-4 py-3 text-left">Amount</th>
                      <th className="px-4 py-3 text-left">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {acceptedBookings?.map((booking) => (
                      <tr
                        key={booking._id}
                        className="bg-white shadow-md rounded-lg hover:scale-[1.01] hover:shadow-lg transition-all duration-300"
                      >
                        <td className="px-4 py-3 rounded-l-lg font-semibold">
                          {booking.userId?.name || "N/A"}
                        </td>
                        <td className="px-4 py-3">{booking.userId?.email || "N/A"}</td>
                        <td className="px-4 py-3">{booking.userId?.phone || "N/A"}</td>
                        <td className="px-4 py-3 font-bold text-green-700">
                          ₹{booking.fareBreakdown?.totalFare || "0"}
                        </td>
                        <td className="px-4 py-3">{formatDate(booking.createdAt)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Transactions;