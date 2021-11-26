
const ReviewItem = ({reviewItem}) => {
	console.log("ReviewItem =>", reviewItem);
	return (
		<div className="ReviewItem">
			<h6>{reviewItem.bodyMessage}</h6>
		</div>
	);

}

export default ReviewItem;