import UserItem from "./UserItem";
import {
    ACTION_USER_RANK_DATA_RECEIVED,
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
import {useContext} from "react";
import {MyContext} from "../hooks/reducer";
import ReviewItem from "./ReviewItem";
import UserCard from "./UserCard";
import {Container} from "@mui/material";
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
        q = query(collection(fbDB, path), where("like", ">", 0), orderBy("like", "desc"), limit(20));
    } else if (mode === SCREEN_MODE_FAMOUS_BOOK) {
        path = 'Books';
    } else if (mode === SCREEN_MODE_RECENT_REVIEW) {
        path = "MessageDataBase";
        q = query(collection(fbDB, path), orderBy("updatedDate", "desc"), limit(20));
    }
    console.log("query path = ", path);
    if (q === null)
        q = query(collection(fbDB, path), where("read", ">", 0), orderBy("read", "desc"), limit(20));
    return await getDocs(q)
}

const LoadData = (mode, dispatch) => {

  queryCallAsync(mode).then(r => {
    let itemList = [];
    r.forEach((doc) => {
      const data = doc.data();
        itemList.push(data);

    });
    window.localStorage.setItem(mode, JSON.stringify(itemList));
    dispatch({type: ACTION_USER_RANK_DATA_RECEIVED, userRankList: itemList});
  });
}


const UserList = () => {
    const {state, dispatch} = useContext(MyContext);
    console.log('UserList state=>', state);
    const mode = state.mode;

    const userList = JSON.parse(window.localStorage.getItem(mode));
    console.log('################ UserList render() userList=>', mode, userList);

    if (mode !== SCREEN_MODE_USER_RANK_DAILY && mode !== SCREEN_MODE_USER_RANK_MONTHLY && mode !== SCREEN_MODE_USER_RANK_WEEKLY
        && mode !== SCREEN_MODE_BEST_READER && mode !== SCREEN_MODE_GOOD_WRITER && mode !== SCREEN_MODE_FAMOUS_BOOK
        && mode !== SCREEN_MODE_RECENT_REVIEW) {
      return (
          <div className="hidden"/>
      )
    }

    if (!userList) {
        console.log("try to download...")
        LoadData(mode, dispatch);
        return (
            <div>
                <h1>데이타 로딩중...</h1>
            </div>
        )
    }

    let userItems = [];
    let i = 0;
    while (i < userList.length) {
      const _data = userList[i];
      if (mode === SCREEN_MODE_RECENT_REVIEW) {
          const item = <ReviewItem key={"" + i} reviewItem={_data}/>
          userItems.push(item);
      } else {
          // const item = <UserItem key={"" + i} userItem={_data} screenMode={mode}/>
          const item = <UserCard key={"" + i} userItem={_data} screenMode={mode}/>
          userItems.push(item);
      }
      i = i + 1;
    }

    console.log('userItems=', userItems);
    return (
        <Box marginTop='5em' sx={{
            width: '100%',
            display: 'flex',
            justifyContent: 'center',
            flexDirection: 'row',
            flexWrap: 'wrap'
        }}>
            {userItems}
        </Box>
    )
}

export default UserList