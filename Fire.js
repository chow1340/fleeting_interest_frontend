import firebase from 'firebase'; // 4.8.1

class Fire {
  constructor() {
    this.init();
    this.observeAuth();
  }
  

  init = () => {
    if (!firebase.apps.length) {
      firebase.initializeApp({  
        apiKey: "AIzaSyCoPSR_eORDRBvjdcbBhA7U7J4XSMvzZSw",
        authDomain: "fir-backend-1-9c33e.firebaseapp.com",
        databaseURL: "https://fir-backend-1-9c33e.firebaseio.com",
        projectId: "fir-backend-1-9c33e",
        storageBucket: "fir-backend-1-9c33e.appspot.com",
        messagingSenderId: "861166145757",
      });
    }
  }
    

  observeAuth = () =>
    firebase.auth().onAuthStateChanged(this.onAuthStateChanged);

  onAuthStateChanged = user => {
    if (!user) {
      try {
        firebase.auth().signInAnonymously();
      } catch ({ message }) {
        alert(message);
      }
    }
  };

  get uid() {
    return (firebase.auth().currentUser || {}).uid;
  }

  get ref() {
    return firebase.database().ref('messages');
  }

  parse = snapshot => {
   
    const { timestamp: numberStamp, text, user } = snapshot.val();

    const { key: _id } = snapshot;
    const createdAt = new Date(numberStamp);
    const message = {
      _id,
      createdAt,
      text,
      user,
    };
    return message;
  };



  on = (callback, chatId) => {
    firebase.database().ref('messages' + chatId)
      .limitToLast(15)
      .orderByChild("timestamp")
      .on('child_added', snapshot => {
        callback(this.parse(snapshot));
      });
  }

  fetchMoreMessages = (callback, chatId, key) => {
    firebase.database().ref('messages' + chatId)
      .limitToLast(15)
      .endAt(key)
      .orderByKey()
      .on('child_added', snapshot => 
        callback(this.parse(snapshot))
      );
  }

  fetchInitialLastMessage = (callback, chatId) => {
    firebase.database().ref('messages' + chatId)
      .limitToLast(1)
      .once('child_added', snapshot => callback(this.parse(snapshot)))
  }

  fetchLastMessage = (callback, chatId) => {
    firebase.database().ref('messages' + chatId)
      .limitToLast(1)
      .on('child_added', snapshot => callback(this.parse(snapshot)))
  }

  listen = (callback, chatId) => {
    firebase.database().ref('messages' + chatId)
      .limitToLast(1)
      .orderByChild("timestamp")
      .startAt(Date.now().valueOf())
      .on('child_added', snapshot => {
        callback(this.parse(snapshot));
      });
  }


  get timestamp() {
    return firebase.database.ServerValue.TIMESTAMP;
  }
  // send the message to the Backend
  send = (messages, chatId, avatar, key) => {

    for (let i = 0; i < messages.length; i++) {
      const { text, user } = messages[i];
      user.avatar = avatar;
      const message = {
        key,
        text,
        user,
        timestamp: this.timestamp,
      };

      this.append(message, chatId);
    }
  };

  append = (message, chatId) => firebase.database().ref('messages' + chatId).push(message);

  // close the connection to the Backend
  off() {
    firebase.database().ref('messages').off();
  }
}

Fire.shared = new Fire();
export default Fire;
