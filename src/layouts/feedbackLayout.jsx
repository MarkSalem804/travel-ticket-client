import React from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Typography,
  Container,
  Box,
  Tooltip,
  useMediaQuery,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import depedLogo from "../assets/deped_logo.png";
import tripBackground from "../assets/background2.png";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import DepartureBoardIcon from "@mui/icons-material/DepartureBoard";
import RocketLaunchIcon from "@mui/icons-material/RocketLaunch";
import ListAltIcon from "@mui/icons-material/ListAlt";

const FormLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isFullPage =
    location.pathname === "/TodaysTravels" ||
    location.pathname === "/UrgentTravels";

  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up("xl")); // Detect if xl screen or larger

  const handleRedirect = (path) => {
    navigate(path);
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
              gap: { xs: 1.5, xl: 7 },
            }}
          >
            {isDesktop ? (
              <>
                <Typography
                  sx={{ color: "white", cursor: "pointer", fontSize: "1rem" }}
                  onClick={() => handleRedirect("./UrgentTravels")}
                >
                  Urgent Trips
                </Typography>
                <Typography
                  sx={{ color: "white", cursor: "pointer", fontSize: "1rem" }}
                  onClick={() => handleRedirect("./")}
                >
                  Request Form
                </Typography>
                <Typography
                  sx={{ color: "white", cursor: "pointer", fontSize: "1rem" }}
                  onClick={() => handleRedirect("./TodaysTravels")}
                >
                  Today's Trips
                </Typography>
                <Typography
                  sx={{ color: "white", cursor: "pointer", fontSize: "1rem" }}
                  onClick={() => handleRedirect("./Authenticate")}
                >
                  Login
                </Typography>
              </>
            ) : (
              <>
                <Tooltip
                  title="Urgent Trips"
                  onClick={() => handleRedirect("./UrgentTravels")}
                >
                  <RocketLaunchIcon
                    sx={{
                      fontSize: { xs: 20, sm: 35 },
                      color: "white",
                      cursor: "pointer",
                    }}
                  />
                </Tooltip>
                <Tooltip
                  title="Request Form"
                  onClick={() => handleRedirect("./")}
                >
                  <ListAltIcon
                    sx={{
                      fontSize: { xs: 20, sm: 35 },
                      color: "white",
                      cursor: "pointer",
                    }}
                  />
                </Tooltip>
                <Tooltip
                  title="Today's Trips"
                  onClick={() => handleRedirect("./TodaysTravels")}
                >
                  <DepartureBoardIcon
                    sx={{
                      fontSize: { xs: 20, sm: 35 },
                      color: "white",
                      cursor: "pointer",
                    }}
                  />
                </Tooltip>
                <Tooltip
                  title="Login"
                  onClick={() => handleRedirect("./Authenticate")}
                >
                  <AdminPanelSettingsIcon
                    sx={{
                      fontSize: { xs: 20, sm: 40 },
                      color: "white",
                      cursor: "pointer",
                    }}
                  />
                </Tooltip>
              </>
            )}
          </Box>
        </Toolbar>
      </AppBar>

      {/* Content */}
      {isFullPage ? (
        <Box sx={{ flexGrow: 1 }}>
          <Outlet />
        </Box>
      ) : (
        <Container
          maxWidth="xxl"
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
