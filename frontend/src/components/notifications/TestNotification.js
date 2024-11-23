// src/components/TestNotification/index.jsx
import React, { useState, useEffect } from 'react';
import { requestForToken, checkPermission } from '../../services/firebase.js';
import { saveFCMTokenToServer, sendNotifications } from "../../api/notifications.ts";
import PermissionGuide from './permissionGuide';

const TestNotification = () => {
    const [token, setToken] = useState('');
    const [title, setTitle] = useState('');
    const [message, setMessage] = useState('');
    const [status, setStatus] = useState('');
    const [permissionState, setPermissionState] = useState('checking');

    useEffect(() => {
        initializeNotifications();
    }, []);

    const initializeNotifications = async () => {
        try {
            // First check permission
            const permission = await checkPermission();
            setPermissionState(permission);
            console.log('Notification permission:', permission);

            if (permission === 'granted') {
                // Get FCM token
                const fcmToken = await requestForToken();
                console.log('FCM Token received:', fcmToken);

                if (fcmToken) {
                    setToken(fcmToken);
                    // Save token to server
                    try {
                        await saveFCMTokenToServer(fcmToken);
                        console.log('Token saved to server successfully');
                    } catch (error) {
                        console.error('Error saving token to server:', error);
                    }
                }
            }
        } catch (error) {
            console.error('Error initializing notifications:', error);
            setStatus('Error initializing notifications: ' + error.message);
        }
    };

    const sendNotification = async (e) => {
        e.preventDefault(); // Prevent form submission

        if (!token) {
            setStatus('Error: No FCM token available');
            return;
        }

        if (!title || !message) {
            setStatus('Error: Please fill in both title and message');
            return;
        }

        setStatus('Sending...');

        try {
            const response = await sendNotifications({
                title,
                body: message,
                tokens: [token]  // Make sure token is sent as array
            });

            if (response.data.success) {
                setStatus('Notification sent successfully!');
                // Clear form
                setTitle('');
                setMessage('');
            } else {
                setStatus('Failed to send notification');
            }
        } catch (error) {
            console.error('Error sending notification:', error);
            setStatus('Error: ' + (error.message || 'Failed to send notification'));
        }
    };

    if (permissionState === 'denied') {
        return <PermissionGuide />;
    }

    return (
        <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-4">Test Notifications</h2>

            {/* Token Display */}
            <div className="mb-4">
                <h3 className="font-semibold">Your FCM Token:</h3>
                <div className="relative">
                    <textarea
                        readOnly
                        value={token}
                        className="w-full p-2 border rounded mt-1 text-sm bg-gray-50"
                        rows="3"
                    />
                    {token && (
                        <button
                            onClick={() => {
                                navigator.clipboard.writeText(token);
                                setStatus('Token copied to clipboard!');
                            }}
                            className="absolute right-2 top-2 text-sm text-blue-500 hover:text-blue-700"
                        >
                            Copy
                        </button>
                    )}
                </div>
            </div>

            {/* Notification Form */}
            <form onSubmit={sendNotification} className="space-y-4">
                <div>
                    <label className="block mb-2">Notification Title:</label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full p-2 border rounded"
                        required
                        placeholder="Enter notification title"
                    />
                </div>

                <div>
                    <label className="block mb-2">Message:</label>
                    <textarea
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        className="w-full p-2 border rounded"
                        rows="3"
                        required
                        placeholder="Enter notification message"
                    />
                </div>

                <button
                    type="submit"
                    className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 disabled:bg-blue-300"
                    disabled={!token || permissionState !== 'granted'}
                >
                    Send Notification
                </button>
            </form>

            {/* Status Display */}
            {status && (
                <div
                    className={`mt-4 p-3 rounded ${
                        status.includes('Error') || status.includes('Failed')
                            ? 'bg-red-100 text-red-700'
                            : 'bg-green-100 text-green-700'
                    }`}
                >
                    {status}
                </div>
            )}

            {/* Permission Status */}
            {permissionState !== 'granted' && permissionState !== 'denied' && (
                <div className="mt-4 p-3 rounded bg-yellow-100 text-yellow-700">
                    Notification permission status: {permissionState}
                </div>
            )}
        </div>
    );
};

export default TestNotification;