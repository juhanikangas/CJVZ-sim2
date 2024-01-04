/** @format */

import { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { IoIosAdd } from 'react-icons/io';
import { getUserData, signoutAction, updateStat } from '../store/actions/userActions';
import reducers from '../store/reducers';
import Logo from '../imgs/Logo.png';

//TODO
// lisätä userdataa

export default function Menu() {
	const dispatch = useDispatch();
	const user = useSelector((state) => state.userData);


	//Stats
	const [speed, setSpeed] = useState(user.speed);
	const [healthPoints, setHealthPoints] = useState(user.HP);
	const [wingspan, setWingspan] = useState(user.wingspan);
	const [rangeF, setRangeF] = useState(user.rangeF);
	const [miracle, setMiracle] = useState(user.miracle);

	const handleSignout = () => {
		dispatch(signoutAction(user));
	};

	const reduceSkillPoint = () =>{
		dispatch({
			type: 'UPDATE_SKILL_POINTS',
			payload: user.skillPoints - 1,
		});
	}

	const handleUpgrade = (stat, newState) => {
		const requestData = {
			username: user.username,
			stat: stat,
			value: newState,
		};
		dispatch(updateStat(requestData));
		dispatch({
			type: stat + '_UPGRADE',
			payload: newState,
		});
	};

	const getPercentage = (num, min, max) => {
		if (min === max) {
			return 0;
		}
		let percentage = ((num - min) / (max - min)) * 100;
		if (percentage > 100) {
			return 100;
		} else if (percentage < 0) {
			return 0;
		} else {
			return percentage;
		}
	};

	const Stat = ({ value, name, description, upgrade, maxValue, width, units }) => {
		return (
			<div className=' text-sm bg-[#373A3E] rounded-lg p-2 text-white w-full '>
				<div className='flex flex-row  items-center justify-between'>
					<span className='text-lg pl-1'>{name}</span>
					<span className='mr-11'>{`${value} ${units}`}</span>
				</div>

				<div className='h-5 flex flex-row items-center'>
					<div className='h-2 w-full bg-[#1F2124] rounded-full'>
						<div
							className={`h-full rounded-full bg-[#4d799f]`}
							style={{
								width: `${width}%`,
								transition: 'width 0.1s linear',
							}}
						/>
					</div>

					<div className='ml-4 rounded-md w-6 h-6 flex bg-[#5a5d60] items-center justify-center'>
						<button className='text-[#70a0ca] material-icons font-bold  ' onClick={upgrade}>
							add
						</button>
					</div>
				</div>
				{/* <p className="text-xs mt-1 mr-9">{description}</p> */}
			</div>
		);
	};

	return (
		<div className={`  select-none z-10 h-full px-1   flex  bg-[#1F2124] w-[300px] `}>
			<div className='flex w-full'>
				<div className='flex flex-col w-full '>
					<div className='flex items-center justify-center h-full'>
						<img src={Logo} className='h-[150px] opacity-80 ' />
					</div>
					<div className='mx-3 flex flex-col'>
						<p className='text-white text-lg mt-4'>Level: {user.level}</p>
						<p className='text-[#c9c9c9]  text-sm mt-1'>
							Next level at: {user.exp}xp/{user.nextExpGoal}xp
						</p>

						<div className='h-3 w-full bg-[#141619] rounded-full mt-2'>
							<div
								className={`h-full rounded-full bg-[#34a491]`}
								style={{
									width: `${getPercentage(user.exp, user.prevExpGoal, user.nextExpGoal)}%`,
									transition: 'width 0.1s linear',
								}}
							/>
						</div>
						<br />
						<br />

						<span className='text-gray-400  my-3 text-lg flex flex-row gap-x-4 justify-between mr-14'>
							<span>Skill Points Available</span>
							<span className=''>{user.skillPoints}</span>
						</span>
					</div>

					<div className='text-[#c9c9c9] flex flex-col gap-y-4 px-1.5 '>
						<Stat
							value={speed}
							maxValue={1000}
							width={getPercentage(speed, 650, 1000)}
							name='Speed'
							units='km/h'
							description='Dictates the duration of your flight and the velocity of
		  your plane within the game. Upgrade your speed to shorten travel
		  times and experience the thrill of faster, high-paced flights'
							upgrade={() => {
								if (speed < 1000 && user.skillPoints) {
									handleUpgrade('SPEED', speed + 50);
									setSpeed(speed + 50);
									reduceSkillPoint()
								}
							}}
						/>

						<Stat
							value={healthPoints}
							maxValue={400}
							width={getPercentage(healthPoints, 100, 400)}
							name='Durability'
							units='HP'
							description="Boost your plane's toughness for enhanced survival. A
            more durable aircraft means you can withstand more obstacles,
            ensuring increased resilience in challenging situations."
							upgrade={() => {
								if (healthPoints < 400 && user.skillPoints) {
									handleUpgrade('HP', healthPoints + 30);
									setHealthPoints(healthPoints + 30);
									reduceSkillPoint()
								}
							}}
						/>

						<Stat
							value={wingspan}
							maxValue={28}
							width={100 - getPercentage(wingspan, 28, 60)}
							name='Wingspan'
							units='m'
							description='Navigate with agility and precision through tight spaces
		  by opting for a smaller wingspan, enabling your aircraft to maneuver
		  seamlessly and fit snugly between obstacles.'
							upgrade={() => {
								if (wingspan > 28 && user.skillPoints) {
									handleUpgrade('WINGSPAN', wingspan - 4);
									setWingspan(wingspan - 4);
									reduceSkillPoint()
								}
							}}
						/>

						<Stat
							value={rangeF}
							maxValue={10000}
							width={getPercentage(rangeF, 1000, 10000)}
							name='Fuel Capacity'
							units='l'
							description="Enhance your aircraft's endurance for extended
		  journeys with a larger fuel capacity, allowing for more extended and
		  ambitious flights."
							upgrade={() => {
								if (rangeF < 10000 && user.skillPoints) {
									handleUpgrade('RANGEF', rangeF + 400);
									setRangeF(rangeF + 400);
									reduceSkillPoint()
								}
							}}
						/>
						<Stat
							value={miracle}
							maxValue={50}
							width={getPercentage(miracle, 0, 50)}
							name='Miracle'
							units='%'
							description='[Miracle]: Harness the power of chance to your advantage! In dire
        situations where your health is depleted, this ability grants you a
        miraculous opportunity to make a safe emergency landing at the nearest
        airport, ensuring a chance for survival.'
							upgrade={() => {
								if (miracle < 50 && user.skillPoints) {
									handleUpgrade('MIRACLE', miracle + 10);
									setMiracle(miracle + 10);
									reduceSkillPoint()
								}
							}}
						/>
					</div>
					<div className=' h-full flex items-end mb-4'>
						<button
							className=' text-gray-500 py-2 px-4 rounded hover:bg-gray-800 material-icons '
							onClick={() => {
								localStorage.removeItem('isAuthenticated');
								localStorage.removeItem('userName');
								window.location.reload();
							}}>
							logout
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}
