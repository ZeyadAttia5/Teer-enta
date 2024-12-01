import React, { createContext, useState, useEffect } from "react";
import { getAllMyNotifications, markAllAsReadd, markAsReadd } from "../../api/notifications.ts";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const NotificationContext = createContext();

export const NotificationProvider = ({ children, incomingNotification ,isNotificationIncomming }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    if (user) {
      fetchNotifications();
    }
  }, []);

  // Handle incoming notifications
  useEffect( () => {
    console.log("incomingNotification", isNotificationIncomming);
    if (incomingNotification) {
      console.log("incomingNotification", isNotificationIncomming);
      setNotifications(prev => [incomingNotification, ...prev]);
      console.log("unreadCount", unreadCount);
      setUnreadCount(prev => prev + 1);
      console.log("unreadCount", unreadCount);
    }
  }, [incomingNotification]);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getAllMyNotifications();

      setNotifications(response.data.notifications);
      const unseenCount = response.data.notifications.filter(
          notif => !notif.isSeen
      ).length;
      // console.log("unseenCount", unseenCount);
      setUnreadCount(unseenCount);
    } catch (err) {
      setError(err.message || "Failed to fetch notifications");
      console.error("Error fetching notifications:", err);

      // Show error toast
      // toast.error("Failed to load notifications. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await markAllAsReadd();
      setNotifications(prev =>
          prev.map(notif => ({ ...notif, isSeen: true }))
      );
      setUnreadCount(0);

      // toast.success("All notifications marked as read");
    } catch (err) {
      console.error("Error marking all as read:", err);
      // toast.error("Failed to mark all as read. Please try again.");
      await fetchNotifications(); // Refresh to ensure consistency
    }
  };

  const handleMarkAsRead = async (notificationId) => {
    try {
      await markAsReadd(notificationId);
      setNotifications(prev =>
          prev.map(notif =>
              notif._id === notificationId ? { ...notif, isSeen: true } : notif
          )
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (err) {
      console.error("Error marking as read:", err);
      // toast.error("Failed to mark notification as read");
      await fetchNotifications(); // Refresh to ensure consistency
    }
  };

  const value = {
    notifications,
    unreadCount,
    loading,
    error,
    isDropdownOpen,
    setIsDropdownOpen,
    markAllAsRead: handleMarkAllAsRead,
    markAsRead: handleMarkAsRead,
    refreshNotifications: fetchNotifications
  };

  return (
      <>
        <ToastContainer />
        <NotificationContext.Provider value={value}>
          {children}
        </NotificationContext.Provider>
      </>
  );
};

export default NotificationProvider;