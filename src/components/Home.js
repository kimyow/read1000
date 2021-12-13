import Box from "@mui/material/Box";
import {useContext} from "react";
import {MyContext} from "../hooks/reducer";
import {SCREEN_MODE_INIT} from "../const";
import logo from "./../img/image1.svg";
import appIcon from "./../img/icon.png";
import userCards from "./../img/user_card.png";
import bookShelf from "./../img/bookshelf2.png";
import {Link} from "@mui/material";
import "./Home.css"

const Home = () => {
	const {state} = useContext(MyContext);
	const mode = state.mode;
	console.log("Home render() ======> ", mode);

	if (mode !== SCREEN_MODE_INIT) {
		return (<div />);
	}

	return (
		<Box paddingTop='5rem' textAlign='center'>
			<img src={logo} className="logo"/>
			<h1 className="main-title">독서의 힘, 앱으로 키워요</h1>
			<div className="sub-title">
				<p>책읽기 싫어하는 자녀를<br/>
					스스로 독서하는 아이로</p>
			</div>

			<img src={userCards} className={"userCard"} />

			<div className="margin-top-desc">
				<p className="main-title" style={{textAlign: 'left'}}>독서의 페이스메이커</p>
				<div className="main-description">
					<p><span style={{color:"#B44C4F"}}>달성율</span>을 보면서 목표량을 향해 달립니다.<br/>
						친구와 함께 <span style={{color:"#B44C4F"}}>독서방</span>을 만들고 읽은 책을 공유합니다.<br/>
						오늘의 <span style={{color:"#B44C4F"}}>독서왕, 주간, 월간 독서왕</span>에 도전해 보세요.<br/>
						명예의 전당에 오른 친구들의 <span style={{color:"#B44C4F"}}>독서이력</span>을 보며 독서의 마음가짐을 새롭게 합니다.
					</p>
				</div>
			</div>

			<img src={bookShelf} className={"userCard"} />

			<div className="margin-top-desc">
				<p className="main-title" style={{textAlign: 'right'}}>독서 동기 전문가</p>
				<div className="main-description" style={{textAlign: 'right'}}>
					<p>선뜻 혼자 시작하기 어려우시다면 <span style={{color:"#B44C4F"}}>방학레이스</span> 참여해보세요.<br/>
						함께 달리는 재미로 어느덧 목표량에 도달합니다.<br/>
						완주 후 주어지는 뱃지와 상장에 뿌듯함은 두 배~</p>
				</div>
			</div>

			<div className="margin-top-desc">
				<p className="main-title">천권읽기를 활용해보세요</p>
				<div className="sub-title">
					<p>책읽기 싫어하는 자녀를<br/>
						스스로 독서하는 아이로</p>
				</div>
			</div>

			<Link underline="hover" color="#3a3737"
			   href="https://play.google.com/store/apps/details?id=com.yeoniyouni.readbooks&amp;hl=ko" target="_blank">
				<img className="img-icon-book margin-top-desc" src={appIcon}/>
				<div className="link-button">
					천권읽기 앱 설치하기
				</div>
			</Link>
		</Box>
	);
}

export default Home;