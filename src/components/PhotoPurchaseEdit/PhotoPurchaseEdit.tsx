import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  TextField,
  Typography,
  IconButton,
} from "@mui/material";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";

interface Photo {
  id: number;
  file_path: string;
}

interface PhotoPurchaseEditProps {
  open: boolean;                          
  photo: Photo | null;                    
  onClose: () => void;                   
  onSave: (editedCaption: string) => void; 
}

const PhotoPurchaseEdit: React.FC<PhotoPurchaseEditProps> = ({
  open,
  photo,
  onClose,
  onSave,
}) => {
  const [editedPrice, setEditedPrice] = useState<number>(0);

  useEffect(() => {
    if (photo) {
      
      //ADD THE REAL PRICE FUNCTION HERE
      setEditedPrice(100);
    }
  }, [photo]);

  const handleSave = () => {
    
    //JUST FOR AN EXAMPLE UI.
    onSave(`New price is: ${editedPrice}`);
    onClose();
  };

  // FOR NOT RENDERING
  if (!photo) return null;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      PaperProps={{
        sx: {
          overflow: "visible",
          background: "linear-gradient(135deg, #f6d365 0%, #fda085 100%)",
          borderRadius: 3,
        },
      }}
    >
      <DialogTitle
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1,
          color: "#fff",
        }}
      >
        <MonetizationOnIcon />
        <Typography variant="h6" sx={{ flex: 1, fontWeight: "bold" }}>
          Purchase Edit
        </Typography>
        <IconButton onClick={onClose} sx={{ color: "#fff" }}>
          X
        </IconButton>
      </DialogTitle>

      <DialogContent>
        <Box
          sx={{
            textAlign: "center",
            p: 2,
            backgroundColor: "rgba(255, 255, 255, 0.2)",
            borderRadius: 2,
          }}
        >
          <img
            src={photo.file_path}
            alt={`Photo ${photo.id}`}
            style={{
              width: "100%",
              marginBottom: "20px",
              borderRadius: "8px",
              boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
            }}
          />
          <Typography variant="body1" sx={{ mb: 2, color: "#fff" }}>
            Set a new purchase price for this photo:
          </Typography>
          <TextField
            label="Price"
            type="number"
            fullWidth
            value={editedPrice}
            onChange={(e) => setEditedPrice(Number(e.target.value))}
            sx={{
              backgroundColor: "#fff",
              borderRadius: 1,
            }}
          />
        </Box>
      </DialogContent>

      <DialogActions
        sx={{
          justifyContent: "space-between",
          p: 2,
        }}
      >
        <Button onClick={onClose} color="inherit" sx={{ fontWeight: "bold" }}>
          Cancel
        </Button>
        <Button
          variant="contained"
          sx={{
            background: "linear-gradient(135deg, #89f7fe 0%, #66a6ff 100%)",
            color: "#fff",
            fontWeight: "bold",
            "&:hover": {
              background: "linear-gradient(135deg, #66a6ff 0%, #89f7fe 100%)",
            },
          }}
          onClick={handleSave}
        >
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PhotoPurchaseEdit;
