import {ACTION_CHANGE_MODE, SCREEN_MODE_INIT, SCREEN_MODE_SIGN_IN, SCREEN_MODE_USER_RANK_DAILY} from "../const";
import {fbAuth, googleAuthProvider} from "../firebase/features";
import {GoogleAuthProvider, signInWithPopup} from "firebase/auth";
import {useContext} from "react";
import {MyContext} from "../hooks/reducer";

import logo from "./../img/image1.svg";
import Box from "@mui/material/Box";
import {makeStyles} from "@mui/styles";
import clsx from "clsx";

const useSigninStyles = makeStyles(() => {
	return {
		container: {
			height: '80rem',
			['@media screen and (max-width:767px)']: {
				height: '60rem'
			}

		},
		loginButton: {
			width: '50%',
			margin: 10,
			maxWidth: 600,
			padding: '10px',
			border: 'none',
			color: 'white',
			borderRadius: '4px'
		},
		buttonColorGoogle: {
			backgroundColor: '#4285F4',
			'&:hover': {
				backgroundColor: '#2f54f5',
			}
		},
		buttonColorKakao: {
			color: "black",
			backgroundColor: '#FEE500',
			'&:hover': {
				backgroundColor: '#b7ac4e',
			}
		},
		buttonColorNaver: {
			backgroundColor: '#03C75A',
			'&:hover': {
				backgroundColor: '#058d41',
			}
		},
		signinTitle: {
			marginTop: 20,
			marginBottom:20,
			color: '#477F8F',
			fontWeight: 'bolder',
			fontFamily: 'Gamja Flower'
		}
	}
});

const loginGoogle = (dispatch) => {
	signInWithPopup(fbAuth, googleAuthProvider)
		.then((result) => {
			// This gives you a Google Access Token. You can use it to access the Google API.
			const credential = GoogleAuthProvider.credentialFromResult(result);
			const token = credential.accessToken;
			// The signed-in user info.
			const user = result.user;
			// ...
			console.log("로그인 완료~!!", user, token);
			dispatch({type: ACTION_CHANGE_MODE, mode: SCREEN_MODE_INIT})
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

const loginKakao = (dispatch) => {

}

const loginNaver = (dispatch) => {

}


const Signin = () => {
	const {state, dispatch} = useContext(MyContext);
	const mode = state.mode;
	const styles = useSigninStyles();
	console.log('signin render()', mode)

	if (mode !== SCREEN_MODE_SIGN_IN) {
		console.log("signin hidden return")
		return (
			<div className="hidden"/>
		)
	}
	console.log("signin general return")
	return (
		<Box paddingTop='10rem' textAlign='center' className={styles.container}>
			<img src={logo} className={styles.signinLogo}/>
			<h1 className={styles.signinTitle}>천권읽기 로그인</h1>
			<div>
				<button className={clsx(styles.loginButton, styles.buttonColorGoogle)} 
						size={"large"}
						variant={"contained"} onClick={
					()=> {
						loginGoogle(dispatch);
					}
				}>구글 계정으로 로그인</button>
			</div>
			<div>
				<button className={clsx(styles.loginButton, styles.buttonColorKakao)}
				        size={"large"}
				        variant={"contained"} onClick={
					()=> {
						loginKakao(dispatch);
					}
				}>카카오 계정으로 로그인</button>
			</div>
			<div>
				<button className={clsx(styles.loginButton, styles.buttonColorNaver)}
				        size={"large"}
				        variant={"contained"} onClick={
					()=> {
						loginNaver(dispatch);
					}
				}>네이버 계정으로 로그인</button>
			</div>
		</Box>
	)
}

export default Signin;