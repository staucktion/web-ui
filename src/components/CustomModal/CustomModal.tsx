import React from "react";
import { Modal, Box, Typography, Button } from "@mui/material";

interface CustomModalProps {
  open: boolean;
  title: string;
  onClose: () => void;
  onConfirm?: () => void;
  confirmText?: string;
  children?: React.ReactNode;
}

const CustomModal: React.FC<CustomModalProps> = ({
  open,
  title,
  onClose,
  onConfirm,
  confirmText,
  children,
}) => {
  return (
    <Modal open={open} onClose={onClose} BackdropProps={{ style: { backgroundColor: "rgba(0, 0, 0, 0.5)" } }}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 400,
          bgcolor: "white",
          border: "2px solid #000",
          borderRadius: "12px",
          p: 4,
          textAlign: "center",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 2,
          boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.2)",
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: "bold", color: "#333" }}>
          {title}
        </Typography>

        {children}

        {onConfirm && (
          <Button
            variant="contained"
            sx={{
              backgroundColor: "#000",
              color: "#fff",
              textTransform: "none",
              borderRadius: "8px",
              width: "100%",
              padding: "12px",
              fontSize: "1.1rem",
              border: "2px solid #333",
              "&:hover": { backgroundColor: "#333" },
            }}
            onClick={onConfirm}
          >
            {confirmText || "Confirm"}
          </Button>
        )}

        <Button
          variant="outlined"
          sx={{
            textTransform: "none",
            backgroundColor: "white",
            color: "black",
            borderRadius: "12px",
            fontSize: "1rem",
            padding: "8px 20px",
            height: "45px",
            border: "2px solid #999",
            "&:hover": { backgroundColor: "#f0f0f0" },
          }}
          onClick={onClose}
        >
          Cancel
        </Button>
      </Box>
    </Modal>
  );
};

export default CustomModal;
