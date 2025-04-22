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
import { useState } from "react";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import userService from "../../services/user-service";
import { useStateContext } from "../../contexts/ContextProvider";

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

export default function ChangePasswordModal({
  open,
  onClose,
  user,
  onUpdated,
}) {
  const { auth } = useStateContext();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [loadingDialogOpen, setLoadingDialogOpen] = useState(false);
  const [successDialogOpen, setSuccessDialogOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  console.log(auth);

  // Only password field needed for changing the password
  const [formData, setFormData] = useState({
    password: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    console.log("Submit initiated");

    try {
      setLoading(true);
      setError("");
      setLoadingDialogOpen(true);
      console.log("Loading dialog opened");

      console.log(`Attempting to change password for user ID: ${auth.id}`);

      const newPassword = await userService.changePassword(
        auth.id,
        formData.password
      );

      console.log("Password change successful");

      setLoadingDialogOpen(false);
      setSuccessDialogOpen(true);

      console.log("Success dialog opened");

      setTimeout(() => {
        setSuccessDialogOpen(false);
        onClose();
      }, 1000);

      //   if (onUpdated) onUpdated(newPassword);

      if (onUpdated) {
        console.log("Calling onUpdated callback");
        onUpdated(newPassword);
      }

      setFormData({
        password: "",
      });
      console.log("Form data reset");
    } catch (err) {
      console.error("Error changing password:", err);
      setError("Failed to change password. Please try again.");
      setLoadingDialogOpen(false);
    } finally {
      setLoading(false);
      console.log("Loading state reset");
    }
  };

  return (
    <>
      <Modal
        open={open}
        onClose={onClose}
        slotProps={{
          backdrop: {
            sx: {
              backgroundColor: "rgba(0, 0, 0, 0.5)",
            },
          },
        }}
      >
        <Box
          sx={{
            ...modalBaseStyle,
            width: {
              xs: "90%",
              sm: 600,
              md: "60vw",
            },
            maxWidth: "30vw",
          }}
        >
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
              CHANGE PASSWORD
            </Typography>
          </Box>

          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              maxHeight: "80vh",
            }}
          >
            <Box
              sx={{
                overflowY: "auto",
                pr: 1,
                flexGrow: 1,
                p: { xs: 2, sm: 3 },
              }}
            >
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    label="New Password"
                    type={showPassword ? "text" : "password"}
                    fullWidth
                    value={formData.password}
                    name="password"
                    margin="normal"
                    onChange={handleInputChange}
                    InputProps={{
                      endAdornment: (
                        <IconButton
                          onClick={() => setShowPassword(!showPassword)}
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
              </Grid>
            </Box>

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
                Change Password
              </Button>
            </Box>
          </Box>

          {error && (
            <Typography color="error" sx={{ mt: 2, px: 3 }}>
              {error}
            </Typography>
          )}
        </Box>
      </Modal>

      <Dialog
        open={loadingDialogOpen}
        onClose={() => {}}
        disableBackdropClick
        slotProps={{
          backdrop: {
            sx: {
              backgroundColor: "rgba(0, 0, 0, 0.2)",
            },
          },
        }}
      >
        <DialogContent sx={{ textAlign: "center", px: "100px" }}>
          <CircularProgress />
          <Typography sx={{ marginTop: "10px" }}>
            Changing Password...
          </Typography>
        </DialogContent>
      </Dialog>

      <Dialog open={successDialogOpen} onClose={() => {}} disableBackdropClick>
        <DialogContent sx={{ textAlign: "center", px: "100px", py: "50px" }}>
          <Typography variant="h7">Password Successfully Changed!</Typography>
        </DialogContent>
      </Dialog>
    </>
  );
}
