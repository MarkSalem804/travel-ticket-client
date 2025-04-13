/* eslint-disable no-unused-vars */
import {
  Modal,
  Box,
  Typography,
  TextField,
  Button,
  useMediaQuery,
  useTheme,
  Grid,
  DialogContent,
  Dialog,
  CircularProgress,
} from "@mui/material";
import { useState, useEffect } from "react";
import ticketService from "../../services/ticket-service";
const modalBaseStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  bgcolor: "background.paper",
  borderRadius: 2,
  boxShadow: 24,
  p: 0,
  overflow: "hidden",
};

export default function UpdateVehicleModal({
  open,
  onClose,
  vehicle,
  onUpdated,
}) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [loadingDialogOpen, setLoadingDialogOpen] = useState(false);
  const [successDialogOpen, setSuccessDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [attachmentModalOpen, setAttachmentModalOpen] = useState(false);
  const [attachmentUrl, setAttachmentUrl] = useState("");

  // Initialize the ticket form data
  const [formData, setFormData] = useState({
    vehicleName: "",
    plateNo: "",
  });

  // Populate form data if ticket is available
  useEffect(() => {
    if (open && vehicle) {
      setFormData({
        vehicleName: vehicle.vehicleName || "",
        plateNo: vehicle.plateNo || "",
      });
    }
  }, [open, vehicle]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      setError("");
      setLoadingDialogOpen(true);

      const updatedVehicle = await ticketService.updateVehicle(
        vehicle.id,
        formData
      );

      setFormData(updatedVehicle);

      setLoadingDialogOpen(false);
      setSuccessDialogOpen(true);

      setTimeout(() => {
        window.location.reload(); // Reload the page
      }, 1000);

      setTimeout(() => {
        setSuccessDialogOpen(false);
        onClose();
      }, 1000);

      if (onUpdated) onUpdated(updatedVehicle);
    } catch (err) {
      console.error(err);
      setError("Failed to update vehicle. Please try again.");
      setLoadingDialogOpen(false);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!vehicle?.id) return;

    const confirmDelete = window.confirm(
      "Are you sure you want to delete this vehicle?"
    );
    if (!confirmDelete) return;

    try {
      setLoading(true);
      setError("");

      await ticketService.deleteVehicle(vehicle.id);

      setDeleteDialogOpen(true);

      setTimeout(() => {
        window.location.reload();
      }, 1000);

      setTimeout(() => {
        setDeleteDialogOpen(false);
        onClose();
      }, 1000);
    } catch (err) {
      console.error(err);
      setError("Failed to delete vehicle. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    const localTime = new Date(
      date.getTime() + date.getTimezoneOffset() * 60000
    );
    return localTime.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  return (
    <>
      <Modal open={open} onClose={onClose}>
        <Box
          sx={{
            ...modalBaseStyle,
            width: {
              xs: "90%", // Mobile screens
              sm: 600, // Increase for small screens/tablets
              md: "60vw", // Increase for desktop
            },
            maxWidth: "70vw", // Limit the maximum width on larger screens
          }}
        >
          {/* Title Header */}
          <Box
            sx={{
              bgcolor: "primary.main",
              color: "white",
              px: 3,
              py: 2,
              display: "flex",
              alignItems: "center",
            }}
          >
            <Typography
              variant={isMobile ? "subtitle1" : "h6"}
              sx={{ fontWeight: "bold", textAlign: "center", width: "100%" }}
            >
              UPDATE REGISTERED VEHICLE
            </Typography>
          </Box>

          {/* Body */}
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              maxHeight: "80vh", // Set max height for the modal
            }}
          >
            {/* Scrollable content */}
            <Box
              sx={{
                overflowY: "auto",
                pr: 1, // Prevent cut-off by adding some padding
                flexGrow: 1, // Allow the scrollable area to take up most of the space
                p: { xs: 2, sm: 3 },
              }}
            >
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        "& fieldset": {
                          borderColor: "gray",
                        },
                      },
                    }}
                    fullWidth
                    label="Vehicle"
                    name="vehicleName"
                    value={formData?.vehicleName}
                    onChange={handleInputChange}
                    margin="normal"
                    InputProps={{
                      style: { minWidth: 250 },
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        "& fieldset": {
                          borderColor: "gray",
                        },
                      },
                    }}
                    fullWidth
                    label="Plate Number"
                    name="plateNo"
                    value={formData.plateNo}
                    onChange={handleInputChange}
                    margin="normal"
                    InputProps={{
                      style: { minWidth: 250 }, // Set a minimum width to accommodate longer text
                    }}
                  />
                </Grid>

                {/* Add more fields as needed */}
              </Grid>
            </Box>

            {/* Action buttons */}
            <Box
              padding={2}
              mt={3}
              display="flex"
              flexDirection={isMobile ? "column" : "row"}
              justifyContent="flex-end"
              gap={1}
            >
              {/* DELETE FIRST - Visually on the far left or top */}
              <Box order={isMobile ? 0 : -1}>
                <Button
                  variant="contained"
                  color="error"
                  onClick={handleDelete}
                  fullWidth={isMobile}
                  sx={{ minWidth: !isMobile ? 120 : undefined }}
                >
                  Delete
                </Button>
              </Box>

              <Button
                onClick={onClose}
                color="secondary"
                fullWidth={isMobile}
                sx={{ minWidth: !isMobile ? 120 : undefined }}
              >
                Cancel
              </Button>

              <Button
                variant="contained"
                color="primary"
                onClick={handleSubmit}
                fullWidth={isMobile}
                sx={{
                  minWidth: !isMobile ? 120 : undefined,
                  backgroundColor: "green",
                }}
              >
                Update
              </Button>
            </Box>
          </Box>

          {/* Error message */}
          {error && (
            <Typography color="error" sx={{ mt: 2, px: 3 }}>
              {error}
            </Typography>
          )}
        </Box>
      </Modal>

      {/* Loading Dialog */}
      <Dialog open={loadingDialogOpen} onClose={() => {}} disableBackdropClick>
        <DialogContent sx={{ textAlign: "center", px: "100px" }}>
          <CircularProgress />
          <Typography sx={{ marginTop: "10px" }}>Updating...</Typography>
        </DialogContent>
      </Dialog>

      {/* Success Dialog */}
      <Dialog open={successDialogOpen} onClose={() => {}} disableBackdropClick>
        <DialogContent sx={{ textAlign: "center", px: "100px", py: "50px" }}>
          <Typography variant="h7">Vehicle Successfully Updated!</Typography>
        </DialogContent>
      </Dialog>

      <Dialog open={deleteDialogOpen} onClose={() => {}} disableBackdropClick>
        <DialogContent sx={{ textAlign: "center", px: "100px", py: "50px" }}>
          <Typography variant="h7">Vehicle Successfully Deleted!</Typography>
        </DialogContent>
      </Dialog>

      <Dialog open={rejectDialogOpen} onClose={() => {}} disableBackdropClick>
        <DialogContent sx={{ textAlign: "center", px: "100px", py: "50px" }}>
          <Typography variant="h6">Request / Ticket Rejected!</Typography>
        </DialogContent>
      </Dialog>
    </>
  );
}
