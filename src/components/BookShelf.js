import {useContext, useEffect, useState} from "react";
import {MyContext} from "../hooks/reducer";
import {SCREEN_MODE_BOOK_SHELF} from "../const";
import {getDownloadURL, ref} from "firebase/storage";
import {fbStorage} from "../firebase/features";
import Book from "./Book";
import Box from "@mui/material/Box";
import UserAvatar from "./UserAvatar";
import './Book.css';


const BookShelf = () => {
	const {state} = useContext(MyContext);
	const [contents, setContents] = useState([]);
	const [error, setError] = useState(null);
	console.log('BookShelf state=>', state);
	const mode = state.mode;
	const user = state.selectedUser;

	useEffect(()=> {
		if (user) {
			console.log('BookShelf download db...', user);
			setContents([]);
			setError(null);
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
					xhr.onload = (event) => {
						try {
							const blob = xhr.response;
							// console.log("downloaded blob=", typeof(blob), blob);
							const uInt8Array = new Uint8Array(blob);
							const db = new SQL.Database(uInt8Array);
							const contents = db.exec(`SELECT * FROM tbl_favorite WHERE profileid = ${user.profileId} AND pagecount >= 0 ORDER BY readdate DESC LIMIT 100`);
							console.log("contents ==>", contents);
							if (contents.length > 0 && contents[0].values) {
								setContents(contents[0].values);
							} else {
								setContents([]);
							}
						} catch (e) {
							console.log("database error ~~~> ", e);
							setError(e);
						}
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

	if (error) return (
		<Box marginTop='10em' sx={{
			textAlign: 'center',
			verticalAlign: 'middle',
			height: '100rem'
		}}>
			<h5>사용자의 데이터베이스 로딩중에 오류가 발생했습니다.</h5>
		</Box>
	);

	console.log('BookShelf render() ===>', mode)

	const books = contents.slice(0, 100);

	return (
		<>
			<Box className="bookShelfCard" sx={{
				width: '100%',
				display: 'flex',
				justifyContent: 'center',
				flexDirection: 'row',
				flexWrap: 'wrap'
			}}>
				<UserAvatar user={user} /> <span style={{ marginLeft: '10px', padding: '5px'}}>{user.profileName} • (최근에 읽은 책들)</span>
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