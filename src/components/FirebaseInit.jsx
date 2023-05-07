import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAz8DlW8Twd7WkcnHOGyviNo41EHeVpuKA",
  authDomain: "police-complaint-registr-7435e.firebaseapp.com",
  projectId: "police-complaint-registr-7435e",
  storageBucket: "police-complaint-registr-7435e.appspot.com",
  messagingSenderId: "663762393527",
  appId: "1:663762393527:web:48341fe5c824236e9d3032"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;