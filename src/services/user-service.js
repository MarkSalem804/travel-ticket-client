/* eslint-disable import/no-anonymous-default-export */
import axios from "axios";

const customError = new Error("Network error or no response");
const BASE_URL = "http://localhost:8050";

function authenticate(account) {
  return new Promise((resolve, reject) => {
    axios
      .post(`${BASE_URL}/user/Authentication`, account, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      })
      .then((res) => resolve(res.data))
      .catch((err) => {
        if (err.response) {
          reject(err);
        }
        reject(customError);
      });
  });
}

export default {
  authenticate,
};
