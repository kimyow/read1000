import {ListItem, ListItemAvatar, ListItemText} from "@mui/material";
import UserAvatar from "./UserAvatar";
import {doc, getDoc} from "firebase/firestore";
import {fbDB} from "../firebase/features";
import {useEffect, useState} from "react";

const queryClientInfo = async (email, profileId) => {
	const q = doc(fbDB, 'ClientInfoDataBase', `${email}_${profileId}`);
	return await getDoc(q);
}

const Review = ({review}) => {
	const [clientInfo, setClientInfo] = useState(null);
	console.log("Review =======> ", review);

	const user = {
		email: review.writerEmail,
		profileId: review.writerProfileId
	};

	useEffect(() => {
		queryClientInfo(user.email, user.profileId).then(doc => {
			console.log("clientInfo =>", doc.data());
			setClientInfo(doc.data());
		});
	}, [])

	return (
		<ListItem alignItems="flex-start">
			<ListItemAvatar>
				<UserAvatar alt="No image" user={user}/>
			</ListItemAvatar>
			<ListItemText
				primary={
					clientInfo?
						clientInfo.profileName:""
				}
				secondary={
					review.bodyMessage
				}
			/>
		</ListItem>
	);
}

export default Review;