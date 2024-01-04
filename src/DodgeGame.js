/** @format */

// src/DodgeGame.js
import React, { useEffect, useState } from 'react';
import './DodgeGame.css';

const DodgeGame = () => {
	const [playerPosition, setPlayerPosition] = useState({ x: 50, y: 50 });
	const [obstacles, setObstacles] = useState([]);
	const [gameOver, setGameOver] = useState(false);
	const [elapsedTime, setElapsedTime] = useState(0);
	const gameTimeLimit = 30; // Game time limit in seconds
	const [gameWon, setGameWon] = useState(false);

	const playerWidth = 50; // Width of the player in pixels, adjustable variable
	const playerHeight = 25; // Height of the player in pixels
	const obstacleSize = 30; // Obstacle size
	const gameAreaWidth = 500; // Pixels
	const gameAreaHeight = 500; // Pixels

	const [keysPressed, setKeysPressed] = useState({});

	const updatePlayerPosition = () => {
		let newX = playerPosition.x;
		let newY = playerPosition.y;
		const movementIncrement = 2;

		if (keysPressed['ArrowLeft'] && newX > movementIncrement) {
			newX -= movementIncrement;
		}
		if (keysPressed['ArrowRight'] && newX < 100 - movementIncrement) {
			newX += movementIncrement;
		}
		if (keysPressed['ArrowUp'] && newY > movementIncrement) {
			newY -= movementIncrement;
		}
		if (keysPressed['ArrowDown'] && newY < 100 - movementIncrement) {
			newY += movementIncrement;
		}

		setPlayerPosition({ x: newX, y: newY });
	};

	const getGameAreaDimensions = () => {
		const gameContainer = document.querySelector('.game-container');
		return { width: gameContainer.offsetWidth, height: gameContainer.offsetHeight };
	};

	// Updated collision detection function
	const checkCollision = (obstacle) => {
		const { width, height } = getGameAreaDimensions();
		const playerX = (width * playerPosition.x) / 100;
		const playerY = (height * playerPosition.y) / 100;
		const obstacleX = (width * obstacle.x) / 100;
		const obstacleY = obstacle.y;

		if (
			playerX < obstacleX + obstacleSize &&
			playerX + playerWidth > obstacleX &&
			playerY < obstacleY + obstacleSize &&
			playerY + playerHeight > obstacleY
		) {
			return true;
		}
		return false;
	};

	useEffect(() => {
		const handleKeyDown = (event) => {
			if (!gameOver && !gameWon) {
				let newX = playerPosition.x;
				let newY = playerPosition.y;

				const movementIncrement = 2; // Reduced from 5 to 2 for finer movement control

				if (event.key === 'ArrowLeft' && playerPosition.x > movementIncrement) {
					newX -= movementIncrement;
				} else if (event.key === 'ArrowRight' && playerPosition.x < 100 - movementIncrement) {
					newX += movementIncrement;
				} else if (event.key === 'ArrowUp' && playerPosition.y > movementIncrement) {
					newY -= movementIncrement;
				} else if (event.key === 'ArrowDown' && playerPosition.y < 100 - movementIncrement) {
					newY += movementIncrement;
				}

				setPlayerPosition({ x: newX, y: newY });
			}
		};

		window.addEventListener('keydown', handleKeyDown);

		let interval;
		let timer;
		if (!gameOver && !gameWon) {
			interval = setInterval(() => {
				setObstacles((oldObstacles) => {
					const newObstacles = oldObstacles.map((obstacle) => ({ ...obstacle, y: obstacle.y + 10 })); // Moving 10 pixels each interval
					if (newObstacles.some(checkCollision)) {
						setGameOver(true);
						clearInterval(interval);
						return oldObstacles;
					}
					return [...newObstacles, { x: Math.random() * (100 - (obstacleSize / gameAreaWidth) * 100), y: 0 }];
				});
			}, 100); // Interval remains the same
			timer = setInterval(() => {
				setElapsedTime((prevTime) => {
					if (prevTime + 1 === gameTimeLimit) {
						clearInterval(interval);
						clearInterval(timer);
						setGameWon(true);
					}
					return prevTime + 1;
				});
			}, 1000); // Increment every second
		}

		return () => {
			window.removeEventListener('keydown', handleKeyDown);
			if (interval) clearInterval(interval);
			if (timer) clearInterval(timer);
		};
	}, [playerPosition, gameOver, gameWon]);
	const resetGame = () => {
		setObstacles([]);
		setGameOver(false);
		setPlayerPosition({ x: 50, y: 50 });
	};

	return (
		<div className='game-container'>
			{!gameOver && (
				<div
					className='player'
					style={{
						left: `${playerPosition.x}%`,
						top: `${playerPosition.y}%`,
						width: `${playerWidth}px`,
						height: `${playerHeight}px`,
					}}></div>
			)}
			{obstacles.map((obstacle, index) => (
				<div
					key={index}
					className='obstacle'
					style={{ left: `${obstacle.x}%`, top: `${obstacle.y}px` }}></div>
			))}
			<div className='timer'>
				Time: {elapsedTime} / {gameTimeLimit} seconds
			</div>
			{gameOver && (
				<div className='game-over'>
					Game Over
					<button onClick={resetGame}>Start Again</button>
				</div>
			)}
			{gameWon && (
				<div className='game-over'>
					You Win!
					<button onClick={resetGame}>Play Again</button>
				</div>
			)}
		</div>
	);
};

export default DodgeGame;
