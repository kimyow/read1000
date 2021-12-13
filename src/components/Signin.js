import {ACTION_CHANGE_MODE, SCREEN_MODE_INIT, SCREEN_MODE_SIGN_IN, SCREEN_MODE_USER_RANK_DAILY} from "../const";
import {fbAuth, googleAuthProvider} from "../firebase/features";
import {GoogleAuthProvider, signInWithPopup} from "firebase/auth";
import {useContext} from "react";
import {MyContext} from "../hooks/reducer";
import {Button, Container} from "@mui/material";
import logo from "./../img/image1.svg";
import Box from "@mui/material/Box";
import {makeStyles} from "@mui/styles";
import clsx from "clsx";

const useStyles = makeStyles(() => {
	return {
		container: {
			height: '80rem',
			['@media screen and (max-width:600px)']: {
				height: '60rem'
			}

		},
		loginButton: {
			width: '50%',
			margin: 10,
			color: "white",
			maxWidth: 600
		},
		buttonColorGoogle: {
			backgroundColor: '#4285F4'
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
	console.log('Signin state=>', state);

	const mode = state.mode;

	console.log('signin render()', mode)

	const styles = useStyles();

	if (mode !== SCREEN_MODE_SIGN_IN) {
		console.log("signin hidden return")
		return (
			<div className="hidden"/>
		)
	}
	console.log("signin general return")
	return (
		<Box paddingTop='10rem' textAlign='center' className={styles.container}>
			<img src={logo} className="logo"/>
			<h1 className={styles.signinTitle}>천권읽기 로그인</h1>
			<div>
			<Button className={clsx(styles.loginButton, styles.buttonColorGoogle)}
					size={"large"}
					variant={"contained"} onClick={
				()=> {
					loginGoogle(dispatch);
				}
			}>Google 로 로그인</Button>
			</div>
			<div>
			<Button className={clsx(styles.loginButton, styles.buttonColorKakao)}
			        size={"large"}
			        variant={"contained"} onClick={
				()=> {
					loginKakao(dispatch);
				}
			}>카카오로 로그인</Button>
			</div>
			<div>
			<Button className={clsx(styles.loginButton, styles.buttonColorNaver)}
			        size={"large"}
			        variant={"contained"} onClick={
				()=> {
					loginNaver(dispatch);
				}
			}>네이버로 로그인</Button>
			</div>
		</Box>
	)
}

export default Signin;