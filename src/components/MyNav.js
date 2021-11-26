import {Nav} from "react-bootstrap";
import {useContext} from "react";
import {MyContext} from "../hooks/reducer";
import {ACTION_CHANGE_MODE} from "../const";


const MyNav = () => {
	const {state, dispatch} = useContext(MyContext);
	const currentMode = state.mode;
	console.log("currentMode=", currentMode, typeof(currentMode));
	return (
		<div className="MyNav">
			<Nav className="justify-content-center"
			     variant="pills"
			     activeKey={currentMode}
			     onSelect={(selectedKey) => {
				     console.log("selected key=>", selectedKey);
				     dispatch({type: ACTION_CHANGE_MODE, mode: selectedKey});
			     }}
			>
				<Nav.Item>
					<Nav.Link eventKey="good-writer">좋은 글을 쓰는 친구들</Nav.Link>
				</Nav.Item>
				<Nav.Item>
					<Nav.Link eventKey="famous-book">어린이 인기 도서</Nav.Link>
				</Nav.Item>
				<Nav.Item>
					<Nav.Link eventKey="recent-review">최근 리뷰</Nav.Link>
				</Nav.Item>
				<Nav.Item>
					<Nav.Link eventKey="user-rank-daily">오늘의 독서왕</Nav.Link>
				</Nav.Item>
				<Nav.Item>
					<Nav.Link eventKey="user-rank-weekly">주간 독서왕</Nav.Link>
				</Nav.Item>
				<Nav.Item>
					<Nav.Link eventKey="user-rank-monthly">월간 독서왕</Nav.Link>
				</Nav.Item>
				<Nav.Item>
					<Nav.Link eventKey="best-reader">책을 많이 읽은 친구들</Nav.Link>
				</Nav.Item>
				<Nav.Item>
					<Nav.Link eventKey="find-user">친구 찾기</Nav.Link>
				</Nav.Item>
			</Nav>
		</div>


	);
}

export default MyNav;