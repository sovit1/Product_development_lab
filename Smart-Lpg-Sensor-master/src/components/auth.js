import { auth, googleProvider } from "../config/firebase-config";
import { useState } from "react";
import { createUserWithEmailAndPassword, signInWithPopup , signOut } from "firebase/auth";
import "./auth.css"


export const Auth = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const signIn = async () => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
    } catch (error) {
      console.error("Error signing in:", error.message);
    }
  };
  const signInWithGoogle = async () => {
    try {
     
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error("Error signing in with Google:", error.message);
    }
  };
  const LogOut = async () => {
    try {
      await signOut(auth);
      console.log("loggedout");
    } catch (error) {
      console.error("Error signing out:", error.message);
    }
  };

  return (
    <div className="SignUpPage">
     <div className="emailInput"> 
       <input className="email"
              placeholder="email.."
              onChange={(e) => setEmail(e.target.value)}  
       />
     </div> 
     <div className="passwordInput">
         <input className="password"
                placeholder="password.."
                onChange={(e) => setPassword(e.target.value)}  
                type="password"
        />
     </div> 
     <div className="buttons">
       <div className="signIn"><button className="btn1" onClick={signIn}>Sign In</button></div>   
       <div className="signInwg"><button className="btn2" onClick={signInWithGoogle}>Sign in with Google</button></div> 
       <div className="logOut"><button className="btn3" onClick={LogOut}>Log Out</button></div> 
     </div>  
   
    </div>
  );
};
//for info of current user console.log(auth?.currentUser?.email)