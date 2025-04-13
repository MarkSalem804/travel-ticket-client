/* eslint-disable no-unused-vars */
import { Box, IconButton, Tooltip } from "@mui/material";
import React, { useState } from "react";
import EditableTable from "../../components/Table/EditableTable";
import dayjs from "dayjs";
import PlaylistAddCheckCircleIcon from "@mui/icons-material/PlaylistAddCheckCircle";
import UpdateTicketModal from "../../modals/Tickets/UpdateTicketModal";

export default function AdminTable({ data, loadingState }) {
  const [openModal, setOpenModal] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);

  const columns = [
    {
      field: "actions",
      headerName: "Actions",
      width: 300, // Adjusted width to accommodate new icons
      renderCell: (params) => {
        return (
          <Box
            sx={{ display: "flex", gap: 1 }}
            onClick={() => {
              setSelectedTicket(params.row);
              setOpenModal(true);
            }}
          >
            <Tooltip title={"Update Ticket"}>
              <span>
                <IconButton sx={{ color: "#1976d2" }}>
                  <PlaylistAddCheckCircleIcon sx={{ fontSize: "2rem" }} />
                </IconButton>
              </span>
            </Tooltip>
          </Box>
        );
      },
    },
    {
      field: "departureTime",
      headerName: "Departure",
      width: 200,
      valueGetter: (params) =>
        // Return the formatted date
        dayjs(params.value).format("YYYY-MM-DD hh:mm A"),
    },
    {
      field: "arrivalTime",
      headerName: "Estimated Arrival",
      width: 200,
      valueGetter: (params) =>
        // Return the formatted date
        dayjs(params.value).format("YYYY-MM-DD hh:mm A"),
    },
    { field: "requestedBy", headerName: "Requestor", width: 250 },
    { field: "destination", headerName: "Destination", width: 250 },
    { field: "status", headerName: "Status", width: 250 },
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

      <UpdateTicketModal
        open={openModal}
        onClose={() => setOpenModal(false)} // Close the modal
        ticket={selectedTicket} // Pass selected ticket data
        onUpdated={(updatedTicket) => {
          // Handle the updated ticket data if needed (e.g., refresh the table)
          const updatedData = data.map((item) =>
            item.id === updatedTicket.id ? updatedTicket : item
          );
          // Update the data state (if it's passed as a prop)
        }}
      />
    </Box>
  );
}
