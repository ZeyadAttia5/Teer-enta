import React, { useContext, useEffect, useState, useRef } from "react";
import { NotificationContext } from "../../notifications/NotificationContext";
import { Bell, X, Check, CheckCheck, Clock, AlertCircle, Trash2 } from "lucide-react";
import {deleteNotification} from "../../../api/notifications.ts";

// NotificationIcon Component stays the same
const NotificationIcon = ({ navbarcolor = "first" }) => {
    const { unreadCount, refreshNotifications } = useContext(NotificationContext);
    const [isOpen, setIsOpen] = useState(false);

    const handleClick = async () => {
        await refreshNotifications();
        setIsOpen(!isOpen);
    };

    return (
        <div className="relative">
            <div
                onClick={handleClick}
                className={`
                    relative
                    inline-flex
                    items-center
                    justify-center
                    p-2
                    rounded-full
                    cursor-pointer
                    transition-all
                    duration-200
                    hover:bg-opacity-80
                    ${navbarcolor === "first" ? "bg-transparent" : "bg-gray-100"}
                `}
                role="button"
                aria-label={`Notifications ${unreadCount > 0 ? `(${unreadCount} unread)` : ''}`}
            >
                <Bell
                    className={`
                        w-6 
                        h-6 
                        transition-transform 
                        duration-200 
                        hover:scale-110
                        ${unreadCount > 0 ? 'animate-bounce' : ''}
                    `}
                    color={navbarcolor === "first" ? "white" : "black"}
                />

                {unreadCount > 0 && (
                    <span
                        className={`
                            absolute 
                            -top-1 
                            -right-1
                            min-w-[20px]
                            h-5
                            flex 
                            items-center 
                            justify-center
                            px-1
                            text-xs 
                            font-bold 
                            text-white 
                            bg-red-500
                            border-2
                            ${navbarcolor === "first" ? "border-gray-900" : "border-white"}
                            rounded-full
                            animate-pulse
                        `}
                    >
                        {unreadCount > 99 ? '99+' : unreadCount}
                    </span>
                )}
            </div>

            {isOpen && (
                <NotificationDropdown
                    onClose={() => setIsOpen(false)}
                    navbarcolor={navbarcolor}
                />
            )}
        </div>
    );
};

// NotificationDropdown Component with enhanced delete functionality
const NotificationDropdown = ({ onClose, navbarcolor }) => {
    const {
        notifications,
        loading,
        error,
        markAllAsRead,
        markAsRead
    } = useContext(NotificationContext);
    const dropdownRef = useRef(null);
    const [deletingIds, setDeletingIds] = useState(new Set());

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                onClose();
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [onClose]);

    const handleDelete = async (notificationId) => {
        try {
            setDeletingIds(prev => new Set([...prev, notificationId]));
            // Add your delete API call here
            // await deleteNotification(notificationId);

           await deleteNotification(notificationId);
            // Remove from deletingIds after successful deletion
            setDeletingIds(prev => {
                const next = new Set(prev);
                next.delete(notificationId);
                return next;
            });
        } catch (error) {
            console.error('Error deleting notification:', error);
            setDeletingIds(prev => {
                const next = new Set(prev);
                next.delete(notificationId);
                return next;
            });
        }
    };

    const getTimeAgo = (isoDateString) => {
        try {
            if (!isoDateString) return 'Unknown time';

            const date = new Date(isoDateString);
            if (isNaN(date.getTime())) return 'Invalid date';

            const now = new Date();
            const utc1 = Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(),
                date.getHours(), date.getMinutes(), date.getSeconds());
            const utc2 = Date.UTC(now.getFullYear(), now.getMonth(), now.getDate(),
                now.getHours(), now.getMinutes(), now.getSeconds());
            const diff = Math.floor((utc2 - utc1) / 1000);

            if (diff < 60) return 'Just now';
            const minutes = Math.floor(diff / 60);
            if (minutes < 60) return `${minutes} min${minutes !== 1 ? 's' : ''} ago`;
            const hours = Math.floor(minutes / 60);
            if (hours < 24) return `${hours} hour${hours !== 1 ? 's' : ''} ago`;
            const days = Math.floor(hours / 24);
            if (days < 7) return `${days} day${days !== 1 ? 's' : ''} ago`;

            return new Intl.DateTimeFormat('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            }).format(date);
        } catch (error) {
            console.error('Error formatting date:', error);
            return 'Date unavailable';
        }
    };

    return (
        <div
            ref={dropdownRef}
            className={`
                absolute
                right-0
                mt-2
                w-96
                max-h-[80vh]
                bg-white
                rounded-xl
                shadow-2xl
                border
                border-gray-200
                overflow-hidden
                z-50
                transform
                transition-all
                duration-200
            `}
        >
            {/* Header */}
            <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-gray-50">
                <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-gray-900">Notifications</h3>
                    <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                        {notifications.filter(n => !n.isSeen).length} new
                    </span>
                </div>
                <div className="flex items-center gap-3">
                    {notifications.some(n => !n.isSeen) && (
                        <button
                            onClick={markAllAsRead}
                            className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                        >
                            Mark all read
                        </button>
                    )}
                    <button
                        onClick={onClose}
                        className="p-1 hover:bg-gray-200 rounded-full transition-colors"
                    >
                        <X className="w-5 h-5 text-gray-500" />
                    </button>
                </div>
            </div>

            {/* Content */}
            <div className="overflow-y-auto max-h-[60vh]">
                {loading ? (
                    <div className="flex items-center justify-center h-32">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
                    </div>
                ) : error ? (
                    <div className="p-8 text-center text-red-500">
                        <AlertCircle className="w-12 h-12 mx-auto mb-2" />
                        <p>{error}</p>
                    </div>
                ) : notifications.length === 0 ? (
                    <div className="p-8 text-center text-gray-500">
                        <Bell className="w-12 h-12 mx-auto mb-2 opacity-20" />
                        <p>No notifications yet</p>
                    </div>
                ) : (
                    <div className="divide-y divide-gray-100">
                        {notifications.map((notification) => (
                            <div
                                key={notification._id || notification.id}
                                className={`
                                    group
                                    p-4
                                    hover:bg-gray-50
                                    transition-colors
                                    duration-200
                                    ${!notification.isSeen ? 'bg-blue-50/50' : ''}
                                    relative
                                    overflow-hidden
                                `}
                            >
                                <div className="flex gap-3 items-start">
                                    <div className="flex-shrink-0 mt-1">
                                        {notification.isSeen ? (
                                            <CheckCheck className="w-5 h-5 text-gray-400" />
                                        ) : (
                                            <Check className="w-5 h-5 text-blue-500" />
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-gray-900">
                                            {notification.title}
                                        </p>
                                        {notification.body && (
                                            <p className="mt-1 text-sm text-gray-600 line-clamp-2">
                                                {notification.body}
                                            </p>
                                        )}
                                        <div className="mt-2 flex items-center gap-3">
                                            <span className="flex items-center text-xs text-gray-500">
                                                <Clock className="w-3 h-3 mr-1" />
                                                {getTimeAgo(notification.sentAt)}
                                            </span>
                                            {!notification.isSeen && (
                                                <button
                                                    onClick={() => markAsRead(notification._id || notification.id)}
                                                    className="text-xs text-blue-600 hover:text-blue-700 font-medium opacity-0 group-hover:opacity-100 transition-opacity"
                                                >
                                                    Mark as read
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => handleDelete(notification._id || notification.id)}
                                        disabled={deletingIds.has(notification._id || notification.id)}
                                        className={`
                                            p-2
                                            rounded-full
                                            opacity-0
                                            group-hover:opacity-100
                                            transition-all
                                            duration-200
                                            hover:bg-red-50
                                            ${deletingIds.has(notification._id || notification.id) ?
                                            'animate-spin bg-red-50' :
                                            'hover:text-red-600'}
                                        `}
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default NotificationIcon;