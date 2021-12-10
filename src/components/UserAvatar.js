import Avatar from "@mui/material/Avatar";
import {useEffect, useState} from "react";
import {getDownloadURL, ref} from "firebase/storage";
import {fbStorage} from "../firebase/features";


const UserAvatar = ({user}) => {
	const [imageLink, setImageLink] = useState(null);
	const userUrl = user.email ? `${user.email}_${user.profileId}`: '';

	console.log("UserAvatar====>", user);
	useEffect(() => {
		let storageRef = ref(fbStorage, `/profile_thumbnails/${userUrl}.png`)
		getDownloadURL(storageRef).then(value => {
			console.log('download_url=', value)
			setImageLink(value)
		});
	}, [user]);

	return (
		<Avatar src={imageLink} alt="No image"/>
	);
}

export default UserAvatar;