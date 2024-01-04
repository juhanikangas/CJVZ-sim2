import React from "react";

const BoardingPass2 = ({
  passengerName,
  date,
  seat,
  flight,
  gate,
  boardingTime,
}) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-md relative font-sans">
      <div className="absolute top-0 left-2 w-3 h-3 bg-white rounded-full border border-gray-300"></div>
      <div className="absolute top-0 right-2 w-3 h-3 bg-white rounded-full border border-gray-300"></div>
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-lg font-bold">{passengerName}</h2>
          <p className="text-sm">Date: {date}</p>
        </div>
        <div>
          <h3 className="text-lg font-bold text-red-600">MOSCOW → DUBAI</h3>
          <p className="text-sm">Seat: {seat}</p>
        </div>
      </div>
      <div className="flex justify-between items-center mt-4">
        <div>
          <p className="text-sm">Flight: {flight}</p>
          <p className="text-sm">Gate: {gate}</p>
        </div>
        <div>
          <p className="text-sm">Boarding Time: {boardingTime}</p>
          <p className="text-xs">Gate closes 30 minutes before departure</p>
        </div>
      </div>
      <div className="absolute bottom-0 left-2 w-3 h-3 bg-white rounded-full border border-gray-300"></div>
      <div className="absolute bottom-0 right-2 w-3 h-3 bg-white rounded-full border border-gray-300"></div>
    </div>
  );
};

export default BoardingPass2;
