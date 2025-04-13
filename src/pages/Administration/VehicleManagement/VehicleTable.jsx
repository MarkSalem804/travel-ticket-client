/* eslint-disable no-unused-vars */
import { Box, IconButton, Tooltip } from "@mui/material";
import React, { useState } from "react";
import EditableTable from "../../../components/Table/EditableTable";
import dayjs from "dayjs";
import DeleteForeverRoundedIcon from "@mui/icons-material/DeleteForeverRounded";
import PlaylistAddCheckCircleIcon from "@mui/icons-material/PlaylistAddCheckCircle";
import UpdateVehicleModal from "../../../modals/Tickets/UpdateVehicleModal";
import ticketService from "../../../services/ticket-service";

export default function VehiclesTable({ data, loadingState }) {
  const [openModal, setOpenModal] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState(null);

  const columns = [
    {
      field: "actions",
      headerName: "Actions",
      width: 300,
      renderCell: (params) => {
        const handleUpdateClick = () => {
          setSelectedVehicle(params.row);
          setOpenModal(true);
        };

        const handleDeleteClick = async () => {
          const confirmed = window.confirm(
            "Are you sure you want to delete this vehicle?"
          );
          if (confirmed) {
            try {
              await ticketService.deleteVehicle(params.row.id);
              console.log("Deleted vehicle with ID:", params.row.id);
              window.location.reload(); // or call a data reload function
            } catch (error) {
              console.error("Error deleting vehicle:", error);
            }
          }
        };

        return (
          <Box sx={{ display: "flex", gap: 1 }}>
            <Tooltip title={"Update Vehicle"}>
              <IconButton sx={{ color: "#1976d2" }} onClick={handleUpdateClick}>
                <PlaylistAddCheckCircleIcon sx={{ fontSize: "2rem" }} />
              </IconButton>
            </Tooltip>
            <Tooltip title={"Delete Vehicle"}>
              <IconButton sx={{ color: "#d32f2f" }} onClick={handleDeleteClick}>
                <DeleteForeverRoundedIcon sx={{ fontSize: "2rem" }} />
              </IconButton>
            </Tooltip>
          </Box>
        );
      },
    },
    { field: "vehicleName", headerName: "Vehicle Name", width: 250 },
    { field: "plateNo", headerName: "Plate Number", width: 250 },
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

      <UpdateVehicleModal
        open={openModal}
        onClose={() => setOpenModal(false)} // Close the modal
        vehicle={selectedVehicle} // Pass selected ticket data
        onUpdated={(updatedVehicle) => {
          // Handle the updated ticket data if needed (e.g., refresh the table)
          const updatedData = data.map((item) =>
            item.id === updatedVehicle.id ? updatedVehicle : item
          );
          // Update the data state (if it's passed as a prop)
        }}
      />
    </Box>
  );
}
