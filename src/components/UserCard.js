import {Card,Slider} from "@mui/material";
import cx from 'clsx';
import {memo, useContext, useEffect, useState} from "react";
import {getDownloadURL, ref} from "firebase/storage";
import {fbDB, fbStorage} from "../firebase/features";
import {doc, getDoc} from "firebase/firestore";
import makeStyles from "@mui/styles/makeStyles";
import {
	ACTION_USER_SELECTED,
	SCREEN_MODE_GOOD_WRITER,
	SCREEN_MODE_USER_RANK_DAILY,
	SCREEN_MODE_USER_RANK_MONTHLY,
	SCREEN_MODE_USER_RANK_WEEKLY
} from "../const";
import {MyContext} from "../hooks/reducer";
import Box from "@mui/material/Box";
import Avatar from "@mui/material/Avatar";

const useStyles = makeStyles(({spacing, palette}) => {

	const family =
		'-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"';
	return {
		card: {
			display: 'flex',
			padding: spacing(2),
			minWidth: 288,
			width: 350,
			margin: spacing(1),
			borderRadius: 12,
			boxShadow: '0 2px 4px 0 rgba(138, 148, 159, 0.2)',
			'& > *:nth-child(1)': {
				marginRight: spacing(2),
			},
			'& > *:nth-child(2)': {
				flex: 'auto',
			},
			cursor: 'pointer'
		},
		avatar: {
			width: 100,
			height: 100
		},
		heading: {
			fontFamily: family,
			fontSize: 16,
			marginBottom: 0,
		},
		subheader: {
			fontFamily: family,
			fontSize: 14,
			color: palette.grey[600],
			letterSpacing: '1px',
			marginBottom: 4,
		},
		value: {
			marginLeft: 8,
			fontSize: 14,
			color: palette.grey[500],
		},
	};
});

const useSliderStyles = makeStyles(() => ({
	root: {
		height: 4,
	},
	rail: {
		borderRadius: 10,
		height: 4,
		backgroundColor: 'rgb(202,211,216)',
	},
	track: {
		borderRadius: 10,
		height: 4,
		backgroundColor: 'rgb(117,156,250)',
	},
	thumb: {
		display: 'none',
	},
}));

const queryClientInfo = async (email, profileId) => {
	const q = doc(fbDB, 'ClientInfoDataBase', `${email}_${profileId}`);
	return await getDoc(q);
}

const handleCardClick = (dispatch, clientInfo) => {
	dispatch({type: ACTION_USER_SELECTED, user: clientInfo});
}

const UserCard = memo(({userItem, screenMode}) => {
	const {dispatch} = useContext(MyContext);
	const userUrl = userItem.email ? `${userItem.email}_${userItem.profileId}`: '';
	const [imageUrl, setImageUrl] = useState(null);
	const [clientInfo, setClientInfo] = useState({});
	console.log("UserCard render()...", userItem);

	useEffect(() => {
		try {
			let storageRef = ref(fbStorage, `/profile_thumbnails/${userUrl}.png`)
			getDownloadURL(storageRef).then(value => {
				console.log('download_url=', value)
				window.localStorage.setItem(userUrl, JSON.stringify(value));
				setImageUrl(value)
			});
		} catch (e) {

		}
	}, [userItem, userUrl]);

	useEffect(()=> {
		try {
			queryClientInfo(userItem.email, userItem.profileId).then(doc => {
				console.log("clientInfo =>", doc.data());
				setClientInfo(doc.data());
			});
		} catch (e) {

		}

	}, [userItem]);

	let prefix = '';
	let postfix = ' 읽었습니다.';

	if (screenMode === SCREEN_MODE_USER_RANK_DAILY) {
		prefix = " 오늘 ";
	} else if (screenMode === SCREEN_MODE_USER_RANK_WEEKLY) {
		prefix = " 이번 주 ";
	} else if (screenMode === SCREEN_MODE_USER_RANK_MONTHLY) {
		prefix = " 이번 달 ";
	} else if (screenMode === SCREEN_MODE_GOOD_WRITER) {
		prefix = " 좋아요: ";
		postfix = "";
	}

	const styles = useStyles();
	const sliderStyles = useSliderStyles();

	const progressValue = clientInfo && clientInfo.read && clientInfo.goal ?
		Math.floor((clientInfo.read * 100) / clientInfo.goal) : 0;

	return (
		<Card className={cx(styles.card)} elevation={0}
		      onClick={() => {handleCardClick(dispatch, clientInfo);}}>
			<Avatar src={imageUrl} className={styles.avatar} />
			<Box>
				<h3 className={styles.heading}>{clientInfo.profileName}</h3>
				<p className={styles.subheader}>{clientInfo.age}세 •
					{prefix} <span style={{color: "brown"}}>{
						screenMode === SCREEN_MODE_GOOD_WRITER ?
							userItem.like: userItem.read}</span> {postfix}
				</p>
				<Box display={'flex'} alignItems={'center'}>
					<Slider classes={sliderStyles} value={progressValue}/>
					<span className={styles.value}>{clientInfo.read}/{clientInfo.goal}</span>
				</Box>
			</Box>
		</Card>
	);
});

export default UserCard;