import React from "react";
import { Modal, Box, Typography, Button, IconButton, Divider } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import PhotoDto from "../../dto/photo/PhotoDto";
import { webApiUrl } from "../../env/envVars";
import { toastSuccess, toastError } from "../../util/toastUtil";
import { generateLocationUrl } from "../../util/generateLocationUrl";

interface VoteModalProps {
  open: boolean;
  onClose: () => void;
	photo: PhotoDto;
  onNext?: () => void;
  onPrev?: () => void;
  children?: React.ReactNode;
}

const VoteModal: React.FC<VoteModalProps> = ({ open, onClose, onNext, onPrev, photo }) => {
	const handleVote = async () => {
		const response = await fetch(`${webApiUrl}/votes/${photo.id}`, {
			method: "POST",
			credentials: "include",
		});

		if (response.ok) {
			toastSuccess("Voted successfully");
		} else {
			toastError("Failed to vote: " + (await response.json()).message);
		}
	};

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
            py: 1,
            px: 2,
            background: "linear-gradient(90deg, #ff69b4, #1e90ff)",
          }}
        >
          {/* Soldaki alan */}
          <Box display="flex" alignItems="center" gap={2}>
            <IconButton onClick={onClose} sx={{ color: "#fff" }}>
              <CloseIcon />
            </IconButton>
            <Typography variant="h6" sx={{ fontWeight: "bold", color: "#fff" }}>
							{photo.user.username}
            </Typography>
            <Button
              variant="outlined"
              sx={{
                textTransform: "none",
                color: "#fff",
                borderColor: "#fff",
                "&:hover": {
                  borderColor: "#fff",
                  backgroundColor: "rgba(255,255,255,0.1)",
                },
              }}
            >
              Follow
            </Button>
          </Box>

          {/* Sağdaki alan */}
          <Box display="flex" alignItems="center" gap={2}>
            <Button
              variant="text"
              sx={{
                textTransform: "none",
                color: "#fff",
                "&:hover": { backgroundColor: "rgba(255,255,255,0.1)" },
              }}
            >
              Date
            </Button>
            <Button
              variant="text"
              sx={{
                textTransform: "none",
                color: "#fff",
                "&:hover": { backgroundColor: "rgba(255,255,255,0.1)" },
              }}
            >
              Location
            </Button>
            <Button
              variant="contained"
              sx={{
                textTransform: "none",
                background: "linear-gradient(90deg, #ff69b4, #1e90ff)",
                color: "#fff",
                "&:hover": {
                  background: "linear-gradient(90deg, #ff85c0, #1eaaff)",
                },
              }}
							onClick={handleVote}
            >
              Vote
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
          {onPrev && (
            <IconButton
              onClick={onPrev}
              sx={{
                position: "absolute",
                left: 16,
                color: "#fff",
                backgroundColor: "rgba(0,0,0,0.3)",
                "&:hover": { backgroundColor: "rgba(0,0,0,0.5)" },
                zIndex: 10,
              }}
            >
              <ArrowBackIosNewIcon />
            </IconButton>
          )}

          <img
						src={photo.file_path}
            alt="detail"
            style={{
              display: "block",
              maxWidth: "90%",
              maxHeight: "90%",
              objectFit: "contain",
            }}
          />

          {onNext && (
            <IconButton
              onClick={onNext}
              sx={{
                position: "absolute",
                right: 16,
                color: "#fff",
                backgroundColor: "rgba(0,0,0,0.3)",
                "&:hover": { backgroundColor: "rgba(0,0,0,0.5)" },
                zIndex: 10,
              }}
            >
              <ArrowForwardIosIcon />
            </IconButton>
          )}
        </Box>

        {/* Alt Kısım */}
        <Divider />
        <Box sx={{ p: 2, display: "flex", justifyContent: "center" }}>
          <Button
            variant="contained"
            sx={{
              textTransform: "none",
              background: "linear-gradient(90deg, #ff69b4, #1e90ff)",
              color: "#fff",
              "&:hover": {
                background: "linear-gradient(90deg, #ff85c0, #1eaaff)",
              },
            }}
						onClick={handleVote}
          >
            Vote
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default VoteModal;
