import {Button, Card, CardActionArea, CardActions, CardContent, CardMedia} from "@mui/material";
import Typography from "@mui/material/Typography";
import {useContext, useEffect, useState} from "react";
import {getDownloadURL, ref} from "firebase/storage";
import {fbDB, fbStorage} from "../firebase/features";
import {doc, getDoc} from "firebase/firestore";
import {
	ACTION_CHANGE_MODE, ACTION_USER_SELECTED, SCREEN_MODE_BOOK_SHELF,
	SCREEN_MODE_GOOD_WRITER,
	SCREEN_MODE_USER_RANK_DAILY,
	SCREEN_MODE_USER_RANK_MONTHLY,
	SCREEN_MODE_USER_RANK_WEEKLY
} from "../const";
import {MyContext} from "../hooks/reducer";


const queryClientInfo = async (email, profileId) => {
	const q = doc(fbDB, 'ClientInfoDataBase', `${email}_${profileId}`);
	return await getDoc(q);
}

const handleCardClick = (dispatch, email) => {
	console.log(email);
	dispatch({type: ACTION_USER_SELECTED, user: email});
}

const UserCard = ({userItem, screenMode}) => {
	const {dispatch} = useContext(MyContext);
	const userUrl = userItem.email ? `${userItem.email}_${userItem.profileId}`: '';
	const cachedUrl = JSON.parse(window.localStorage.getItem(userUrl));
	const [imageUrl, setImageUrl] = useState(cachedUrl);
	const [clientInfo, setClientInfo] = useState({});

	console.log("UserCard render()...", userItem);

	useEffect(() => {
		if (!imageUrl) {
			let storageRef = ref(fbStorage, `/profile_thumbnails/${userUrl}.png`)
			getDownloadURL(storageRef).then(value => {
				console.log('download_url=', value)
				window.localStorage.setItem(userUrl, JSON.stringify(value));
				setImageUrl(value)
			});
		} else {
			setImageUrl(cachedUrl);
		}
	}, [userItem]);

	useEffect(()=> {
		if (userItem) {
			queryClientInfo(userItem.email, userItem.profileId).then(doc => {
				console.log("clientInfo =>", doc.data());
				setClientInfo(doc.data());
			});
		}
	}, []);

	let readNum = '';

	if (screenMode === SCREEN_MODE_USER_RANK_DAILY) {
		readNum = `오늘 총 ${userItem.read}권 읽었습니다.`;
	} else if (screenMode === SCREEN_MODE_USER_RANK_WEEKLY) {
		readNum = `이번 주에 총 ${userItem.read}권 읽었습니다.`;
	} else if (screenMode === SCREEN_MODE_USER_RANK_MONTHLY) {
		readNum = `이번 달에 총 ${userItem.read}권 읽었습니다.`;
	} else if (screenMode === SCREEN_MODE_GOOD_WRITER) {
		readNum = `좋아요: ${userItem.like}`;
	}

	return (
		<Card sx={{ width: 280, minWidth: 245, maxWidth: 345, margin: 1}}>
			<CardActionArea
				onClick={() => {handleCardClick(dispatch, userItem.email);}}>
				<CardMedia
					component="img"
					alt="profile image"
					height="300em"
					image={imageUrl}
				/>
				<CardContent>
					<Typography gutterBottom variant="h5" component="div">
						{clientInfo.profileName}
					</Typography>
					<Typography variant="body1" color="text.primary">
						{clientInfo.onlineMessage}
					</Typography>

					<Typography variant="body1" color="text.primary">
						{readNum}
					</Typography>

					<Typography sx={{marginTop: 1}} variant="body2" color="text.secondary">
						나이: {clientInfo.age} <br/>
						목표: {clientInfo.goal} <br/>
						읽은 책: {clientInfo.read} 권 <br/>
						{clientInfo.review ? `작성한 리뷰: ${clientInfo.review} 개`:`작성한 리뷰: 0 개`} <br/>
						{clientInfo.like ? `좋아요: ${clientInfo.like}`: ``}
					</Typography>
				</CardContent>
			</CardActionArea>
			<CardActions>
				<Button size="small">Share</Button>
				<Button size="small">Learn More</Button>
			</CardActions>
		</Card>
	);
}

export default UserCard;