import React, { useState, useRef, useEffect } from "react";
import {
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
} from "@mui/material";
import ticketService from "../../services/ticket-service"; // Make sure to import your axios function

const UrgentTravels = () => {
  const [loading, setLoading] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [travels, setTravels] = useState([]);
  const [rfidInput, setRfidInput] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const inputRef = useRef(null);

  useEffect(() => {
    fetchUrgentTrips();
  }, []);

  const fetchUrgentTrips = async () => {
    try {
      setLoading(true);
      const data = await ticketService.getAllUrgentTrips();
      console.log("✅ [fetchUrgentTrips] Data loaded:", data);

      const filteredData = data.filter(
        (trip) => trip.driverName !== "Wilfredo P. Estopace"
      );

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
    }, 100); // Ensure focus happens after dialog opens
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
        setSnackbarMessage("RFID scanned successfully!");
        setSnackbarOpen(true);

        await fetchUrgentTrips(); // ✅ WAIT for the table to update
        setRfidInput(""); // ✅ Clear the input
        handleCloseDialog(); // ✅ Finally close the dialog cleanly
      } catch (error) {
        console.error("❌ [API Error] Error processing RFID:", error);
        setSnackbarMessage("Error scanning RFID, please try again.");
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
            Urgent Travels
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
          <Typography align="center">No urgent travels available.</Typography>
        ) : (
          <Box sx={{ maxHeight: 500, overflow: "auto" }}>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell>Driver Name</TableCell>
                  <TableCell>Vehicle Name</TableCell>
                  <TableCell>Plate Number</TableCell>
                  <TableCell>Departure</TableCell>
                  <TableCell>Arrival</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {travels.map((travel) => (
                  <TableRow key={travel.id}>
                    <TableCell>{travel.driverName}</TableCell>
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
        sx={{
          "& .MuiDialog-paper": {
            width: "90%",
            maxWidth: "500px",
          },
        }}
      >
        <DialogTitle>RFID Scan</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please tap your RFID card on the reader.
          </DialogContentText>

          {/* 👇 Here's the new TextField */}
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
          <Button variant="contained" onClick={handleCloseDialog}>
            Close
          </Button>
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
          severity={snackbarMessage.includes("Error") ? "error" : "success"}
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default UrgentTravels;
