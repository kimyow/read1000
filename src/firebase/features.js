import {initializeApp} from "firebase/app";
import {getAnalytics} from "firebase/analytics";
import {getFirestore} from "firebase/firestore";
import {getAuth, GoogleAuthProvider} from "firebase/auth";
import {getStorage} from "firebase/storage";

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

export const firebaseApp = initializeApp(firebaseConfig);
export const fbAnalytics = getAnalytics(firebaseApp);
export const fbDB = getFirestore(firebaseApp);
export const fbAuth = getAuth(firebaseApp);
export const fbStorage = getStorage(firebaseApp)
export const googleAuthProvider = new GoogleAuthProvider();