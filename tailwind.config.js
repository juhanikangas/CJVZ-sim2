/**
 * @format
 * @type {import('tailwindcss').Config}
 */

// tailwind.config.js
module.exports = {
	content: ['./src/**/*.{html,js}'],
	theme: {
		extend: {
			transitionDuration: {
				600: '600ms',
			},
			transitionTimingFunction: {
				'in-out': 'ease-in-out',
			},
		},
	},
	plugins: [],
};
