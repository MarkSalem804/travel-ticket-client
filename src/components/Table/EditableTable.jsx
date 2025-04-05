/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import ListAltIcon from "@mui/icons-material/ListAlt";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Close";
import {
  GridRowModes,
  DataGrid,
  GridActionsCellItem,
  GridRowEditStopReasons,
  GridToolbar,
} from "@mui/x-data-grid";
import { Tooltip } from "@mui/material";

export default function EditableTable({
  data,
  columns,
  loading,
  checkbox,
  height,
  showSearch,
  selectedData,
  rowToUpdate,
  rowToDelete,
  rowToView,
  singleSelect,
  reset,
  edit,
  remove,
  view,
  form,
}) {
  const [rows, setRows] = useState(data);
  const [rowModesModel, setRowModesModel] = useState({});

  const [selectedRows, setSelectedRows] = useState([]);

  const handleRowSelect = (ids) => {
    if (ids.length === 0) {
      setSelectedRows([]);
      selectedData([]);
    } else {
      const cartArray = [];
      // eslint-disable-next-line no-restricted-syntax
      for (const selectedId of ids) {
        // Find the row with the matching ID and push it to the selectedRows array
        const selectedRow = data.find(
          (row) => row.uid || row.id === selectedId
        );
        if (selectedRow) {
          setSelectedRows(ids);
          cartArray.push(selectedRow);
        }
      }
      selectedData(cartArray);
    }
  };

  const handleSingleRowSelection = (newSelection) => {
    if (newSelection.length > 0) {
      const selectionSet = new Set(selectedRows);
      const result = newSelection.filter((s) => !selectionSet.has(s));

      let selectedRow;

      if (data[0].uid) {
        selectedRow = data.find((row) => row.uid === result[0]);
      } else if (data[0].id) {
        selectedRow = data.find((row) => row.id === result[0]);
      }

      setSelectedRows(result);
      selectedData([selectedRow]);
    } else {
      setSelectedRows(newSelection);
      selectedData([]);
    }
  };

  const handleRowEditStop = (params, event) => {
    if (params.reason === GridRowEditStopReasons.rowFocusOut) {
      // eslint-disable-next-line no-param-reassign
      event.defaultMuiPrevented = true;
    }
  };

  const handleViewClick = (id) => () => {
    rowToView(id);
    // setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
  };

  const handleEditClick = (id) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
  };

  const handleSaveClick = (id) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
  };

  const handleDeleteClick = (id) => () => {
    if (rows[0].uid) {
      // setRows(rows.filter((row) => row.uid !== id));
      rowToDelete(rows.filter((row) => row.uid === id));
    } else if (rows[0].id) {
      // setRows(rows.filter((row) => row.id !== id));
      rowToDelete(rows.filter((row) => row.id === id));
    }
  };

  const handleCancelClick = (id) => () => {
    setRowModesModel({
      ...rowModesModel,
      [id]: { mode: GridRowModes.View, ignoreModifications: true },
    });

    const editedRow = rows.find((row) => row.uid || row.id === id);
    if (editedRow.isNew) {
      setRows(rows.filter((row) => row.uid || row.id !== id));
    }
  };

  const processRowUpdate = (newRow) => {
    let updatedRow = { ...newRow };

    if (newRow.status) {
      let status = 0;
      if (newRow.status === "Activate") {
        status = 1;
      }
      updatedRow = { ...updatedRow, status };
    } else {
      updatedRow = { ...updatedRow };
    }

    rowToUpdate(updatedRow);

    setRows(
      rows.map((row) =>
        row.uid || row.id === newRow.uid || newRow.id ? updatedRow : row
      )
    );

    return updatedRow;
  };

  const columnsAction = [
    ...columns,
    {
      field: "actions",
      type: "actions",
      headerName: "Actions",
      width: 140,
      cellClassName: "actions",
      getActions: ({ id }) => {
        const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;

        if (isInEditMode) {
          return [
            <Tooltip title="Save" placement="top">
              <GridActionsCellItem
                icon={<SaveIcon />}
                label="Save"
                sx={{
                  color: "primary.main",
                }}
                onClick={handleSaveClick(id)}
              />
            </Tooltip>,
            <Tooltip title="Cancel" placement="top">
              <GridActionsCellItem
                icon={<CancelIcon />}
                label="Cancel"
                className="textPrimary"
                onClick={handleCancelClick(id)}
                color="inherit"
              />
            </Tooltip>,
          ];
        }

        return [
          view ? (
            <Tooltip title="View Items" placement="top">
              <GridActionsCellItem
                icon={<ListAltIcon />}
                label="View Items"
                onClick={handleViewClick(id)}
                color="inherit"
              />
            </Tooltip>
          ) : (
            <div />
          ),
          form ? (
            <Tooltip title="Form" placement="top">
              <GridActionsCellItem
                icon={<ReceiptLongIcon />}
                label="Delete"
                onClick={handleDeleteClick(id)}
                color="inherit"
              />
            </Tooltip>
          ) : (
            <div />
          ),
          edit ? (
            <Tooltip title="Edit" placement="top">
              <GridActionsCellItem
                icon={<EditIcon />}
                label="Edit"
                className="textPrimary"
                onClick={handleEditClick(id)}
                color="inherit"
              />
            </Tooltip>
          ) : (
            <div />
          ),
          remove ? (
            <Tooltip title="Remove" placement="top">
              <GridActionsCellItem
                icon={<DeleteIcon />}
                label="Delete"
                onClick={handleDeleteClick(id)}
                color="inherit"
              />
            </Tooltip>
          ) : (
            <div />
          ),
        ];
      },
    },
  ];

  useEffect(() => {
    if (data) {
      setRows(data);
    }
  }, [data]);

  useEffect(() => {
    if (reset) {
      setSelectedRows([]);
      selectedData([]);
    }
  }, [reset]);

  return (
    <Box
      sx={{
        height,
        minHeight: "500px",
        width: "100%",
        overflowX: "auto",
        "& .MuiDataGrid-root": {
          border: "none",
        },
        // "& .MuiDataGrid-cell": {
        //   borderBottom: "none",
        // },
        "& .name-column--cell": {
          color: "black",
        },
        "& .MuiDataGrid-columnHeaders": {
          color: "#fff",
          backgroundColor: "black",
          borderBottom: "none",
        },
        "& .MuiDataGrid-virtualScroller": {
          // virtualScroller is the inside of dataGrid
          backgroundColor: "#fff",
        },
        "& .MuiDataGrid-footerContainer": {
          borderTop: "none",
          backgroundColor: "lightgray",
        },
        "& .MuiCheckbox-root": {
          color: "black !important",
        },
        "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
          color: "black !important",
        },
        "& .MuiDataGrid-columnHeaderCheckbox .MuiDataGrid-columnHeaderTitleContainer":
          {
            display: "none",
          },
        scrollbarWidth: "thin",
        msOverflowStyle: "none",
        "&::-webkit-scrollbar": {
          width: "0.5rem",
        },
        "&::-webkit-scrollbar-thumb": {
          backgroundColor: "#53FDFD",
        },
        marginTop: "5px",
      }}
    >
      <DataGrid
        hideFooter
        getRowId={(row) => row.id || row.uid}
        rows={rows}
        columns={!remove && !view && !form ? columns : columnsAction}
        editMode="row"
        checkboxSelection={checkbox}
        loading={loading}
        rowModesModel={rowModesModel}
        rowSelectionModel={selectedRows}
        onRowSelectionModelChange={
          singleSelect ? handleSingleRowSelection : handleRowSelect
        }
        onRowEditStop={handleRowEditStop}
        processRowUpdate={processRowUpdate}
        slots={{ toolbar: GridToolbar }}
        slotProps={{
          toolbar: {
            showQuickFilter: showSearch,
            quickFilterProps: { debounceMs: 500 },
            setRows,
            setRowModesModel,
          },
        }}
        // pageSizeOptions={[10, 20, 30, 40, 50]}
        initialState={{
          // pinnedColumns: { left: ["name"], right: ["actions"] },
          pagination: {
            paginationModel: {
              pageSize: 50,
            },
          },
        }}
        disableRowSelectionOnClick // para di magloop si params
        hideFooterSelectedRowCount
        height="100%"
        width="100%"
        columnBuffer={columns.length - 1}
      />
    </Box>
  );
}
