/* eslint-disable no-unused-vars */
import {
  Box,
  Dialog,
  DialogContent,
  IconButton,
  Tooltip,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import EditableTable from "../../../components/Table/EditableTable";
import dayjs from "dayjs";
import DeleteForeverRoundedIcon from "@mui/icons-material/DeleteForeverRounded";
import PlaylistAddCheckCircleIcon from "@mui/icons-material/PlaylistAddCheckCircle";
import UpdateDriverModal from "../../../modals/Tickets/UpdateDriverModal";
import ticketService from "../../../services/ticket-service";

export default function DriversTable({ data, loadingState }) {
  const [openModal, setOpenModal] = useState(false);
  const [selectedDriver, setSelectedDriver] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const columns = [
    {
      field: "actions",
      headerName: "Actions",
      width: 300,
      renderCell: (params) => {
        const handleUpdateClick = () => {
          setSelectedDriver(params.row);
          setOpenModal(true);
        };

        const handleDeleteClick = async () => {
          const confirmed = window.confirm(
            "Are you sure you want to delete this D?"
          );
          if (confirmed) {
            try {
              await ticketService.deleteDriver(params.row.id);

              setDeleteDialogOpen(true);

              setTimeout(() => {
                setDeleteDialogOpen(false);
              }, 1000);

              window.location.reload();
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
    { field: "driverName", headerName: "Driver Name", width: 250 },
    { field: "contactNo", headerName: "Contact Number", width: 250 },
    { field: "email", headerName: "E-Mail", width: 250 },
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

      <UpdateDriverModal
        open={openModal}
        onClose={() => setOpenModal(false)} // Close the modal
        driver={selectedDriver} // Pass selected ticket data
        onUpdated={(updatedDriver) => {
          // Handle the updated ticket data if needed (e.g., refresh the table)
          const updatedData = data.map((item) =>
            item.id === updatedDriver.id ? updatedDriver : item
          );
          // Update the data state (if it's passed as a prop)
        }}
      />

      <Dialog open={deleteDialogOpen} onClose={() => {}} disableBackdropClick>
        <DialogContent sx={{ textAlign: "center", px: "100px", py: "50px" }}>
          <Typography variant="h7">Vehicle Successfully Deleted!</Typography>
        </DialogContent>
      </Dialog>
    </Box>
  );
}
