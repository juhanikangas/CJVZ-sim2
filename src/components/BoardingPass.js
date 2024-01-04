/** @format */

import React from 'react';
import barcode from '../imgs/barcode.png';

const BoardingPass = ({ from, to, flightData }) => {
	return (
		// <div className=" rounded-lg shadow-md relative font-sans flex flex-row ">
		//   <div className="stamp  h-[120px] w-[200px] ">
		//     <div className="bg-white  h-[120px]  -mt-2.5 -ml-5 rounded-l-2xl flex items-center">
		//       <img src={barcode} className="rotate-90 max-h-[35px] mr-auto" />
		//     </div>
		//   </div>
		//   <div className="stamp-red   h-[120px] w-[150px] ">
		//     <div className="bg-red-500  h-[120px] w-[150px] rounded-r-2xl -mt-2.5 "></div>
		//   </div>
		// </div>
		<div className='flex flex-col text-sm bg-[#1F2124] text-white p-2 rounded-lg border border-[#373A3E]'>
			<div className='w-full flex flex-row'>
				<p>Flight Distance: {flightData?.distanceKM}km</p>
				<p className='pl-6'>Flight Duration: {flightData?.flightDuration}s</p>
			</div>
			<div className='flex flex-row gap-x-5'>
				<div className='bg-[#373A3E] rounded-lg p-2'>
					<p>{from?.name}</p>
					<p>{from?.ident}</p>
					<br />
					<p>{from?.continent}</p>
					<p>{from?.iso_country}</p>
					<p>{from?.latitude_deg}°N</p>
					<p>{from?.longitude_deg}°E</p>
				</div>
				<div className='bg-[#373A3E] rounded-lg p-2'>
					<p>{to?.name}</p>
					<p>{to?.ident}</p>
					<br />
					<p>{to?.continent}</p>
					<p>{to?.iso_country}</p>
					<p>{to?.latitude_deg}°N</p>
					<p>{to?.longitude_deg}°E</p>
				</div>
			</div>
		</div>
	);
};

export default BoardingPass;
