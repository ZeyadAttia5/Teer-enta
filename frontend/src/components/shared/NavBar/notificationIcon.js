// NotificationIcon.js
import React, { useContext, useState, useEffect, useRef } from "react";
import { NotificationContext } from "../../notifications/NotificationContext";
import { getAllMyNotifications } from "../../../api/notifications.ts";
import NotificationComponent from "../../notifications/Notification";

// Ensure NotificationContext is provided in a higher component

const NotificationIcon = ({ navbarcolor, onClick }) => {
  const { unreadCount } = useContext(NotificationContext);
  // const [unreadCount, setUnreadCount] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const notificationRef = useRef(null);

  useEffect(() => {
    if (isHovered || isOpen) {
      getAllMyNotifications().then((data) =>
        setNotifications(data?.data?.notifications)
      );
    }
  }, [isHovered, isOpen, unreadCount]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [unreadCount]);

  return (
    <div
      ref={notificationRef}
      onClick={() => setIsOpen(!isOpen)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`relative bg-${navbarcolor}`}
      style={{ overflow: "visible" }}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="w-6 h-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke={navbarcolor === "first" ? "white" : "black"}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.5V11a6 6 0 10-12 0v3.5c0 .512-.195 1.024-.585 1.415L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
        />
      </svg>
      {unreadCount > 0 && (
        <span className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full text-xs w-5 h-5 flex items-center justify-center">
          {unreadCount}
        </span>
      )}
      {(isHovered || isOpen) && (
        <div
          className="absolute left-1/2 transform -translate-x-1/2 mt-4 bg-second rounded-md shadow-lg z-50 transition-opacity duration-300 ease-in-out border-radius: 8px"
          style={{ opacity: isHovered || isOpen ? 1 : 0, width: "300px" }}
        >
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-3/4 w-0 h-0 border-l-4 border-l-transparent border-r-4 border-r-transparent border-b-4 border-b-second"></div>
          <div className="p-2">
            {/* <NotificationComponent
              title={"hi this "}
              body={"notification message"}
            /> */}
            {notifications.length > 0 ? (
              notifications.map((notification) => (
                <NotificationComponent
                  key={notification.id}
                  {...notification}
                />
              ))
            ) : (
              <div className="text-center p-2 text-gray-500">
                {/* No notifications */}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationIcon;
