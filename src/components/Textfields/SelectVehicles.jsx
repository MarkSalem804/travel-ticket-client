import React, { useEffect, useState } from "react";
import {
  Box,
  CircularProgress,
  IconButton,
  Menu,
  MenuItem,
  TextField,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ticketService from "../../services/ticket-service";

export default function SelectOffice({
  label,
  placeholder,
  name,
  value,
  onChange,
  onBlur,
  errorFormik,
  helperText,
  disabled,
  sx,
}) {
  const [vehicles, setVehicles] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Define handleGetAll function
  const handleGetAll = () => {
    setLoading(true);
    setError("");

    ticketService
      .getAllVehicles()
      .then((response) => {
        setVehicles(response); // Make sure offices is always an array
        setSelectedVehicle(
          response.find((office) => office.id === value) || null
        );
      })
      .catch((err) => {
        setError(err.message);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    handleGetAll();
  }, []);

  useEffect(() => {
    setSelectedVehicle(vehicles?.find((office) => office.id === value) || null);
  }, [vehicles, value]);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = (newValue) => {
    setAnchorEl(null);
    if (newValue) {
      onChange?.(name, newValue.id || "");
      setSelectedVehicle(newValue);
    }
  };

  const handleClear = () => {
    onChange?.(name, "");
    setSelectedVehicle(null);
  };

  return (
    <Box>
      <TextField
        autoComplete="off"
        fullWidth
        label={error ? `${label} - ${error}` : label}
        placeholder={error ? `${placeholder} - ${error}` : placeholder}
        name={name}
        variant="outlined"
        size="large"
        disabled={error || disabled}
        value={selectedVehicle && value ? selectedVehicle.vehicleName : ""}
        onClick={handleClick}
        onBlur={onBlur}
        error={errorFormik}
        helperText={helperText}
        sx={sx}
        InputProps={{
          endAdornment: (
            // eslint-disable-next-line react/jsx-no-useless-fragment
            <>
              {loading ? (
                <CircularProgress color="inherit" size={20} />
              ) : (
                <>
                  {selectedVehicle && (
                    <IconButton edge="end" onClick={handleClear}>
                      <CloseIcon />
                    </IconButton>
                  )}
                  {!disabled && !error && (
                    <IconButton edge="end" onClick={handleClick}>
                      <ArrowDropDownIcon />
                    </IconButton>
                  )}
                </>
              )}
            </>
          ),
        }}
      />
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => handleClose(null)}
      >
        {vehicles.map((office) => (
          <MenuItem
            sx={{ width: "100%" }}
            key={office.id}
            onClick={() => handleClose(office)}
          >
            {office.vehicleName}
          </MenuItem>
        ))}
      </Menu>
    </Box>
  );
}
