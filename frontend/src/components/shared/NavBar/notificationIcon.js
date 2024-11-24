// NotificationIcon.js
import React, { useContext } from "react";
import { NotificationContext } from "../../notifications/NotificationContext";

// Ensure NotificationContext is provided in a higher component

const NotificationIcon = ({ navbarcolor, onClick }) => {
  const { unreadCount } = useContext(NotificationContext);

  return (
    <div onClick={onClick} className={`bg-${navbarcolor}`}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="w-6 h-6"
        fill="white"
        viewBox="0 0 24 24"
        stroke={navbarcolor === "first" ? "yellow" : "black"}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.5V11a6 6 0 10-12 0v3.5c0 .512-.195 1.024-.585 1.415L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
        />
      </svg>
      {unreadCount > 0 && (
        <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full text-xs w-5 h-5 flex items-center justify-center">
          {unreadCount}
        </span>
      )}
    </div>
  );
};

export default NotificationIcon;
