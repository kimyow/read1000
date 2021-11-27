import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import {useContext, useEffect, useState} from "react";
import {MyContext} from "../hooks/reducer";
import {
	ACTION_CHANGE_MODE,
	SCREEN_MODE_BEST_READER,
	SCREEN_MODE_FAMOUS_BOOK, SCREEN_MODE_FIND_USER,
	SCREEN_MODE_GOOD_WRITER, SCREEN_MODE_RECENT_REVIEW,
	SCREEN_MODE_USER_RANK_DAILY, SCREEN_MODE_USER_RANK_MONTHLY,
	SCREEN_MODE_USER_RANK_WEEKLY
} from "../const";
import {getDownloadURL, ref} from "firebase/storage";
import {fbStorage} from "../firebase/features";
import {Slide, useScrollTrigger} from "@mui/material";
import PropTypes from "prop-types";

const pages = [
	{
		mode: SCREEN_MODE_GOOD_WRITER,
		value: '좋은 글을 쓰는 친구들',
	},
	{
		mode: SCREEN_MODE_FAMOUS_BOOK,
		value: '인기 도서'
	},
	{
		mode: SCREEN_MODE_RECENT_REVIEW,
		value: '리뷰'
	},
	{
		mode: SCREEN_MODE_USER_RANK_DAILY,
		value: '오늘의 독서왕'
	},
	{
		mode: SCREEN_MODE_USER_RANK_WEEKLY,
		value: '주간 독서왕'
	},
	{
		mode: SCREEN_MODE_USER_RANK_MONTHLY,
		value: '월간 독서왕'
	},
	{
		mode: SCREEN_MODE_BEST_READER,
		value: '베스트 리더'
	},
	{
		mode: SCREEN_MODE_FIND_USER,
		value: '친구 찾기'
	}
];

const settings = ['Profile', 'Account', 'Dashboard', 'Logout'];

const HideOnScroll = (props) => {
	const { children, window } = props;
	// Note that you normally won't need to set the window ref as useScrollTrigger
	// will default to window.
	// This is only being set here because the demo is in an iframe.
	const trigger = useScrollTrigger({
		target: window ? window() : undefined,
	});

	return (
		<Slide appear={false} direction="down" in={!trigger}>
			{children}
		</Slide>
	);
}

HideOnScroll.propTypes = {
	children: PropTypes.element.isRequired,
	/**
	 * Injected by the documentation to work in an iframe.
	 * You won't need it on your project.
	 */
	window: PropTypes.func,
};

const ResponsiveAppBar = (props) => {
	const {dispatch, logout} = useContext(MyContext);
	console.log("ResponsiveAppBar user=>", props);
	const user = props.user;

	const [anchorElNav, setAnchorElNav] = useState(null);
	const [anchorElUser, setAnchorElUser] = useState(null);
	const [imageUrl, setImageUrl] = useState(null);
	const [title, setTitle] = useState('천권읽기');

	useEffect(() => {
		if (user) {
			const userUrl = `${user.email}`;
			const downloadUrl = user.photoURL; //JSON.parse(window.localStorage.getItem(userUrl));
			console.log("ResponsiveAppBar downloadUrl=>", downloadUrl);

			if (!downloadUrl) {
				let storageRef = ref(fbStorage, `/profile_thumbnails/${userUrl}.png`)
				getDownloadURL(storageRef).then(value => {
					console.log('Me download_url=', value)
					window.localStorage.setItem(userUrl, JSON.stringify(value));
					setImageUrl(value)
				});
			} else {
				setImageUrl(downloadUrl);
			}
		}
	}, [user]);

	const handleOpenNavMenu = (event) => {
		console.log("handleOpenNavMenu=>", event.currentTarget);
		setAnchorElNav(event.currentTarget);
	};
	const handleOpenUserMenu = (event) => {
		console.log("handleOpenUserMenu=>", event.currentTarget);
		setAnchorElUser(event.currentTarget);
	};

	const handleCloseNavMenu = (item) => {
		console.log("handleCloseNavMenu", item);
		setAnchorElNav(null);
		if (item.target.innerText === 'Logout') {
			console.log('Logout~!!!')
			setAnchorElUser(null);
			setImageUrl('');
			logout(dispatch);
			return;
		}
		if (item.target.dataset.index) {
			dispatch({type: ACTION_CHANGE_MODE, mode: item.target.dataset.index});
		} else if(item.target.parentElement.dataset.index) {
			setTitle(item.target.innerText);
			dispatch({type: ACTION_CHANGE_MODE, mode: item.target.parentElement.dataset.index});
		}
	};

	const handleCloseUserMenu = () => {
		setAnchorElUser(null);
	};

	return (
		<HideOnScroll {...props}>
		<AppBar>
			<Container maxWidth="xl">
				<Toolbar disableGutters>
					<Typography
						variant="h6"
						noWrap
						component="div"
						sx={{ mr: 2, display: { xs: 'none', md: 'flex' } }}
					>
						천권읽기
					</Typography>

					<Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
						<IconButton
							size="large"
							aria-label="account of current user"
							aria-controls="menu-appbar"
							aria-haspopup="true"
							onClick={handleOpenNavMenu}
							color="inherit"
						>
							<MenuIcon />
						</IconButton>
						<Menu
							id="menu-appbar"
							anchorEl={anchorElNav}
							anchorOrigin={{
								vertical: 'bottom',
								horizontal: 'left',
							}}
							keepMounted
							transformOrigin={{
								vertical: 'top',
								horizontal: 'left',
							}}
							open={Boolean(anchorElNav)}
							onClose={handleCloseNavMenu}
							sx={{
								display: { xs: 'block', md: 'none' },
							}}
						>
							{pages.map((page) => (
								<MenuItem key={page.mode}
								          data-index={page.mode} onClick={handleCloseNavMenu}>
									<Typography textAlign="center">{page.value}</Typography>
								</MenuItem>
							))}
						</Menu>
					</Box>
					<Typography
						variant="h6"
						noWrap
						component="div"
						sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}
					>
						{title}
					</Typography>
					<Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
						{pages.map((page) => (
							<Button
								key={page.mode}
								data-index={page.mode}
								onClick={handleCloseNavMenu}
								sx={{ my: 2, color: 'white', display: 'block' }}
							>
								{page.value}
							</Button>
						))}
					</Box>

					<Box sx={{ flexGrow: 0 }}>
						<Tooltip title="Open settings">
							<IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
								<Avatar alt="Remy Sharp" src={imageUrl} />
							</IconButton>
						</Tooltip>
						<Menu
							sx={{ mt: '45px' }}
							id="menu-appbar"
							anchorEl={anchorElUser}
							anchorOrigin={{
								vertical: 'top',
								horizontal: 'right',
							}}
							keepMounted
							transformOrigin={{
								vertical: 'top',
								horizontal: 'right',
							}}
							open={Boolean(anchorElUser)}
							onClose={handleCloseUserMenu}
						>
							{settings.map((setting) => (
								<MenuItem key={setting} onClick={handleCloseNavMenu}>
									<Typography textAlign="center">{setting}</Typography>
								</MenuItem>
							))}
						</Menu>
					</Box>
				</Toolbar>
			</Container>
		</AppBar>
		</HideOnScroll>
	);
};

export default ResponsiveAppBar;
