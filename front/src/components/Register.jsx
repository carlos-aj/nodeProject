import { useState } from "react";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { useNavigate } from "react-router-dom"; 
import { auth } from "../firebase"; 
import styles from "../CSS/Register.module.css";
import avatar2 from "../assets/avatar2.png";
import avatar3 from "../assets/avatar3.png";
import avatar4 from "../assets/avatar4.png";
import avatar5 from "../assets/avatar5.png";

function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passError, setPassError] = useState("");
  const [confirmPassError, setConfirmPassError] = useState("");
  const [selectedAvatar, setSelectedAvatar] = useState(null);
  const [avatarError, setAvatarError] = useState(""); 
  const [username, setUsername] = useState(""); 
  const navigate = useNavigate();

  const handleRegister = async (event) => {
    event.preventDefault();
    setEmailError("");
    setPassError("");
    setConfirmPassError("");
    setAvatarError("");
  
    if (!email) {
      setEmailError("Email is required");
      return;
    }
    if (!password) {
      setPassError("Password is required");
      return;
    }
    if (password !== confirmPassword) {
      setConfirmPassError("Passwords do not match");
      return;
    }
    if (!selectedAvatar) {
      setAvatarError("Avatar is required");
      return;
    }
  
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      console.log("Usuario registrado:", user);
  
      await updateProfile(user, {
        displayName: username,
        photoURL: selectedAvatar
      });
  
      console.log("Perfil actualizado");
      navigate("/Chats");
    } catch (error) {
      console.error("Error en el registro:", error);
      switch (error.code) {
        case "auth/invalid-email":
          setEmailError("The email does not have a valid format");
          break;
        case "auth/email-already-in-use":
          setEmailError("The email is already registered");
          break;
        case "auth/weak-password":
          setPassError("The password is too weak. It must be at least 6 characters long");
          break;
        default:
          break;
      }
    }
  };

  const back = () => {
    navigate("/Login");
  };

  return (
    <>
      <div className={styles.container}>
        <form onSubmit={handleRegister}>
          <label>User Name</label>
          <input id="user" type="text" placeholder="User Name..." value={username} onChange={(e) => setUsername(e.target.value)} />

          <label htmlFor="email">Email</label>
          <input id="email" type="email" placeholder="Email..." value={email} onChange={(e) => setEmail(e.target.value)} />
          <p className={styles.error}>{emailError}</p>

          <label htmlFor="password">Password</label>
          <input id="password" type="password" placeholder="Password..." value={password} onChange={(e) => setPassword(e.target.value)} />
          <p className={styles.error}>{passError}</p>

          <label htmlFor="confirm-password">Confirm Password</label>
          <input id="confirm-password" type="password" placeholder="Confirm Password..." value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
          <p className={styles.error}>{confirmPassError}</p>

          <label htmlFor="avatar">Avatar</label>
          <div className={styles.avatarOptions}>
            <img src={avatar2} alt="Avatar 2" onClick={() => setSelectedAvatar(avatar2)} className={selectedAvatar === avatar2 ? styles.selected : ""} />
            <img src={avatar3} alt="Avatar 3" onClick={() => setSelectedAvatar(avatar3)} className={selectedAvatar === avatar3 ? styles.selected : ""} />
            <img src={avatar4} alt="Avatar 4" onClick={() => setSelectedAvatar(avatar4)} className={selectedAvatar === avatar4 ? styles.selected : ""} />
            <img src={avatar5} alt="Avatar 5" onClick={() => setSelectedAvatar(avatar5)} className={selectedAvatar === avatar5 ? styles.selected : ""} />
          </div>
          <p className={styles.error}>{avatarError}</p>
          <button className={styles.log} type="submit">Sign up</button>
        </form>
        <div className={styles.back} onClick={back}><i className="fa-solid fa-angle-left"></i> Back</div>
      </div>
    </>
  );
}

export default Register;
