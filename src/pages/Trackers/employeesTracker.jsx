import React, { useState, useRef, useEffect } from "react";
import {
  useTheme,
  useMediaQuery,
  Container,
  Paper,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  DialogContentText,
  CircularProgress,
  Box,
  Snackbar,
  Alert,
  TextField,
  Grid,
  Card,
  CardContent,
  Divider,
} from "@mui/material";
import ticketService from "../../services/ticket-service"; // Make sure to import your axios function

const EmployeesTravels = () => {
  const [loading, setLoading] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [travels, setTravels] = useState([]);
  const [rfidInput, setRfidInput] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [showErrorDialog, setShowErrorDialog] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("info");
  const [govDialogOpen, setGovDialogOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const inputRef = useRef(null);

  useEffect(() => {
    fetchUrgentTrips();
  }, []);

  const fetchUrgentTrips = async () => {
    try {
      setLoading(true);
      const data = await ticketService.getAllUrgentTrips();

      const excludedDrivers = [
        "Wilfredo P. Estopace",
        "Roberto D. Baarde jr",
        "Salem Mark",
        "Joseph Salem",
      ];

      const filteredData = data.filter((trip) => {
        const driver = trip.driverName || trip.ownerName;
        const vehicleType = trip.vehicles?.type;

        return (
          !excludedDrivers.includes(driver) &&
          vehicleType !== "Government (Red Plate)"
        );
      });

      console.log(filteredData);

      setTravels(filteredData); // 👈 update the table data
    } catch (error) {
      console.error(
        "❌ [fetchUrgentTrips] Failed to load urgent trips:",
        error
      );
    } finally {
      setLoading(false);
    }
  };

  const handleTopScanButton = () => {
    console.log("🔝 [handleTopScanButton] RFID scan button clicked.");
    setOpenDialog(true);

    // Set focus to the RFID input field immediately
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
        console.log("✅ [handleTopScanButton] Focused on RFID input field.");
      }
    }, 100);
  };

  const handleCloseDialog = () => {
    console.log("❌ [handleCloseDialog] Closing RFID dialog.");
    setOpenDialog(false);

    // also clear RFID input in case it wasn't cleared
    setRfidInput("");
  };

  const handleRfidChange = async (e) => {
    const scannedRfid = e.target.value;
    console.log("📥 [handleRfidChange] Scanned RFID:", scannedRfid);
    setRfidInput(scannedRfid);

    if (scannedRfid.length >= 10) {
      console.log("🚀 [handleRfidChange] Sending RFID to backend API...");

      try {
        const data = await ticketService.urgentTap(scannedRfid);
        console.log("✅ [API Response] Successfully processed RFID:", data);

        const vehicleType = data?.vehicles?.type || data?.type;

        if (vehicleType === "Government (Red Plate)") {
          console.warn(
            "🚫 Vehicle type is Government (Red Plate) — not allowed."
          );
          setSnackbarMessage("Only for Private Vehicles.");
          setSnackbarSeverity("error"); // Optional if you use a severity prop
          setSnackbarOpen(true);
          return; // 🛑 Stop here — no further processing
        }

        setSnackbarMessage("RFID scanned successfully!");
        setSnackbarSeverity("success"); // Optional
        setSnackbarOpen(true);

        await fetchUrgentTrips(); // ✅ WAIT for the table to update
        setRfidInput(""); // ✅ Clear the input
        handleCloseDialog(); // ✅ Finally close the dialog cleanly
      } catch (error) {
        console.error("❌ [API Error] Error processing RFID:", error);

        if (error?.response?.data?.message === "Only for Private Vehicles") {
          setGovDialogOpen(true);
          setRfidInput("");
          handleCloseDialog();
          return;
        }

        setSnackbarMessage("Error scanning RFID, please try again.");
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
      }
    }
  };

  const handleFocus = () => {
    console.log("✅ [handleFocus] Input field focused.");
  };

  const formatTime = (dateString) => {
    if (!dateString) return "—";
    const date = new Date(dateString);

    const formattedDate = date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "2-digit",
    });

    const formattedTime = date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });

    return `${formattedDate} — ${formattedTime}`;
  };

  return (
    <Container maxWidth="xxl">
      <Paper elevation={3} sx={{ padding: 4, marginTop: 4 }}>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={2}
        >
          <Typography
            variant="h5"
            sx={{ fontWeight: "bold", fontFamily: "Poppins" }}
          >
            EMPLOYEE'S VEHICLE LOGS
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={handleTopScanButton}
          >
            Tap RFID
          </Button>
        </Box>

        {/* Invisible input for RFID */}
        <input
          type="text"
          ref={inputRef}
          style={{ position: "absolute", top: -100, opacity: 0 }}
          value={rfidInput}
          onChange={handleRfidChange}
          onFocus={handleFocus} // Log when focused
        />

        {loading ? (
          <CircularProgress sx={{ display: "block", mx: "auto" }} />
        ) : travels.length === 0 ? (
          <Typography align="center">No travels for today.</Typography>
        ) : isMobile ? (
          <Grid container spacing={2}>
            {travels.map((travel) => (
              <Grid item xs={12} key={travel.id}>
                <Card elevation={3} sx={{ borderRadius: 3, p: 2 }}>
                  <CardContent>
                    <Box display="flex" justifyContent="space-between" mb={1}>
                      <Typography variant="h6">{travel.destination}</Typography>
                    </Box>
                    <Divider sx={{ mb: 1 }} />
                    <Typography variant="body2">
                      <strong>VEHICLE</strong> {travel.vehicleName}
                    </Typography>
                    <Typography variant="body2">
                      <strong>PLATE</strong> {travel.plateNo}
                    </Typography>
                    <Typography variant="body2">
                      <strong>ARRIVAL</strong>{" "}
                      {travel.departure ? formatTime(travel.departure) : "—"}
                    </Typography>
                    <Typography variant="body2">
                      <strong>DEPARTURE</strong>{" "}
                      {travel.arrival ? formatTime(travel.arrival) : "—"}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        ) : (
          <Box sx={{ maxHeight: 500, overflowY: "auto" }}>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell
                    sx={{
                      backgroundColor: "#1976d2",
                      color: "#fff",
                      fontWeight: "bold",
                    }}
                  >
                    VEHICLE
                  </TableCell>
                  <TableCell
                    sx={{
                      backgroundColor: "#1976d2",
                      color: "#fff",
                      fontWeight: "bold",
                    }}
                  >
                    PLATE
                  </TableCell>
                  <TableCell
                    sx={{
                      backgroundColor: "#1976d2",
                      color: "#fff",
                      fontWeight: "bold",
                    }}
                  >
                    ARRIVAL
                  </TableCell>
                  <TableCell
                    sx={{
                      backgroundColor: "#1976d2",
                      color: "#fff",
                      fontWeight: "bold",
                    }}
                  >
                    DEPARTURE
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {travels.map((travel) => (
                  <TableRow key={travel.id}>
                    <TableCell>{travel.vehicleName}</TableCell>
                    <TableCell>{travel.plateNo}</TableCell>
                    <TableCell>
                      {travel.departure ? formatTime(travel.departure) : "—"}
                    </TableCell>
                    <TableCell>
                      {travel.arrival ? formatTime(travel.arrival) : "—"}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Box>
        )}
      </Paper>

      {/* RFID Scan Dialog */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        fullWidth
        maxWidth="xs"
      >
        <DialogTitle>Scan RFID</DialogTitle>
        <DialogContent>
          <DialogContentText>Please scan your RFID</DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            label="RFID"
            type="text"
            fullWidth
            variant="outlined"
            value={rfidInput}
            onChange={handleRfidChange}
            inputRef={inputRef}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={showErrorDialog} onClose={() => setShowErrorDialog(false)}>
        <DialogTitle>Notice</DialogTitle>
        <DialogContent>
          <DialogContentText>Only for Private Vehicles.</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowErrorDialog(false)} autoFocus>
            OK
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={govDialogOpen} onClose={() => setGovDialogOpen(false)}>
        <DialogTitle>Process Failed</DialogTitle>
        <DialogContent>
          <DialogContentText>
            This functionality is only for private vehicles.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setGovDialogOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for showing success/error messages */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
      >
        <Alert
          onClose={() => setSnackbarOpen(false)}
          severity={snackbarSeverity}
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default EmployeesTravels;
