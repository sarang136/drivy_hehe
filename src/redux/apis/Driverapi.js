import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const Driverapi = createApi({
  reducerPath: "Driverapi",

  baseQuery: fetchBaseQuery({
    baseUrl: "https://drvvy-backend-s21a.onrender.com",
    // baseUrl: "https://drvvy-backend-s21a.onrender.com",
    credentials: "include",
  }),

  tagTypes: ["Driver"],

  endpoints: (builder) => ({
    getAllDriver: builder.query({
      query: () => "/drivers/getAllDrivers",
      providesTags: ["Driver"],
    }),

    getDriverById: builder.query({
      query: (id) => `/drivers/${id}`,
      providesTags: ["Driver"],
    }),

    getdriverPaymentRequest: builder.query({
      query: () => `/driver-bank-requests`,
      providesTags: ["Driver"],
    }),

    updateDriverBankStatus: builder.mutation({
      query: ({ id, status }) => ({
        url: `/driver-bank-request/${id}`,
        method: "PUT",
        body: { status },
        credentials: "include",
      }),
      invalidatesTags: ["Driver"],
    }),

    approveDriver: builder.mutation({
      query: ({ id, status }) => ({
        url: `/drivers/updateDriverApprovedStatus/${id}`,
        method: "POST",
        body: { status },
      }),
      invalidatesTags: ["Driver"],
    }),

    rejectDriver: builder.mutation({
      query: ({ id, status }) => ({
        url: `/drivers/updateDriverRejectedStatus/${id}`,
        method: "POST",
        body: { status },
      }),
      invalidatesTags: ["Driver"],
    }),

    deleteDriver: builder.mutation({
      query: (id) => ({
        url: `/drivers/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Driver"],
    }),
  }),
});

export const {
  useGetAllDriverQuery,
  useGetDriverByIdQuery,
  useApproveDriverMutation,
  useRejectDriverMutation,
  useDeleteDriverMutation,
  useGetdriverPaymentRequestQuery,
  useUpdateDriverBankStatusMutation,
} = Driverapi;
