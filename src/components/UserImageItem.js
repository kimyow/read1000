import {useEffect, useState} from "react";
import {getDownloadURL, ref} from "firebase/storage";
import {fbStorage} from "../firebase/features";


const UserImageItem = ({userItem}) =>  {
    const [imageUrl, setImageUrl] = useState(null);
    console.log("UserImageItem =>", userItem);

    useEffect(() => {
        let storageRef = ref(fbStorage, `/profile_thumbnails/${userItem.email}_${userItem.profileId}.png`)

        getDownloadURL(storageRef).then(value => {
            console.log('download_url=', value)
            setImageUrl(value)
        });
    }, [userItem]);

    console.log('UserImageItem render =>', imageUrl);
    if (imageUrl) {
        return (
            <div className="UserImageDiv">
                <h2>{userItem.email}</h2>
                <h4>{userItem.read}권 읽음</h4>
                <img src={imageUrl} className="UserImage" alt=""/>
            </div>
        );
    } else {
        return <div/>;
    }
}

export default UserImageItem