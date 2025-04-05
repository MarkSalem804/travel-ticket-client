/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  Paper,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import { useStateContext } from "../../contexts/ContextProvider";
import { string, object } from "yup";
import userService from "../../services/user-service";
import LockIcon from "@mui/icons-material/Lock";
import { AccountCircle, Visibility, VisibilityOff } from "@mui/icons-material";
import IllustrationImage from "../../assets/deped_logo.png"; // Import the illustration image

const Login = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { setAuth } = useStateContext();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const formik = useFormik({
    initialValues: { username: "", password: "" },
    validationSchema: object().shape({
      username: string().required("Email Required!"),
      password: string().required("Password Required!"),
    }),
    onSubmit: async (values) => {
      setLoading(true);
      setError("");

      try {
        const res = await userService.authenticate(values);

        if (res?.valid) {
          setAuth(res?.data);
          localStorage.setItem("authTicket", JSON.stringify(res?.data));
          navigate("/Administration");
        }
      } catch (err) {
        let message = "";
        if (err?.response?.status === 404) {
          message = "Invalid Credentials";
        } else if (err?.response?.status === 401) {
          message = err?.response?.data?.error;
        } else {
          message = "Internal Server Error";
        }
        setError(message || err?.message);
      } finally {
        setLoading(false);
      }
    },
  });

  const handleTogglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const handleBackToRequestForm = () => {
    navigate("/"); // Adjust this route based on your app's structure
  };

  return (
    <Container maxWidth="sm">
      {/* Increase width of the container */}
      <Paper
        elevation={3}
        sx={{
          p: 4,
          // mt: 8,
          textAlign: "center",
          display: "flex",
          justifyContent: "center",
          flexDirection: "row",
          alignItems: "flex-start",
          width: "100%",
          maxWidth: "900px",
          minHeight: "auto",
          boxSizing: "border-box",
        }}
      >
        {/* Left side: Logo and Title */}
        <Box sx={{ flex: 1, paddingRight: 2, textAlign: "center" }}>
          {/* Logo */}
          <Box sx={{ mb: 2 }}>
            <img
              src={IllustrationImage}
              alt="Logo"
              style={{
                width: "50%",
                maxWidth: "100px",
                height: "auto",
                objectFit: "contain",
              }}
            />
          </Box>

          {/* Title */}
          <Typography
            variant="h6"
            sx={{
              fontWeight: 600,
              fontSize: { xs: "1.2rem", sm: "1.5rem" }, // Responsive title
              marginBottom: "1rem",
            }}
          >
            SDOIC Trip Ticket System
          </Typography>

          {/* Login Form */}
          <Typography variant="h5" gutterBottom>
            Login
          </Typography>

          <form onSubmit={formik.handleSubmit}>
            <TextField
              placeholder="Username"
              fullWidth
              variant="outlined"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <AccountCircle />
                  </InputAdornment>
                ),
              }}
              sx={{ my: 2 }}
              required
              name="username"
              value={formik.values.username}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.username && Boolean(formik.errors.username)}
              helperText={formik.touched.username && formik.errors.username}
            />
            <TextField
              placeholder="Password"
              variant="outlined"
              type={showPassword ? "text" : "password"}
              fullWidth
              required
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockIcon />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={handleTogglePasswordVisibility}
                      edge="end"
                      aria-label="toggle password visibility"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              name="password"
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.password && Boolean(formik.errors.password)}
              helperText={formik.touched.password && formik.errors.password}
            />

            <Box mt={2}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                disabled={loading}
              >
                {loading ? "Logging in..." : "Login"}
              </Button>
            </Box>
          </form>

          {/* Back to request form button */}
          <Box mt={2}>
            <Button
              variant="outlined"
              color="secondary"
              fullWidth
              onClick={handleBackToRequestForm}
            >
              Back to request form
            </Button>
          </Box>

          {error && (
            <Typography variant="body2" color="error" mt={2}>
              {error}
            </Typography>
          )}
        </Box>
      </Paper>
    </Container>
  );
};

export default Login;
