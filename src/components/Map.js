/** @format */

import { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import {
	GoogleMap,
	OverlayView,
	Marker,
	DirectionsRenderer,
	Circle,
	MarkerClusterer,
	Polyline,
	InfoWindow,
} from '@react-google-maps/api';
import Places from './Places';
import Distance from './Distance';
import { FillStyle } from 'pixi.js';

// import Places from "./places";
// import Distance from "./distance";
import Login from './Login';
import Menu from './Menu';
import { useSelector, useDispatch } from 'react-redux';

import airplane_pointer from '../imgs/airplane_pointer5.png';
import aiport_pointer from '../imgs/m1.png';
import selected_aiport_pointer from '../imgs/finish.png';
import BoardingPass from './BoardingPass';
import BoardingPass2 from './BoardingPass2';

import not_allowed from '../imgs/Not_allowed.svg.png';
// import GameEndInfo from './GameEndInfo';

// TODO
// search airport

const Airportss = require('../airports.json');

export default function Map() {
	const dispatch = useDispatch();
	const google = window.google;
	const mapRef = useRef(null);
	const [polypath, setPolypath] = useState([]);
	const [directions, setDirections] = useState();
	const center = useMemo(() => ({ lat: 28.04444, lng: -16.5725 }), []);
	const centerLat = 28.04444;
	const centerLng = -16.5725;

	const [currentAirport, setCurrentAirport] = useState({
		continent: 'EU',
		elevation_ft: 1080,
		gps_code: 'GCHU',
		home_link: '',
		iata_code: '',
		id: 43272,
		ident: 'GCHU',
		iso_country: 'ES',
		iso_region: 'ES-CN',
		keywords: '',
		latitude_deg: '28.456199645996094',
		local_code: '',
		longitude_deg: '-16.29210090637207',
		municipality: 'Tenerife Island',
		name: 'Hospital Universitario De Canarias Heliport',
		scheduled_service: 'no',
		type: 'heliport',
		wikipedia_link: '',
	});
	const [selectedAirport, setSelectedAirport] = useState(null);
	const [selectedAirports, setSelectedAirports] = useState([]);

	const [hoveredAirport, setHoveredAirport] = useState(null);

	const [rotatedIconUrl, setRotatedIconUrl] = useState('');
	const [overRange, setOverRange] = useState('');
	const user = useSelector((state) => state.userData);
	const [flightData, setFlightData] = useState({});
	const [flightCords, setFlightCords] = useState({});

	const [dangerCoordinates, setDangerCoordinates] = useState(generateRandomCoordinates(100));

	const [airplaneCoordinates, setAirplaneCoordinates] = useState({
		latitude_deg: '28.456199645996094',
		longitude_deg: '-16.29210090637207',
	});

	const onLoad = useCallback((map) => (mapRef.current = map), []);
	const Airports = useMemo(() => Airportss);

	const options = useMemo(
		() => ({
			mapId: 'b181cac70f27f5e6',
			disableDefaultUI: true,
			clickableIcons: false,
			fillColor: '#FFF',

			restriction: {
				latLngBounds: {
					north: 85.0,
					south: -85.0,
					east: 180,
					west: -180,
				},
				strictBounds: true,
			},
		}),
		[]
	);
	const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';

	useEffect(() => {
		rotateAndSetIcon(airplane_pointer, 10);
	}, [isAuthenticated]);

	useEffect(() => {
		console.log(hoveredAirport);
	}, [hoveredAirport]);

	useEffect(() => {
		function calculateTotalDistance(polypaths) {
			if (!flightCords?.from || !flightCords?.to || !user?.speed) return;
			const R = 6371; // Earth's radius in kilometers

			const toRadians = (degree) => (degree * Math.PI) / 180;

			const haversineDistance = (start, end) => {
				const lat1 = toRadians(start?.lat);
				const lat2 = toRadians(end.lat);
				const deltaLat = toRadians(end.lat - start?.lat);
				const deltaLng = toRadians(end.lng - start?.lng);

				const a =
					Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
					Math.cos(lat1) * Math.cos(lat2) * Math.sin(deltaLng / 2) * Math.sin(deltaLng / 2);
				const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

				return R * c; // Distance in kilometers
			};

			let totalDistance = 0;
			for (let i = 0; i < selectedAirports?.length - 1; i++) {
				totalDistance += haversineDistance(
					selectedAirports[i]?.polypath[0],
					selectedAirports[i]?.polypath[1]
				);
			}

			const minScaledDuration = 15;
			const maxScaledDuration = 300;

			let scaledDuration =
				minScaledDuration +
				((maxScaledDuration - minScaledDuration) * ((totalDistance - 10) / (20000 - 10))) /
					(user?.speed / 650);

			setFlightData({
				distanceKM: Math.round(totalDistance),
				flightDuration: Math.round(scaledDuration),
			});
			console.log('distance:', totalDistance);
		}

		calculateTotalDistance();
	}, [selectedAirports, user?.speed]);

	const fetchDirections = (airport) => {
		setSelectedAirport(airport);

		setSelectedAirports((previousAirports) => [
			...(previousAirports ?? []),
			{
				airport: airport,
				polypath: [
					{
						lat: parseFloat(
							previousAirports?.length > 0
								? previousAirports[previousAirports?.length - 1].airport?.latitude_deg
								: currentAirport.latitude_deg
						),
						lng: parseFloat(
							previousAirports?.length > 0
								? previousAirports[previousAirports?.length - 1].airport?.longitude_deg
								: currentAirport.longitude_deg
						),
					},
					{
						lat: parseFloat(airport.latitude_deg),
						lng: parseFloat(airport.longitude_deg),
					},
				].filter(Boolean), // This will remove the null if previousAirports is empty
			},
		]);
		console.info('AIRPORTS', selectedAirports);
		setFlightCords({
			from: [parseFloat(currentAirport.latitude_deg), parseFloat(currentAirport.longitude_deg)],
			to: [parseFloat(airport.latitude_deg), parseFloat(airport.longitude_deg)],
		});
		setPolypath([
			{
				lat: parseFloat(currentAirport.latitude_deg),
				lng: parseFloat(currentAirport.longitude_deg),
			},
			{
				lat: parseFloat(airport.latitude_deg),
				lng: parseFloat(airport.longitude_deg),
			},
		]);

		const origin = new google.maps.LatLng(
			parseFloat(currentAirport.latitude_deg),
			parseFloat(currentAirport.longitude_deg)
		);
		const destination = new google.maps.LatLng(
			parseFloat(airport.latitude_deg),
			parseFloat(airport.longitude_deg)
		);

		const distanceInMeters = google?.maps?.geometry?.spherical.computeDistanceBetween(origin, destination);
		const distanceInKilometers = distanceInMeters / 1000;

		console.info(`Distance: ${distanceInKilometers} kilometers`);

		setOverRange(distanceInKilometers > user?.rangeF);
		console.log('OverRange:', distanceInKilometers > user?.rangeF);

		var airportLoc = {
			lat: parseFloat(currentAirport.latitude_deg),
			lng: parseFloat(currentAirport.longitude_deg),
		};

		var airplaneLoc = {
			latitude_deg: parseFloat(airport.latitude_deg),
			longitude_deg: parseFloat(airport.longitude_deg),
		};

		console.info([airportLoc, airplaneLoc]);

		var centerCoord = getGeodesicCenter(airportLoc, airplaneLoc);

		console.info('Center', centerCoord);

		// setMapToBounds(centerCoord, distanceInKilometers * 20);

		// if (mapRef.current) {
		//   const bounds = new window.google.maps.LatLngBounds();

		//   bounds.extend(
		//     new window.google.maps.LatLng(
		//       parseFloat(currentAirport.latitude_deg),
		//       parseFloat(currentAirport.longitude_deg)
		//     )
		//   );
		//   bounds.extend(
		//     new window.google.maps.LatLng(
		//       parseFloat(airplaneLoc.latitude_deg),
		//       parseFloat(airplaneLoc.longitude_deg)
		//     )
		//   );

		//   mapRef.current.fitBounds(bounds, {
		//     top: 100,
		//     right: 100,
		//     bottom: 200,
		//     left: 100,
		//   });
		// }

		const currentPosition = new google.maps.LatLng(
			parseFloat(currentAirport.latitude_deg),
			parseFloat(currentAirport.longitude_deg)
		);
		const nextPosition = new google.maps.LatLng(
			parseFloat(airplaneLoc.latitude_deg),
			parseFloat(airplaneLoc.longitude_deg)
		); // Define nextPoint accordingly
		const heading = calculateHeading(currentPosition, nextPosition); // Use the calculateHeading function from earlier
		rotateAndSetIcon(airplane_pointer, heading);

		// const service = new google.maps.DirectionsService();
		// service.route(
		//   {
		//     geodesic: true,
		//     origin: { lat: currentAirport.lat, lng: currentAirport.lng },
		//     destination: {
		//       lat: parseFloat(airport.latitude_deg),
		//       lng: parseFloat(airport.longitude_deg),
		//     },
		//     travelMode: google.maps.Polyline.Distance,
		//   },
		//   (result, status) => {
		//     console.info([result, status]);
		//     if (status === "OK" && result) {
		//       console.info(result);
		//       setDirections(result);
		//     }
		//   }
		// );
	};

	const rotateAndSetIcon = (imageSrc, degrees) => {
		const img = new Image();
		img.onload = () => {
			const canvas = document.createElement('canvas');
			const ctx = canvas.getContext('2d');
			canvas.width = canvas.height = Math.sqrt(img.width ** 2 + img.height ** 2); // To fit the rotated image
			ctx.translate(canvas.width / 2, canvas.height / 2); // Set rotation center
			ctx.rotate(((degrees - 185) * Math.PI) / 180); // Convert degrees to radians
			ctx.drawImage(img, -img.width / 2, -img.height / 2); // Draw the image
			setRotatedIconUrl(canvas.toDataURL()); // Update state with new icon
		};
		img.src = imageSrc;
	};

	function getGeodesicCenter(coord1, coord2) {
		var lat1 = (coord1.lat * Math.PI) / 180;
		var lon1 = (coord1.lng * Math.PI) / 180;
		var lat2 = (coord2.lat * Math.PI) / 180;
		var dLon = ((coord2.lng - coord1.lng) * Math.PI) / 180;

		var bx = Math.cos(lat2) * Math.cos(dLon);
		var by = Math.cos(lat2) * Math.sin(dLon);
		var lat3 = Math.atan2(
			Math.sin(lat1) + Math.sin(lat2),
			Math.sqrt((Math.cos(lat1) + bx) * (Math.cos(lat1) + bx) + by * by)
		);
		var lon3 = lon1 + Math.atan2(by, Math.cos(lat1) + bx);

		return {
			lat: (lat3 * 180) / Math.PI,
			lng: (lon3 * 180) / Math.PI,
		};
	}

	const clusterStyles = [
		{
			textColor: 'white',
			url: 'https://superstorefinder.net/support/wp-content/uploads/2015/07/m1.png',
			height: 50,
			width: 50,
		},
		{
			textColor: 'white',
			url: 'https://superstorefinder.net/support/wp-content/uploads/2015/07/m1.png',
			height: 60,
			width: 60,
		},
		{
			textColor: 'white',
			url: 'https://superstorefinder.net/support/wp-content/uploads/2015/07/m1.png',
			height: 70,
			width: 70,
		},
	];

	const clusterOptions = {
		styles: clusterStyles,
	};

	function calculateHeading(start, end) {
		var startLat = google?.maps?.geometry?.spherical.computeOffset(start, 1000, 0).lat();
		var startLng = google?.maps?.geometry?.spherical.computeOffset(start, 1000, 90).lng();
		var dLng = end.lng() - startLng;
		var dLat = end.lat() - startLat;
		return (Math.atan2(dLng, dLat) * 180) / Math.PI;
	}

	function generateRandomCoordinates(numCoords) {
		const coordinates = [];
		for (let i = 0; i < numCoords; i++) {
			// Latitude ranges from -90 to 90
			const lat = Math.random() * 180 - 90;
			// Longitude ranges from -180 to 180
			const lng = Math.random() * 360 - 180;
			const size = Math.random() * (1000 - 10) + 10;

			coordinates.push({ lat: lat, lng: lng, size: size });
		}
		return coordinates;
	}

	function randomBetween(min, max) {
		return Math.random() * (max - min) + min;
	}

	function updateCoordinates(currentCoords) {
		return currentCoords.map((coord, i) => {
			// Define the maximum change in degrees for the drift
			const maxLatDrift = 0.1; // maximum latitude drift
			const maxLngDrift = 0.3; // maximum longitude drift

			// Generate a small random change for latitude and longitude
			const latChange = randomBetween(-maxLatDrift, maxLatDrift);
			const lngChange = randomBetween(-maxLngDrift / 2, maxLngDrift);

			// Update the latitude and longitude with the random change, ensuring they remain valid
			const newLat = Math.min(90, Math.max(-90, coord.lat + latChange));
			const newLng = Math.min(180, Math.max(-180, coord.lng + lngChange));

			// Return the updated coordinates
			return { lat: newLat, lng: newLng, size: coord.size };
		});
	}

	function updateCoordinates(currentCoords) {
		const targetLat = parseFloat(currentAirport.latitude_deg);
		const targetLng = parseFloat(currentAirport.longitude_deg);
		return currentCoords.map((coord) => {
			// Define the maximum change in degrees for the drift
			const maxLatDrift = 0.01; // maximum latitude drift
			const maxLngDrift = 0.03; // maximum longitude drift

			// Calculate the direction of drift towards the target coordinates
			const latDirection = (targetLat - coord.lat) / Math.abs(targetLat - coord.lat || 1);
			const lngDirection = (targetLng - coord.lng) / Math.abs(targetLng - coord.lng || 1);

			// Generate a small directed change for latitude and longitude
			let latChange = latDirection * Math.min(maxLatDrift, Math.abs(targetLat - coord.lat));
			let lngChange = lngDirection * Math.min(maxLngDrift, Math.abs(targetLng - coord.lng));

			latChange = randomBetween(-maxLatDrift, maxLatDrift);

			// Update the latitude and longitude with the directed change, ensuring they remain valid
			const newLat = Math.min(90, Math.max(-90, coord.lat + latChange));
			const newLng = Math.min(180, Math.max(-180, coord.lng + lngChange));

			// Return the updated coordinates
			return { lat: newLat, lng: newLng, size: coord.size };
		});
	}

	useEffect(() => {
		const DangerIntervat = setInterval(() => {
			setDangerCoordinates((currentCoords) => updateCoordinates(currentCoords));
		}, 500);

		// Clear interval on component unmount
		return () => {
			clearInterval(DangerIntervat);
		};
	}, []);

	function animateAirplane() {
		const airplanes = selectedAirports;
		let currentAirportIndex = 0;
		let currentSegmentIndex = 0;
		let segmentProgress = 0;
		let segmentDuration = 0; // This will be calculated based on distance

		function calculateDistance(start, end) {
			// Simple distance calculation (Pythagorean theorem)
			const latDist = end.lat - start?.lat;
			const lngDist = end.lng - start?.lng;
			return Math.sqrt(latDist * latDist + lngDist * lngDist);
		}

		function calculateSegmentDuration(start, end) {
			const distance = calculateDistance(start, end);
			// Assuming a constant speed, calculate duration based on distance
			// This constant can be adjusted to represent the speed of the airplane
			const speed = 0.001; // units of degrees per millisecond
			return distance / speed;
		}

		function move() {
			const currentAirportMove = airplanes[currentAirportIndex];
			const polypath = currentAirportMove?.polypath;

			if (currentSegmentIndex === 0 || segmentProgress === 0) {
				// Calculate segment duration when starting a new segment
				segmentDuration = calculateSegmentDuration(
					polypath[currentSegmentIndex],
					polypath[currentSegmentIndex + 1]
				);
			}

			const start = polypath[currentSegmentIndex];
			const end = polypath[currentSegmentIndex + 1];

			if (!start || !end) {
				// Proceed to the next airport or stop if finished
				currentAirportIndex++;
				if (currentAirportIndex >= airplanes.length) {
					clearInterval(intervalId); // Stop the animation
					return;
				}
				currentSegmentIndex = 0;
				return; // Start with the new polypath on next interval
			}

			const t = segmentProgress / segmentDuration;
			const nextLat = start?.lat + (end.lat - start?.lat) * t;
			const nextLng = start?.lng + (end.lng - start?.lng) * t;

			// Update the airplane's position
			setAirplaneCoordinates({ latitude_deg: nextLat, longitude_deg: nextLng });

			// Increment progress
			segmentProgress += 100;
			if (segmentProgress >= segmentDuration) {
				setSelectedAirports((prevAirports) => prevAirports.slice(1));
				// Reset for the next segment

				segmentProgress = 0;
				currentSegmentIndex++;
				if (currentSegmentIndex >= polypath.length - 1) {
					// End of the current polypath, proceed to the next airport
					currentAirportIndex++;
					currentSegmentIndex = 0;

					if (currentAirportIndex >= airplanes.length) {
						let goal = user.nextExpGoal;
						let prevGoal = user.prevExpGoal;
						let lvl = user.level;
            let expg = flightData.flightDuration * 21
						for (let i = 10; i <= user.exp + expg; i += 10) {
							if (i >= goal) {
								prevGoal = goal;
								lvl++;
								goal = Math.floor((goal * (lvl + 100)) / ((lvl + 100) / 1.37));
							}
						}
		
            
						dispatch({
							type: 'UPDATE_USER_LEVEL',
							payload: lvl,
						});
						dispatch({
							type: 'UPDATE_SKILL_POINTS',
							payload: lvl * 2,
						});
            dispatch({
							type: 'UPDATE_EXP',
							payload: user.exp + expg,
						});
            dispatch({
							type: 'SET_NEXT_XP_GOAL',
							payload: goal,
						});
            dispatch({
							type: 'SET_PREV_XP_GOAL',
							payload: prevGoal,
						});
						// if (localStorage.getItem('isAuthenticated') === 'true') {
						// 	const username = localStorage.getItem('userName');
						// 	console.log('localstorage name ', username);
						// 	dispatch({ type: 'SET_USERNAME', payload: username });
						// 	getUserData(username);
						// }
						console.log('SA', selectedAirports[0].airport, currentAirport);
						setCurrentAirport(selectedAirports[selectedAirports.length - 1]?.airport);
						setSelectedAirport(null);
						setSelectedAirports([]);
						setAirplaneCoordinates({
							latitude_deg: end.lat,
							longitude_deg: end.lng,
						});
						clearInterval(intervalId); // Stop the animation
					}
				}
			}
		}

		// Start the animation
		const intervalId = setInterval(move, 100); // Update every 100ms
	}

	return (
		<div className='flex flex-row'>
			<div>{(!isAuthenticated && <Login />) || <Menu />}</div>

			<div className='flex w-full'>
				<GoogleMap
					zoom={10}
					center={center}
					mapContainerClassName='map-container'
					options={options}
					onLoad={onLoad}
					ref={mapRef}
					zIndex={5}>
					{selectedAirport ? (
						overRange ? (
							<Marker
								position={{
									lat: parseFloat(selectedAirport?.latitude_deg),
									lng: parseFloat(selectedAirport?.longitude_deg),
								}}
								icon={{
									url: not_allowed,
									scaledSize: new window.google.maps.Size(40, 40),
									anchor: new google.maps.Point(20, 20),
								}}
							/>
						) : (
							<OverlayView
								position={{
									lat: parseFloat(selectedAirport?.latitude_deg),
									lng: parseFloat(selectedAirport?.longitude_deg),
								}}
								mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
								zIndex={30}>
								<div className='flex flex-col items-center -mt-8  select-none'>
									<img
										src={selected_aiport_pointer}
										alt='Custom'
										style={{ height: '33px' }}
										className='mb-5 ml-6'
									/>
									<button
										className='z-20 bg-sky-600 hover:bg-sky-700 border border-gray-400 text-white hover:text-gray-200 font-semibold text-center text-xl rounded-lg px-4'
										onClick={(e) => {
											animateAirplane();
										}}>
										Start
									</button>
								</div>
							</OverlayView>
						)
					) : (
						''
					)}

					{directions && (
						<DirectionsRenderer
							directions={directions}
							options={{
								polylineOptions: {
									zIndex: 50,
									strokeColor: '#1976D2',
									strokeWeight: 5,
								},
							}}
						/>
					)}
					{selectedAirports &&
						selectedAirports.map((selected, i) => {
							return (
								<Polyline
									path={selected.polypath}
									textColor='#FFF'
									options={{
										geodesic: true,
										strokeColor: overRange ? '#e4081e' : '#0081C0',
										strokeOpacity: 0,
										strokeWeight: 2,
										icons: [
											{
												icon: {
													path: 'M 0,-1 0,1',
													strokeOpacity: 1,
													scale: 4,
												},
												offset: '0',
												repeat: '20px',
											},
										],
									}}>
									Help
								</Polyline>
							);
						})}

					{currentAirport && (
						<>
							{rotatedIconUrl && (
								<Marker
									position={{
										lat: parseFloat(airplaneCoordinates?.latitude_deg),
										lng: parseFloat(airplaneCoordinates?.longitude_deg),
									}}
									icon={{
										url: rotatedIconUrl,
										scaledSize: new window.google.maps.Size(55, 65),
										anchor: new google.maps.Point(25, 35),
									}}
								/>
							)}
							<MarkerClusterer>
								{(clusterer) =>
									Airports.slice(0, 30000)
										.filter((airport) => {
											if (!airport.latitude_deg || !airport.longitude_deg) return false;

											const distance = google?.maps?.geometry?.spherical.computeDistanceBetween(
												new google.maps.LatLng(
													parseFloat(currentAirport.latitude_deg),
													parseFloat(currentAirport.longitude_deg)
												),
												new google.maps.LatLng(
													parseFloat(airport.latitude_deg),
													parseFloat(airport.longitude_deg)
												)
											);

											return distance <= user?.rangeF * 1000; // 5000km
										})
										.map((airport) => (
											<Marker
												key={airport.id}
												onMouseOver={() => {
													console.log('Over');

													setHoveredAirport(airport);
												}}
												onMouseOut={() => {
													console.log('Out');

													setHoveredAirport(null);
												}}
												onClick={() => {
													console.log('Click');

													fetchDirections(airport);
													console.info('airport:', airport);
												}}
												icon={{
													url: aiport_pointer,
													scaledSize: new window.google.maps.Size(20, 20),
													anchor: new google.maps.Point(10, 10),
												}}
												position={{
													lat: parseFloat(airport.latitude_deg),
													lng: parseFloat(airport.longitude_deg),
												}}
												clusterer={clusterer}
												options={clusterOptions}
												zIndex={20}
											/>
										))
								}
							</MarkerClusterer>

							{hoveredAirport && (
								<OverlayView
									mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
									position={{
										lat: parseFloat(hoveredAirport.latitude_deg),
										lng: parseFloat(hoveredAirport.longitude_deg),
									}}
									zIndex={10}>
									<div
										className='flex flex-col items-center select-none -mt-[180px] '
										onBlur={(e) => console.log('IM OFF')}>
										<div className='flex flex-row bg-gray-400  items-center select-none py-2 px-2 rounded-md'>
											<div className=' flex flex-col mr-4 gap-y-1 text-xs'>
												<p>Name:</p>
												<p>Ident:</p>
												<br />
												<p>Contitnent:</p>
												<p>Contry:</p>
												<p>Latitude:</p>
												<p>Longitude:</p>
											</div>
											<div className='flex flex-col font-semibold gap-y-1 text-xs whitespace-nowrap'>
												<p>{hoveredAirport.name}</p>
												<p>{hoveredAirport.ident}</p>
												<br />
												<p>{hoveredAirport.continent}</p>
												<p>{hoveredAirport.iso_country}</p>
												<p>{hoveredAirport.latitude_deg}°N</p>
												<p>{hoveredAirport.longitude_deg}°E</p>
											</div>
										</div>
										<div className='relative w-0 h-10 border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent border-t-gray-400 rounded-triangle'></div>
									</div>
								</OverlayView>
							)}
							{dangerCoordinates.map((item, i) => {
								return <Circle center={item} radius={item.size * 1000} options={dangerOptions} />;
							})}

							<Circle
								center={{
									lat: parseFloat(airplaneCoordinates.latitude_deg),
									lng: parseFloat(airplaneCoordinates.longitude_deg),
								}}
								radius={user?.rangeF * 1000}
								options={closeOptions}
							/>
						</>
					)}
				</GoogleMap>
			</div>
			<div className='absolute bottom-5 right-5'>
				<Places
					setAirportLocation={(airport) => {
						setSelectedAirport(airport);
						fetchDirections(airport);
						// mapRef.current?.panTo({
						//   lat: parseFloat(airport.latitude_deg),
						//   lng: parseFloat(airport.longitude_deg),
						// });
					}}
					selectedAirport={selectedAirport}
					clearAirportLocation={() => {
						setSelectedAirport(null);
						setPolypath([]);
						mapRef.current?.panTo({
							lat: parseFloat(currentAirport.latitude_deg),
							lng: parseFloat(currentAirport.longitude_deg),
						});
					}}
					Airports={Airports}
				/>
			</div>
			<div className='absolute bottom-5 right-96 flex flex-col gap-y-10'>
				{flightData?.distanceKM && flightData?.flightDuration && selectedAirport?.latitude_deg && (
					<BoardingPass from={currentAirport} to={selectedAirport} flightData={flightData} />
				)}

				{/* <BoardingPass2
          passengerName="Jeak Black"
          date="09 Nov 2018"
          seat="9A"
          flight="AEROFLO AIR"
          gate="13A"
          boardingTime="21:45"
        /> */}
			</div>
		</div>
	);
}

const defaultOptions = {
	strokeOpacity: 0.5,
	strokeWeight: 2,
	clickable: false,
	draggable: false,
	editable: false,
	visible: true,
};
const closeOptions = {
	...defaultOptions,
	zIndex: 3,
	fillOpacity: 0.05,
	strokeColor: '#FFF',
	fillColor: '#FFF',
};

const dangerOptions = {
	...defaultOptions,
	zIndex: 3,
	fillOpacity: 0.5,
	strokeColor: '#b13333',
	fillColor: '#b13333',
};
