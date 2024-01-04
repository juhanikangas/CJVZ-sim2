import { HttpClient } from "./helpers";

export function setExampleData(data) {
  return {
    type: "SET_EXAMPLE_DATA",
    data,
  };
}

export function exampleCallbackRequest(callback) {
  const url = "https://api.chucknorris.io/jokes/random";
  return (dispatch, getState) => {
    //    Tätä myöhemmin.
    // const state = getState();
    // const Language = state.uiSetup.language;
    // const session = state.session;

    HttpClient.request(url, "GET")
      .then((response) => {
        callback(response);
      })
      .catch((error) => {
        console.error(error);
      });
  };
}

export function exampleReducerRequest(callback) {
  const url = "https://api.chucknorris.io/jokes/random";
  return (dispatch) => {
    HttpClient.request(url, "POST")
      .then((response) => {
        dispatch(setExampleData(response));
      })
      .catch((error) => {
        console.error(error);
      });
  };
}
