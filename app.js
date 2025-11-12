import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getMessaging, getToken, onMessage, isSupported } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-messaging.js";

const firebaseConfig = {
  apiKey: "AIzaSyBozRq1XyOs_YqEgMU-n0MKMhC0SoQFzoc",
  authDomain: "push-pwa-aae4b.firebaseapp.com",
  projectId: "push-pwa-aae4b",
  storageBucket: "push-pwa-aae4b.firebasestorage.app",
  messagingSenderId: "796936557989",
  appId: "1:796936557989:web:1807ba0af5fb784c8e844c"
};

const app = initializeApp(firebaseConfig);

const $ = (sel) => document.querySelector(sel);
const logEl = $("#log");
const permEl = $("#perm");
const tokenEl = $("#token");
const log = (message) => {
  if (logEl.textContent === "—") {
    logEl.textContent = message;
  } else {
    logEl.textContent += "\n" + message;
  }
};

permEl.textContent = typeof Notification === "undefined" ? "no soportado" : Notification.permission;

let swReg = null;
if ("serviceWorker" in navigator) {
  swReg = await navigator.serviceWorker.register("/firebase-messaging-sw.js");
}

const supported = await isSupported();
let messaging = null;
if (supported) {
  messaging = getMessaging(app);
} else {
  log("Este navegador no soporta FCM en la Web.");
}

const VAPID_KEY = "BIEhigQVnz-oZpPsDhgs-Gq7jAAEWGCkb8J3M5YZE6r6-QZ66_DmwcEWGgsl74-6iunCeqYR6skPuijtfpVGEB4";

async function requestPermissionAndGetToken() {
  if (!messaging || !swReg) {
    log("No se pudo inicializar la mensajería.");
    return;
  }

  try {
    const permission = await Notification.requestPermission();
    permEl.textContent = permission;

    if (permission !== "granted") {
      log("Permiso denegado por el usuario.");
      return;
    }

    const token = await getToken(messaging, {
      vapidKey: VAPID_KEY,
      serviceWorkerRegistration: swReg
    });

    if (token) {
      tokenEl.textContent = token;
      log("Token obtenido. Usa este token en Firebase Console → Cloud Messaging.");
    } else {
      log("No se pudo obtener el token.");
    }
  } catch (err) {
    log("Error al obtener token: " + err.message);
  }
}

if (messaging) {
  onMessage(messaging, (payload) => {
    log("Mensaje en primer plano:\n" + JSON.stringify(payload, null, 2));
  });
}

$("#btn-permission").addEventListener("click", requestPermissionAndGetToken);
