import { useState } from "react";
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, GithubAuthProvider, updateProfile } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import styles from "../CSS/Login.module.css";
import avatar2 from "../assets/avatar2.png";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passError, setPassError] = useState("");
  const navigate = useNavigate();

  const handleLogin = (event) => {
    event.preventDefault();
    setEmailError("");
    setPassError("");

    signInWithEmailAndPassword(auth, email, password)
      .then(() => {
        navigate("/Chats");
      })
      .catch((error) => {
        switch (error.code) {
          case "auth/wrong-password":
            setPassError("Incorrect password");
            break;
          case "auth/user-not-found":
            setEmailError("No user found with this email");
            break;
          default:
            console.error("Error en el inicio de sesión:", error);
            break;
        }
      });
  };

  const handleGoogleLogin = () => {
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider)
      .then((result) => {
        const user = result.user;
        updateProfile(user, { photoURL: avatar2 }); 
        navigate("/Chats");
      })
      .catch((error) => {
        console.error("Error en el inicio de sesión con Google:", error);
      });
  };

  const handleGithubLogin = () => {
    const provider = new GithubAuthProvider();
    signInWithPopup(auth, provider)
      .then((result) => {
        const user = result.user;
        updateProfile(user, { photoURL: avatar2 }); 
        navigate("/Chats");
      })
      .catch((error) => {
        console.error("Error en el inicio de sesión con GitHub:", error);
      });
  };

  const goRegister = () => {
    navigate("/Register");
  };

  const back = () => {
    navigate("/");
  };

  return (
    <>
      <div className={styles.container}>
        <form onSubmit={handleLogin}>
          <label htmlFor="email">Email</label>
          <input id="email" type="email" placeholder="Email..." value={email} onChange={(e) => setEmail(e.target.value)} />
          <p className={styles.error}>{emailError}</p>
          
          <label htmlFor="password">Password</label>
          <input id="password" type="password" placeholder="Password..." value={password} onChange={(e) => setPassword(e.target.value)} />
          <p className={styles.error}>{passError}</p>
          
          <button className={styles.log} type="submit">Login</button>
          <p className={styles.regP}>If you haven't registered yet, don't hesitate to join us</p>
          <button className={styles.log} type="button" onClick={goRegister}>Sign up</button>
        </form>

        <div className={styles.back} onClick={back}><i className="fa-solid fa-angle-left"></i> Back</div>

        <div className={styles.social} onClick={handleGoogleLogin}>
          <i className="fa-brands fa-google"></i> Login With Google
        </div>

        <div className={styles.social} onClick={handleGithubLogin}>
          <i className="fa-brands fa-github"></i> Login With Github
        </div>
      </div>
    </>
  );
}

export default Login;
