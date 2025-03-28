import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  CircularProgress,
} from "@mui/material";
import { Button } from "antd";
import React from "react";

const ConfirmationDialog = ({
  open,
  title,
  message,
  onConfirm,
  onCancel,
  loading,
}) => {
  return (
    <Dialog open={open} onClose={onCancel}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        {loading ? (
          <>
            <CircularProgress size={24} sx={{ marginRight: 2 }} />
            Processing Your Request
          </>
        ) : (
          message
        )}
      </DialogContent>
      <DialogActions>
        {/* <Button onClick={onCancel} color="secondary">
          Cancel
        </Button> */}
        <Button variant="contained" large onClick={onConfirm} color="primary">
          Ok
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmationDialog;
