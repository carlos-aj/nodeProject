import { useState } from "react";
import { updateProfile } from "firebase/auth";
import { auth } from "../firebase";
import avatar2 from "../assets/avatar2.png";
import avatar3 from "../assets/avatar3.png";
import avatar4 from "../assets/avatar4.png";
import avatar5 from "../assets/avatar5.png";
import { useNavigate } from "react-router-dom";
import styles from "../CSS/User.module.css";

function User() {
    const [username, setUsername] = useState(auth.currentUser.displayName || "");
    const [selectedAvatar, setSelectedAvatar] = useState(auth.currentUser.photoURL || null);
    const [avatarError, setAvatarError] = useState(""); 
    const [message, setMessage] = useState("");
    const navigate = useNavigate();

    const handleUpdateProfile = () => {
        const photoURL = selectedAvatar;
        updateProfile(auth.currentUser, {
            displayName: username,
            photoURL: photoURL
        })
        .then(() => {
            setMessage("Profile updated successfully");
            navigate("/Chats");
        })
        .catch((error) => {
            console.error("Error updating profile:", error);
            setMessage("Error updating profile");
        });
    };

    return (
        <div className={styles.container}>
            <h1>User Profile</h1>
            <div>
                <label>Username</label>
                <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
            </div>
            <div>
                <label>Avatar</label>
                <div className={styles.avatarOptions}>
                    <img src={avatar2} alt="Avatar 2" onClick={() => setSelectedAvatar(avatar2)} className={selectedAvatar === avatar2 ? styles.selected : ""} />
                    <img src={avatar3} alt="Avatar 3" onClick={() => setSelectedAvatar(avatar3)} className={selectedAvatar === avatar3 ? styles.selected : ""} />
                    <img src={avatar4} alt="Avatar 4" onClick={() => setSelectedAvatar(avatar4)} className={selectedAvatar === avatar4 ? styles.selected : ""} />
                    <img src={avatar5} alt="Avatar 5" onClick={() => setSelectedAvatar(avatar5)} className={selectedAvatar === avatar5 ? styles.selected : ""} />
                </div>
                <p className={styles.error}>{avatarError}</p>
            </div>
            <button onClick={handleUpdateProfile}>Update Profile</button>
            <p>{message}</p>
        </div>
    );
}

export default User;