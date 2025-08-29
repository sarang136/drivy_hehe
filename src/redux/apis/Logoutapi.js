
import { fetchBaseQuery } from "@reduxjs/toolkit/query";
import { adminApi } from "./Adminapi";


export const logoutApi = adminApi.injectEndpoints({ 
   baseQuery: fetchBaseQuery({
    baseUrl: "https://drvvy-backend-lucc.onrender.com",
    credentials: "include",
  }),
  endpoints: (builder) => ({
    logOut: builder.mutation({
      
      query: () => ({
        url: "admin/logOut",
        method: "POST",
  
      }),
    }),
  }),
  overrideExisting: false,
});

export const { useLogOutMutation } = logoutApi;
