/* eslint-disable no-unused-vars */
import React, { useEffect, useState, useRef } from "react";
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
} from "@mui/material";
import AdfScannerSharpIcon from "@mui/icons-material/AdfScannerSharp";
import ticketService from "../../services/ticket-service";

const TodaysTravelPage = () => {
  const [travels, setTravels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTravel, setSelectedTravel] = useState(null);
  const inputRef = useRef();

  useEffect(() => {
    ticketService
      .getTodaysRequests()
      .then((data) => {
        console.log("Fetched today's travels:", data);
        setTravels(data);
      })
      .catch((err) => {
        console.error("Failed to fetch today's travels:", err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  // Focus RFID input on mount and when travel is selected
  useEffect(() => {
    inputRef.current?.focus();
    if (selectedTravel) {
      console.log("Ready for RFID scan for travel ID:", selectedTravel.id);
    }
  }, [selectedTravel]);

  const handleScan = (travel) => {
    console.log("Scan icon clicked. Selected travel:", travel);
    setSelectedTravel(travel);
    setTimeout(() => inputRef.current?.focus(), 100); // Make sure input is focused
  };

  const handleRFIDInput = async (e) => {
    if (e.key === "Enter" && selectedTravel) {
      const rfid = e.target.value.trim();
      console.log("RFID input received:", rfid);

      if (!rfid) {
        console.warn("Empty RFID input, ignoring.");
        return;
      }

      if (rfid !== selectedTravel.rfid) {
        alert("Invalid RFID for this trip.");
        console.warn(
          `Mismatched RFID — Expected: ${selectedTravel.rfid}, Got: ${rfid}`
        );
        e.target.value = "";
        setSelectedTravel(null);
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
          alert("Travel out recorded!");
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
          alert("Travel in recorded!");
        } else {
          alert("Travel already completed.");
          console.log("No API call made: travel already completed.");
        }

        // Refresh table after scan
        console.log("Refreshing travel list...");
        const updatedTravels = await ticketService.getTodaysRequests();
        console.log("Updated travel list:", updatedTravels);
        setTravels(updatedTravels);
      } catch (err) {
        console.error("RFID processing error:", err);
        alert("Error while processing RFID. See console for details.");
      }

      // Reset
      e.target.value = "";
      setSelectedTravel(null);
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
    if (!dateString) return "—";
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  return (
    <Container maxWidth="xxl">
      <Paper elevation={3} sx={{ padding: 4, marginTop: 4 }}>
        <Typography
          variant="h5"
          align="center"
          sx={{ mb: 3, fontWeight: "bold", fontFamily: "Poppins" }}
        >
          Today's Travels
        </Typography>

        {/* Hidden input to capture RFID */}
        <input
          type="text"
          ref={inputRef}
          onKeyDown={handleRFIDInput}
          style={{ position: "absolute", top: -100, opacity: 0 }}
        />

        {loading ? (
          <CircularProgress sx={{ display: "block", mx: "auto" }} />
        ) : travels.length === 0 ? (
          <Typography align="center">No travels for today.</Typography>
        ) : (
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Actions</TableCell>
                <TableCell>Requestor</TableCell>
                <TableCell>Destination</TableCell>
                <TableCell>Driver</TableCell>
                <TableCell>Out</TableCell>
                <TableCell>In</TableCell>
                <TableCell>Status</TableCell>
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
                  </TableCell>
                  <TableCell>{travel.requestedBy}</TableCell>
                  <TableCell>{travel.destination}</TableCell>
                  <TableCell>{travel.driverName}</TableCell>
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
        )}
      </Paper>
    </Container>
  );
};

export default TodaysTravelPage;
