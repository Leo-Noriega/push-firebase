importScripts("https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.12.2/firebase-messaging-compat.js");

firebase.initializeApp({
  apiKey: "AIzaSyBozRq1XyOs_YqEgMU-n0MKMhC0SoQFzoc",
  authDomain: "push-pwa-aae4b.firebaseapp.com",
  projectId: "push-pwa-aae4b",
  storageBucket: "push-pwa-aae4b.firebasestorage.app",
  messagingSenderId: "796936557989",
  appId: "1:796936557989:web:1807ba0af5fb784c8e844c"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  const title = payload.notification?.title || "Notificación";
  const options = {
    body: payload.notification?.body || "",
    icon: "/icon-192.png"
  };
  self.registration.showNotification(title, options);
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  event.waitUntil(clients.openWindow("/"));
});
