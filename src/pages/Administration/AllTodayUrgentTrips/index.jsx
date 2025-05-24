/* eslint-disable no-alert */
/* eslint-disable react/jsx-no-useless-fragment */
/* eslint-disable no-unused-vars */
/* eslint-disable no-use-before-define */
/* eslint-disable no-shadow */
import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  MenuItem,
  Select,
  TextField,
  Typography,
  TablePagination,
} from "@mui/material";
import {
  List as ListIcon,
  GridView as GridViewIcon,
  TableChart as TableChartIcon,
} from "@mui/icons-material";
import { useStateContext } from "../../../contexts/ContextProvider";
import AdminTable from "../AdminTable";
// import userService from "../../../services/user-service";
import ticketService from "../../../services/ticket-service";
import UpdateVehicleModal from "../../../modals/Tickets/UpdateVehicleModal";
import RegisterUserModal from "../../../modals/Users/AddUserModal";
import AddVehicleModal from "../../../modals/Tickets/AddVehicleModal";
import UrgentsTable from "./UrgentRequestTable";

export default function UrgentTodayTrips() {
  const { auth, updateNewTicketsCount } = useStateContext();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [refresh, setRefresh] = useState(false);
  const [urgentTrips, setUrgentTrips] = useState([]);
  const [view, setView] = useState("table" || localStorage.getItem("view"));

  const [urgentTripFilter, setUrgentTripFilter] = useState("");

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [openUpdateModal, setOpenUpdateModal] = useState(false);
  const [openAddModal, setOpenAddModal] = useState(false);
  const [selectedUrgentTrip, setSelectedUrgentTrip] = useState(null);

  const handleUpdate = (urgentTrip) => {
    setSelectedUrgentTrip(urgentTrip);
    setOpenUpdateModal(true);
  };

  useEffect(() => {
    const fetchUrgents = async () => {
      setLoading(true);
      try {
        const response = await ticketService.getUrgentTodayTrip();
        setData(response);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch trip data.");
      } finally {
        setLoading(false);
        setRefresh(false);
      }
    };

    fetchUrgents();
  }, [refresh]);

  const handleUrgentFilterChange = (e) => setUrgentTripFilter(e.target.value);

  const filteredData = data.filter((trip) => {
    const matchesName = urgentTripFilter
      ? trip.vehicleName.toLowerCase().includes(urgentTripFilter.toLowerCase())
      : true;
    return matchesName;
  });

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

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const paginatedData = filteredData.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const handleViewChange = (newView) => {
    setView(newView);
    localStorage.setItem("view", newView);
  };

  return (
    <Box
      sx={{
        p: "20px",
        backgroundColor: "white",
      }}
    >
      <Box>
        <Typography
          sx={{
            textAlign: "left",
            fontSize: "20px", // Default font size
            fontWeight: "bold",
            color: "black",
            "@media (max-width: 600px)": {
              fontSize: "12px", // Smaller font size for mobile
            },
          }}
        >
          {auth?.role === "admin"
            ? "Welcome to the SDOIC - Trip Ticket Management System!"
            : "Welcome to the SDOIC - Trip Ticket Management System!"}
        </Typography>
        <Typography
          sx={{
            textAlign: "left",
            fontSize: "15px", // Default font size
            color: "black",
            mt: 2,
            mb: 2,
            "@media (max-width: 600px)": {
              fontSize: "12px", // Smaller font size for mobile
            },
          }}
        >
          {auth?.role === "admin"
            ? `${auth?.username} - Administrator`
            : `${auth?.officeName} - ${auth.role}`}
        </Typography>
      </Box>

      <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
        <IconButton
          onClick={() => handleViewChange("list")}
          sx={{
            marginRight: 1,
            color: view === "list" ? "blue" : "inherit",
            "@media (max-width: 432px)": { fontSize: "1rem" },
          }}
        >
          <ListIcon />
        </IconButton>
        <IconButton
          onClick={() => handleViewChange("card")}
          sx={{
            color: view === "card" ? "blue" : "inherit",
            "@media (max-width: 432px)": { display: "none" },
          }}
        >
          <GridViewIcon />
        </IconButton>
        <IconButton
          onClick={() => handleViewChange("table")}
          sx={{
            color: view === "table" ? "blue" : "inherit",
            "@media (max-width: 432px)": { display: "none" },
          }}
        >
          <TableChartIcon />
        </IconButton>
      </Box>

      <Box
        boxShadow="3px 2px 15px 3px rgba(100, 100, 100, 0.8)"
        p="1rem"
        sx={{
          backgroundColor: "primary.main",
          color: "white",
        }}
      >
        <Typography
          sx={{
            textTransform: "uppercase",
            fontSize: {
              xs: "12px",
              sm: "18px",
              md: "25px",
            },
            fontWeight: "bold",
            textAlign: "center",
          }}
        >
          URGENT TRIPS MANAGEMENT
        </Typography>
      </Box>

      <Box
        sx={{
          display: "flex",
          my: 5,
          alignItems: "center",
          justifyContent: "Right",
        }}
      >
        <TextField
          label="Search user"
          value={urgentTripFilter}
          onChange={handleUrgentFilterChange}
          sx={{
            width: "300px", // Width can also be adjusted as needed
            fontSize: "14px", // Smaller font size
            display: "flex",
            justifyContent: "center",
          }}
        />
      </Box>

      <Box
        boxShadow="3px 2px 15px 3px rgba(100, 100, 100, 0.8)"
        p="1rem"
        sx={{
          backgroundColor: "rgba(240, 240, 240, 1)",
          my: 5,
          "@media (max-width: 600px)": {
            my: 2, // Less margin on mobile
            width: "100%",
          },
        }}
      >
        <Divider>
          <Typography
            sx={{
              textTransform: "uppercase",
              fontSize: "25px", // Default font size
              fontWeight: "bold",
              mb: 2,
              "@media (max-width: 600px)": {
                fontSize: "20px", // Smaller font size for mobile
              },
            }}
          >
            Urgent Trips
          </Typography>
        </Divider>

        {/* Trip Ticket Card Style */}
        <Box
          sx={{
            display: view === "list" ? "block" : "grid",
            gridTemplateColumns: view === "card" ? "repeat(4, 1fr)" : "none", // Adjust grid for card view
            gap: 2,
            "@media (max-width: 1200px)": {
              gridTemplateColumns: view === "card" ? "repeat(3, 1fr)" : "none",
            },
            "@media (max-width: 900px)": {
              gridTemplateColumns: view === "card" ? "repeat(2, 1fr)" : "none",
            },
            "@media (max-width: 600px)": {
              gridTemplateColumns: view === "card" ? "1fr" : "none",
            },
          }}
        >
          {view === "table" ? (
            <UrgentsTable data={paginatedData} loadingState={loading} />
          ) : (
            paginatedData.map((trip) => (
              <Box
                key={trip.id}
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 2,
                  backgroundColor: "#fff",
                  border: "2px dashed #ccc",
                  borderRadius: "15px",
                  padding: "20px",
                  marginTop: "20px",
                  boxShadow: "2px 2px 10px rgba(0,0,0,0.1)",
                  height: "auto",
                  "@media (max-width: 600px)": {
                    padding: "15px", // Less padding for mobile
                    marginTop: "10px", // Less margin on mobile
                  },
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    flexWrap: "wrap",
                  }}
                >
                  <Box sx={{ minWidth: "200px" }}>
                    <Typography
                      variant="h6"
                      fontWeight="bold"
                      sx={{
                        fontSize: "16px", // Smaller font size for ticket details
                        "@media (max-width: 600px)": {
                          fontSize: "14px", // Reduce font size for mobile
                        },
                      }}
                    >
                      Owner: {trip.ownerName}
                    </Typography>
                    <Typography sx={{ fontSize: "14px" }}>
                      Vehicle: {trip.vehicleName}
                    </Typography>
                    <Typography sx={{ fontSize: "14px" }}>
                      Plate: {trip.plateNo}
                    </Typography>
                    <Typography sx={{ fontSize: "14px" }}>
                      Type: {trip.type}
                    </Typography>
                    <Typography sx={{ fontSize: "14px" }}>
                      Arrival: {trip.departure}
                    </Typography>
                    <Typography sx={{ fontSize: "14px" }}>
                      Departure: {trip.arrival}
                    </Typography>
                  </Box>
                </Box>

                <Box
                  sx={{
                    display: "flex",
                    justifyContent: view === "list" ? "flex-end" : "flex-end",
                    mt: 2,
                    gap: 2,
                  }}
                >
                  <Button
                    variant="contained"
                    color="primary"
                    sx={{
                      width: view === "list" ? "10%" : "40%", // Smaller width in list view
                    }}
                    onClick={() => handleUpdate(trip)} // Handle the update action
                  >
                    View / Update
                  </Button>
                </Box>
              </Box>
            ))
          )}
        </Box>

        {/* <UpdateVehicleModal
          open={openUpdateModal}
          onClose={() => setOpenUpdateModal(false)}
          vehicle={selectedVehicle}
          onUpdated={handleVehicleUpdated}
        /> */}

        {/* <RegisterUserModal
          open={openAddModal}
          onClose={() => setOpenAddModal(false)}
          user={selectedUrgentTrip}
          //   onAdded={hand}
        /> */}

        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mt: 2,
            flexWrap: "wrap", // responsive
          }}
        >
          <TablePagination
            rowsPerPageOptions={[10, 25, 50]}
            component="div"
            count={filteredData.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Box>
      </Box>
    </Box>
  );
}
