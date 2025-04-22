/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import {
  MenuItem,
  IconButton,
  Box,
  TextField,
  Menu,
  CircularProgress,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";

export default function SelectRole({
  label,
  placeholder,
  name,
  value,
  onChange,
  onBlur,
  errorFormik,
  helperText,
  error,
  disabled,
  // disable,
  sx,
}) {
  const [anchorEl, setAnchorEl] = useState(null);
  const [loading, setLoading] = useState(false);

  const roles = [
    { id: 1, type: "Admin" },
    { id: 2, type: "Driver" },
    { id: 3, type: "Requestor" },
  ];

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 100);
  }, [value]);

  const lowercaseValue = value ? value?.toLowerCase() : "";

  const [selectedRole, setSelectedRole] = useState(
    roles?.find((role) => role.type.toLowerCase() === lowercaseValue) || null
  );

  useEffect(() => {
    setSelectedRole(
      roles?.find((role) => role.type.toLowerCase() === lowercaseValue) || null
    );
  }, [value]);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = (newValue) => {
    setAnchorEl(null);
    if (newValue) {
      onChange?.(name, newValue.type.toLowerCase() || "");
      setSelectedRole(newValue);
    }
  };

  const handleClear = () => {
    onChange?.(name, ""); // Clear the value
    setSelectedRole(null);
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
        value={selectedRole && value ? selectedRole.type : ""}
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
                  {selectedRole && (
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
        {roles.map((role) => (
          <MenuItem
            sx={{ width: "100%" }}
            key={role.id}
            onClick={() => handleClose(role)}
          >
            {role.type}
          </MenuItem>
        ))}
      </Menu>
    </Box>
  );
}
