/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { Box, IconButton, Menu, MenuItem } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useStateContext } from "../../contexts/ContextProvider";
import ChangePasswordModal from "../../modals/Users/ChangePasswordModal";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import SnackbarComponent from "../Snackbar";

export default function ProfileMenu() {
  const navigate = useNavigate();
  const { setAuth } = useStateContext();

  const [anchorEl, setAnchorEl] = useState(null);

  const [open, setOpen] = useState();

  const [openSuccess, setOpenSuccess] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleNavigate = () => {
    navigate("/");
  };

  const handleLogout = () => {
    setAuth(null);
  };

  const handleCloseSuccess = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenSuccess(false);
  };

  return (
    <Box>
      <ChangePasswordModal
        open={open}
        onClose={handleClose}
        onUpdated={() => setOpenSuccess(true)}
      />
      <IconButton
        onClick={(evt) => setAnchorEl(evt.currentTarget)}
        sx={{
          color: "lightgray",
          "&:hover": {
            color: "#fff",
          },
        }}
      >
        <AccountCircleIcon sx={{ fontSize: 30 }} />
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
      >
        <MenuItem onClick={() => handleOpen()}>Change Password</MenuItem>
        <MenuItem
        // onClick={() => handleNavigate()}
        >
          About Us
        </MenuItem>
        <MenuItem onClick={() => handleLogout()}>Logout</MenuItem>
      </Menu>
      {/* <SnackbarComponent
        open={openSuccess}
        onClose={handleCloseSuccess}
        severity="success"
        message="Password Changed Successfully."
      /> */}
    </Box>
  );
}
