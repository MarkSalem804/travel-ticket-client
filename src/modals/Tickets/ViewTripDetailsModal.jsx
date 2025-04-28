import { useEffect, useState } from "react";
import {
  Modal,
  Box,
  Typography,
  TextField,
  Grid,
  useMediaQuery,
  useTheme,
  Button,
} from "@mui/material";
import ticketService from "../../services/ticket-service";
import SelectOffice from "../../components/Textfields/SelectOffice";
import SelectVehicle from "../../components/Textfields/SelectVehicles";
import SelectDriver from "../../components/Textfields/SelectDrivers";
import ViewAttachmentModal from "./ViewAttachmentModal";

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

export default function ViewTripRequestModal({ open, onClose, ticket }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [formData, setFormData] = useState(null);
  const [attachmentModalOpen, setAttachmentModalOpen] = useState(false);
  const [attachmentUrl, setAttachmentUrl] = useState("");

  useEffect(() => {
    if (ticket && open) {
      setFormData(ticket);
    }
  }, [ticket, open]);

  useEffect(() => {
    if (!open) {
      setFormData(null);
    }
  }, [open]);

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

  const handleViewAttachment = (requestId) => {
    const url = ticketService.viewAttachment(requestId);
    setAttachmentUrl(url);
    setAttachmentModalOpen(true);
  };

  return (
    <>
      <Modal open={open} onClose={onClose}>
        <Box
          sx={{
            ...modalBaseStyle,
            width: { xs: "90%", sm: 600, md: "70vw" },
            maxWidth: "70vw",
          }}
        >
          <Box sx={{ bgcolor: "primary.main", color: "white", px: 3, py: 2 }}>
            <Typography
              variant={isMobile ? "subtitle1" : "h6"}
              sx={{ fontWeight: "bold", textAlign: "center", width: "100%" }}
            >
              VIEW TRIP REQUEST
            </Typography>
          </Box>

          <Box sx={{ p: 3, overflowY: "auto", maxHeight: "80vh" }}>
            {!formData ? (
              <Typography>Loading...</Typography>
            ) : (
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Requestor"
                    value={formData.requestedBy || ""}
                    InputProps={{ readOnly: true }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Email"
                    value={formData.email || ""}
                    InputProps={{ readOnly: true }}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <SelectOffice
                    label="Office"
                    name="officeId"
                    value={formData.officeId}
                    onChange={() => {}}
                    disabled
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <SelectVehicle
                    label="Vehicle"
                    name="vehicleId"
                    value={formData.vehicleId}
                    onChange={() => {}}
                    disabled
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <SelectDriver
                    label="Driver"
                    name="driverId"
                    value={formData.driverId}
                    onChange={() => {}}
                    disabled
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="RFID"
                    name="rfid"
                    value={formData.rfid}
                    onChange={() => {}}
                    disabled
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Departure Date"
                    value={formatDate(formData.departureDate)}
                    InputProps={{ readOnly: true }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Arrival Date"
                    value={formatDate(formData.arrivalDate)}
                    InputProps={{ readOnly: true }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Departure Time"
                    value={formatTime(formData.departureTime)}
                    InputProps={{ readOnly: true }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Estimated Arrival Time"
                    value={formatTime(formData.arrivalTime)}
                    InputProps={{ readOnly: true }}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="Status"
                    value={formData.status || ""}
                    InputProps={{ readOnly: true }}
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    multiline
                    label="Purpose"
                    value={formData.purpose || ""}
                    minRows={2}
                    InputProps={{ readOnly: true }}
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    multiline
                    label="Authorized Passengers"
                    value={formData.authorizedPassengers || ""}
                    minRows={2}
                    InputProps={{ readOnly: true }}
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    multiline
                    label="Remarks"
                    value={formData.remarks || ""}
                    minRows={2}
                    InputProps={{ readOnly: true }}
                  />
                </Grid>

                {/* <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="Status"
                    value={formData.status || ""}
                    InputProps={{ readOnly: true }}
                  />
                </Grid> */}
              </Grid>
            )}
            <Box mt={1} display="flex" justifyContent="flex-end" gap={1.5}>
              <Button
                variant="outlined"
                onClick={() => handleViewAttachment(formData.id)}
                sx={{
                  backgroundColor: "#27b304", // light green
                  color: "white",
                  px: 3,
                  py: 1.5,
                  "&:hover": {
                    backgroundColor: "#66bb6a", // slightly darker green
                  },
                }}
              >
                View Attachment
              </Button>
              <Button
                onClick={onClose}
                sx={{
                  backgroundColor: "#e57373", // light red
                  color: "white",
                  px: 3,
                  py: 1.5,
                  "&:hover": {
                    backgroundColor: "#ef5350", // slightly darker red
                  },
                }}
              >
                Close
              </Button>
            </Box>
          </Box>
        </Box>
      </Modal>

      <ViewAttachmentModal
        open={attachmentModalOpen}
        onClose={() => setAttachmentModalOpen(false)}
        attachmentUrl={attachmentUrl}
      />
    </>
  );
}
