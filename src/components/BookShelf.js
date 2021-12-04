import {useContext, useEffect, useState} from "react";
import {MyContext} from "../hooks/reducer";
import {SCREEN_MODE_BOOK_SHELF} from "../const";
import {Container, ImageList, ImageListItem} from "@mui/material";
import {getDownloadURL, ref} from "firebase/storage";
import {fbStorage} from "../firebase/features";
import Book from "./Book";
import Box from "@mui/material/Box";


const BookShelf = () => {
	const {state, dispatch} = useContext(MyContext);
	const [contents, setContents] = useState([]);
	console.log('BookShelf state=>', state);
	const mode = state.mode;

	useEffect(()=> {

		if (state.selectedUser) {
			let storageRef = ref(fbStorage, `/databases/${state.selectedUser}.db`)
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
	}, [state.selectedUser]);

	if (mode !== SCREEN_MODE_BOOK_SHELF) {
		return (
			<div className="hidden"/>
		)
	}

	console.log('BookShelf render() ===>', mode)

	let books = [];
	let i = 0;
	while (i < contents.length && i < 100) {
		const content = contents[i];
		// console.log("content====>", content);
		const book = <Book key={"" + i} book={content}/>
		books.push(book);
		i = i + 1;
	}

	return (
		<Box marginBottom='5em'
			sx={{
				width: '100%',
				display: 'flex',
				justifyContent: 'center',
				flexDirection: 'row',
				flexWrap: 'wrap'
			}}>
			{books}
		</Box>
	)
}

export default BookShelf;