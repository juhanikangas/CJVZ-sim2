/** @format */

import { useDispatch, useSelector } from "react-redux";

import { useEffect, useState } from "react";

import { loginAction, signupAction } from "../store/actions/userActions";
import { ReactComponent as EyeOpenIcon } from "../imgs/eyeOpen.svg";
import { ReactComponent as EyeClosedIcon } from "../imgs/eyeClosed.svg";
export default function Login() {
	const dispatch = useDispatch();
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');
	const [passwordVisible, setPasswordVisible] = useState(false);
	const error = useSelector((state) => state?.authReducer?.errorMsg);

	const handleChange = (event) => {
        const { name, value } = event.target;
        const regex = /^[A-Za-z0-9]+$/;

        if (regex.test(value) || value === "") {
            if (name === "password") {
                setPassword(value);
            } else if (name === "username") {
                setUsername(value);
            }
        }
    };

	const handleSignup = () => {
		dispatch(signupAction({ username: username, password: password }));
	};

  const handleLogin = () => {
    dispatch(loginAction({ username: username, password: password }));
  };

  return (
    <div className="  select-none z-10 h-full px-4 flex bg-[#1F2124] w-[300px] items-center justify-center ">
      <div className="w-full">
        <div className="mb-4">
          <label htmlFor="usernameInput" className="block text-white">
            Username
          </label>
          <input
		  	name="username"
            type="text"
            id="usernameInput"
            autoComplete="off"
            value={username}
            onChange={handleChange}
            className="p-2  w-full rounded bg-black border-none text-white"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="passwordInput" className="block text-white">
            Password
          </label>
          <div className="relative">
            <input
			  name="password"	
              type={passwordVisible ? "text" : "password"}
              autoComplete="off"
              id="passwordInput"
              value={password}
              onChange={handleChange}
              className="p-2  w-full rounded bg-black border-none text-white"
            />
            <div
              className="absolute top-1/2 transform -translate-y-1/2 right-3 cursor-pointer"
              onMouseDown={() => setPasswordVisible(true)}
              onMouseUp={() => setPasswordVisible(false)}
              onMouseOut={() => setPasswordVisible(false)}
            >
              {passwordVisible ? (
                // Eye icon when password is visible
                // Eye icon when password is visible
                <EyeOpenIcon className="h-5 w-5" fill="#FFFFFF" />
              ) : (
                // Closed eye icon when password is not visible
                <EyeClosedIcon className="h-5 w-5" fill="#FFFFFF" />
              )}
            </div>
          </div>
        </div>

        <div className="flex justify-between w-full mt-4">
          <button
            className="bg-[#373A3E] text-white py-2 px-4 rounded w-2/5 hover:bg-[#5a5d60] focus:border-0 focus:outline-0 focus:ring-0"
            onClick={handleSignup}
          >
            Sign Up
          </button>
          <button
            className="bg-[#373A3E] text-white py-2 px-4 rounded w-2/5 hover:bg-[#5a5d60]"
            onClick={handleLogin}
          >
            Log In
          </button>
        </div>
        <div className="text-red-500">
          {<div className="text-red-500">{error}</div>}
        </div>
      </div>
    </div>
  );
}
