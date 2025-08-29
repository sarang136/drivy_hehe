// src/redux/api/bookingApi.js
import { createApi,fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const Bookingapi = createApi({
  reducerPath: 'Bookingapi',
 baseQuery: fetchBaseQuery({
    baseUrl: "https://drvvy-backend-lucc.onrender.com",
    credentials: "include",
  }),
  endpoints: (builder) => ({
    getAllBookings: builder.query({
      query: () => '/bookings',
    }),
  }),
});

export const { useGetAllBookingsQuery } = Bookingapi;
