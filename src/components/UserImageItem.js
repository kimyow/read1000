import {Component} from "react";
import {getDownloadURL, ref} from "firebase/storage";

import {getStorage} from "firebase/storage";

class UserImageItem extends Component {
    state = {
        imageUrl: null
    }

    componentDidMount() {
        const storage = getStorage()
        console.log('UserImageItem componentDidMount =>', this.props.data, storage);
        let storageRef = ref(storage, `/profile_thumbnails/${this.props.data.email}_${this.props.data.profileId}.png`)
        console.log('storageRef=', storageRef)

        getDownloadURL(storageRef).then(value => {
            console.log('download_url=', value)
            this.setState({imageUrl: value})
        });
    }

    render() {
        console.log('UserImageItem render =>', this.state.imageUrl);
        if (this.state.imageUrl) {
            return (
                <div className="UserImageDiv">
                    <h2>{this.props.data.email}</h2>
                    <h4>{this.props.data.read}권 읽음</h4>
                    <img src={this.state.imageUrl} className="UserImage"/>
                </div>
            );
        } else {
            return <div/>;
        }
    }
}

export default UserImageItem