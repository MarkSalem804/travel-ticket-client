import React, { useState } from "react";
import { styled, useTheme } from "@mui/material/styles";
import { Outlet, useLocation } from "react-router-dom";
import { Box, CssBaseline } from "@mui/material";
import Topbar from "../components/Topbar/Topbar";
import Sidebar from "../components/Sidebar";

// Define responsive drawerWidth
const drawerWidth = 240;

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

function AdminLayout() {
  const location = useLocation();

  const theme = useTheme();
  const [open, setOpen] = useState(false);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  return (
    <Box
      sx={{
        display: "flex",
        backgroundColor: location.pathname === "/form" ? "black" : "white",
        height: "100vh",
        // overflow: "auto",
        // width: "100vw",
      }}
    >
      <CssBaseline />
      <Sidebar
        themeProp={theme}
        drawerWidth={drawerWidth}
        drawerOpenStatus={open}
        closeDrawerFunction={handleDrawerClose}
      />
      <Topbar
        themeProp={theme}
        drawerWidth={drawerWidth}
        openDrawerFunction={handleDrawerOpen}
        drawerOpenStatus={open}
      />
      <Box
        component="main"
        sx={{
          display: "block",
          transition: "ease-in-out 0.1s",
          width: `calc(100% - 57px)`,
          minWidth: "360px",
          // overflowX: "auto",
          // width: "100%",
          // p: 3,
          // backgroundColor:
          //   location.pathname === "/form" ? "#e5bfa1" : "#f0f0f0",
          mt: 2,
          "@media (min-height: 1920px)": {
            mt: 6,
          },

          ml: open ? 26 : 3,
          // [theme.breakpoints.up("sm")]: {
          //   ml: open ? 26 : 4,
          // },
          "@media (max-width: 380px)": {
            ml: 0,
          },
        }}
      >
        <DrawerHeader theme={theme} />
        <Outlet />
      </Box>
    </Box>
  );
}

export default AdminLayout;
