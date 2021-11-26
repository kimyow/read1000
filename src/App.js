import './App.css';

import {fbAuth} from "./firebase/features";
import {useEffect, useReducer, useState} from "react";
import {ACTION_CHANGE_MODE, SCREEN_MODE_SIGN_IN, SCREEN_MODE_USER_RANK_DAILY} from "./const";
import Signin from "./components/Signin";
import UserList from "./components/UserList";
import stateReducer, {initValues, MyContext} from "./hooks/reducer";
import Button from "react-bootstrap/Button";
import MyNav from "./components/MyNav";


const useFirebaseAuthentication = () => {
    const [authUser, setAuthUser] = useState(null);

    useEffect(() =>{
        const unlisten = fbAuth.onAuthStateChanged(
            authUser => {
                console.log("authUser=>", authUser);

                authUser
                    ? setAuthUser(authUser)
                    : setAuthUser(null);
            },
        );
        return () => {
            unlisten();
        }
    }, []);

    return authUser
}

const logout = (dispatch) => {
    fbAuth.signOut().then((result)=> {
        console.log("signed out~!!");
        dispatch({
            type: ACTION_CHANGE_MODE,
            mode: SCREEN_MODE_SIGN_IN
        });
    }).catch((error)=> {
        console.log("signed out failed~!!!", error)
    });
}


function App() {
    const [state, dispatch] = useReducer(stateReducer, initValues, undefined);
    console.log("App state=>", state);
    const authUser = useFirebaseAuthentication();

    console.log("app render()...", authUser)

    useEffect(()=>{
        if (authUser === null) {
            dispatch({type: ACTION_CHANGE_MODE,
                mode: SCREEN_MODE_SIGN_IN});
        } else {
            dispatch({type: ACTION_CHANGE_MODE,
                mode: SCREEN_MODE_USER_RANK_DAILY});
        }
    }, [authUser]);

    return (
        <MyContext.Provider value={{state, dispatch}}>
            <div className="App">
                <MyNav />
                <hr
                    style={{
                        backgroundColor: "#0D60EA",
                        height: 1
                    }}
                />

                <Signin/>
                <UserList/>
                <Button className="hidden" onClick={()=>{
                    logout(dispatch);
                }}>
                    로그아웃
                </Button>
            </div>
        </MyContext.Provider>
    );
}

export default App;