import React from "react";
import { useDispatch } from "react-redux";

import { Button } from "@material-ui/core";
// import { auth, provider } from "../../firebase";
import { SET_USER } from "../../redux/reducers/authSlice";
import "./Login.css";
import Img from "../../assets/connectify.svg";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";

const Login = () => {
  const dispatch = useDispatch();
  const auth = getAuth();
  const provider = new GoogleAuthProvider();
  const signIn = () => {
    signInWithPopup(auth, provider)
      .then((result) => {
        // This gives you a Google Access Token. You can use it to access the Google API.
        // const credential = GoogleAuthProvider.credentialFromResult(result);
        // const token = credential.accessToken;
        // const user = result.user;
        // console.log(user);
        // The signed-in user info.
        dispatch(
          SET_USER({
            userId: result.user.uid,
            token: result.user.refreshToken,
            userImg: result.user.photoURL,
            userName: result.user.displayName,
            userEmail: result.user.email,
          })
        );
      })
      .catch((error) => {
        console.log(error);
        // Handle Errors here.
        // const errorCode = error.code;
        // const errorMessage = error.message;
        // The email of the user's account used.
        // const email = error.email;
        // The AuthCredential type that was used.
        // const credential = GoogleAuthProvider.credentialFromError(error);
      });

  };

  return (
    <div className="Login">
      <img src={Img} alt="" />
      <h1>Welcome to Chatting Application</h1>
      <Button onClick={signIn}>Sign in with Google</Button>
    </div>
  );
};

export default Login;
