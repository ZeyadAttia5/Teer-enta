import React, { createContext, useState, useEffect } from "react";
import { getAllMyNotifications } from "../../api/notifications.ts"; // Adjust the import path as needed

export const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch notifications from backend
  const fetchNotifications = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getAllMyNotifications();
      setNotifications(response.data.notifications);

      // Calculate unread count from fetched notifications
      const unseenCount = response.data.notifications.filter(
          (notif) => !notif.isSeen
      ).length;
      setUnreadCount(unseenCount);
    } catch (err) {
      setError(err.message || 'Failed to fetch notifications');
      console.error('Error fetching notifications:', err);
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch on mount
  useEffect(() => {
    fetchNotifications();
  }, []);

  // Add a new notification locally
  const addNotification = (notification) => {
    setNotifications((prevNotifications) => [
      {
        title: notification.title,
        body: notification.body,
        isSeen: false,
        timestamp: new Date().toISOString(),
      },
      ...prevNotifications,
    ]);
    setUnreadCount((prevCount) => prevCount + 1);
  };

  // Mark all notifications as read
  const markAllAsRead = async () => {
    try {
      // Update local state
      setNotifications((prevNotifications) =>
          prevNotifications.map((notif) => ({ ...notif, isSeen: true }))
      );
      setUnreadCount(0);

      // You can add an API call here to update the backend
      // await updateNotificationsAsRead();
    } catch (err) {
      console.error('Error marking notifications as read:', err);
      // Revert local state if backend update fails
      await fetchNotifications();
    }
  };

  // Mark a single notification as read
  const markAsRead = async (notificationId) => {
    try {
      setNotifications((prevNotifications) =>
          prevNotifications.map((notif) =>
              notif._id === notificationId ? { ...notif, isSeen: true } : notif
          )
      );
      setUnreadCount((prevCount) => Math.max(0, prevCount - 1));

      // You can add an API call here to update the backend
      // await updateNotificationAsRead(notificationId);
    } catch (err) {
      console.error('Error marking notification as read:', err);
      // Revert local state if backend update fails
      await fetchNotifications();
    }
  };

  // Refresh notifications
  const refreshNotifications = () => {
    fetchNotifications();
  };

  return (
      <NotificationContext.Provider
          value={{
            notifications,
            unreadCount,
            loading,
            error,
            addNotification,
            markAllAsRead,
            markAsRead,
            refreshNotifications,
          }}
      >
        {children}
      </NotificationContext.Provider>
  );
};

export default NotificationProvider;