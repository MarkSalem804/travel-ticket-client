import React from "react";
import { Box } from "@mui/material";
import { Route, Routes } from "react-router-dom";
import { useStateContext } from "./contexts/ContextProvider";
import AdminLayout from "./layouts/AdminLayout";
import FeedbackLayout from "./layouts/feedbackLayout";
import {
  RequestForm,
  Login,
  AdminPage,
  VehiclePage,
  DriverPage,
  UserPage,
  TodaysTravelsPage,
} from "./pages";
import RequireAuth from "./contexts/RequireAuth";

function App() {
  const { auth } = useStateContext();
  console.log(auth);
  const roles = ["admin", "driver", "requestor"];

  return (
    <Box>
      <Routes>
        <Route element={<FeedbackLayout />}>
          <Route path="/" element={<RequestForm />} />
          <Route path="/Authenticate" element={<Login />} />
          <Route path="/TodaysTravels" element={<TodaysTravelsPage />} />
        </Route>

        <Route element={<RequireAuth allowedRoles={roles} />}>
          <Route path="/" element={<AdminLayout />}>
            <Route path="/Administration" element={<AdminPage />} />
            <Route path="/Vehicles" element={<VehiclePage />} />
            <Route path="/Drivers" element={<DriverPage />} />
            <Route path="/Users" element={<UserPage />} />
          </Route>
        </Route>
      </Routes>
    </Box>
  );
}

export default App;
