import React from "react";
import {
  Modal,
  Box,
  Typography,
  Button,
  IconButton,
  Divider,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import { useNavigate } from "react-router-dom";

interface PhotoDetailModalProps {
  open: boolean;
  onClose: () => void;
  photoUrl: string;
  photographerName?: string;
  likes?: number;
  onNext?: () => void;
  onPrev?: () => void;
  children?: React.ReactNode;
}

const PhotoDetailModal: React.FC<PhotoDetailModalProps> = ({
  open,
  onClose,
  photoUrl,
  photographerName = "Damla Köklü",
  likes = 250,
  onNext,
  onPrev,
  children,
}) => {
  const navigate = useNavigate();

  return (
    <Modal
      open={open}
      onClose={onClose}
      BackdropProps={{
        style: { backgroundColor: "rgba(0, 0, 0, 0.8)" },
      }}
    >
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "90vw",
          maxWidth: 1200,
          height: "90vh",
          bgcolor: "#fff",
          borderRadius: 2,
          boxShadow: 24,
          display: "flex",
          flexDirection: "column",
          outline: "none",
        }}
      >
        {/* Üst Kısım */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            paddingY: 1,
            paddingX: 2,
          }}
        >
          {/* Soldaki alan */}
          <Box display="flex" alignItems="center" gap={2}>
            <IconButton onClick={onClose}>
              <CloseIcon />
            </IconButton>
            <Typography variant="h6" sx={{ fontWeight: "bold" }}>
              {photographerName}
            </Typography>
            <Button variant="outlined" sx={{ textTransform: "none" }}>
              Follow
            </Button>
          </Box>

          {/* Sağdaki alan */}
          <Box display="flex" alignItems="center" gap={2}>
            <Button variant="text" sx={{ textTransform: "none" }}>
              Date
            </Button>

            {/* Like ve Kalp Butonu */}
            <Box display="flex" alignItems="center" gap={1}>
              <Typography variant="body1">Like {likes}</Typography>
              <IconButton color="error" aria-label="like">
                <FavoriteBorderIcon />
              </IconButton>
            </Box>

            <Button variant="text" sx={{ textTransform: "none" }}>
              Location
            </Button>
            <Button
              variant="contained"
              color="success"
              sx={{ textTransform: "none" }}
              onClick={() => navigate("/payment")}
            >
              Purchase Now
            </Button>
          </Box>
        </Box>

        <Divider />

        {/* Orta Kısım: Fotoğraf + Oklar */}
        <Box
          sx={{
            flex: 1,
            display: "flex",
            position: "relative",
            alignItems: "center",
            justifyContent: "center",
            overflow: "hidden",
          }}
        >
          {/* Geri Ok */}
          {onPrev && (
            <IconButton
              onClick={onPrev}
              sx={{
                position: "absolute",
                left: 16,
                color: "#fff",
                backgroundColor: "rgba(0,0,0,0.3)",
                "&:hover": { backgroundColor: "rgba(0,0,0,0.5)" },
              }}
            >
              <ArrowBackIosNewIcon />
            </IconButton>
          )}

          <img
            src={photoUrl}
            alt="detail"
            style={{
              display: "block",
              maxWidth: "90%",
              maxHeight: "90%",
              objectFit: "contain",
            }}
          />

          {/* İleri Ok */}
          {onNext && (
            <IconButton
              onClick={onNext}
              sx={{
                position: "absolute",
                right: 16,
                color: "#fff",
                backgroundColor: "rgba(0,0,0,0.3)",
                "&:hover": { backgroundColor: "rgba(0,0,0,0.5)" },
              }}
            >
              <ArrowForwardIosIcon />
            </IconButton>
          )}
        </Box>

        {/* Alt Kısım: children (ör. EmailButtons vb.) */}
        {children && (
          <Box sx={{ p: 2 }}>
            {children}
          </Box>
        )}
      </Box>
    </Modal>
  );
};

export default PhotoDetailModal;
