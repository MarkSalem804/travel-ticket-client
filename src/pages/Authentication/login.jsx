import React from "react";
import { useState } from "react";
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  Paper,
} from "@mui/material";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();
    console.log("Logging in with:", email, password);
    // Add authentication logic here
  };

  return (
    <Container maxWidth="xs">
      <Paper elevation={3} sx={{ p: 4, mt: 8, textAlign: "center" }}>
        <Typography variant="h5" gutterBottom>
          Login
        </Typography>
        <form onSubmit={handleLogin}>
          <TextField
            label="Email"
            type="email"
            fullWidth
            margin="normal"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            label="Password"
            type="password"
            fullWidth
            margin="normal"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Box mt={2}>
            <Button type="submit" variant="contained" color="primary" fullWidth>
              Login
            </Button>
          </Box>
        </form>
      </Paper>
    </Container>
  );
};

export default Login;
