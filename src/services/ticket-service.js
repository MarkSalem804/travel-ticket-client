/* eslint-disable import/no-anonymous-default-export */
import axios from "axios";

const BASE_URL = "http://localhost:8050";

function getAllOffices() {
  return axios.get(`${BASE_URL}/ticket/getAllOffices`).then((res) => res.data);
}

function getAllRequests() {
  return axios.get(`${BASE_URL}/ticket/getAllRequests`).then((res) => res.data);
}

function getAllVehicles() {
  return axios.get(`${BASE_URL}/ticket/getAllVehicles`).then((res) => res.data);
}

function getAllDrivers() {
  return axios.get(`${BASE_URL}/ticket/getAllDrivers`).then((res) => res.data);
}

function addVehicle(data) {
  return axios
    .post(`${BASE_URL}/ticket/addVehicle`, data)
    .then((res) => res.data);
}

function addDriver(data) {
  return axios
    .post(`${BASE_URL}/ticket/addDriver`, data)
    .then((res) => res.data);
}

function submitTicket(formData) {
  return axios.post(`${BASE_URL}/ticket/submitTicket`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
}

function updateRequest(ticketId, updatedData) {
  return axios
    .put(`${BASE_URL}/ticket/updateRequest/${ticketId}`, updatedData)
    .then((res) => res.data);
}

function updateDriver(driverId, updatedData) {
  return axios
    .put(`${BASE_URL}/ticket/updateDriver/${driverId}`, updatedData)
    .then((res) => res.data);
}

function updateVehicle(vehicleId, updatedData) {
  return axios
    .put(`${BASE_URL}/ticket/updateVehicle/${vehicleId}`, updatedData)
    .then((res) => res.data);
}

function deleteVehicle(vehicleId) {
  return axios
    .delete(`${BASE_URL}/ticket/deleteVehicle/${vehicleId}`)
    .then((res) => res.data);
}

function deleteDriver(driverId) {
  return axios
    .delete(`${BASE_URL}/ticket/deleteDriver/${driverId}`)
    .then((res) => res.data);
}

function viewAttachment(requestId) {
  return `${BASE_URL}/ticket/viewAttachment/${requestId}`;
}

export default {
  addVehicle,
  addDriver,
  updateRequest,
  updateDriver,
  updateVehicle,
  deleteVehicle,
  deleteDriver,
  submitTicket,
  getAllOffices,
  getAllRequests,
  getAllVehicles,
  getAllDrivers,
  viewAttachment,
};
