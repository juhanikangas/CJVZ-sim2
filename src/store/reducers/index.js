/** @format */

import { combineReducers } from 'redux';
import userData from './userData';
import authReducer from './userReducers';
export default combineReducers({
	userData: userData,
	auth: authReducer,
});
