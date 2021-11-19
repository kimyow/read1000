import './App.css';

import {initializeApp} from "firebase/app";
import {getAnalytics} from "firebase/analytics";
import {collection, getDocs, getFirestore, limit, orderBy, query, where} from "firebase/firestore";
import {getAuth, GoogleAuthProvider, onAuthStateChanged, signInWithPopup} from "firebase/auth";
import UserImageList from "./components/UserImageList";
import {Component} from "react";

const firebaseConfig = {
  apiKey: "AIzaSyCGerFrxYZ2_MfRCURUdsqMuD2-9V-B7g4",
  authDomain: "readbooks-164200.firebaseapp.com",
  databaseURL: "https://readbooks-164200.firebaseio.com",
  projectId: "readbooks-164200",
  storageBucket: "readbooks-164200.appspot.com",
  messagingSenderId: "451518411017",
  appId: "1:451518411017:web:cced9b89a6030da16963d8",
  measurementId: "G-8WQD7EGSVQ"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

console.log("currentUser=", auth.currentUser)

if (auth.currentUser === null) {
  signInWithPopup(auth, provider)
    .then((result) => {
      // This gives you a Google Access Token. You can use it to access the Google API.
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const token = credential.accessToken;
      // The signed-in user info.
      const user = result.user;
      // ...
    }).catch((error) => {
    // Handle Errors here.
    const errorCode = error.code;
    const errorMessage = error.message;
    // The email of the user's account used.
    const email = error.email;
    // The AuthCredential type that was used.
    const credential = GoogleAuthProvider.credentialFromError(error);
    // ...
  });
}

onAuthStateChanged(auth, (user) => {
  if (user) {
    const uid = user.uid;
    console.log('uid=', uid, user.email);
  } else {
    console.log('signed out')
  }
});


async function queryCallAsync() {
  const q = query(collection(db, "UserRank/Rank_Day_2021_11_19/Rank_Day_2021_11_19"), where("read", ">", 0), orderBy("read", "desc"), limit(10));
  return await getDocs(q)
}

class App extends Component {
  state = {
    userRankData: null
  }
  userImage = <div/>

  componentDidMount() {
    queryCallAsync().then(r => {
      const userRanks = [];
      r.forEach((doc) => {
        const data = doc.data();
        userRanks.push(data);
      });
      this.userImage = <UserImageList data={userRanks}/>
      this.setState({userRankData: userRanks});
    })
  }

  render() {
    console.log("app render")
    return (
        <div className="App">
          {this.userImage}
        </div>
    );
  }
}

export default App;
