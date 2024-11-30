importScripts('https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/11.0.2/firebase-messaging.js');

firebase.initializeApp({
    apiKey: "AIzaSyDwqs4ZU0GdiMDFeO4mQFePzcf_FXkpcBs",
    authDomain: "teer-enta-notifications.firebaseapp.com",
    projectId: "teer-enta-notifications",
    storageBucket: "teer-enta-notifications.appspot.com",
    messagingSenderId: "828740425170",
    appId: "1:828740425170:web:909d060c571b441d9d640b",
    measurementId: "G-VD566R2Q90"
});

const messaging = firebase.messaging();

// Handle background messages
messaging.onBackgroundMessage((payload) => {
    console.log('Received background message:', payload);

    const notificationTitle = payload.notification.title;
    const notificationOptions = {
        body: payload.notification.body,
        icon: '/logo192.png',
        badge: '/logo192.png',
        tag: 'notification-1',
        requireInteraction: true,
        actions: [
            { action: 'open', title: 'Open App' }
        ]
    };

    return self.registration.showNotification(notificationTitle, notificationOptions);
});