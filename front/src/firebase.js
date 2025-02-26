import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyCz5MyzGQgVSaC_zheCrtHKm7zyLldiA4Q",
    authDomain: "nodeproject-18dc7.firebaseapp.com",
    projectId: "nodeproject-18dc7",
    storageBucket: "nodeproject-18dc7.firebasestorage.app",
    messagingSenderId: "527144353156",
    appId: "1:527144353156:web:49416891b44d2437c1b1d1",
    measurementId: "G-4W9V3502ZN"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
