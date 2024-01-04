// GoogleMapsLoader.js
import React, { useEffect, useState } from "react";
import { useLoadScript } from "@react-google-maps/api";
import Map from "./components/Map.js";

const apikey = "AIzaSyAe1WOvDBCip4k4BDy5eoICF5-ZgDcm00Y";

const MemoizedMap = React.memo(Map);

const GoogleMapsLoader = () => {
  const [libraries] = useState(["places"]);

  //   useEffect(() => {}, []);

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: apikey,
    libraries: libraries,
  });
  if (!isLoaded) {
    return <p>Loading...</p>;
  }

  return <MemoizedMap />;
};

export default GoogleMapsLoader;
