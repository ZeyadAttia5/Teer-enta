import React, { createContext, useState, useEffect } from "react";
import { getAllMyNotifications, markAllAsReadd, markAsReadd } from "../../api/notifications.ts";
import { getMessaging, onMessage } from "firebase/messaging";
import { toast } from "react-toastify";

export const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const user = JSON.parse(localStorage.getItem("user"));

  // Fetch notifications from backend
  const fetchNotifications = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getAllMyNotifications();
      setNotifications(response.data.notifications);
      const unseenCount = response.data.notifications.filter(
          (notif) => !notif.isSeen
      ).length;
      setUnreadCount(unseenCount);
    } catch (err) {
      setError(err.message || "Failed to fetch notifications");
      console.error("Error fetching notifications:", err);
    } finally {
      setLoading(false);
    }
  };

  // Set up Firebase messaging listener
  useEffect(() => {
    let unsubscribe = null;

    const setupForegroundListener = async () => {
      try {
        const messaging = getMessaging();

        unsubscribe = onMessage(messaging, (payload) => {
          console.log("Received foreground message:", payload);

          if (payload?.notification) {
            // Add the new notification to the state immediately
            const newNotification = {
              _id: Date.now().toString(), // Temporary ID
              title: payload.notification.title,
              body: payload.notification.body,
              isSeen: false,
              sentAt: new Date().toISOString(),
            };

            setNotifications(prev => [newNotification, ...prev]);
            setUnreadCount(prev => prev + 1);

            // Show toast notification
            toast.info(
                `${payload.notification.title}: ${payload.notification.body}`,
                {
                  position: "top-right",
                  autoClose: 5000,
                  hideProgressBar: false,
                  closeOnClick: true,
                  pauseOnHover: true,
                  draggable: true,
                  progress: undefined,
                }
            );

            // Fetch updated notifications from server after a short delay
            setTimeout(() => {
              fetchNotifications();
            }, 1000);
          }
        });
      } catch (error) {
        console.error("Error setting up notification listener:", error);
      }
    };

    if (user) {
      setupForegroundListener();
    }

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [user]);

  // Initial fetch on mount
  useEffect(() => {
    if (user) {
      fetchNotifications();
    }
  }, []);

  // Add a new notification locally
  const addNotification = (notification) => {
    setNotifications((prevNotifications) => [
      {
        title: notification.title,
        body: notification.body,
        isSeen: false,
        sentAt: new Date().toISOString(),
      },
      ...prevNotifications,
    ]);
    setUnreadCount((prevCount) => prevCount + 1);
  };

  const markAllAsRead = async () => {
    try {
      setNotifications((prevNotifications) =>
          prevNotifications.map((notif) => ({ ...notif, isSeen: true }))
      );
      setUnreadCount(0);
      await markAllAsReadd();
    } catch (err) {
      console.error("Error marking notifications as read:", err);
      await fetchNotifications();
    }
  };

  const markAsRead = async (notificationId) => {
    try {
      setNotifications((prevNotifications) =>
          prevNotifications.map((notif) =>
              notif._id === notificationId ? { ...notif, isSeen: true } : notif
          )
      );
      setUnreadCount((prevCount) => Math.max(0, prevCount - 1));

      await markAsReadd(notificationId);
    } catch (err) {
      console.error("Error marking notification as read:", err);
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