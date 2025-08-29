import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';

// RTK Query APIs
import { dashboardApi } from './redux/apis/Dashboardapi';
import { Userapi } from './redux/apis/Userapi';
import { Driverapi } from './redux/apis/Driverapi';
import { Bookingapi } from './redux/apis/Bookingapi';
import { adminApi } from './redux/apis/Adminapi';


import authSlice from './redux/slice';
import { CategoriesApi } from './redux/apis/CategoriesApi';

export const store = configureStore({
  reducer: {
    auth: authSlice,
    [dashboardApi.reducerPath]: dashboardApi.reducer,
    [Userapi.reducerPath]: Userapi.reducer,
    [Driverapi.reducerPath]: Driverapi.reducer,
    [Bookingapi.reducerPath]: Bookingapi.reducer,
    [adminApi.reducerPath]: adminApi.reducer,
     [CategoriesApi.reducerPath]: CategoriesApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(dashboardApi.middleware)
      .concat(Userapi.middleware)
      .concat(Driverapi.middleware)
      .concat(Bookingapi.middleware)
      .concat(adminApi.middleware)
      .concat(CategoriesApi.middleware),
});

setupListeners(store.dispatch);
