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
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import ticketService from "../../services/ticket-service";

const RequestForm = () => {
  const [fileName, setFileName] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [offices, setOffices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [selectedOffice, setSelectedOffice] = useState("");

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
      console.log("📌 File Selected:", file.name); // Debugging log
      setSelectedFile(file); // Store actual file object
      setFileName(file.name); // Store file name for UI
    } else {
      console.log("⚠️ No file selected.");
    }
  };

  const [formData, setFormData] = useState({
    requestedBy: "",
    email: "",
    officeId: "",
    designation: "",
    destination: "",
    purpose: "",
    departureDate: null,
    arrivalDate: null,
    authorizedPassengers: "",
    remarks: "",
  });

  const handleChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  const handleDateChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const data = new FormData();
    const updatedFormData = {
      ...formData,
      officeId: selectedOffice,
      departureDate: formData.departureDate
        ? formData.departureDate.toISOString()
        : null,
      arrivalDate: formData.arrivalDate
        ? formData.arrivalDate.toISOString()
        : null,
    };

    Object.keys(updatedFormData).forEach((key) => {
      data.append(key, updatedFormData[key]);
    });

    if (selectedOffice) {
      data.append("officeId", selectedOffice);
    }

    if (selectedFile) {
      console.log("✅ Adding File to FormData:", selectedFile.name);
      data.append("file", selectedFile);
    } else {
      console.log("⚠️ No file selected.");
    }

    // 🚀 Debugging Logs
    console.log("📌 Request Body (Before Submission):", updatedFormData);
    console.log("📌 Selected Office:", selectedOffice);
    console.log(
      "📌 Selected File:",
      selectedFile ? selectedFile.name : "No file"
    );

    console.log("📌 FormData Contents:");
    for (let pair of data.entries()) {
      console.log(`${pair[0]}:`, pair[1]);
    }

    try {
      const response = await ticketService.submitTicket(data);
      console.log("Ticket Submitted:", response.data);
    } catch (error) {
      console.error("Error submitting ticket:", error);
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Container maxWidth="md">
        <Paper elevation={3} sx={{ padding: 4, marginTop: 4 }}>
          <Typography
            variant="h5"
            align="center"
            sx={{ mb: 5, fontWeight: "bold" }}
          >
            REQUEST FORM
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
                <DateTimePicker
                  fullWidth
                  label="Departure Date"
                  value={formData.departureDate}
                  onChange={(value) => handleDateChange("departureDate", value)}
                  renderInput={(params) => (
                    <TextField {...params} fullWidth required />
                  )}
                  sx={{ width: "100%" }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <DateTimePicker
                  fullWidth
                  label="Arrival Date"
                  value={formData.arrivalDate}
                  onChange={(value) => handleDateChange("arrivalDate", value)}
                  renderInput={(params) => (
                    <TextField {...params} fullWidth required />
                  )}
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
              <Grid item xs={12}>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  fullWidth
                  size="large"
                >
                  Submit Request
                </Button>
              </Grid>
            </Grid>
          </form>
        </Paper>
      </Container>
    </LocalizationProvider>
  );
};

export default RequestForm;
