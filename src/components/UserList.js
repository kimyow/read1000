import {
    SCREEN_MODE_BEST_READER,
    SCREEN_MODE_FAMOUS_BOOK,
    SCREEN_MODE_GOOD_WRITER,
    SCREEN_MODE_RECENT_REVIEW,
    SCREEN_MODE_USER_RANK_DAILY,
    SCREEN_MODE_USER_RANK_MONTHLY,
    SCREEN_MODE_USER_RANK_WEEKLY
} from "../const";
import {collection, getDocs, limit, orderBy, query, where} from "firebase/firestore";
import {fbDB} from "../firebase/features";
import {useContext, useEffect, useMemo, useState} from "react";
import {MyContext} from "../hooks/reducer";
import UserCard from "./UserCard";
import Box from "@mui/material/Box";


const getWeekOfYear = (currentDate) => {
    const oneJan = new Date(currentDate.getFullYear(),0,1);
    const numberOfDays = Math.floor((currentDate - oneJan) / (24 * 60 * 60 * 1000));
    return Math.floor((currentDate.getDay() + 1 + numberOfDays) / 7);
}

const queryCallAsync = async (mode) => {
    const date = new Date();
    let path = ``;
    let q = null;

    console.log(mode);

    const retrieveNum = 50;

    if (mode === SCREEN_MODE_USER_RANK_DAILY) {
        path = `UserRank/Rank_Day_${date.getFullYear()}_${date.getMonth() + 1}_${date.getDate()}/Rank_Day_${date.getFullYear()}_${date.getMonth() + 1}_${date.getDate()}`;
    } else if (mode === SCREEN_MODE_USER_RANK_WEEKLY) {
        path = `UserRank/Rank_Week_${date.getFullYear()}_${getWeekOfYear(date)}/Rank_Week_${date.getFullYear()}_${getWeekOfYear(date)}`;
    } else if (mode === SCREEN_MODE_USER_RANK_MONTHLY) {
        path = `UserRank/Rank_Month_${date.getFullYear()}_${date.getMonth() + 1}/Rank_Month_${date.getFullYear()}_${date.getMonth() + 1}`;
    } else if (mode === SCREEN_MODE_BEST_READER) {
        path = `ClientInfoDataBase`;
    } else if (mode === SCREEN_MODE_GOOD_WRITER) {
        path = "ClientInfoDataBase";
        q = query(collection(fbDB, path), where("like", ">", 0), orderBy("like", "desc"), limit(retrieveNum));
    } else if (mode === SCREEN_MODE_FAMOUS_BOOK) {
        path = 'Books';
    } else if (mode === SCREEN_MODE_RECENT_REVIEW) {
        path = "MessageDataBase";
        q = query(collection(fbDB, path), orderBy("updatedDate", "desc"), limit(retrieveNum));
    }
    console.log("query path = ", path);

    if (!path) {
        return new Promise((resolve) => {
            resolve([]);
        });
    }

    if (q === null)
        q = query(collection(fbDB, path), where("read", ">", 0), orderBy("read", "desc"), limit(retrieveNum));
    return await getDocs(q)
}

const UserList = () => {
    const {state} = useContext(MyContext);
    const [error, setError] = useState(null);
    const [userList, setUserList] = useState(null);
    const mode = state.mode;
    console.log('################ UserList render() userList=>', mode, userList);

    useEffect( () => {
        try {
            setError(null);
            setUserList(null);
            queryCallAsync(mode).then(r => {
                let itemList = [];
                r.forEach((doc) => {
                    const data = doc.data();
                    itemList.push(data);
                });
                console.log("UserList ===> itemList ==> ", itemList);
                setUserList(itemList);
            });
        } catch (e) {
            setError(e);
        }
    }, [mode]);

    const currentMode = useMemo(() => {

    }, []);

    if (mode !== SCREEN_MODE_USER_RANK_MONTHLY &&
        mode !== SCREEN_MODE_USER_RANK_WEEKLY &&
        mode !== SCREEN_MODE_USER_RANK_DAILY &&
        mode !== SCREEN_MODE_BEST_READER &&
        mode !== SCREEN_MODE_GOOD_WRITER)
        return (
            <div />
        )

    if (error) return (
        <Box marginTop='10em' sx={{
            textAlign: 'center',
            verticalAlign: 'middle',
            height: '100rem'
        }}>
            <h5>데이터 로딩중에 오류가 발생했습니다. {error}</h5>
        </Box>
    );

    if (userList === null) return (
        <Box marginTop='10em' sx={{
            textAlign: 'center',
            verticalAlign: 'middle',
            height: '100rem'
        }}>
            <h5>데이타를 로딩중입니다...</h5>
        </Box>
    );

    return (
        <Box marginTop='5em' sx={{
            width: '100%',
            display: 'flex',
            justifyContent: 'center',
            flexDirection: 'row',
            flexWrap: 'wrap'
        }}>
            {
                userList && userList.length > 0 ?
                        userList.map((user, i) => <UserCard key={"" + i} userItem={user} screenMode={mode}/>) :
                    <div>
                        <h2>데이타를 로딩중입니다...</h2>
                    </div>
            }
        </Box>
    )
}

export default UserList