import {useContext, useEffect, useState} from "react";
import {MyContext} from "../hooks/reducer";
import {SCREEN_MODE_BOOK_SHELF} from "../const";
import {getDownloadURL, ref} from "firebase/storage";
import {fbStorage} from "../firebase/features";
import Book from "./Book";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import UserAvatar from "./UserAvatar";


const BookShelf = () => {
	const {state} = useContext(MyContext);
	const [contents, setContents] = useState([]);
	console.log('BookShelf state=>', state);
	const mode = state.mode;
	const user = state.selectedUser;

	useEffect(()=> {
		if (user) {
			console.log('BookShelf download db...', user);
			setContents([]);
			let storageRef = ref(fbStorage, `/databases/${user.email}.db`)
			getDownloadURL(storageRef).then(value => {
				console.log('download_url=', value)
				window.initSqlJs({
					locateFile: filename => `/dist/${filename}`
				}).then(SQL => {
					console.log("SQL", SQL);
					const url = value;
					const xhr = new XMLHttpRequest();
					xhr.responseType = 'arraybuffer';
					xhr.onload = function(event) {
						const blob = xhr.response;
						// console.log("downloaded blob=", typeof(blob), blob);
						const uInt8Array = new Uint8Array(blob);
						const db = new SQL.Database(uInt8Array);
						const contents = db.exec("SELECT * FROM tbl_favorite");
						// console.log("contents ==>", contents[0].values);
						setContents(contents[0].values);
					};
					xhr.open('GET', url);
					xhr.send();
				});
			});
		}
	}, [user]);

	if (mode !== SCREEN_MODE_BOOK_SHELF) {
		return (
			<div className="hidden"/>
		)
	}

	console.log('BookShelf render() ===>', mode)

	const books = contents.slice(0, 100);

	return (
		<>
			<Box marginTop='5rem' padding='1rem' sx={{
				width: '100%',
				display: 'flex',
				justifyContent: 'center',
				flexDirection: 'row',
				flexWrap: 'wrap'
			}}>
				<UserAvatar user={user} /> <span style={{ marginLeft: '10px', padding: '5px'}}>{user.profileName}</span>
			</Box>
			<Box
				sx={{
					width: '100%',
					display: 'flex',
					justifyContent: 'center',
					flexDirection: 'row',
					flexWrap: 'wrap'
				}}>
				{books.map((book, index) => <Book key={"" + index} book={book}/>)}
			</Box>
		</>
	)
}

export default BookShelf;