import { Box, IconButton, Tooltip } from "@mui/material";
import React, { useEffect, useState } from "react";
import EditableTable from "../../components/Table/EditableTable";
import dayjs from "dayjs";
import { Visibility as VisibilityIcon } from "@mui/icons-material";
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
                  <VisibilityIcon />
                </IconButton>
              </span>
            </Tooltip>
          </Box>
        );
      },
    },
    { field: "id", headerName: "ID", width: 70 },
    {
      field: "startTime",
      headerName: "Start time",
      width: 200,
      valueGetter: (params) =>
        // Return the formatted date
        dayjs(params.value).format("YYYY-MM-DD hh:mm A"),
    },
    {
      field: "created_at",
      headerName: "Completion Time",
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
    <Box sx={{ width: "100%" }}>
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
