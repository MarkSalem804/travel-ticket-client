import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

export default function ViewAttachmentModal({ open, onClose, attachmentUrl }) {
  const theme = useTheme();
  const isFullScreen = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullScreen={isFullScreen}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle>
        Attachment Preview
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{ position: "absolute", right: 8, top: 8 }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers>
        {attachmentUrl ? (
          <iframe
            src={attachmentUrl}
            title="Attachment"
            style={{ width: "100%", height: "80vh", border: "none" }}
          />
        ) : (
          <p>No attachment available.</p>
        )}
      </DialogContent>
    </Dialog>
  );
}
