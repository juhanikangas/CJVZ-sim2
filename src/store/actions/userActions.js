/** @format */

import { HttpClient } from './helpers';

export const loginSuccess = (userData) => ({
	type: 'LOGIN_SUCCESS',
	payload: userData,
});

export const loginFailed = (error) => ({
	type: 'LOGIN_FAILED',
	payload: error,
});

export const signupSuccess = (userData) => ({
	type: 'SIGNUP_SUCCESS',
	payload: userData,
});

export const signupFailed = (error) => ({
	type: 'SIGNUP_FAILED',
	payload: error,
});

export const signoutSuccess = () => ({
	type: 'SIGNOUT',
});

export const setUserStats = (userData) => {
	const userDataToUpdate = {
		HP: userData.HP,
		exp: userData.exp,
		range: userData.range,
		level: userData.level,
		miracle: userData.miracle,
		skillPoints: userData.skillPoints,
		speed: userData.speed,
		wingspan: userData.wingspan,
	};
	return {
		type: 'SET_ALL_STATS',
		payload: userDataToUpdate,
	};
};

export const storeAuthencation = (userData, dispatch) => {
	localStorage.setItem('isAuthenticated', 'true');
	localStorage.setItem('userName', userData.username);

	dispatch({
		type: 'SET_ALL_DATA',
		payload: {
			username: userData.username,
			HP: userData.HP,
			exp: userData.exp,
			rangeF: userData.rangeF,
			level: userData.level,
			miracle: userData.miracle,
			skillPoints: userData.skillPoints,
			speed: userData.speed,
			wingspan: userData.wingspan,
		},
	});
};

export const loginAction = (credentials) => {
	const url = 'http://127.0.0.1:3001/login';
	return (dispatch) => {
		HttpClient.request(url, 'POST', credentials)
			.then((response) => {
				console.log(response);
				if (response.success) {
					storeAuthencation(response.userData, dispatch);
					dispatch(loginSuccess(response));
				} else {
					dispatch(loginFailed(response.message));
				}
			})
			.catch((error) => {
				dispatch(loginFailed('Oops! Something went wrong on our end. Please try again later.'));
			});
	};
};

export const signupAction = (credentials) => {
	const url = 'http://127.0.0.1:3001/signup';
	return (dispatch) => {
		HttpClient.request(url, 'POST', credentials)
			.then((response) => {
				console.log(response);
				if (response.success) {
					storeAuthencation(response.userData, dispatch);
					dispatch(signupSuccess(response.userData));
				} else {
					dispatch(signupFailed(response.message));
				}
			})
			.catch((error) => {
				dispatch(signupFailed('Oops! Something went wrong on our end. Please try again later.'));
			});
	};
};

export const signoutAction = (userData) => {
	const url = 'http://127.0.0.1:3001/save-userdata';
	console.log(userData);
	return (dispatch) => {
		HttpClient.request(url, 'POST', userData)
			.then((response) => {
				console.log(response);
				if (response.success) {
					localStorage.removeItem('isAuthenticated');
					localStorage.removeItem('userName');
					dispatch(signoutSuccess());
				} else {
					console.log(response.message);
				}
			})
			.catch((error) => {
				console.log(error);
			});
	};
};

export const updateStat = (requestData) => {
	const url = 'http://127.0.0.1:3001/update-stat';
	return (dispatch) => {
		HttpClient.request(url, 'POST', requestData)
			.then((response) => {
				console.log(response.message);
			})
			.catch((error) => {
				console.error(error);
			});
	};
};

export const getUserData = (username) => {
	const url = 'http://127.0.0.1:3001/get-user-data';
	console.log('username: ', username);
	const user = { username: username };
	return (dispatch) => {
		HttpClient.request(url, 'POST', user)
			.then((response) => {
				console.log(response);
			})
			.catch((error) => {
				console.log(error);
			});
	};
};
