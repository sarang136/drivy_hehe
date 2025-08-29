import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const Userapi = createApi({
  reducerPath: "Userapi",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://drvvy-backend-lucc.onrender.com",
    credentials: "include",
  }),
  tagTypes: ["Users"],

  endpoints: (builder) => ({
    getAllUser: builder.query({
      query: () => "/users/getAllUsers",
      providesTags: ["Users"],
    }),
    getUserDetails: builder.query({
      query: (id) => `/bookings/getBookingsByUserId/${id}`,
      providesTags: ["Users"],
    }),

    deleteUser: builder.mutation({
      query: (id) => ({
        url: `/users/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Users"],
    }),
  }),
});

export const { useGetAllUserQuery, useDeleteUserMutation,useGetUserDetailsQuery } = Userapi;
