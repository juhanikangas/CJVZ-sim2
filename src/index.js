import React from "react";
import { createRoot } from "react-dom/client";
import "./styles/index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";

import rootReducer from "./store/reducers";
import { configureStore } from "@reduxjs/toolkit";
import { Provider } from "react-redux";

import { LoadScript, useLoadScript } from "@react-google-maps/api";

import GoogleMapsLoader from "./GoogleMapsLoader";
import Map from "./components/Map";

export const store = configureStore({
  reducer: rootReducer,
});

const rootElement = document.getElementById("root");

const root = createRoot(rootElement);

const apikey = "AIzaSyAe1WOvDBCip4k4BDy5eoICF5-ZgDcm00Y";
const MemoizedMap = React.memo(Map);

root.render(
  <Provider store={store}>
    <LoadScript
      id="script-loader"
      googleMapsApiKey={apikey}
      libraries={["places"]}
    >
      <MemoizedMap />
    </LoadScript>
  </Provider>
);

//reportWebVitals();