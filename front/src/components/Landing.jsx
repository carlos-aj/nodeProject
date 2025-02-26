import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase";
import styles from "../CSS/Landing.module.css";

function Landing() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const handleDiscoverClick = () => {
    navigate(user ? "/Chats" : "/Login");
  };

  return (
    <div className={styles.landingContainer}>
      <h1 className={styles.title}>Qué App</h1>
      <button className={styles.discoverButton} onClick={handleDiscoverClick}>
        Start
      </button>
      <div className={styles.infoSection}>
        <div className={styles.infoCard}>
          <h3>App Features</h3>
          <p>Real-time chat, user authentication, profile customization, and more</p>
        </div>
        <div className={styles.infoCard}>
          <h3>Technologies Used</h3>
          <p>React, Firebase, Socket.io, Express, Node.js, and more</p>
        </div>
        <div className={styles.infoCard}>
          <h3>Contact</h3>
          <p>Feel free to reach out to us at queappcontact@gmail.com for any inquiries or support</p>
        </div>
      </div>
    </div>
  );
}

export default Landing;
