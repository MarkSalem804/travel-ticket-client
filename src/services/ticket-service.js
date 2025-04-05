/* eslint-disable import/no-anonymous-default-export */
import axios from "axios";

const BASE_URL = "http://localhost:8050";

function getAllOffices() {
  return axios.get(`${BASE_URL}/ticket/getAllOffices`).then((res) => res.data);
}

function getAllRequests() {
  return axios.get(`${BASE_URL}/ticket/getAllRequests`).then((res) => res.data);
}

function submitTicket(formData) {
  return axios.post(`${BASE_URL}/ticket/submitTicket`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
}

export default {
  submitTicket,
  getAllOffices,
  getAllRequests,
};
