// https://chat.openai.com/c/a4aaa32f-acbb-40b4-9198-3ff37ab32203
//https://www.youtube.com/watch?v=0gLr-pBIPhI&list=PLpPqplz6dKxUfvM22GXRvYA4s-mvJE0XF&index=6&pp=iAQB
//https://www.youtube.com/watch?v=jCY6DH8F4oc&list=PLpPqplz6dKxUfvM22GXRvYA4s-mvJE0XF


import { useRef, useState } from "react";
import "./App.css";
import Auth from "./components/Auth";
import image from './image/happy-people-talking-speech-bubbles-head_316839-2247.avif'
import Cookies from "universal-cookie";
import Chat from "./components/Chat";
import { signOut } from "firebase/auth";
import { auth } from "./Firebase-config";
const cookies = new Cookies();

function App() {
  const [isAuth, setIsAuth] = useState(cookies.get("auth-token")); // if cookie is present it will be true or else will be false
  const [room, setRoom] = useState(""); // initially empty
  const roomInputRef = useRef('');


  const signUserOut = async () => {
    await signOut(auth)
    cookies.remove('auth-token')
    setIsAuth(false)
    setRoom('')
  }
  const clickHandler = () => {
    setRoom(roomInputRef.current.value);
    console.log("hello",room)// asynchronous behaviour
  };

  if (!isAuth) {
    return (
      <div className="App">
        <div className="welcome-container">
          <p><b>Welcome</b></p>
          <p><b>Connect, Chat, Create Memories.</b></p>
          <Auth setIsAuth={setIsAuth} />
        </div>
        <div className="auth-container">
          <h1>Sign in with your Gmail account and enter your room name for a seamless experience.</h1>
          <img src={image} alt="Happy People" />
          
        </div>
      </div>
    );
  }
  return (
    // room is not empty then show chat else show chat name input box.
    <>
    <div className="Chat">
      {room ? (
        <Chat room={room} />
      ) : (
        <div>
          <label className="Label">EnterRoomName</label>
          <input className="input"  placeholder="enter the chat room" ref={roomInputRef}></input>
          <button className="button" onClick={clickHandler}>enter chat</button>
        </div>
      )}
      </div>
      <button className="signOut" onClick={signUserOut}>Signout</button>
    </>
  );
}

export default App;
