
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const adminApi = createApi({
  reducerPath: "adminApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://drvvy-backend-lucc.onrender.com",
    credentials: "include", 
  }),
  endpoints: (builder) => ({
    sendOtp: builder.mutation({
      query: ({ email }) => ({
        url: "/admin/login",
        method: "POST",
        body: { email },
      }),
    }),
    verifyOtp: builder.mutation({
      query: ({ email, otp }) => ({
        url: "/admin/verify",
        method: "POST",
        body: { email, otp },
      }),
    }),
  }),
});

export const { useSendOtpMutation, useVerifyOtpMutation} = adminApi;
