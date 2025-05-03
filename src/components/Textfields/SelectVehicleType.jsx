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

export default function SelectType({
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

  const types = [
    { id: 1, type: "Government (Red Plate)" },
    { id: 2, type: "Employee (Private)" },
  ];

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 100);
  }, [value]);

  const selectedTypeValue = value || "";

  const [selectedType, setSelectedType] = useState(
    types?.find((car) => car.type === selectedTypeValue) || null
  );

  useEffect(() => {
    setSelectedType(
      types?.find((car) => car.type === selectedTypeValue) || null
    );
  }, [value]);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = (newValue) => {
    setAnchorEl(null);
    if (newValue) {
      onChange?.(name, newValue.type || "");
      setSelectedType(newValue);
    }
  };

  const handleClear = () => {
    onChange?.(name, ""); // Clear the value
    setSelectedType(null);
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
        value={selectedType && value ? selectedType.type : ""}
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
                  {selectedType && (
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
        {types.map((role) => (
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
