import React from "react";
import '../Styles/Auth.css'

import { auth, provider } from "../Firebase-config";
import { signInWithPopup } from "firebase/auth";

import Cookies from "universal-cookie";
const cookies = new Cookies();

const Auth = (props) => {
  const signInWithGoogle = async () => {
    try{
    const result = await signInWithPopup(auth, provider);
    cookies.set("auth-token", result.user.refreshToken);
    props.setIsAuth(true). // we are doing this so that after user is authenticated they are shown the chat room .
    console.log("result is ", result);

    }
    catch(err){
        console.log(err)
    }
  };

  return (
    <div className="auth">
      <p>Sign In With Google To Continue</p>
      <button onClick={signInWithGoogle}>Sign In With Google</button>
    </div>
  );
};

export default Auth;
