import {
	Button,
	CircularProgress,
	Container,
	Dialog,
	DialogActions,
	DialogContent,
	DialogContentText,
	DialogTitle, Divider
} from "@mui/material";
import {useEffect, useState} from "react";
import {getDownloadURL, ref} from "firebase/storage";
import {fbDB, fbStorage} from "../firebase/features";
import './Book.css';
import {doc, getDoc} from "firebase/firestore";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import AvatarList from "./AvatarList";
import ReviewList from "./ReviewList";

const dialogStyle = {
	display: 'flex',
    justifyContent: 'center',
	flexDirection: 'row',
	flexWrap: 'wrap'
}

const queryBookDetails = async (isbn) => {
	const q = doc(fbDB, 'Books', isbn);
	return await getDoc(q);
}

const LoadBookDetails = (isbn, setBookDetails, setImageBigUrl) => {
	console.log('LoadBookDetails ====> ', isbn);
	queryBookDetails(isbn).then(r => {
		const bookDetails = r.data();
		console.log('LoadBookDetails Success !!!! ====> ', r.data());
		if (bookDetails.imageLinkBig) {
			console.log('LoadBookDetails imageLinkBig==>', bookDetails.imageLinkBig);
			setImageBigUrl(bookDetails.imageLinkBig);
		}
		setBookDetails(r.data());

	}).catch(e => {
		console.log('LoadBookDetails Error !!!! ====> ', e);
		setBookDetails({});
	});
}

const Book = ({book}) => {
	const [imageUrl, setImageUrl] = useState(null);
	const [imageBigUrl, setImageBigUrl] = useState(null);
	const [open, setOpen] = useState(false);
	const [bookDetails, setBookDetails] = useState(null);
	console.log('Book===>', imageUrl);

	let bookThumbnailUrl = book[11];
	if (imageUrl)
		bookThumbnailUrl = imageUrl;

	const handleClickOpen = () => {
		setOpen(true);
		// if (!bookDetails)
			LoadBookDetails(book[12], setBookDetails, setImageBigUrl);
	};

	const handleClose = () => {
		setOpen(false);
	};

	const handleGoto = () => {
		setOpen(false);
		window.open(book[10]);
	};

	const handleOnImageError = (e) => {
		console.log('handleOnImageError === ', e.target.src, imageUrl, e);
		if (e.target.src && imageUrl && e.target.src !== imageUrl)
			e.target.src = imageUrl;
	}

	useEffect(() => {
		if (bookThumbnailUrl.startsWith("gs://")) {
			let storageRef = ref(fbStorage, bookThumbnailUrl);
			getDownloadURL(storageRef).then(value => {
				console.log('BookThumbnail download_url=', value);
				setImageUrl(value)
			});
		} else {
			setImageUrl(bookThumbnailUrl);
		}
	}, []);

	const readDate = +book[14];
	const date = new Date(readDate);
	console.log('read date=', date);
	const dateStr = `${date.getFullYear()}년 ${date.getMonth()+1}월 ${date.getDate()}일`;

	return (
		<div>
			<Container
				sx={{
					width: 100,
					height: 150,
					alignItems: 'center'
				}}
			>
				{
					imageUrl && imageUrl.startsWith("http") ?
						<img onClick={handleClickOpen} className='bookImg' src={imageUrl} alt={book[2]}/> :
						<div onClick={handleClickOpen} className="image">
							<img className='bookImg' src="" alt=""/>
								<div className="text">
									<h6>{book[2]}</h6>
								</div>
						</div>
				}
			</Container>
			<Dialog
				open={open}
				onClose={handleClose}
				aria-labelledby="customized-dialog-title"
				aria-describedby="modal-modal-description"
				scroll={'paper'}
			>
				<DialogContent id="modal-modal-description" sx={{ mt: 2 }}>
					<DialogTitle id="modal-modal-title" variant="h6" component="h2">
						{book[2]}
					</DialogTitle>

					<Box sx={dialogStyle}>
						<img className='bookImgLarge' src={imageBigUrl? imageBigUrl: imageUrl? imageUrl: ""} alt={book[2]}
						     onError={handleOnImageError}/>
					</Box>
					<Typography id="modal-modal-description" sx={{ mt: 2 }}>
						<span style={{color: 'red'}}>{dateStr}</span>에 읽었습니다.
					</Typography>
					{
						(bookDetails !== null) ?
							bookDetails.read ?
								<div>
									<Typography id="modal-modal-description" sx={{ mt: 2 }}>
										천권읽기 회원 총 <span style={{color: 'red'}}>{bookDetails.read}</span> 명이 읽었습니다.
									</Typography>
									<DialogContent>
										<AvatarList style={{
											display: 'flex',
											justifyContent: 'center',
											flexDirection: 'row',
											flexWrap: 'wrap'
										}} users={bookDetails.readPeople}/>
									</DialogContent>
								</div>: <div/> : <CircularProgress />

					}
					<DialogContentText id="alert-dialog-description">
						<Typography id="modal-modal-description" sx={{ mt: 3 }}>
							{book[7]}
						</Typography>
					</DialogContentText>

					<Divider sx={{mt:2}}/>
					<ReviewList isbn={book[12]}/>
				</DialogContent>
				<DialogActions>
					{
						book[10] ?
							<Button onClick={handleGoto}>이 책에 대한 자세한 내용 보러가기</Button> :
							<div/>
					}
				</DialogActions>
			</Dialog>
		</div>
	)
}

export default Book;