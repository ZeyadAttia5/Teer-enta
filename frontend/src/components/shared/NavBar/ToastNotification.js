// ToastNotification.js
import React, { useContext, useEffect, useState } from "react";
import { NotificationContext } from "../../notifications/NotificationContext";

const ToastNotification = () => {
  const { notifications } = useContext(NotificationContext);
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (notifications.length) {
      setShow(true);
      setTimeout(() => setShow(false), 3000);
    }
  }, [notifications]);

  if (!show || notifications.length === 0) return null;

  return (
    <div className="fixed top-5 right-5 bg-gray-800 text-white px-4 py-2 rounded-lg shadow-lg">
      <p>{notifications[0].message}</p>
    </div>
  );
};

export default ToastNotification;
