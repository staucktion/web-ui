import React from "react";
import { Modal, Box, Typography, Button } from "@mui/material";

interface CustomModalProps {
  open: boolean;
  title: string;
  onClose: () => void;

  onPrimary: () => void;
  primaryText: string;

  onSecondary: () => void;
  secondaryText: string;

  simpleLoginText?: string;
  onSimpleLogin?: () => void; 
}

const CustomModal: React.FC<CustomModalProps> = ({
  open,
  title,
  onClose,
  onPrimary,
  primaryText,
  onSecondary,
  secondaryText,
  simpleLoginText,
  onSimpleLogin,
}) => {
  return (
    <Modal
      open={open}
      onClose={onClose}
      BackdropProps={{ style: { backgroundColor: "rgba(0,0,0,0.6)" } }}
    >
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%,-50%)",
          width: 360,
          bgcolor: "#ffffff",
          border: "2px solid #000000",
          borderRadius: 2,
          p: 4,
          boxShadow: 24,
          textAlign: "center",
        }}
      >
        {/* Title */}
        <Typography
          variant="h6"
          sx={{ fontWeight: "bold", color: "#000000", mb: 3 }}
        >
          {title}
        </Typography>

        
        {simpleLoginText && onSimpleLogin && (
          <Box
            sx={{
              mb: 2,
              border: "1px solid #000000",
              borderRadius: "8px",
              px: 1,
              py: 0.5,
            }}
          >
            <Button
              fullWidth
              variant="text"
              onClick={onSimpleLogin}
              sx={{
                color: "#000000",
                textTransform: "none",
                fontSize: "1rem",
                "&:hover": { backgroundColor: "#fafafa" },
              }}
            >
              {simpleLoginText}
            </Button>
          </Box>
        )}

        {/* first Login */}
        <Button
          fullWidth
          variant="contained"
          onClick={onPrimary}
          sx={{
            mb: 2,
            backgroundColor: "#000000",
            color: "#ffffff",
            textTransform: "none",
            borderRadius: "8px",
            py: 1.5,
            fontSize: "1rem",
            "&:hover": { backgroundColor: "#333333" },
          }}
        >
          {primaryText}
        </Button>

        {/* second Register */}
        <Button
          fullWidth
          variant="outlined"
          onClick={onSecondary}
          sx={{
            mb: 2,
            borderColor: "#000000",
            color: "#000000",
            textTransform: "none",
            borderRadius: "8px",
            py: 1.5,
            fontSize: "1rem",
            "&:hover": { backgroundColor: "#f5f5f5" },
          }}
        >
          {secondaryText}
        </Button>

        {/* Cancel */}
        <Button
          fullWidth
          variant="text"
          onClick={onClose}
          sx={{
            color: "#000000",
            textTransform: "none",
            fontSize: "1rem",
            "&:hover": { backgroundColor: "#fafafa" },
          }}
        >
          Cancel
        </Button>
      </Box>
    </Modal>
  );
};

export default CustomModal;
