// firebase.js
import { initializeApp } from 'firebase/app';
import { getMessaging, getToken, onMessage, isSupported } from 'firebase/messaging';

const firebaseConfig = {
    apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
    authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
    storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.REACT_APP_FIREBASE_APP_ID,
    measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase app
const app = initializeApp(firebaseConfig);

// Initialize messaging if supported
let messagingInstance = null;

export const initializeMessaging = async () => {
    try {
        const isSupportedBrowser = await isSupported();
        if (isSupportedBrowser) {
            messagingInstance = getMessaging(app);
            return messagingInstance;
        }
        throw new Error('Firebase messaging is not supported in this browser');
    } catch (error) {
        console.error('Error initializing messaging:', error);
        return null;
    }
};

// Check notification permission
export const checkPermission = async () => {
    try {
        if (!('Notification' in window)) {
            throw new Error('Notifications not supported');
        }

        // Request permission if not granted
        if (Notification.permission !== 'granted') {
            const permission = await Notification.requestPermission();
            return permission;
        }

        return Notification.permission;
    } catch (error) {
        console.error('Error checking permission:', error);
        return 'denied';
    }
};

// Get FCM token
export const requestForToken = async () => {
    try {
        // Check if messaging is initialized
        if (!messagingInstance) {
            await initializeMessaging();
        }

        // Verify service worker registration
        if (!('serviceWorker' in navigator)) {
            throw new Error('Service Worker not supported');
        }

        const permission = await checkPermission();
        if (permission !== 'granted') {
            throw new Error('Notification permission not granted');
        }

        // Get service worker registration
        const registration = await navigator.serviceWorker.getRegistration();
        if (!registration) {
            throw new Error('Service Worker not registered');
        }

        // Get FCM token
        const currentToken = await getToken(messagingInstance, {
            vapidKey: process.env.REACT_APP_FIREBASE_VAPID_KEY,
            serviceWorkerRegistration: registration
        });

        if (!currentToken) {
            throw new Error('No FCM token available');
        }

        return currentToken;
    } catch (error) {
        console.error('Error requesting FCM token:', error);
        throw error;
    }
};

// Setup message listener for foreground messages
export const setupMessageListener = (callback) => {
    try {
        if (!messagingInstance) {
            throw new Error('Messaging not initialized');
        }

        return onMessage(messagingInstance, (payload) => {
            console.log('Received foreground message:', payload);
            if (callback && typeof callback === 'function') {
                callback(payload);
            }
        });
    } catch (error) {
        console.error('Error setting up message listener:', error);
        return null;
    }
};

// Initialize Firebase messaging and request permission
export const initializeFirebaseMessaging = async () => {
    try {
        // Initialize messaging
        await initializeMessaging();

        // Register service worker
        if ('serviceWorker' in navigator) {
            const registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js');
            console.log('Service Worker registered with scope:', registration.scope);
        }

        // Check permission and request token
        const permission = await checkPermission();
        if (permission === 'granted') {
            const token = await requestForToken();
            return { success: true, token };
        }

        return { success: false, error: 'Permission not granted' };
    } catch (error) {
        console.error('Error initializing Firebase messaging:', error);
        return { success: false, error: error.message };
    }
};

export { messagingInstance as messaging };