import {Container} from "@mui/material";
import {useEffect, useState} from "react";
import {getDownloadURL, ref} from "firebase/storage";
import {fbStorage} from "../firebase/features";
import './Book.css';

const Book = ({book}) => {
	const [imageUrl, setImageUrl] = useState(null);
	console.log('Book===>', book[11]);

	const bookThumbnailUrl = book[11];

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
	}, )


	return (
		<Container
			sx={{
				width: 100,
				height: 150,
				alignItems: 'center'
			}}
		>
			{
				imageUrl && imageUrl.startsWith("http") ?
					<img className='bookImg' src={imageUrl} alt={book[2]}/> :
					<div className="image">
						<img className='bookImg' src=""/>
							<div className="text">
								<h6>{book[2]}</h6>
							</div>
					</div>
			}
		</Container>
	)
}

export default Book;