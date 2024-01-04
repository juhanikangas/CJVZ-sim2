/** @format */

const allData = {
	user: {
		exp: 900,
		level: 0,
		skillPoints: 0,
		stats: { speed: 200, HP: 100, wingspan: 60, range: 1000, miracle: 0 },
	},
	flightData: {
		departureICAO: '',
		destinationICAO: '',
		flightDuration: 0,
		potentialCrashICAOs: [],
	},
	game: {
		currentHealth: 0,
		gatheredExp: 0,
		closestCrashICAO: '',
	},
	gameStop: {
		expEarned: 0,
		landingICAO: '',
	},
};

const DATABASE = {
    username: "",
    password: "",
	exp: 900,
	level: 0,
	skillPoints: 0,
	stats: { speed: 200, HP: 100, wingspan: 60, range: 1000, miracle: 0 },
	departureICAO: '',
};

const LOCALSTORAGE = {
    username: "",
    isAuthenticated: false
}