import { Box } from "@mui/material";
import React from "react";
import { Route, Routes } from "react-router-dom";
import FormLayout from "./layouts/feedbackLayout";
import RequestForm from "./pages/Forms/requestForm"; // Ensure correct import path
import Login from "./pages/Authentication/login";

function App() {
  return (
    <Box>
      <Routes>
        <Route element={<FormLayout />}>
          <Route path="/" element={<RequestForm />} />
          <Route path="/Authenticate" element={<Login />} />
        </Route>
      </Routes>
    </Box>
  );
}

export default App;
