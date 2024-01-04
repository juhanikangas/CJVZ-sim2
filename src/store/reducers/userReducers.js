/** @format */

const initialState = {
	user: null,
	isAuthenticated: false,
	errorMsg: null,
};

const authReducer = (state = initialState, action) => {
	console.log("authreducer: ", state, action.payload, action.type);
	switch (action.type) {
		case 'LOGIN_SUCCESS':
			const { payload } = action;
			return {
				...state,
				user: payload,
				isAuthenticated: true,
				errorMsg: null,
			};
		case 'LOGIN_FAILED':
			return {
				...state,
				errorMsg: action.payload,
			};
		case 'SIGNUP_SUCCESS':
			return {
				...state,
				user: action.payload,
				isAuthenticated: true,
				errorMsg: null,
			};
		case 'SIGNUP_FAILED':
			return {
				...state,
				errorMsg: action.payload,
			};
		case 'SIGNOUT':
			return {
				...state,
				isAuthenticated: false,
			};
		case 'SIGNOUT_FAILED':
			return {
				...state,
				errorMsg: action.payload,
			};
		default:
			return state;
	}
};

export default authReducer;
