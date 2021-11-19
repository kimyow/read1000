import {Component} from "react";
import UserImageItem from "./UserImageItem";

class UserImageList extends Component {
  render() {
    console.log('UserImageList render =>', this.props.data);
    this.userItems = []
    let i = 0;
    while (i < this.props.data.length) {
      const _data = this.props.data[i]
      const item = <UserImageItem key={"" + i} data={_data}/>
      this.userItems.push(item)
      i = i + 1;
    }

    return (
        <ul>
          {this.userItems}
        </ul>
    )
  }
}

export default UserImageList