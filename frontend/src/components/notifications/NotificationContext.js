// NotificationContext.js
import React, { createContext, useState } from "react";

// Create the context
export const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  // State to hold the list of notifications
  const [notifications, setNotifications] = useState([]);
  // State to hold the count of unread notifications
  const [unreadCount, setUnreadCount] = useState(3);

  // Function to add a new notification
  const addNotification = (message) => {
    const newNotification = {
      id: Date.now(), // unique id for each notification
      message,
      read: false,
    };
    setNotifications((prevNotifications) => [
      newNotification,
      ...prevNotifications,
    ]);
    setUnreadCount((prevCount) => prevCount + 1);
  };

  // Function to mark all notifications as read
  const markAsRead = () => {
    setNotifications((prevNotifications) =>
      prevNotifications.map((notif) => ({ ...notif, read: true }))
    );
    setUnreadCount(0);
  };

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        addNotification,
        markAsRead,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};
