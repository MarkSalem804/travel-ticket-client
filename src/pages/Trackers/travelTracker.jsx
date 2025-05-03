/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState, useRef } from "react";
import {
  useTheme,
  useMediaQuery,
  Card,
  CardContent,
  Grid,
  Divider,
} from "@mui/material";
import {
  Container,
  Paper,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  CircularProgress,
  IconButton,
  DialogContent,
  Dialog,
  DialogTitle,
  DialogContentText,
  DialogActions,
  Button,
  Box,
} from "@mui/material";
import AdfScannerSharpIcon from "@mui/icons-material/AdfScannerSharp";
import ticketService from "../../services/ticket-service";
import NewspaperIcon from "@mui/icons-material/Newspaper";
import ViewTicketModal from "../../modals/Tickets/ViewTripDetailsModal";
import { io } from "socket.io-client";

const TodaysTravelPage = () => {
  const [travels, setTravels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTravel, setSelectedTravel] = useState(null);
  const [scanDialogOpen, setScanDialogOpen] = useState(false);
  const [messageDialogOpen, setMessageDialogOpen] = useState(false);
  const [messageText, setMessageText] = useState("");
  const [rfidInput, setRfidInput] = useState("");
  const [viewOpen, setViewOpen] = useState(false);
  const [viewData, setViewData] = useState(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const inputRef = useRef();
  const socketRef = useRef(null);

  useEffect(() => {
    const fetchTravels = async () => {
      try {
        const data = await ticketService.getTodaysRequests();
        console.log("Fetched today's travels (raw):", data);
        const approvedTravels = data.filter(
          (item) => item.status === "Approved"
        );
        console.log("Filtered approved travels:", approvedTravels);
        setTravels(approvedTravels);
      } catch (err) {
        console.error("Failed to fetch today's travels:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTravels();

    // --- SETUP SOCKET CONNECTION ---
    socketRef.current = io("https://tripticket.depedimuscity.com:8050", {
      reconnection: true, // enable auto reconnect
      reconnectionAttempts: 5, // try 5 times then stop
      reconnectionDelay: 3000, // wait 3s between tries
      transports: ["websocket"], // (optional but recommended for better speed)
      secure: true,
    });

    socketRef.current.on("connect", () => {
      // console.log("Connected to socket server ✅");
    });

    socketRef.current.on("travel-updated", (data) => {
      // console.log("Received travel-updated event:", data);
      fetchTravels(); // re-fetch travels when an update happens
    });

    socketRef.current.on("ticket-updated", (data) => {
      console.log("Received ticket-updated event:", data);
      fetchTravels();
    });

    socketRef.current.on("disconnect", () => {
      console.warn("Disconnected from socket server");
    });

    // --- CLEANUP on unmount ---
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, []);

  useEffect(() => {
    if (selectedTravel) {
      console.log("Ready for RFID scan for travel ID:", selectedTravel.id);
      setScanDialogOpen(true);
      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus();
          console.log("Input focused successfully");
        }
      }, 100);
    }
  }, [selectedTravel]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Enter" || e.key === "Tab") {
        handleRFIDInput();
      } else {
        setRfidInput((prev) => prev + e.key);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [rfidInput]);

  const handleScan = (travel) => {
    console.log("Scan icon clicked. Selected travel:", travel);
    setSelectedTravel(travel);
  };

  const closeScanDialog = () => {
    setScanDialogOpen(false);
    setSelectedTravel(null);
    setRfidInput(""); // Clear RFID input on close
  };

  const showMessage = (msg) => {
    setMessageText(msg);
    setMessageDialogOpen(true);
  };

  const handleRFIDInput = async () => {
    console.log("handleRFIDInput triggered"); // Debugging to see if it's being called
    const rfid = rfidInput.trim();
    console.log("RFID input received:", rfid);

    if (!rfid) {
      console.warn("Empty RFID input, ignoring.");
      closeScanDialog();
      return;
    }

    if (rfid !== selectedTravel.rfid) {
      console.warn(
        `Mismatched RFID — Expected: ${selectedTravel.rfid}, Got: ${rfid}`
      );
      closeScanDialog();
      showMessage("Invalid RFID for this trip.");
      return;
    }

    try {
      if (!selectedTravel.travelOut) {
        console.log("Calling travelOut API with:", {
          id: selectedTravel.id,
          rfid,
        });
        const res = await ticketService.travelOut({
          id: selectedTravel.id,
          rfid,
        });
        console.log("travelOut API response:", res);
        closeScanDialog();
        showMessage("Travel out recorded!");
      } else if (!selectedTravel.travelIn) {
        console.log("Calling travelIn API with:", {
          id: selectedTravel.id,
          rfid,
        });
        const res = await ticketService.travelIn({
          id: selectedTravel.id,
          rfid,
        });
        console.log("travelIn API response:", res);
        closeScanDialog();
        showMessage("Travel in recorded!");
      } else {
        closeScanDialog();
        showMessage("Travel already completed.");
        console.log("No API call made: travel already completed.");
      }

      const updatedTravels = await ticketService.getTodaysRequests();
      const approvedTravels = updatedTravels.filter(
        (t) => t.status === "Approved"
      );
      setTravels(approvedTravels);
    } catch (err) {
      console.error("RFID processing error:", err);
      closeScanDialog();
      showMessage("Error while processing RFID. See console for details.");
    }
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

  const handleView = async (travel) => {
    try {
      const data = await ticketService.getRequestByRFIDandId(
        travel.rfid,
        travel.id
      );
      setViewData(data);
      setViewOpen(true);
    } catch (err) {
      console.error("Error fetching view data:", err);
      setViewData(null); // optional fallback
    }
  };

  return (
    <Container maxWidth="xxl">
      <Paper elevation={3} sx={{ padding: 4, marginTop: 4 }}>
        <Typography
          variant="h5"
          align="center"
          sx={{ mb: 3, fontWeight: "bold", fontFamily: "Poppins" }}
        >
          TODAY'S TRAVELS
        </Typography>

        {/* Invisible input for RFID */}
        <input
          type="text"
          ref={inputRef}
          style={{ position: "absolute", top: -100, opacity: 0 }}
          value={rfidInput}
          onChange={(e) => setRfidInput(e.target.value)}
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
                      <Box>
                        <IconButton onClick={() => handleScan(travel)}>
                          <AdfScannerSharpIcon />
                        </IconButton>
                        <IconButton onClick={() => handleView(travel)}>
                          <NewspaperIcon />
                        </IconButton>
                      </Box>
                    </Box>
                    <Divider sx={{ mb: 1 }} />
                    <Typography variant="body2">
                      <strong>Requestor:</strong> {travel.authorizedPassengers}
                    </Typography>
                    <Typography variant="body2">
                      <strong>Driver:</strong> {travel.driverName}
                    </Typography>
                    <Typography variant="body2">
                      <strong>Vehicle:</strong> {travel.vehicleName}
                    </Typography>
                    <Typography variant="body2">
                      <strong>Out:</strong>{" "}
                      {travel.travelOut ? formatTime(travel.travelOut) : "—"}
                    </Typography>
                    <Typography variant="body2">
                      <strong>In:</strong>{" "}
                      {travel.travelIn ? formatTime(travel.travelIn) : "—"}
                    </Typography>
                    <Typography variant="body2">
                      <strong>Status:</strong>{" "}
                      {travel.travelStatus || "Pending"}
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
                    Actions
                  </TableCell>
                  <TableCell
                    sx={{
                      backgroundColor: "#1976d2",
                      color: "#fff",
                      fontWeight: "bold",
                    }}
                  >
                    PASSENGERS
                  </TableCell>
                  <TableCell
                    sx={{
                      backgroundColor: "#1976d2",
                      color: "#fff",
                      fontWeight: "bold",
                    }}
                  >
                    DESTINATION
                  </TableCell>
                  <TableCell
                    sx={{
                      backgroundColor: "#1976d2",
                      color: "#fff",
                      fontWeight: "bold",
                    }}
                  >
                    DRIVER
                  </TableCell>
                  <TableCell
                    sx={{
                      backgroundColor: "#1976d2",
                      color: "#fff",
                      fontWeight: "bold",
                    }}
                  >
                    VEHICLES
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
                    STATUS
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {travels.map((travel) => (
                  <TableRow key={travel.id}>
                    <TableCell>
                      <IconButton
                        color="primary"
                        onClick={() => handleScan(travel)}
                      >
                        <AdfScannerSharpIcon />
                      </IconButton>
                      <IconButton
                        color="secondary"
                        onClick={() => handleView(travel)}
                      >
                        <NewspaperIcon />
                      </IconButton>
                    </TableCell>
                    <TableCell
                      sx={{
                        width: "120px",
                        maxWidth: "120px",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {travel.authorizedPassengers}
                    </TableCell>
                    <TableCell>{travel.destination}</TableCell>
                    <TableCell>{travel.driverName}</TableCell>
                    <TableCell>{travel.vehicleName}</TableCell>
                    <TableCell>
                      {travel.travelOut ? formatTime(travel.travelOut) : "—"}
                    </TableCell>
                    <TableCell>
                      {travel.travelIn ? formatTime(travel.travelIn) : "—"}
                    </TableCell>
                    <TableCell>{travel.travelStatus || "Pending"}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Box>
        )}
      </Paper>

      {viewOpen && viewData && (
        <ViewTicketModal
          open={viewOpen}
          onClose={() => setViewOpen(false)}
          ticket={viewData}
        />
      )}

      <Dialog
        open={scanDialogOpen}
        onClose={closeScanDialog}
        sx={{
          "& .MuiDialog-paper": {
            width: "90%", // Default width on smaller screens
            maxWidth: "500px", // Maximum width for larger screens
          },
        }}
      >
        <DialogTitle>RFID Scan</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please tap your RFID card on the reader.
          </DialogContentText>
        </DialogContent>
      </Dialog>

      <Dialog
        open={messageDialogOpen}
        onClose={() => setMessageDialogOpen(false)}
        sx={{
          "& .MuiDialog-paper": {
            width: "90%",
            maxWidth: "500px",
          },
        }}
      >
        <DialogTitle>Notification</DialogTitle>
        <DialogContent>
          <DialogContentText>{messageText}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            variant="contained"
            onClick={() => setMessageDialogOpen(false)}
          >
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default TodaysTravelPage;
