import React, { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { requestForToken, onMessageListener } from "../../services/firebase.js";
import {
  saveFCMTokenToServer,
  deleteNotification,
} from "../../api/notifications.ts";

const NotificationComponent = ({ id, title, body }) => {
  const [notification, setNotification] = useState({ title, body });
  const [token, setToken] = useState("");

  useEffect(() => {
    const initializeNotifications = async () => {
      try {
        const permission = await Notification.requestPermission();
        if (permission === "granted") {
          const token = await requestForToken();
          if (token) {
            setToken(token);
            await saveTokenToServer(token);
            await onMessageListener();
          }
        }
      } catch (error) {
        console.error("Error initializing notifications:", error);
      }
    };

    initializeNotifications();

    // Set up message listener
    onMessageListener()
      .then((payload) => {
        setNotification({
          title: payload.notification.title,
          body: payload.notification.body,
        });
        toast.info(
          `${payload.notification.title}: ${payload.notification.body}`
        );
      })
      .catch((err) =>
        console.log("Failed to receive foreground message:", err)
      );
  }, []);

  const saveTokenToServer = async (token) => {
    try {
      const response = await saveFCMTokenToServer(token);

      if (!response.status === 200) {
        throw new Error("Failed to save token");
      }
    } catch (error) {
      console.error("Error saving token:", error);
    }
  };

  const handleDeleteNotification = async () => {
    try {
      setNotification(null);
      await deleteNotification(notification.id);
      toast.success("Notification deleted successfully");
    } catch (error) {
      console.error("Error deleting notification:", error);
      toast.error("Failed to delete notification");
    }
  };

  return (
    <div>
      <ToastContainer />
      {notification.title && (
        <div className="flex items-center bg-fourth shadow-lg rounded-lg p-4 mb-4 padding: 10px 20px;">
          <div className="flex-grow">
            <h4 className="text-lg font-semibold mb-1 text-black">
              {notification.title}
            </h4>
            <p className="text-sm text-black">{notification.body}</p>
          </div>
          <button
            onClick={handleDeleteNotification}
            className="ml-4 text-red-500 hover:text-red-700 transition-colors duration-200"
          >
            X
          </button>
        </div>
      )}
    </div>
  );
};

export default NotificationComponent;
