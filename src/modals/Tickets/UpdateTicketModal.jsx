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
import SelectOffice from "../../components/Textfields/SelectOffice";
import SelectVehicle from "../../components/Textfields/SelectVehicles";
import SelectDriver from "../../components/Textfields/SelectDrivers";
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

export default function UpdateTicketModal({
  open,
  onClose,
  ticket,
  onUpdated,
}) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [loadingDialogOpen, setLoadingDialogOpen] = useState(false);
  const [successDialogOpen, setSuccessDialogOpen] = useState(false);
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);

  // Initialize the ticket form data
  const [formData, setFormData] = useState({
    requestedBy: "",
    email: "",
    officeId: null,
    designation: "",
    destination: "",
    departureDate: "",
    arrivalDate: "",
    departureTime: "",
    arrivalTime: "",
    authorizedPassengers: "",
    remarks: "",
    driverId: null,
    vehicleId: null,
    purpose: "",
    status: "Pending",
  });

  // Populate form data if ticket is available
  useEffect(() => {
    if (ticket) {
      setFormData({
        requestedBy: ticket.requestedBy || "",
        email: ticket.email || "",
        officeId: ticket.officeId || null,
        designation: ticket.designation || "",
        destination: ticket.destination || "",
        departureDate: ticket.departureDate || "",
        arrivalDate: ticket.arrivalDate || "",
        departureTime: ticket.departureTime || "",
        arrivalTime: ticket.arrivalTime || "",
        authorizedPassengers: ticket.authorizedPassengers || "",
        remarks: ticket.remarks || "",
        driverId: ticket.driverId || null,
        vehicleId: ticket.vehicleId || null,
        purpose: ticket.purpose || "",
        status: ticket.status || "Pending",
      });
    }
  }, [ticket]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (newStatus) => {
    try {
      setLoading(true);
      setError("");
      setLoadingDialogOpen(true);

      const updatedData = {
        ...formData,
        status: "Approved", // 👈 keep current if not provided
      };

      const updatedTicket = await ticketService.updateRequest(
        ticket.id,
        updatedData
      );

      setFormData(updatedTicket);

      setLoadingDialogOpen(false);
      setSuccessDialogOpen(true);

      setTimeout(() => {
        window.location.reload(); // Reload the page
      }, 1000);

      setTimeout(() => {
        setSuccessDialogOpen(false);
        onClose();
      }, 1000);

      if (onUpdated) onUpdated(updatedTicket);
    } catch (err) {
      console.error(err);
      setError("Failed to update ticket. Please try again.");
      setLoadingDialogOpen(false);
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async () => {
    try {
      setLoading(true);
      setError("");
      setLoadingDialogOpen(true);

      const rejectedData = {
        ...formData,
        status: "Rejected", // ✅ Force status to Rejected
      };

      const updatedTicket = await ticketService.updateRequest(
        ticket.id,
        rejectedData
      );

      setFormData(updatedTicket);

      setLoadingDialogOpen(false);
      setRejectDialogOpen(true);

      setTimeout(() => {
        window.location.reload(); // Reload the page
      }, 1000);

      setTimeout(() => {
        setRejectDialogOpen(false);
        onClose();
      }, 1000);

      if (onUpdated) onUpdated(updatedTicket);
    } catch (err) {
      console.error("❌ Failed to reject ticket:", err);
      setError("Failed to reject ticket. Please try again.");
      setLoadingDialogOpen(false);
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
              md: "70vw", // Increase for desktop
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
              UPDATE TRIP TICKET
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
                    label="Requestor"
                    name="requestedBy"
                    value={formData.requestedBy}
                    onChange={handleInputChange}
                    margin="normal"
                    InputProps={{
                      style: { minWidth: 250 }, // Set a minimum width to accommodate longer text
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
                    label="Email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    margin="normal"
                    InputProps={{
                      style: { minWidth: 250 }, // Set a minimum width to accommodate longer text
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
                    label="Designation/Position"
                    name="designation"
                    value={formData.designation}
                    onChange={handleInputChange}
                    InputProps={{
                      style: { minWidth: 250 }, // Set a minimum width to accommodate longer text
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <SelectOffice
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        "& fieldset": {
                          borderColor: "gray",
                        },
                      },
                    }}
                    label="Office"
                    placeholder="Select office"
                    name="officeId"
                    value={formData.officeId}
                    onChange={(name, value) =>
                      setFormData((prev) => ({ ...prev, [name]: value }))
                    }
                    errorFormik={!!error && !formData.officeId}
                    helperText={
                      !formData.officeId && error ? "Office is required" : ""
                    }
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <SelectVehicle
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        "& fieldset": {
                          borderColor: "gray",
                        },
                      },
                    }}
                    label="Vehicle"
                    placeholder="Select Vehicle"
                    name="vehicleId"
                    value={formData.vehicleId}
                    onChange={(name, value) =>
                      setFormData((prev) => ({ ...prev, [name]: value }))
                    }
                    errorFormik={!!error && !formData.vehicleId}
                    helperText={
                      !formData.vehicleId && error ? "Office is required" : ""
                    }
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <SelectDriver
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        "& fieldset": {
                          borderColor: "gray",
                        },
                      },
                    }}
                    label="Driver"
                    placeholder="Assign Driver"
                    name="driverId"
                    value={formData.driverId}
                    onChange={(name, value) =>
                      setFormData((prev) => ({ ...prev, [name]: value }))
                    }
                    errorFormik={!!error && !formData.driverId}
                    helperText={
                      !formData.driverId && error ? "Driver is required" : ""
                    }
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
                    label="Destination"
                    name="destination"
                    value={formData.destination}
                    onChange={handleInputChange}
                    InputProps={{
                      style: { minWidth: 250 }, // Set a minimum width to accommodate longer text
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Departure Date"
                    name="departureDate"
                    value={formatDate(formData.departureDate)}
                    onChange={handleInputChange}
                    InputProps={{
                      readOnly: true,
                      style: { minWidth: 250 }, // Set a minimum width to accommodate longer text
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Arrival Date"
                    name="arrivalDate"
                    value={formatDate(formData.arrivalDate)}
                    onChange={handleInputChange}
                    InputProps={{
                      readOnly: true,
                      style: { minWidth: 250 }, // Set a minimum width to accommodate longer text
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Departure Time"
                    name="departureTime"
                    value={formatTime(formData.departureTime)}
                    onChange={handleInputChange}
                    InputProps={{
                      readOnly: true,
                      style: { minWidth: 250 }, // Set a minimum width to accommodate longer text
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Estimated Arrival Time"
                    name="arrivalTime"
                    value={formatTime(formData.arrivalTime)}
                    onChange={handleInputChange}
                    InputProps={{
                      readOnly: true,
                      style: { minWidth: 250 }, // Set a minimum width to accommodate longer text
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Status"
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    InputProps={{
                      readOnly: true,
                      style: { minWidth: 250 },
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={12}>
                  <TextField
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        "& fieldset": {
                          borderColor: "gray",
                        },
                      },
                    }}
                    fullWidth
                    multiline
                    label="Purpose"
                    name="purpose"
                    value={formData.purpose}
                    onChange={handleInputChange}
                    InputProps={{
                      readOnly: true,
                      style: { minWidth: 250 },
                    }}
                    minRows={3}
                    maxRows={6}
                  />
                </Grid>
                <Grid item xs={12} sm={12}>
                  <TextField
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        "& fieldset": {
                          borderColor: "gray",
                        },
                      },
                    }}
                    fullWidth
                    multiline
                    label="Authorized Passengers"
                    name="authorizedPassengers"
                    value={formData.authorizedPassengers}
                    onChange={handleInputChange}
                    InputProps={{
                      readOnly: true,
                      style: { minWidth: 250 },
                    }}
                    minRows={3}
                    maxRows={6}
                  />
                </Grid>
                <Grid item xs={12} sm={12}>
                  <TextField
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        "& fieldset": {
                          borderColor: "gray",
                        },
                      },
                    }}
                    fullWidth
                    multiline
                    label="Remarks"
                    name="remarks"
                    value={formData.remarks}
                    onChange={handleInputChange}
                    InputProps={{
                      readOnly: true,
                      style: { minWidth: 250 }, // Set a minimum width to accommodate longer text
                    }}
                    minRows={3}
                    maxRows={6}
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
                color="error"
                onClick={handleReject}
                fullWidth={isMobile}
                sx={{ minWidth: !isMobile ? 120 : undefined }}
              >
                Reject
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={handleSubmit}
                fullWidth={isMobile}
                sx={{ minWidth: !isMobile ? 120 : undefined }}
              >
                Save
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
          <Typography variant="h6">Request / Ticket Approved!</Typography>
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
