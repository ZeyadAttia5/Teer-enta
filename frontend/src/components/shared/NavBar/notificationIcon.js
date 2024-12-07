import React, { useContext, useEffect, useState, useRef } from "react";
import { NotificationContext } from "../../notifications/NotificationContext";
import {Bell, X, Check, CheckCheck, Clock, AlertCircle, Trash2, Loader2} from "lucide-react";
import {deleteAllNotifications, deleteNotification} from "../../../api/notifications.ts";
import {message, Modal} from "antd";

// NotificationIcon Component stays the same
const NotificationIcon = ({ navbarcolor = "first" }) => {
    const {
        unreadCount,
        refreshNotifications,
        isDropdownOpen,
        setIsDropdownOpen
    } = useContext(NotificationContext);

    const handleClick = async () => {
        await refreshNotifications();
        setIsDropdownOpen(!isDropdownOpen);
    };

    return (
        <div className="">
            <div
                onClick={handleClick}
                className={`
                    relative
                    inline-flex
                    items-center
                    justify-center
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
                    color={"gray"}
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

            {isDropdownOpen && (
                <NotificationDropdown
                    onClose={() => setIsDropdownOpen(false)}
                    navbarcolor={navbarcolor}
                />
            )}
        </div>
    );
};

// NotificationDropdown Component with enhanced delete functionality
const NotificationDropdown = ({onClose}) => {
    const {
        notifications: contextNotifications,
        loading,
        error,
        markAllAsRead,
        markAsRead,
        refreshNotifications
    } = useContext(NotificationContext);

    const [localNotifications, setLocalNotifications] = useState([]);
    const [deletingIds, setDeletingIds] = useState(new Set());
    const [isDeletingAll, setIsDeletingAll] = useState(false);
    const [isMarkingAll, setIsMarkingAll] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        setLocalNotifications(contextNotifications);
    }, [contextNotifications]);

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
            setLocalNotifications(prev =>
                prev.filter(notification =>
                    (notification._id || notification.id) !== notificationId
                )
            );

            await deleteNotification(notificationId);
            await refreshNotifications();
            message.success('Notification deleted');

            setDeletingIds(prev => {
                const next = new Set(prev);
                next.delete(notificationId);
                return next;
            });
        } catch (error) {
            console.error('Error deleting notification:', error);
            setLocalNotifications(contextNotifications);
            setDeletingIds(prev => {
                const next = new Set(prev);
                next.delete(notificationId);
                return next;
            });
            message.warning('Failed to delete notification');
        }
    };

    const handleDeleteAll = async () => {
        try {
            const confirmed = await new Promise((resolve) => {
                Modal.confirm({
                    title: 'Delete All Notifications',
                    content: 'Are you sure you want to delete all notifications? This cannot be undone.',
                    okText: 'Delete All',
                    okButtonProps: {
                        className: 'bg-red-500 hover:bg-red-600 text-white',
                        danger: true,
                    },
                    cancelText: 'Cancel',
                    onOk: () => resolve(true),
                    onCancel: () => resolve(false),
                });
            });

            if (!confirmed) return;

            setIsDeletingAll(true);
            setLocalNotifications([]);

            await deleteAllNotifications();
            await refreshNotifications();

            message.success('All notifications deleted successfully');
        } catch (error) {
            console.error('Error deleting all notifications:', error);
            setLocalNotifications(contextNotifications);
            message.warning('Failed to delete all notifications');
        } finally {
            setIsDeletingAll(false);
        }
    };

    const handleMarkAllAsRead = async () => {
        try {
            setIsMarkingAll(true);
            await markAllAsRead();
            message.success('All notifications marked as read');

            // Update local state to reflect all notifications as read
            setLocalNotifications(prev =>
                prev.map(notification => ({
                    ...notification,
                    isSeen: true
                }))
            );
        } catch (error) {
            console.error('Error marking all as read:', error);
            message.warning('Failed to mark all as read');
        } finally {
            setIsMarkingAll(false);
        }
    };

    const getTimeAgo = (isoDateString) => {
        try {
            if (!isoDateString) return 'Unknown time';

            const date = new Date(isoDateString);
            if (isNaN(date.getTime())) return 'Invalid date';

            const now = new Date();
            const diff = Math.floor((now - date) / 1000);

            if (diff < 60) return 'Just now';
            const minutes = Math.floor(diff / 60);
            if (minutes < 60) return `${minutes}m ago`;
            const hours = Math.floor(minutes / 60);
            if (hours < 24) return `${hours}h ago`;
            const days = Math.floor(hours / 24);
            if (days < 7) return `${days}d ago`;

            return new Intl.DateTimeFormat('en-US', {
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
            className="absolute right-0 mt-3 w-[30rem] bg-white rounded-lg shadow-xl border border-gray-200
        overflow-hidden z-50 transform transition-all duration-300 ease-out"
        >

            {/* Header */}
            <div className="py-6 px-8 bg-gradient-to-r from-[#1C325B] to-[#2A4575]">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-4">
                        <div className="p-2 bg-white/10 rounded-lg">
                            <Bell className="w-6 h-6 text-white"/>
                        </div>
                        <div>
                            <h3 className="text-xl font-semibold text-white">Notifications</h3>
                            <p className="text-sm text-white/70 mt-1">Stay updated with your activities</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                    >
                        <X className="w-6 h-6 text-white/80 hover:text-white"/>
                    </button>
                </div>

                {localNotifications.length > 0 && (
                    <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/10">
                        <div className="flex items-center gap-2">
                            {localNotifications.filter(n => !n.isSeen).length > 0 && (
                                <span className="px-3 py-1.5 bg-white/10 text-white text-sm font-medium rounded-lg">
                                {localNotifications.filter(n => !n.isSeen).length} new notifications
                            </span>
                            )}
                        </div>
                        <div className="flex items-center gap-4">
                            <button
                                onClick={handleMarkAllAsRead}
                                disabled={isMarkingAll || !localNotifications.some(n => !n.isSeen)}
                                className="flex items-center gap-2 px-4 py-2 text-white/90 hover:text-white
                                     bg-white/5 hover:bg-white/10 rounded-lg transition-all duration-200
                                     disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
                            >
                                {isMarkingAll ? (
                                    <Loader2 className="w-4 h-4 animate-spin"/>
                                ) : (
                                    <CheckCheck className="w-4 h-4"/>
                                )}
                                Mark all read
                            </button>
                            <button
                                onClick={handleDeleteAll}
                                disabled={isDeletingAll}
                                className="flex items-center gap-2 px-4 py-2 text-white/90 hover:text-white
                                     bg-white/5 hover:bg-white/10 rounded-lg transition-all duration-200
                                     text-sm font-medium"
                            >
                                {isDeletingAll ? (
                                    <Loader2 className="w-4 h-4 animate-spin"/>
                                ) : (
                                    <Trash2 className="w-4 h-4"/>
                                )}
                                Delete all
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Content */}
            <div className="overflow-y-auto max-h-[32rem] bg-gray-50/80">
                {loading ? (
                    <div className="flex flex-col items-center justify-center h-64 gap-4">
                        <Loader2 className="w-8 h-8 animate-spin text-[#1C325B]"/>
                        <p className="text-gray-500">Loading notifications...</p>
                    </div>
                ) : error ? (
                    <div className="flex flex-col items-center justify-center h-64 text-red-500 gap-3">
                        <AlertCircle className="w-12 h-12"/>
                        <p className="font-medium text-lg">{error}</p>
                    </div>
                ) : localNotifications.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-64 gap-3">
                        <div className="p-4 bg-gray-100/80 rounded-full">
                            <Bell className="w-10 h-10 text-[#1C325B]/30"/>
                        </div>
                        <p className="text-gray-500 font-medium text-lg">No notifications yet</p>
                    </div>
                ) : (
                    <div className="divide-y divide-gray-100">
                        {localNotifications.map((notification) => (
                            <div
                                key={notification._id || notification.id}
                                className={`group px-8 py-6 hover:bg-[#1C325B]/5 transition-all duration-200
                                      ${!notification.isSeen ? 'bg-[#1C325B]/5' : 'bg-white'}`}
                            >
                                <div className="flex gap-6">
                                    <div className="flex-shrink-0 mt-1">
                                        {notification.isSeen ? (
                                            <div className="p-2 rounded-full bg-gray-100">
                                                <CheckCheck className="w-5 h-5 text-gray-400"/>
                                            </div>
                                        ) : (
                                            <div className="p-2 rounded-full bg-[#1C325B]/10">
                                                <Check className="w-5 h-5 text-[#1C325B]"/>
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-base font-semibold text-[#1C325B]">
                                            {notification.title}
                                        </p>
                                        {notification.body && (
                                            <p className="mt-2 text-gray-600">
                                                {notification.body}
                                            </p>
                                        )}
                                        <div className="mt-4 flex items-center gap-6">
                                        <span className="flex items-center text-sm text-gray-500">
                                            <Clock className="w-4 h-4 mr-2"/>
                                            {getTimeAgo(notification.sentAt)}
                                        </span>
                                            {!notification.isSeen && (
                                                <button
                                                    onClick={() => markAsRead(notification._id || notification.id)}
                                                    className="text-sm text-[#1C325B] hover:text-[#2A4575] font-medium
                                                         opacity-0 group-hover:opacity-100 transition-opacity
                                                         hover:underline"
                                                >
                                                    Mark as read
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => handleDelete(notification._id || notification.id)}
                                        disabled={deletingIds.has(notification._id || notification.id)}
                                        className="p-2 rounded-lg opacity-0 group-hover:opacity-100
                                             transition-all duration-200 hover:bg-red-50 self-start
                                             hover:text-red-600"
                                    >
                                        {deletingIds.has(notification._id || notification.id) ? (
                                            <Loader2 className="w-5 h-5 animate-spin"/>
                                        ) : (
                                            <Trash2 className="w-5 h-5"/>
                                        )}
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