/* eslint-disable import/no-anonymous-default-export */
import axios from "axios";

const customError = new Error("Network error or no response");
const BASE_URL = "http://localhost:8050";
// const BASE_URL = "https://tripticket.depedimuscity.com:8050";

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

function getAllUsers() {
  return axios.get(`${BASE_URL}/user/getAllUsers`).then((res) => res.data);
}

function registerUser(userData) {
  return new Promise((resolve, reject) => {
    axios
      .post(`${BASE_URL}/user/Registration`, userData, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      })
      .then((res) => resolve(res.data))
      .catch((err) => {
        if (err.response) {
          reject(err.response.data);
        } else {
          reject(customError);
        }
      });
  });
}

function changePassword(userId, newPassword) {
  return new Promise((resolve, reject) => {
    axios
      .patch(
        `${BASE_URL}/user/changePassword/${userId}`,
        { newPassword },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      )
      .then((res) => resolve(res.data))
      .catch((err) => {
        if (err.response) {
          reject(err.response.data);
        } else {
          reject(customError);
        }
      });
  });
}

export default {
  changePassword,
  registerUser,
  authenticate,
  getAllUsers,
};
