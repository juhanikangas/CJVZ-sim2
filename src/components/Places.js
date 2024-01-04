import { useEffect, useMemo, useState } from "react";
import usePlacesAutocomplete, {
  getGeocode,
  getLatLng,
} from "use-places-autocomplete";
import FixedSizeList from "react-window";
import { filterByInput } from "../helpers/filterArrayByInput";
import { debounce } from "lodash";

export default function Places({
  setAirportLocation,
  selectedAirport,
  clearAirportLocation,
  Airports,
}) {
  const [userInput, setUserInput] = useState("");
  const [foundByUserIput, setFoundByUserIput] = useState([]);

  useEffect(() => {
    // console.info("Airportssss:", Airports);
  }, [Airports]);

  const handleChange = (e) => {
    setUserInput(e.target.value);
  };

  const debouncedHandleChange = useMemo(() => debounce(handleChange, 300), []);

  const filteredAirports = useMemo(() => {
    if (!userInput.trim()) return [];

    return filterByInput(userInput, Airports, ["name"]).slice(0, 10);
  }, [userInput, Airports]);

  useEffect(() => {
    //console.info("INPUT DATA", foundByUserIput);
  }, [foundByUserIput]);

  useEffect(() => {
    return () => {
      debouncedHandleChange.cancel();
    };
  }, [debouncedHandleChange]);

  return (
    <div className="w-[300px]">
      {(selectedAirport?.ident || filteredAirports?.length > 1) && (
        <div className=" flex flex-col bg-[#1F2124] text-white px-3 py-3 rounded-t-lg border-2 border-b-0 border-[#373A3E] gap-y-2 overflow-auto max-h-[500px]">
          {selectedAirport && (
            <div
              className={`${
                filteredAirports.length > 1
                  ? "border-b pb-2 border-[#373A3E]"
                  : ""
              }`}
            >
              <div
                className={`flex flex-row bg-[#373A3E] rounded-lg items-center `}
              >
                <div className={` px-2  py-1 text-left w-full  `}>
                  {selectedAirport?.name}
                </div>
                <button
                  className="  p-1 mr-0.5 material-icons text-[#828589] text-lg"
                  onClick={() => {
                    setAirportLocation(selectedAirport);
                    clearAirportLocation();
                  }}
                >
                  cancel
                </button>
              </div>
            </div>
          )}

          {filteredAirports.length > 1 &&
            filteredAirports.map((airport, i) => {
              if (airport.ident == selectedAirport?.ident) return;

              return (
                <div>
                  <button
                    key={airport.ident}
                    className={`bg-[#373A3E] hover:bg-[#5a5d60] px-2 rounded-lg py-1 text-left w-full`}
                    onClick={() => {
                      setAirportLocation(airport);
                    }}
                  >
                    {airport.name}
                  </button>
                </div>
              );
            })}
        </div>
      )}

      <div
        className={`bg-[#1F2124] flex items-center  border-2  pl-4 pr-2  py-1.5 ${
          filteredAirports.length > 1 || selectedAirport?.ident
            ? "rounded-b-lg"
            : "rounded-lg"
        } border-[#373A3E] `}
      >
        <input
          type="text"
          value={userInput}
          name="location"
          onChange={handleChange}
          className={` text-white bg-transparent focus:outline-0  focus:outline-none w-full `}
          placeholder="Search airport's"
        />
        <button
          className="material-icons text-gray-400 ml-2"
          onClick={(e) => {
            setUserInput("");
            setFoundByUserIput([]);
          }}
        >
          close
        </button>
      </div>
    </div>
  );
}
