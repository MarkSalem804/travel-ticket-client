import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Typography,
  Container,
  Box,
  Tooltip,
} from "@mui/material";
import depedLogo from "../assets/deped_logo.png";
import tripBackground from "../assets/background2.png";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import DepartureBoardIcon from "@mui/icons-material/DepartureBoard";
import ListAltIcon from "@mui/icons-material/ListAlt";
import { useNavigate } from "react-router-dom";

const FormLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isFullPage = location.pathname === "/TodaysTravels";

  const handleRedirectToLogin = () => {
    navigate("./Authenticate");
  };

  const handleRedirectToTravels = () => {
    navigate("./TodaysTravels");
  };

  const handleRedirectToForm = () => {
    navigate("./");
  };
  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundImage: `url(${tripBackground})`,
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        backgroundPosition: "center",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Header */}
      <AppBar
        position="static"
        sx={{ background: "#444545", paddingY: { xs: 0.5, xl: 1 } }}
      >
        <Toolbar sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Box
            component="img"
            src={depedLogo}
            alt="Logo"
            sx={{
              height: { xs: 30, sm: 40 },
            }}
          />
          <Typography
            variant="h6"
            sx={{
              fontSize: { xs: "0.7rem", sm: "1.5rem" },
              fontWeight: "bold",
              flexGrow: 1,
            }}
          >
            TRIP TICKETING SYSTEM
          </Typography>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: { xs: 1.5, xl: 4 },
            }}
          >
            <Tooltip title="Request Form" onClick={handleRedirectToForm}>
              <ListAltIcon
                sx={{
                  fontSize: { xs: 20, sm: 35 },
                  color: "white",
                  cursor: "pointer",
                }}
              />
            </Tooltip>
            <Tooltip title="Today's Trips" onClick={handleRedirectToTravels}>
              <DepartureBoardIcon
                sx={{
                  fontSize: { xs: 20, sm: 35 },
                  color: "white",
                  cursor: "pointer",
                }}
              />
            </Tooltip>
            <Tooltip title="Login" onClick={handleRedirectToLogin}>
              <AdminPanelSettingsIcon
                sx={{
                  fontSize: { xs: 20, sm: 40 },
                  color: "white",
                  cursor: "pointer",
                }}
              />
            </Tooltip>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Content */}
      {isFullPage ? (
        <Box sx={{ flexGrow: 1 }}>
          {/* Full-width layout */}
          <Outlet />
        </Box>
      ) : (
        <Container
          maxWidth="lg"
          sx={{
            flexGrow: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: { xs: 2, md: 4 },
          }}
        >
          <Outlet />
        </Container>
      )}
    </Box>
  );
};

export default FormLayout;
