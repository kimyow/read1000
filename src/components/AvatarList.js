import * as React from 'react';
import Stack from '@mui/material/Stack';
import UserAvatar from "./UserAvatar";

const AvatarList = ({users}) => {

	let avatar_list = []
	users.forEach(user => {
		avatar_list.push(<UserAvatar user={user} />);
	})


	return (
		<Stack
			mt={2} direction="row" spacing={2}>
			{avatar_list}
		</Stack>
	);
}

export default AvatarList;