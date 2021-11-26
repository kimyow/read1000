import {useEffect, useState} from "react";
import {getDownloadURL, ref} from "firebase/storage";
import {fbStorage} from "../firebase/features";
import {SCREEN_MODE_FAMOUS_BOOK} from "../const";


const UserItem = ({userItem, screenMode}) =>  {
    const [imageUrl, setImageUrl] = useState(null);
    let _imageUrl = imageUrl;
    console.log("UserItem =>", userItem, screenMode);

    const userUrl = userItem.email ? `${userItem.email}_${userItem.profileId}`: '';
    const downloadUrl = JSON.parse(window.localStorage.getItem(userUrl));
    if (downloadUrl) {
        console.log('############ url cached', userUrl);
    }

    useEffect(() => {
        if (userItem.email) {
            if (downloadUrl === null) {
                let storageRef = ref(fbStorage, `/profile_thumbnails/${userUrl}.png`)
                getDownloadURL(storageRef).then(value => {
                    console.log('download_url=', value)
                    _imageUrl = value;
                    window.localStorage.setItem(userUrl, JSON.stringify(value));
                    setImageUrl(value)
                });
            }
        }
    }, [userItem]);

    if (userItem.imageLinkBig) {
        _imageUrl = userItem.imageLinkBig;
    } else if (userItem.imageLink) {
        _imageUrl = userItem.imageLink;
    } else if (userUrl && downloadUrl) {
        _imageUrl = downloadUrl;
    }

    console.log('UserItem render =>', _imageUrl);
    if (_imageUrl) {
        const _className = (screenMode === SCREEN_MODE_FAMOUS_BOOK) ? "BookImage": "UserImage";
        return (
            <div>
                <h6>{userItem.email ? `${userItem.email}`: `${userItem.title}`}</h6>
                {userItem.like ? `${userItem.like} 좋아요`:`${userItem.read}권 읽음`}
                <br/>
                <img src={_imageUrl} className={_className} alt=""/>
            </div>
        );
    } else {
        return (<div/>);
    }
}

export default UserItem