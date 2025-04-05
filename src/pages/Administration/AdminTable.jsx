import { Box } from "@mui/material";
import React from "react";
import EditableTable from "../../components/Table/EditableTable";
import dayjs from "dayjs";

export default function AdminTable({ data, loadingState }) {
  const columns = [
    { field: "id", headerName: "ID", width: 70 },
    {
      field: "startTime",
      headerName: "Start time",
      width: 200,
      valueGetter: (params) =>
        // Return the formatted date
        dayjs(params.value).format("YYYY-MM-DD hh:mm A"),
    },
    {
      field: "created_at",
      headerName: "Completion Time",
      width: 200,
      valueGetter: (params) =>
        // Return the formatted date
        dayjs(params.value).format("YYYY-MM-DD hh:mm A"),
    },
    { field: "requestedBy", headerName: "Requestor", width: 250 },
    { field: "destination", headerName: "Destination", width: 250 },
    { field: "status", headerName: "Status", width: 250 },
  ];

  return (
    <Box sx={{ width: "100%" }}>
      <EditableTable
        data={data}
        columns={columns}
        loading={loadingState}
        height="60vh"
        showSearch
      />
    </Box>
  );
}
