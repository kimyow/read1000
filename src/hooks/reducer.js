import React from 'react';
import {
	ACTION_CHANGE_MODE,
	ACTION_USER_RANK_DATA_RECEIVED,
	ACTION_USER_SELECTED,
	SCREEN_MODE_BOOK_SHELF,
	SCREEN_MODE_INIT
} from "../const";

export const MyContext = React.createContext({});

export const initValues = {
	mode: SCREEN_MODE_INIT,
	userRankList: null,
	selectedUser: null
}

export const stateReducer = (state, action) => {
	console.log("reducer called~!", state, action);
	let newState;
	switch (action.type) {
		case ACTION_CHANGE_MODE: {
			newState = Object.assign({}, state, {
				mode: action.mode
			})
			break;
		}
		case ACTION_USER_RANK_DATA_RECEIVED: {
			newState = Object.assign({}, state, {
				userRankList: action.userRankList
			})
			break;
		}
		case ACTION_USER_SELECTED: {
			newState = Object.assign({}, state, {
				selectedUser: action.user,
				mode: SCREEN_MODE_BOOK_SHELF
			})
			break;
		}
		default:
			newState = initValues;
	}
	console.log("reducer return ===>", newState);
	return newState;
}

export default stateReducer;