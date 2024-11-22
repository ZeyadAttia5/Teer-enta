// NotificationsPage.js
import React, { useContext, useEffect } from "react";
import { NotificationContext } from "../../notifications/NotificationContext";

const NotificationsPage = () => {
  const { notifications, markAsRead } = useContext(NotificationContext);

  useEffect(() => {
    markAsRead();
  }, []);

  return (
    <div className="max-w-2xl mx-auto mt-10 p-4 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-semibold mb-4">Notifications</h2>
      {notifications.length === 0 ? (
        <p className="text-gray-600">No notifications available</p>
      ) : (
        notifications.map((notif) => (
          <div key={notif.id} className="border-b border-gray-200 py-3">
            {notif.message}
          </div>
        ))
      )}
    </div>
  );
};

export default NotificationsPage;
