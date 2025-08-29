import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const NotificationApi = createApi({
  reducerPath: "NotificationApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://drvvy-notification.onrender.com",
  }),
  tagTypes: ["Notification"],
  endpoints: (builder) => ({
    sendNotification: builder.mutation({
      query: ({ title, body, image }) => {
        const formData = new FormData();
        formData.append("title", title);
        formData.append("body", body);
        if (image) formData.append("image", image); // image file from input

        return {
          url: "/send-notification",
          method: "POST",
          body: formData,
        };
      },
    }),
  }),
});

export const { useSendNotificationMutation } = NotificationApi;
