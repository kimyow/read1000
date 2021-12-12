import {useEffect, useState} from "react";
import {CircularProgress, List} from "@mui/material";
import {collection, getDocs, limit, orderBy, query, where} from "firebase/firestore";
import {fbDB} from "../firebase/features";
import Review from "./Review";
import Typography from "@mui/material/Typography";

const queryReviewListAsync = async (isbn) => {
	const q = query(collection(fbDB, 'MessageDataBase'), where("isbn", "==", isbn), orderBy("updatedDate", "desc"), limit(20));
	return await getDocs(q)
}

const ReviewList = ({isbn}) => {
	const [reviewList, setReviewList] = useState(null);
	console.log("ReviewList ===>", isbn);

	useEffect( () => {
		queryReviewListAsync(isbn).then(r => {
			let itemList = [];
			r.forEach((doc) => {
				const data = doc.data();
				itemList.push(
					<Review review={data}/>
				);
			});
			setReviewList(itemList);
		});
	}, [isbn]);

	return (
			reviewList ?
				(reviewList.length === 0) ?
					<Typography style={{textAlign:'center'}} id="modal-modal-description" sx={{ mt: 2 }}>작성된 리뷰가 없습니다. </Typography>:
					<List>{reviewList}</List> :
						<CircularProgress/>
	);
}

export default ReviewList;