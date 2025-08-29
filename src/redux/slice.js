// src/redux/slice/authSlice.js
import { createSlice } from "@reduxjs/toolkit";

// 🧠 Safe JSON parse for user from localStorage
let parsedUser = null;
try {
  const raw = localStorage.getItem("auth_user");
  parsedUser = raw && raw !== "undefined" ? JSON.parse(raw) : null;
} catch (err) {
  console.warn("⚠️ Invalid JSON in localStorage auth_user:", err);
}

const initialState = {
  token: localStorage.getItem("auth_token") || null,
  user: parsedUser,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      const { token, user } = action.payload;
      state.token = token;
      state.user = user;

      localStorage.setItem("auth_token", token);

      if (user !== undefined && user !== null) {
        localStorage.setItem("auth_user", JSON.stringify(user));
      } else {
        localStorage.removeItem("auth_user");
      }
    },

    logout: (state) => {
      state.token = null;
      state.user = null;
      localStorage.removeItem("auth_token");
      localStorage.removeItem("auth_user");
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;
