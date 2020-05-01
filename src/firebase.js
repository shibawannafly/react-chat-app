import firebase from '@firebase/app'
import "@firebase/auth"
import "@firebase/database"
import "@firebase/storage"

const firebaseConfig = {
  apiKey: "AIzaSyBZTbalA80sHU_Zrv79ZGfg4XcT8eNCULA",
  authDomain: "slack-chat-app-12.firebaseapp.com",
  databaseURL: "https://slack-chat-app-12.firebaseio.com",
  projectId: "slack-chat-app-12",
  storageBucket: "slack-chat-app-12.appspot.com",
  messagingSenderId: "628192556581",
  appId: "1:628192556581:web:87a1bd1f3408f9dfffb1cc",
  measurementId: "G-3M3MRELJZV"
};

firebase.initializeApp(firebaseConfig)

export default firebase