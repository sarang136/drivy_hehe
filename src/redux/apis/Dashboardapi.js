// src/redux/apis/dashboardApi.js
import { createApi ,fetchBaseQuery} from "@reduxjs/toolkit/query/react";

export const dashboardApi = createApi({
  reducerPath: "dashboardApi",
 baseQuery: fetchBaseQuery({
    baseUrl: "https://drvvy-backend-lucc.onrender.com",
    credentials: "include",
  }),
  tagTypes: ["Revenue", "Bookings", "Users"],
  endpoints: (builder) => ({
    getTotalRevenue: builder.query({
      query: () => "/bookings/getTotalRevenue",
      providesTags: ["Revenue"],
    }),
    getBooking: builder.query({
      query: () => "/bookings",
    }),
    getCompletedBooking: builder.query({
      query: () => "/bookings/CompletedBooking",
    }),
    getAllAcceptedBooking: builder.query({
      query: () => "/bookings/getAcceptedBooking",
    }),
    getTotalUsers: builder.query({
      query: () => "/users/getAllUsers",
      providesTags: ["Users"],
    }),
    addBookingCount: builder.mutation({
      query: (newBookingData) => ({
        url: "/bookings/addBookingCount",
        method: "POST",
        body: newBookingData,
      }),
      invalidatesTags: ["Bookings", "Revenue"],
    }),
  }),
});

export const {
  useGetTotalRevenueQuery,
  useGetBookingQuery,
  useGetAllAcceptedBookingQuery,
  useGetTotalUsersQuery,
  useGetCompletedBookingQuery,
  useAddBookingCountMutation,
} = dashboardApi;
