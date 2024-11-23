import { initializeApp } from 'firebase/app';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';

export const firebaseConfig = {
    apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
    authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
    storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.REACT_APP_FIREBASE_APP_ID ,
    measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID
};
const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

const VAPID_KEY = process.env.REACT_APP_FIREBASE_VAPID_KEY;
export const checkPermission = async () => {
    try {
        const permission = await Notification.requestPermission();
        return permission;
    } catch (error) {
        console.error('Error checking permission:', error);
        return 'denied';
    }
};
export const requestForToken = async () => {
    try {
        // Add this to check service worker status
        navigator.serviceWorker.getRegistrations().then(function(registrations) {
            registrations.forEach(function(registration) {
                // console.log('Service Worker:', registration);
            });
        });
        // First check if service worker is registered
        if (!('serviceWorker' in navigator)) {
            throw new Error('Service Worker not supported');
        }

        // Check notification permission
        const permission = await checkPermission();

        if (permission === 'granted') {
            try {
                const currentToken = await getToken(messaging, {
                    vapidKey: VAPID_KEY,
                    serviceWorkerRegistration: await navigator.serviceWorker.getRegistration()
                });
                if (currentToken) {
                    return currentToken;
                } else {
                    throw new Error('No registration token available');
                }
            } catch (tokenError) {
                console.error('Error getting token:', tokenError);
                throw tokenError;
            }
        } else {
            throw new Error('permission-needed');
        }
    } catch (error) {
        console.error('Error in requestForToken:', error);
    }
};

export const onMessageListener = () =>
    new Promise((resolve) => {
        onMessage(messaging, (payload) => {
            resolve(payload);
        });
    });