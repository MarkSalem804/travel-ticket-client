/* eslint-disable import/no-anonymous-default-export */
import axios from "axios";

const BASE_URL = "http://localhost:8050";
// const BASE_URL = "https://tripticket.depedimuscity.com:8050";

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

function getRequestByRFIDandId(rfid, requestId) {
  return axios
    .post(`${BASE_URL}/ticket/getRequestByRFIDAndId`, { rfid, requestId })
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

function travelOut(data) {
  console.log("🚀 [travelOut] Sending request to backend...");
  console.log("➡️ [travelOut] Data being sent:", data);
  console.log("🆔 [travelOut] requestId being sent:", data.id);

  return axios
    .post(`${BASE_URL}/ticket/travelOut`, data)
    .then((res) => {
      console.log("✅ [travelOut] API response:", res);
      return res.data;
    })
    .catch((error) => {
      console.error("❌ [travelOut] API error:", error);
      throw error;
    });
}

function travelIn(data) {
  return axios
    .post(`${BASE_URL}/ticket/travelIn`, data)
    .then((res) => {
      console.log("✅ [travelIn] API response:", res);
      return res.data;
    })
    .catch((error) => {
      console.error("❌ [travelIn] API error:", error);
      throw error;
    });
}

function getTodaysRequests() {
  return axios
    .get(`${BASE_URL}/ticket/getAllRequestsForToday`)
    .then((res) => res.data);
}

function getAllUrgentTrips() {
  return axios
    .get(`${BASE_URL}/ticket/getAllUrgentTrips`)
    .then((res) => res.data);
}

function urgentTap(rfid) {
  console.log("🚨 [urgentTap] Tapping RFID:", rfid);

  return axios
    .post(`${BASE_URL}/ticket/urgentTap`, { rfid })
    .then((res) => {
      console.log("✅ [urgentTap] API response:", res);
      return res.data;
    })
    .catch((error) => {
      console.error("❌ [urgentTap] API error:", error);
      throw error;
    });
}

export default {
  getAllUrgentTrips,
  urgentTap,
  getRequestByRFIDandId,
  travelOut,
  travelIn,
  addVehicle,
  addDriver,
  updateRequest,
  updateDriver,
  updateVehicle,
  deleteVehicle,
  deleteDriver,
  submitTicket,
  getTodaysRequests,
  getAllOffices,
  getAllRequests,
  getAllVehicles,
  getAllDrivers,
  viewAttachment,
};
