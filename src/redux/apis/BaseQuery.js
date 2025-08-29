// src/redux/apis/baseQuery.js
import { fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const baseQuery = fetchBaseQuery({
  baseUrl: "https://drvvy-backend-lucc.onrender.com", // Replace with your actual backend URL
  credentials: "include",
  prepareHeaders: (headers, { getState }) => {
  const token = getState().auth.token || localStorage.getItem("auth_token");
  console.log("🔑 Token being used in baseQuery:", token);

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  } else {
    console.warn(" No token found in prepareHeaders");
  }

  return headers;
}

});

export default baseQuery;
