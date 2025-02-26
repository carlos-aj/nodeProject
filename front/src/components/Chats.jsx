import { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";
import { useNavigate } from "react-router-dom";
import { onAuthStateChanged, signOut } from "firebase/auth"; 
import { auth } from "../firebase"; 
import styles from "../CSS/Chats.module.css";

const socket = io(
    process.env.NODE_ENV === "production" ? "https://nodeprojectqueapp.onrender.com" : "http://localhost:3000"
  );
const Chats = () => {
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState("");
    const [isLoggedIn, setIsLoggedIn] = useState(true); 
    const [user, setUser] = useState(null); 
    const [users, setUsers] = useState([]); 
    const [typingUsers, setTypingUsers] = useState([]); 
    const typingTimeoutRef = useRef(null); 
    const navigate = useNavigate();

    useEffect(() => {
        socket.on("message", (data) => {
            setMessages((prev) => [...prev, data]);
        });

        socket.on("users", (data) => {
            setUsers(data);
        });

        socket.on("user-connected", (data) => {
            setMessages((prev) => [...prev, { text: `${data.user} se ha conectado`, user: "", avatar: "" }]);
        });

        socket.on("user-disconnected", (data) => {
            setMessages((prev) => [...prev, { text: `${data.user} se ha desconectado`, user: "", avatar: "" }]);
        });

        socket.on("typing", (data) => {
            setTypingUsers((prev) => {
                if (!prev.includes(data.user)) {
                    return [...prev, data.user];
                }
                return prev;
            });
        });

        socket.on("stop-typing", (data) => {
            setTypingUsers((prev) => prev.filter(user => user !== data.user));
        });

        return () => {
            socket.off("message"); 
            socket.off("users");
            socket.off("user-connected"); 
            socket.off("user-disconnected");
            socket.off("typing"); 
            socket.off("stop-typing"); 
        };
    }, []);

    const sendMessage = () => {
        if (message.trim() && user) {
            const messageData = { text: message, user: user.displayName || "Anonymous", avatar: user.photoURL };
            socket.emit("message", messageData);
            setMessage("");
            socket.emit("stop-typing", { user: user.displayName });
        }
    };

    const handleTyping = () => {
        if (user) {
            socket.emit("typing", { user: user.displayName });
            if (typingTimeoutRef.current) {
                clearTimeout(typingTimeoutRef.current);
            }
            typingTimeoutRef.current = setTimeout(() => {
                socket.emit("stop-typing", { user: user.displayName });
            }, 4000);
        }
    };

    useEffect(() => { 
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setIsLoggedIn(!!currentUser);
            setUser(currentUser); 
            if (currentUser) {
                socket.emit("join", { user: currentUser.displayName, avatar: currentUser.photoURL });
            }
        });

        return () => unsubscribe(); 
    }, []);

    useEffect(() => {
        if (user) {
            const updatedMessages = messages.map(msg => 
                msg.user === user.displayName ? { ...msg, user: user.displayName, avatar: user.photoURL } : msg
            );
            setMessages(updatedMessages);
            socket.emit("update-user", { user: user.displayName, avatar: user.photoURL });
            setUsers((prevUsers) =>
                prevUsers.map((u) =>
                    u.user === user.displayName ? { ...u, avatar: user.photoURL } : u
                )
            );
        }
    }, [user]);

    const handleLogout = () => {
        signOut(auth)
            .then(() => {
                console.log("Sesión cerrada");
                setIsLoggedIn(false);
                navigate("/"); 
            })
            .catch((error) => console.error("Error al cerrar sesión", error));
    };

    const goToUserPage = () => {
        navigate("/User");
    };

    return (
        <div className={styles.container}>
            <div className={styles.leftPanel}>
                <h2>Connected Users</h2>
                <ul>
                    {users.map((u, i) => (
                        <li key={i}>
                            <img src={u.avatar} alt="avatar" />
                            {u.user} {typingUsers.includes(u.user) && "is typing..."}
                        </li>
                    ))}
                </ul>
            </div>
            <div className={styles.centralPanel}>
                {isLoggedIn && <button onClick={handleLogout}>Logout</button>}
                <button onClick={goToUserPage}>User Profile</button>
                <h1>Chat</h1>
                <div className={styles.messages}>
                    {messages.map((msg, i) => (
                        <div key={i} className={`${styles.message} ${msg.user === user.displayName ? styles.sent : styles.received}`}>
                            {msg.avatar && <img src={msg.avatar} alt="avatar" />}
                            <strong>{msg.user && `${msg.user}:`}</strong> {msg.text}
                        </div>
                    ))}
                </div>
                <div className={styles.inputContainer}>
                    <input type="text" className={styles.messageInput} value={message} onChange={(e) => setMessage(e.target.value)} onKeyPress={handleTyping}/>
                    <button className={styles.sendButton} onClick={sendMessage}>
                        <i className="fa-solid fa-circle-arrow-right"></i>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Chats;
