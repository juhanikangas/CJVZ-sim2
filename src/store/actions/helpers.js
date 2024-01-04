import { store } from "../..";

export class HttpClient {
  static request(url, method, body) {
    return new Promise(async (resolve, reject) => {
      let request = {
        method: method,
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          //Authorization: "Bearer " + session,
        },
      };

      if (body && body !== undefined) {
        request.body = JSON.stringify(body);
      }

      try {
        let result = await fetch(url, request);
        let response = null;

        try {
          response = await result?.json();
        } catch (err) {
          // Epästandardi response (mm. status 200, mutta käytännössä no content)
        }

        if (result?.status === 200) {
          resolve(response);
        } else if (result?.status === 204) {
          resolve(response);
        } else if (result?.status === 401) {
          //store.dispatch(logout());
          reject(result);
        } else if (result?.status >= 400) {
          reject(result);
        } else {
          try {
            resolve(result);
          } catch (err) {
            // reject(result);
            reject(response);
          }
        }
      } catch (err) {
        console.error(
          `${new Date()} HttpClient request Promise catch. Error:`,
          err
        );
        reject(err);
      }
    });
  }
}
