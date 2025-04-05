/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import {
  Container,
  Paper,
  Typography,
  TextField,
  MenuItem,
  Button,
} from "@mui/material";
import Grid from "@mui/material/Grid";
import { useStateContext } from "../../contexts/ContextProvider";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import ticketService from "../../services/ticket-service";
import ConfirmationDialog from "../../components/PopoutDialogs/dialog";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";

dayjs.extend(utc);

const RequestForm = ({ onSubmitSuccess }) => {
  const { auth, fetchNewTicketsCount } = useStateContext();
  const [fileName, setFileName] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [offices, setOffices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [selectedOffice, setSelectedOffice] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [refresh, setRefresh] = useState(false);

  const handleGetAll = () => {
    setLoading(true);
    setError("");

    ticketService
      .getAllOffices()
      .then((e) => {
        setOffices(e);
      })
      .catch((err) => {
        setError(err?.message);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    handleGetAll();
  }, []);

  const handleFileChange = (event) => {
    const file = event.target.files[0];

    if (file) {
      setSelectedFile(file);
      setFileName(file.name);
    } else {
      console.log("⚠️ No file selected.");
    }
  };

  const initialFormState = {
    requestedBy: "",
    email: "",
    officeId: "",
    designation: "",
    destination: "",
    purpose: "",
    departureDate: null,
    arrivalDate: null,
    departureTime: null,
    arrivalTime: null,
    authorizedPassengers: "",
    remarks: "",
  };

  const [formData, setFormData] = useState(initialFormState);

  const handleChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  const handleDateChange = (field, value) => {
    if (!value) {
      console.log(`Selected ${field}: No value`);
      setFormData((prev) => ({ ...prev, [field]: null }));
      return;
    }

    const parsedValue = dayjs(value); // ✅ Ensure it's a Day.js object

    if (field === "departureTime" || field === "arrivalTime") {
      const dateField =
        field === "departureTime" ? "departureDate" : "arrivalDate";
      const selectedDate = formData[dateField]
        ? dayjs(formData[dateField])
        : dayjs();

      const mergedDateTime = selectedDate
        .hour(parsedValue.hour())
        .minute(parsedValue.minute())
        .second(0);

      console.log(`Selected ${field} (Local Time):`, mergedDateTime.format());

      setFormData((prev) => ({
        ...prev,
        [field]: mergedDateTime.toDate(), // ✅ Store as Date object
      }));
    } else {
      console.log(`Selected ${field} (Local Time):`, parsedValue.format());

      setFormData((prev) => ({
        ...prev,
        [field]: parsedValue.toDate(), // ✅ Store as Date object
      }));
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setOpenDialog(true);
    setLoading(true);

    const data = new FormData();

    // Ensure we're creating Date objects
    const parseToDate = (value) => (value ? new Date(value) : null);

    const updatedFormData = {
      ...formData,
      officeId: selectedOffice,

      departureDate: parseToDate(formData.departureDate),
      arrivalDate: parseToDate(formData.arrivalDate),
      departureTime: parseToDate(formData.departureTime),
      arrivalTime: parseToDate(formData.arrivalTime),
    };

    Object.keys(updatedFormData).forEach((key) => {
      data.append(key, updatedFormData[key]);
    });

    if (selectedFile) {
      data.append("file", selectedFile);
    }

    try {
      // Submit the ticket
      await ticketService.submitTicket(data);

      if (typeof onSubmitSuccess === "function") {
        onSubmitSuccess();
      }

      // Reset the form state
      setFormData(initialFormState);
      setSelectedFile(null);
      setFileName("");
      setSelectedOffice("");

      // Clear localStorage to force a fresh data fetch on the admin panel
      localStorage.removeItem("tripTicketData"); // Clear just the trip ticket data

      // Optionally force the admin panel to re-fetch new data
      setRefresh(true); // Trigger refresh so that admin panel fetches new data
    } catch (error) {
      console.error("Error submitting ticket:", error);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Container maxWidth="lg">
        <Paper elevation={3} sx={{ padding: 4, marginTop: 4 }}>
          <Typography
            variant="h5"
            align="center"
            sx={{ mb: 5, fontWeight: "bold", fontFamily: "Poppins" }}
          >
            TRIP TICKET REQUEST FORM
          </Typography>

          <form onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              {/* Requested By & Email (Side by Side) */}
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Requested By"
                  name="requestedBy"
                  value={formData.requestedBy}
                  onChange={handleChange}
                  required
                  placeholder="(First Name  M.I.  Last Name)"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="(Deped Official Email)"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  select
                  label="Office"
                  name="officeId"
                  value={selectedOffice}
                  onChange={(e) => setSelectedOffice(e.target.value)}
                  required
                >
                  {offices.map((office) => (
                    <MenuItem key={office.id} value={office.id}>
                      {office.officeName}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Designation"
                  name="designation"
                  value={formData.designation}
                  onChange={handleChange}
                  required
                />
              </Grid>

              {/* Destination (Full Width) */}
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Destination"
                  name="destination"
                  value={formData.destination}
                  onChange={handleChange}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Purpose"
                  name="purpose"
                  value={formData.purpose}
                  onChange={handleChange}
                  required
                  multiline
                  rows={3}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <DatePicker
                  label="Departure Date"
                  value={
                    formData.departureDate
                      ? dayjs(formData.departureDate)
                      : null
                  }
                  onChange={(value) =>
                    handleDateChange("departureDate", value?.toDate() || null)
                  }
                  sx={{ width: "100%" }}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <DatePicker
                  label="Arrival Date"
                  value={
                    formData.arrivalDate ? dayjs(formData.arrivalDate) : null
                  }
                  onChange={(value) =>
                    handleDateChange("arrivalDate", value?.toDate() || null)
                  }
                  sx={{ width: "100%" }}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TimePicker
                  label="Departure Time"
                  value={
                    formData.departureTime
                      ? dayjs(formData.departureTime)
                      : null
                  }
                  onChange={(value) =>
                    handleDateChange("departureTime", value?.toDate() || null)
                  }
                  sx={{ width: "100%" }}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TimePicker
                  label="Arrival Time"
                  value={
                    formData.arrivalTime ? dayjs(formData.arrivalTime) : null
                  }
                  onChange={(value) =>
                    handleDateChange("arrivalTime", value?.toDate() || null)
                  }
                  sx={{ width: "100%" }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Authorized Passengers"
                  name="authorizedPassengers"
                  value={formData.authorizedPassengers}
                  onChange={handleChange}
                  required
                  multiline
                  rows={3}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Remarks"
                  name="remarks"
                  value={formData.remarks}
                  onChange={handleChange}
                  multiline
                  rows={2}
                  size="large"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Button
                  component="label"
                  variant="contained"
                  startIcon={<CloudUploadIcon />}
                  sx={{
                    width: "100%",
                    my: 1,
                    backgroundColor: "black",
                  }}
                  size="large"
                >
                  Upload File
                  <input type="file" hidden onChange={handleFileChange} />
                </Button>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullwidth
                  sx={{ width: "100%" }}
                  value={fileName}
                  placeholder="No file selected"
                  slotProps={{ input: { readOnly: true } }}
                />
              </Grid>
              <Grid
                item
                xs={12}
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  textAlign: "center",
                }}
              >
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  size="large"
                  sx={{
                    width: "60%",
                    padding: 2,
                    my: 2,
                    backgroundColor: "black",
                  }}
                >
                  Submit Request
                </Button>
              </Grid>
            </Grid>
          </form>
        </Paper>
      </Container>

      <ConfirmationDialog
        open={openDialog}
        title={loading ? "Processing...." : "Submission Success!"}
        message="Your request has been submitted successfully!"
        onConfirm={() => setOpenDialog(false)}
        onCancel={() => setOpenDialog(false)}
      />
    </LocalizationProvider>
  );
};

export default RequestForm;
