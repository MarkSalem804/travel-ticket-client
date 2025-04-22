/* eslint-disable no-unused-vars */
import {
  Modal,
  Box,
  Typography,
  TextField,
  Button,
  useMediaQuery,
  useTheme,
  Grid,
  DialogContent,
  Dialog,
  CircularProgress,
  IconButton,
} from "@mui/material";
import { useState, useEffect } from "react";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import userService from "../../services/user-service";
import RoleSelector from "../../components/Textfields/SelectRole";
const modalBaseStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  bgcolor: "background.paper",
  borderRadius: 2,
  boxShadow: 24,
  p: 0,
  overflow: "hidden",
};

export default function RegisterUserModal({
  open,
  onClose,
  user,
  onUpdated,
  onAdded,
}) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [loadingDialogOpen, setLoadingDialogOpen] = useState(false);
  const [successDialogOpen, setSuccessDialogOpen] = useState(false);
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  // Initialize the ticket form data
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    email: "",
    designationId: null,
    contactNo: "",
    role: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      setError("");
      setLoadingDialogOpen(true);

      const newUser = await userService.registerUser(formData);

      setLoadingDialogOpen(false);
      setSuccessDialogOpen(true);

      setTimeout(() => {
        setSuccessDialogOpen(false);
        onClose();
      }, 1000);

      if (onAdded) onAdded(newUser);

      setFormData({
        username: "",
        password: "",
        email: "",
        designationId: null,
        contactNo: "",
        role: "",
      });
    } catch (err) {
      console.error(err);
      setError("Failed to add driver. Please try again.");
      setLoadingDialogOpen(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log("Form Data:", formData);
  }, [formData]);

  return (
    <>
      <Modal
        open={open}
        onClose={onClose}
        slotProps={{
          backdrop: {
            sx: {
              backgroundColor: "rgba(0, 0, 0, 0.2)", // adjust darkness here
            },
          },
        }}
      >
        <Box
          sx={{
            ...modalBaseStyle,
            width: {
              xs: "90%", // Mobile screens
              sm: 600, // Increase for small screens/tablets
              md: "60vw", // Increase for desktop
            },
            maxWidth: "70vw", // Limit the maximum width on larger screens
          }}
        >
          {/* Title Header */}
          <Box
            sx={{
              bgcolor: "primary.main",
              color: "white",
              px: 3,
              py: 2,
              display: "flex",
              alignItems: "center",
            }}
          >
            <Typography
              variant={isMobile ? "subtitle1" : "h6"}
              sx={{ fontWeight: "bold", textAlign: "center", width: "100%" }}
            >
              REGISTER USER
            </Typography>
          </Box>

          {/* Body */}
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              maxHeight: "80vh", // Set max height for the modal
            }}
          >
            {/* Scrollable content */}
            <Box
              sx={{
                overflowY: "auto",
                pr: 1, // Prevent cut-off by adding some padding
                flexGrow: 1, // Allow the scrollable area to take up most of the space
                p: { xs: 2, sm: 3 },
              }}
            >
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        "& fieldset": {
                          borderColor: "gray",
                        },
                      },
                    }}
                    fullWidth
                    label="Username"
                    name="username"
                    value={formData.username}
                    onChange={handleInputChange}
                    margin="normal"
                    InputProps={{
                      style: { minWidth: 250 },
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Password"
                    type={showPassword ? "text" : "password"}
                    // disabled={loading}
                    fullWidth
                    value={formData.password}
                    name="password"
                    margin="normal"
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        password: e.target.value,
                      }))
                    }
                    InputProps={{
                      endAdornment: (
                        <IconButton
                          onClick={() => setShowPassword(!showPassword)}
                          onKeyPress={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? (
                            <VisibilityIcon
                              size={18}
                              sx={{ color: "#606468" }}
                            />
                          ) : (
                            <VisibilityOffIcon
                              size={18}
                              sx={{ color: "#606468" }}
                            />
                          )}
                        </IconButton>
                      ),
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        "& fieldset": {
                          borderColor: "gray",
                        },
                      },
                    }}
                    fullWidth
                    label="E-Mail"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    // margin="normal"
                    InputProps={{
                      style: { minWidth: 250 }, // Set a minimum width to accommodate longer text
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        "& fieldset": {
                          borderColor: "gray",
                        },
                      },
                    }}
                    fullWidth
                    label="Contact Number"
                    name="contactNo"
                    value={formData.contactNo}
                    onChange={handleInputChange}
                    // margin="normal"
                    InputProps={{
                      style: { minWidth: 250 }, // Set a minimum width to accommodate longer text
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <RoleSelector
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        "& fieldset": {
                          borderColor: "gray",
                        },
                      },
                    }}
                    label="Role"
                    placeholder="Choose Designation"
                    name="role"
                    value={formData.role}
                    onChange={(name, value) =>
                      setFormData((prev) => ({ ...prev, [name]: value }))
                    }
                    errorFormik={!!error && !formData.role}
                    helperText={
                      !formData.role && error ? "Designation is required" : ""
                    }
                  />
                </Grid>

                {/* Add more fields as needed */}
              </Grid>
            </Box>

            {/* Action buttons */}
            <Box
              padding={2}
              mt={3}
              display="flex"
              flexDirection={isMobile ? "column" : "row"}
              justifyContent="flex-end"
              gap={1}
            >
              <Button
                onClick={onClose}
                color="secondary"
                fullWidth={isMobile}
                sx={{ minWidth: !isMobile ? 120 : undefined }}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={handleSubmit}
                fullWidth={isMobile}
                sx={{
                  minWidth: !isMobile ? 120 : undefined,
                  backgroundColor: "green",
                }}
              >
                Register
              </Button>
            </Box>
          </Box>

          {/* Error message */}
          {error && (
            <Typography color="error" sx={{ mt: 2, px: 3 }}>
              {error}
            </Typography>
          )}
        </Box>
      </Modal>

      {/* Loading Dialog */}
      <Dialog
        open={loadingDialogOpen}
        onClose={() => {}}
        disableBackdropClick
        slotProps={{
          backdrop: {
            sx: {
              backgroundColor: "rgba(0, 0, 0, 0.2)", // lighter backdrop
            },
          },
        }}
      >
        <DialogContent sx={{ textAlign: "center", px: "100px" }}>
          <CircularProgress />
          <Typography sx={{ marginTop: "10px" }}>Adding...</Typography>
        </DialogContent>
      </Dialog>

      {/* Success Dialog */}
      <Dialog open={successDialogOpen} onClose={() => {}} disableBackdropClick>
        <DialogContent sx={{ textAlign: "center", px: "100px", py: "50px" }}>
          <Typography variant="h7">User Successfully Registered!</Typography>
        </DialogContent>
      </Dialog>
    </>
  );
}
