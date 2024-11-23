import React, { useEffect, useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { requestForToken, onMessageListener } from '../../services/firebase.js';
import {saveFCMTokenToServer} from "../../api/notifications.ts";

const NotificationComponent = () => {
    const [notification, setNotification] = useState({ title: '', body: '' });
    const [token, setToken] = useState('');

    useEffect(() => {
        const initializeNotifications = async () => {
            try {
                const permission = await Notification.requestPermission();
                if (permission === 'granted') {
                    const token = await requestForToken();
                    if (token) {
                        setToken(token);
                        await saveTokenToServer(token);
                        await onMessageListener()
                    }
                }
            } catch (error) {
                console.error('Error initializing notifications:', error);
            }
        };

        initializeNotifications();

        // Set up message listener
        onMessageListener()
            .then(payload => {
                setNotification({
                    title: payload.notification.title,
                    body: payload.notification.body
                });
                toast.info(`${payload.notification.title}: ${payload.notification.body}`);
            })
            .catch(err => console.log('Failed to receive foreground message:', err));
    }, []);

    const saveTokenToServer = async (token) => {
        try {
            const response = await saveFCMTokenToServer(token);

            if (!response.status === 200) {
                throw new Error('Failed to save token');
            }
        } catch (error) {
            console.error('Error saving token:', error);
        }
    };

    return (
        <div>
            <ToastContainer />
            {notification.title && (
                <div className="notification-alert">
                    <h4>{notification.title}</h4>
                    <p>{notification.body}</p>
                </div>
            )}
        </div>
    );
};

export default NotificationComponent;