import React from "react";
import { Outlet } from "react-router-dom";
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
import { useNavigate } from "react-router-dom";

const FormLayout = () => {
  const navigate = useNavigate();

  const handleRedirectToLogin = () => {
    navigate("./Authenticate");
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
      <AppBar position="static" sx={{ background: "#444545", paddingY: 1 }}>
        <Toolbar sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Box
            component="img"
            src={depedLogo}
            alt="Logo"
            sx={{
              height: { xs: 30, sm: 40 }, // Adjust for mobile & larger screens
            }}
          />
          <Typography
            variant="h6"
            sx={{
              fontSize: { xs: "1rem", sm: "1.5rem" }, // Adjust font size for responsiveness
              fontWeight: "bold",
              flexGrow: 1,
            }}
          >
            TRIP TICKETING SYSTEM
          </Typography>
          <Tooltip title="Login" onClick={handleRedirectToLogin}>
            <AdminPanelSettingsIcon
              sx={{ fontSize: { xs: 30, sm: 40 }, color: "white" }}
            />
          </Tooltip>
        </Toolbar>
      </AppBar>

      {/* Content */}
      <Container
        maxWidth="lg"
        sx={{
          flexGrow: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: { xs: 2, md: 4 }, // Adjust padding for different screen sizes
        }}
      >
        <Outlet />
      </Container>
    </Box>
  );
};

export default FormLayout;
