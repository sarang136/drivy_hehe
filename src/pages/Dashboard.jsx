
import React, { useState, useMemo } from "react";
import dayjs from "dayjs";
import {
  MdCalendarToday,
  MdAttachMoney,
  MdGroups,
  MdDriveEta,
} from "react-icons/md";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useNavigate } from "react-router-dom";
import "leaflet/dist/leaflet.css";
import {
  useGetTotalRevenueQuery,
  useGetCompletedBookingQuery,
  useGetTotalUsersQuery,
  useGetAllAcceptedBookingQuery,
} from "../redux/apis/Dashboardapi";
import { useGetAllDriverQuery } from "../redux/apis/Driverapi";
import { useGetAllBookingsQuery } from "../redux/apis/Bookingapi";

// Week comparison for stats
const today = new Date();
const startOfThisWeek = new Date(today.setDate(today.getDate() - today.getDay() + 1));
const startOfLastWeek = new Date(new Date(startOfThisWeek).setDate(startOfThisWeek.getDate() - 7));
const endOfLastWeek = new Date(new Date(startOfThisWeek).setDate(startOfThisWeek.getDate() - 1));
const formatDate = (date) => date.toISOString().split("T")[0];

// ...[imports remain unchanged]

const Dashboard = () => {
  const navigate = useNavigate();

  // Weekly stats
  const { data: thisWeekRevenue } = useGetTotalRevenueQuery({ startDate: formatDate(startOfThisWeek) });
  const { data: thisWeekBookings } = useGetCompletedBookingQuery({ startDate: formatDate(startOfThisWeek) });
  const { data: getAllBookings } = useGetAllBookingsQuery();
  console.log(getAllBookings);
  const { data: thisWeekUsers } = useGetTotalUsersQuery({ startDate: formatDate(startOfThisWeek) });
  const { data: thisWeekDrivers } = useGetAllDriverQuery({ startDate: formatDate(startOfThisWeek) });

  const { data: lastWeekRevenue } = useGetTotalRevenueQuery({
    startDate: formatDate(startOfLastWeek),
    endDate: formatDate(endOfLastWeek),
  });
  const { data: lastWeekBookings } = useGetCompletedBookingQuery({
    startDate: formatDate(startOfLastWeek),
    endDate: formatDate(endOfLastWeek),
  });
  const { data: lastWeekUsers } = useGetTotalUsersQuery({
    startDate: formatDate(startOfLastWeek),
    endDate: formatDate(endOfLastWeek),
  });
  const { data: lastWeekDrivers } = useGetAllDriverQuery({
    startDate: formatDate(startOfLastWeek),
    endDate: formatDate(endOfLastWeek),
  });

  const { data: allDrivers, isLoading: driversLoading } = useGetAllDriverQuery();
  const { data: acceptedBookings, isLoading: acceptedLoading, isError: acceptedError } = useGetAllAcceptedBookingQuery();

  const sixMonthsAgo = dayjs().subtract(5, "month").startOf("month").format("YYYY-MM-DD");
  const todayDate = dayjs().endOf("month").format("YYYY-MM-DD");

  const { data: completedBookings } = useGetCompletedBookingQuery({
    startDate: sixMonthsAgo,
    endDate: todayDate,
  });

  console.log(getAllBookings);

  const chartData = useMemo(() => {
  const bookings = getAllBookings || []; // get the full array of bookings

  const monthlyRevenueMap = {};

  // Initialize past 6 months with 0 revenue
  for (let i = 5; i >= 0; i--) {
    const date = new Date();
    date.setMonth(date.getMonth() - i);
    const key = date.toISOString().slice(0, 7); // "YYYY-MM"
    monthlyRevenueMap[key] = 0;
  }

  bookings.forEach((booking) => {
    const bookingDate = new Date(booking?.createdAt);
    const key = bookingDate.toISOString().slice(0, 7); // "YYYY-MM"

    if (monthlyRevenueMap[key] !== undefined) {
      const fare = booking?.fareBreakdown?.totalFare || 0;
      monthlyRevenueMap[key] += fare;
    }
  });

  return Object.entries(monthlyRevenueMap).map(([month, value]) => ({
    month: new Date(month).toLocaleString("default", {
      month: "short",
      year: "numeric",
    }), // "Aug 2025"
    value,
  }));
}, [getAllBookings]);


  const calculateChange = (current, previous) => {
    if (previous === 0) return "+0%";
    const change = ((current - previous) / previous) * 100;
    const rounded = Math.round(change);
    return `${rounded >= 0 ? "+" : ""}${rounded}%`;
  };


  const totalFares = getAllBookings?.reduce((sum, booking) => {
  return sum + (booking?.fareBreakdown?.totalFare || 0);
}, 0);

  const statsData = [
    {
      tag: "Total Booking",
      numbers: getAllBookings?.length ?? 0,
      grownUp: `${calculateChange(thisWeekBookings?.count ?? 0, lastWeekBookings?.count ?? 0)} since last week`,
      icon: <MdCalendarToday size={25} />,
      color: thisWeekBookings?.count >= lastWeekBookings?.count ? "text-green-500" : "text-red-500",
      bg: "bg-[#CDFF00]",
    },
    {
      tag: "Total Revenue",
      numbers: totalFares ? `₹ ${totalFares.toLocaleString()}/-` : "₹0/-",
      grownUp: `${calculateChange(thisWeekRevenue?.totalRevenue ?? 0, lastWeekRevenue?.totalRevenue ?? 0)} since last week`,
      icon: <MdAttachMoney size={25} />,
      color: thisWeekRevenue?.totalRevenue >= lastWeekRevenue?.totalRevenue ? "text-green-500" : "text-red-500",
      bg: "bg-[#CDFF00]",
    },
    {
      tag: "Total User",
      numbers: thisWeekUsers?.count ?? 0,
      grownUp: `${calculateChange(thisWeekUsers?.count ?? 0, lastWeekUsers?.count ?? 0)} since last week`,
      icon: <MdGroups size={25} />,
      color: thisWeekUsers?.count >= lastWeekUsers?.count ? "text-green-500" : "text-red-500",
      bg: "bg-[#CDFF00]",
    },
    {
      tag: "Total Drivers",
      numbers: thisWeekDrivers?.count ?? 0,
      grownUp: `${calculateChange(thisWeekDrivers?.count ?? 0, lastWeekDrivers?.count ?? 0)} since last week`,
      icon: <MdDriveEta size={25} />,
      color: thisWeekDrivers?.count >= lastWeekDrivers?.count ? "text-green-500" : "text-red-500",
      bg: "bg-[#CDFF00]",
    },
  ];

  // console.log("Completed Bookings:", completedBookings?.data);
  const today = new Date();
  const todayDateString = today.toISOString().split('T')[0];

  const acceptedBooks = acceptedBookings?.data?.filter((books) => {
    const bookingDate = new Date(books?.createdAt);
    const bookingDateString = bookingDate.toISOString().split('T')[0];
    return books?.status === "accepted" && bookingDateString === todayDateString;
  });

  // console.log("Accepted Books:", acceptedBooks);
  // console.log(acceptedBookings)

  return (
    <div className="space-y-6 px-4 lg:px-0 pt-4 md:pl-[45vw] lg:pl-0">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {statsData.map((item, idx) => (
          <div
            key={idx}
            className="bg-white rounded-xl shadow p-5 flex items-center justify-between hover:shadow-md transition"
          >
            <div className="flex flex-col gap-1">
              <p className="text-sm text-gray-500">{item.tag}</p>
              <p className="text-2xl font-semibold">{item.numbers}</p>
              <p className={`text-sm font-medium ${item.color}`}>{item.grownUp}</p>
            </div>
            <div className={`p-3 rounded-full ${item.bg} text-black`}>{item.icon}</div>
          </div>
        ))}
      </div>

      {/* Map and Chart */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white p-5 rounded-xl shadow h-[300px]">
          <p className="text-lg font-semibold mb-4">Live Driver Locations</p>
          <MapContainer center={[19.8762, 75.3433]} zoom={12} className="h-[85%] w-full rounded-lg z-0">
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            {!driversLoading &&
              allDrivers?.data?.map(
                (driver) =>
                  driver.location?.latitude &&
                  driver.location?.longitude && (
                    <Marker
                      key={driver._id}
                      position={[driver.location.latitude, driver.location.longitude]}
                    >
                      <Popup>
                        <strong>{driver.name}</strong>
                        <br />
                        {driver.email}
                      </Popup>
                    </Marker>
                  )
              )}
          </MapContainer>
        </div>

        {/* Revenue Chart */}
        <div className="bg-white p-5 rounded-xl shadow h-[300px]">
          <div className="flex justify-between items-center mb-4">
            <p className="text-lg font-semibold">Monthly Revenue Trend</p>
          </div>
          <ResponsiveContainer width="100%" height="90%">
            <LineChart data={chartData}>
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="value" stroke="#10b981" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Accepted Bookings Table */}
      <div>
        <div className="flex justify-between items-center">
          <p className="font-medium text-xl">Recent Accepted Bookings</p>
          <p
            className="cursor-pointer text-sm text-blue-600 hover:text-blue-800"
            onClick={() => navigate("/bookings")}
          >
            View All
          </p>
        </div>

        <div className="mt-4 overflow-x-auto max-w-full">
          <table
            className="min-w-[700px] table-auto border-separate w-full"
            style={{ borderSpacing: "0 10px" }}
          >
            <thead className="bg-white text-left shadow-md rounded-lg">
              <tr>
                <th className="px-4 py-3 rounded-l-lg">Name</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Role</th>
                <th className="px-4 py-3">Booking Date</th>
                <th className="px-4 py-3">Amount</th>
                <th className="px-4 py-3">Status</th>
                {/* <th className="px-4 py-3">Driver Joined</th> */}
              </tr>
            </thead>
            <tbody>
              {acceptedLoading && (
                <tr>
                  <td colSpan="7" className="text-center py-4">Loading...</td>
                </tr>
              )}
              {acceptedError && (
                <tr>
                  <td colSpan="7" className="text-center py-4 text-red-500">Failed to load accepted bookings</td>
                </tr>
              )}
              {getAllBookings?.map((booking) => (
                <tr key={booking._id} className="bg-white shadow-md rounded">
                  <td className="px-4 py-4 rounded-l-lg">{booking?.userId?.name || "N/A"}</td>
                  <td className="px-4 py-2">{booking.userId?.email || "N/A"}</td>
                  <td className="px-4 py-2">User</td>
                  <td className="px-4 py-2">{booking.createdAt?.split("T")[0] || "N/A"}</td>
                  <td className="px-4 py-2 capitalize">{booking?.fareBreakdown?.totalFare || "N/A"}/-</td>
                  <td className="px-4 py-2 capitalize">{booking.status || "N/A"}</td>
                  {/* <td className="px-4 py-2">
                    {booking.driverId?.joiningDate?.split("T")[0] || "N/A"}
                  </td> */}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;







