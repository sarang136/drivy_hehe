import React, { useState } from "react";
import { useSendNotificationMutation } from "../redux/apis/NotificationApi";

const SendNotification = () => {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [image, setImage] = useState(null);

  const [sendNotification, { isLoading }] = useSendNotificationMutation();

  const handleSend = async () => {
    try {
      await sendNotification({ title, body, image }).unwrap();
      alert("Notification sent successfully!");
      setTitle("");
      setBody("");
      setImage(null);
    } catch (error) {
      console.error(error);
      alert("Failed to send notification!");
    }
  };

  return (
    <div className="max-w-lg mx-auto mt-10 p-6 bg-white shadow-lg rounded-xl">
      <h2 className="text-2xl font-bold text-center mb-6">Send Notification</h2>

      <label className="block text-gray-700 font-medium">Title</label>
      <input
        type="text"
        placeholder="Enter notification title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full p-3 mt-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      <label className="block text-gray-700 font-medium mt-4">Body</label>
      <textarea
        placeholder="Enter notification body"
        value={body}
        onChange={(e) => setBody(e.target.value)}
        className="w-full p-3 mt-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[120px]"
      />

      <label className="block text-gray-700 font-medium mt-4">Image</label>
      <input
        type="file"
        onChange={(e) => setImage(e.target.files[0])}
        className="w-full mt-2"
      />

      <button
        onClick={handleSend}
        disabled={isLoading}
        className="mt-6 w-full bg-[#CDFF00] hover:bg-yellow-400 text-black font-semibold py-3 rounded-lg transition duration-200"
      >
        {isLoading ? "Sending..." : "Send"}
      </button>
    </div>
  );
};

export default SendNotification;
