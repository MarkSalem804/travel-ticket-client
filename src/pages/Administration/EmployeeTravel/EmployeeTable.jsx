/* eslint-disable no-unused-vars */
import { Box, IconButton, Tooltip } from "@mui/material";
import React, { useState } from "react";
import EditableTable from "../../../components/Table/EditableTable";
import dayjs from "dayjs";
import DeleteForeverRoundedIcon from "@mui/icons-material/DeleteForeverRounded";
import PlaylistAddCheckCircleIcon from "@mui/icons-material/PlaylistAddCheckCircle";
import UpdateVehicleModal from "../../../modals/Tickets/UpdateVehicleModal";
import ticketService from "../../../services/ticket-service";

export default function EmployeesTable({ data, loadingState }) {
  const [openModal, setOpenModal] = useState(false);
  const [selectedEmployees, setSelectedEmployees] = useState(null);

  const formatDate = (dateString) => {
    return dayjs.utc(dateString).format("MMM D, YYYY");
  };

  const formatTime = (dateString) => {
    return dayjs.utc(dateString).format("h:mm A");
  };

  const columns = [
    {
      field: "actions",
      headerName: "Actions",
      width: 150,
      renderCell: (params) => {
        const handleUpdateClick = () => {
          setSelectedEmployees(params.row);
          setOpenModal(true);
        };

        const handleDeleteClick = async () => {
          const confirmed = window.confirm(
            "Are you sure you want to delete this record?"
          );
          if (confirmed) {
            try {
              await ticketService.deleteUrgent(params.row.id);
              console.log("Deleted vehicle with ID:", params.row.id);
              window.location.reload(); // or call a data reload function
            } catch (error) {
              console.error("Error deleting vehicle:", error);
            }
          }
        };

        return (
          <Box sx={{ display: "flex", gap: 1 }}>
            {/* <Tooltip title={"Update Vehicle"}>
              <IconButton sx={{ color: "#1976d2" }} onClick={handleUpdateClick}>
                <PlaylistAddCheckCircleIcon sx={{ fontSize: "2rem" }} />
              </IconButton>
            </Tooltip> */}
            <Tooltip title={"Delete Record"}>
              <IconButton sx={{ color: "#d32f2f" }} onClick={handleDeleteClick}>
                <DeleteForeverRoundedIcon sx={{ fontSize: "2rem" }} />
              </IconButton>
            </Tooltip>
          </Box>
        );
      },
    },
    { field: "rfid", headerName: "RFID", width: 200 },
    { field: "vehicleName", headerName: "Vehicle", width: 250 },
    { field: "type", headerName: "Type", width: 250 },
    { field: "ownerName", headerName: "Owner", width: 250 },
    { field: "plateNo", headerName: "Plate", width: 150 },
    {
      field: "departure",
      headerName: "Departure",
      width: 250,
      valueGetter: (params) =>
        `${formatDate(params.value)} — ${formatTime(params.value)}`,
    },
    {
      field: "arrival",
      headerName: "Arrival",
      width: 250,
      valueGetter: (params) =>
        `${formatDate(params.value)} — ${formatTime(params.value)}`,
    },
  ];

  return (
    <Box sx={{ width: "100%", overflowX: "auto" }}>
      <EditableTable
        data={data}
        columns={columns}
        loading={loadingState}
        height="60vh"
        showSearch
      />

      {/* <UpdateVehicleModal
        open={openModal}
        onClose={() => setOpenModal(false)} // Close the modal
        vehicle={selectedUrgent} // Pass selected ticket data
        onUpdated={(updatedVehicle) => {
          // Handle the updated ticket data if needed (e.g., refresh the table)
          const updatedData = data.map((item) =>
            item.id === updatedVehicle.id ? updatedVehicle : item
          );
          // Update the data state (if it's passed as a prop)
        }}
      /> */}
    </Box>
  );
}
