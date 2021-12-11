import Box from "@mui/material/Box";
import {useContext} from "react";
import {MyContext} from "../hooks/reducer";
import {SCREEN_MODE_INIT} from "../const";

const Home = () => {
	const {state} = useContext(MyContext);
	const mode = state.mode;
	console.log("Home render() ======> ", mode);

	if (mode !== SCREEN_MODE_INIT) {
		return (<div />);
	}

	return (
		<Box marginTop='5em' sx={{
			width: '100%',
			display: 'flex',
			justifyContent: 'center',
			flexDirection: 'row',
			flexWrap: 'wrap'
		}}>
			<h3> 홈 화면입니다....</h3>
		</Box>
	)
}

export default Home;