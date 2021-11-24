import {Container, Nav, Navbar} from "react-bootstrap";


const MyNav = () => {
	return (
		<>
			<Navbar bg="primary" variant="dark">
				<Container>
					<Navbar.Brand href="#home">Navbar</Navbar.Brand>
					<Nav className="me-auto" onSelect={(selectedKey) => alert(`selected ${selectedKey}`)}>
						<Nav.Link href="#home">Home</Nav.Link>
						<Nav.Link href="#features">Features</Nav.Link>
						<Nav.Link href="#pricing">Pricing</Nav.Link>
					</Nav>
				</Container>
			</Navbar>
			<br/>
			<Nav className="justify-content-center"
			     variant="pills"
			     activeKey="/home"
			     onSelect={(selectedKey) => {
					 console.log("selected key =>", selectedKey);
			     }}
			>
				<Nav.Item>
					<Nav.Link eventKey="link-0">홈</Nav.Link>
				</Nav.Item>
				<Nav.Item>
					<Nav.Link eventKey="link-1">좋은 글을 쓰는 친구들</Nav.Link>
				</Nav.Item>
				<Nav.Item>
					<Nav.Link eventKey="link-2">어린이 인기 도서</Nav.Link>
				</Nav.Item>
				<Nav.Item>
					<Nav.Link eventKey="link-3">최근 리뷰</Nav.Link>
				</Nav.Item>
				<Nav.Item>
					<Nav.Link eventKey="link-4">오늘의 독서왕</Nav.Link>
				</Nav.Item>
				<Nav.Item>
					<Nav.Link eventKey="link-5">주간 독서왕</Nav.Link>
				</Nav.Item>
				<Nav.Item>
					<Nav.Link eventKey="link-6">월간 독서왕</Nav.Link>
				</Nav.Item>
				<Nav.Item>
					<Nav.Link eventKey="link-7">책을 많이 읽은 친구들</Nav.Link>
				</Nav.Item>
				<Nav.Item>
					<Nav.Link eventKey="link-8">친구 찾기</Nav.Link>
				</Nav.Item>
			</Nav>
		</>


	);
}

export default MyNav;