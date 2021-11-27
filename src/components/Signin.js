import {ACTION_CHANGE_MODE, SCREEN_MODE_SIGN_IN, SCREEN_MODE_USER_RANK_DAILY} from "../const";
import {fbAuth, googleAuthProvider} from "../firebase/features";
import {GoogleAuthProvider, signInWithPopup} from "firebase/auth";
import {useContext} from "react";
import {MyContext} from "../hooks/reducer";
import {Button} from "@mui/material";


const login = (dispatch) => {
	signInWithPopup(fbAuth, googleAuthProvider)
		.then((result) => {
			// This gives you a Google Access Token. You can use it to access the Google API.
			const credential = GoogleAuthProvider.credentialFromResult(result);
			const token = credential.accessToken;
			// The signed-in user info.
			const user = result.user;
			// ...
			console.log("로그인 완료~!!", user, token);
			dispatch({type: ACTION_CHANGE_MODE, mode: SCREEN_MODE_USER_RANK_DAILY})
		}).catch((error) => {
		// Handle Errors here.
		const errorCode = error.code;
		const errorMessage = error.message;
		// The email of the user's account used.
		const email = error.email;
		// The AuthCredential type that was used.
		const credential = GoogleAuthProvider.credentialFromError(error);
		console.log('error=>', errorCode, errorMessage, email, credential);
		console.log("로그인 실패~!!");
	});
}


const Signin = () => {
	// const [state, dispatch] = useReducer(stateReducer, initValues, undefined);
	const {state, dispatch} = useContext(MyContext);
	console.log('Signin state=>', state);

	const mode = state.mode;

	console.log('signin render()', mode)
	if (mode !== SCREEN_MODE_SIGN_IN) {
		console.log("signin hidden return")
		return (
			<div className="hidden"/>
		)
	}
	console.log("signin general return")
	return (
		<div>
			<h1>Sign in screen</h1>
			<Button onClick={
				()=> {
					login(dispatch);
				}
			}>Google 로 로그인</Button>
		</div>
	)
}

export default Signin;