import {fbAuth} from "./firebase/features";
import {useEffect, useReducer, useState} from "react";
import {ACTION_CHANGE_MODE, SCREEN_MODE_INIT, SCREEN_MODE_SIGN_IN} from "./const";
import Signin from "./components/Signin";
import UserList from "./components/UserList";
import stateReducer, {initValues, MyContext} from "./hooks/reducer";
import ResponsiveAppBar from "./components/ResponsiveAppBar";
import BookShelf from "./components/BookShelf";
import Home from "./components/Home";


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


function App(props) {
    const [state, dispatch] = useReducer(stateReducer, initValues, undefined);
    console.log("App state=>", state);
    const authUser = useFirebaseAuthentication();

    console.log("app render()...", authUser);

    useEffect(()=>{
        if (authUser === null) {
            dispatch({type: ACTION_CHANGE_MODE,
                mode: SCREEN_MODE_SIGN_IN});
        } else {
            dispatch({type: ACTION_CHANGE_MODE,
                mode: SCREEN_MODE_INIT});
        }
    }, [authUser]);

    return (
        <MyContext.Provider value={{state, dispatch, logout}}>
            <div>
                <ResponsiveAppBar props={props} user={authUser} />
                <Signin />
                <Home />
                <UserList />
                <BookShelf />
            </div>
        </MyContext.Provider>
    );
}

export default App;