/** @format */
const user = {
	username: '',
	exp: 900,
	level: 0,
	skillPoints: 0,
	speed: 650,
	HP: 100,
	wingspan: 60,
	rangeF: 1000,
	miracle: 0,
	prevExpGoal: 0,
	nextExpGoal: 100,
};

const userData = (state = user, action) => {
	console.log('userData.js:', state, action.payload, action.type);
	switch (action.type) {
		case 'UPDATE_USER_LEVEL':
			return {
				...state,
				level: action.payload,
			};
		case 'SET_NEXT_XP_GOAL':
			return {
				...state,
				nextExpGoal: action.payload,
			};
		case 'SET_PREV_XP_GOAL':
			return {
				...state,
				prevExpGoal: action.payload,
			};
		case 'UPDATE_SKILL_POINTS':
			return {
				...state,
				skillPoints: action.payload,
			};
		case 'SPEED_UPGRADE':
			return {
				...state,
				speed: action.payload,
			};
		case 'HP_UPGRADE':
			return {
				...state,
				HP: action.payload,
			};
		case 'WINGSPAN_UPGRADE':
			return {
				...state,
				wingspan: action.payload,
			};
		case 'RANGEF_UPGRADE':
			return {
				...state,
				rangeF: action.payload,
			};
		case 'MIRACLE_UPGRADE':
			return {
				...state,
				miracle: action.payload,
			};
		case 'SET_USERNAME':
			return {
				...state,
				username: action.payload,
			};
		case 'SET_ALL_DATA':
			return {
				...state,
				...action.payload,
			};
		case 'UPDATE_EXP':
			return {
				...state,
				exp: action.payload,
			};
		default:
			return state;
	}
};
export default userData;
