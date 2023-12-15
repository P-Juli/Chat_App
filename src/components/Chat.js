import React, { useEffect, useState } from "react";
import "../Styles/Chat.css";

import {
  addDoc,
  collection,
  serverTimestamp,
  onSnapshot,
  where,
  query,
  orderBy,
} from "firebase/firestore";
import { auth, db } from "../Firebase-config";

const Chat = (props) => {
  // props is the room we are getting from the app, which is what the user typed in.
  const [newMessage, setNewMessage] = useState("");
  const [message, setMessage] = useState([]);
  const messagesRef = collection(db, "messages"); // this is not useRef. 'messages' is the name of the collection in firestore database.

  // i need to understand this properly first.
  useEffect(() => {
    const queryMessages = query(
      messagesRef,
      where("room", "==", props.room),
      orderBy("createdAt")
    );
    /*
        query is a Firestore function that creates a query based on the provided parameters.
messagesRef is presumably a reference to a Firestore collection.
where('room', '==', props.room) specifies a condition: only documents where the 'room' field is equal to props.room will be included.
orderBy('createdAt') arranges the documents in ascending order based on the 'createdAt' field.
        */
    const unSubscribee = onSnapshot(queryMessages, (snapshot) => {
      /*
      onSnapshot is a Firestore function that sets up a real-time listener for changes to the specified query.
The first parameter, queryMessages, is the query we created earlier.
The second parameter is a callback function that will be executed when there are changes to the data.
      */
      //this is a callback function 
      let messages = [];
      snapshot.forEach((doc) => {
        messages.push({ ...doc.data(), id: doc.id });
        setMessage(messages);
      });
    });
/*
doc is a reference to an individual document in the Firestore collection. Each document contains data stored in the form of key-value pairs.
, doc represents each individual document in the Firestore collection
...doc.data(): This extracts the data stored in the document using the data() method. The spread operator (...) is used to create a shallow copy of the document data.
In Firestore, the .data() method is used to retrieve the data stored in a Firestore document. It is a method provided by the Firestore DocumentSnapshot object.
*/



    return () => unSubscribee();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (newMessage.trim().length === 0) {
      return;
    }
    await addDoc(messagesRef, {
      // we are sending this object as the data to the firestore database
      text: newMessage,
      createdAt: serverTimestamp(),
      user: auth.currentUser.displayName,
      room: props.room,
    });
    setNewMessage(""); // after sending empty the message.
    console.log("data inside the db is ...", db);
  };
  const inputHandler = (event) => {
    setNewMessage(event.target.value);
    console.log(newMessage);
    console.log("messagesRef is ...", messagesRef);
  };

  return (
    <>
      <h1> talk to people @ {props.room}</h1>
      <ul>
        {message.map((texts) => {
          return (
            <li key={texts.id}>
              <h2>{texts.text}</h2> <h5>-{texts.user}</h5>
            </li>
          );
        })}
      </ul>
      <div>
        <form onSubmit={handleSubmit}>
          <label>type your message here</label>
          <input placeholder="..." onChange={inputHandler} value={newMessage} />
          <button type="submit">send.</button>
        </form>
      </div>
    </>
  );
};

export default Chat;

/*
The document (doc) is 0VD2CZnGgzYn2apV9cVM, which is a specific document in your Firestore collection.
the doc.id is 0VD2CZnGgzYn2apV9cVM
doc.data() retrieves the data stored within that document, and in your example, it includes several fields with associated values:

createdAt: A timestamp indicating when the document was created.
room: A string representing the room.
text: A string representing the message text.
user: An object with a name field (the actual name is not provided in your example).
So, when you use doc.data(), you get an object representing the data stored in that specific Firestore document (0VD2CZnGgzYn2apV9cVM). Each field in the document corresponds to a key-value pair in this object.

now the (snapshot) => {} function is eventually executed this means it also returns the unsubscribe function or whatever it is called and is assigned to unSubscribee.  right. this means firebase stops sending the dat
ChatGPT
Yes, you've got it right! Let me clarify the sequence of events:

Setting Up the Listener:

javascript
Copy code
const unSubscribee = onSnapshot(queryMessages, (snapshot) => {
    // Callback function to handle data updates
    let messages = [];
    snapshot.forEach((doc) => {
        messages.push({ ...doc.data(), id: doc.id });
        setMessage(messages);
    });
});
The onSnapshot function is called to set up a real-time listener.
The second argument is a callback function (snapshot) => { ... } provided to handle data updates when changes occur.
Execution of the Callback Function:

The callback function is not executed immediately during the setup of the listener. It is designed to be executed asynchronously when there are changes in the Firestore data that match the specified query.
Asynchronous Update of State:

When the callback function is eventually executed (after the initial setup), it processes the updated data from Firestore.
The messages are updated using setMessage(messages), triggering a re-render of your React component.
Returned Cleanup Function:

The onSnapshot function returns a cleanup function (sometimes referred to as the unsubscribe function).
This cleanup function is automatically generated by Firebase and is assigned to unSubscribee.
Unsubscribing:

When you call unSubscribee(), it effectively unsubscribes from the real-time listener.
Firebase stops sending updates to the callback function, preventing further execution of the logic inside the callback.
So, in summary, the cleanup function returned by onSnapshot (assigned to unSubscribee) is responsible for unsubscribing from the real-time listener, and calling unSubscribee() triggers this action.

Yes, that's correct! Let's break it down:

Setting Up the Listener:

javascript
Copy code
const unSubscribee = onSnapshot(queryMessages, (snapshot) => {
    // Callback function to handle data updates
    let messages = [];
    snapshot.forEach((doc) => {
        messages.push({ ...doc.data(), id: doc.id });
        setMessage(messages);
    });
});
The onSnapshot function sets up a real-time listener.
The second argument is a callback function (snapshot) => { ... } that is provided to handle data updates when changes occur.
Returned Cleanup Function:

The onSnapshot function returns a cleanup function (sometimes referred to as the unsubscribe function).
This cleanup function is assigned to the variable unSubscribee.
Cleanup Function in useEffect:

javascript
Copy code
useEffect(() => {
    // ... (setup code)
    return () => unSubscribee();
}, []);
The cleanup function is returned from the useEffect.
When the component is unmounted, this cleanup function is executed.
Unsubscribing:

Inside the cleanup function, unSubscribee() is called.
This effectively unsubscribes from the real-time listener set up by onSnapshot.
Firebase stops sending updates to the callback function defined by (snapshot) => { ... }, preventing further execution of the logic inside the callback.
So, when the component is unmounted, the cleanup function is executed, which, in turn, calls the unsubscribe function provided by onSnapshot, stopping the real-time updates from Firestore to the callback function.






*/