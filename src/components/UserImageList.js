import UserImageItem from "./UserImageItem";
import {ACTION_USER_RANK_DATA_RECEIVED, SCREEN_MODE_USER_RANK} from "../const";
import {collection, getDocs, limit, orderBy, query, where} from "firebase/firestore";
import {fbDB} from "../firebase/features";
import {useContext} from "react";
import {MyContext} from "../hooks/reducer";


async function queryCallAsync() {
  const q = query(collection(fbDB, "UserRank/Rank_Day_2021_11_19/Rank_Day_2021_11_19"), where("read", ">", 0), orderBy("read", "desc"), limit(10));
  return await getDocs(q)
}

const LoadData = (dispatch) => {

  queryCallAsync().then(r => {
    let userRanks = [];
    r.forEach((doc) => {
      const data = doc.data();
      userRanks.push(data);

    });

    dispatch({type: ACTION_USER_RANK_DATA_RECEIVED, userRankList: userRanks});
  });
}


const UserImageList = () => {
    const {state, dispatch} = useContext(MyContext);
    console.log('UserImageList state=>', state);
    const mode = state.mode;
    const userRankList = state.userRankList;

    console.log('UserImageList render()');

    if (mode !== SCREEN_MODE_USER_RANK) {
      return (
          <div className="hidden"/>
      )
    }

    if (userRankList === null) {
      LoadData(dispatch);
      return (
          <div>
            <h1>사용자 랭킹 데이타 로딩중...</h1>
          </div>
      )
    }

    let userItems = [];
    let i = 0;
    while (i < userRankList.length) {
      const _data = userRankList[i];
      const item = <UserImageItem key={"" + i} userItem={_data}/>
      userItems.push(item);
      i = i + 1;
    }

    console.log('userItems=', userItems);
    return (
        <div>
          <ul>
            {userItems}
          </ul>
        </div>
    )
}

export default UserImageList