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
import { useNavigate } from "react-router-dom";

interface   VoteModalProps {
  open: boolean;
  onClose: () => void;
  photoUrl: string;
  photographerName?: string;
  onNext?: () => void;
  onPrev?: () => void;
  children?: React.ReactNode; // children prop'u eklendi
}

const VoteModal: React.FC<VoteModalProps> = ({
  open,
  onClose,
  photoUrl,
  photographerName = "Damla Köklü",
  onNext,
  onPrev,
  //children,
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

          <Box display="flex" alignItems="center" gap={2}>
            <Button variant="text" sx={{ textTransform: "none" }}>
              Date
            </Button>
            <Button variant="text" sx={{ textTransform: "none" }}>
              Location
            </Button>
            <Button
              variant="contained"
              color="primary"
              sx={{ textTransform: "none" }}
              onClick={() => navigate("/vote")}
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

        {/* Alt Kısım */}
        <Box sx={{ p: 2, display: "flex", justifyContent: "center" }}>
          <Button
            variant="contained"
            color="primary"
            sx={{ textTransform: "none" }}
            onClick={() => navigate("/vote")}
          >
            Vote
          </Button>
        </Box>

      </Box>
    </Modal>
  );
};

export default VoteModal;
