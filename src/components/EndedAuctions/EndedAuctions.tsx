import React, { useEffect, useState } from "react";
import {
  Box,
  CircularProgress,
  Grid,
  Card,
  CardMedia,
  Typography,
  Dialog,
  DialogContent,
  Alert,
} from "@mui/material";
import { webApiUrl } from "../../env/envVars";

interface PhotoDto {
  id: number;
  file_path: string;
}

const FinishedPhotos: React.FC = () => {
  const [photos, setPhotos] = useState<PhotoDto[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPhoto, setSelectedPhoto] = useState<PhotoDto | null>(null); // Burayı obje yaptım

  const fetchFinishedPhotos = async () => {
    try {
      const response = await fetch(`${webApiUrl}/photos/finished`, {
        credentials: "include",
      });
      if (!response.ok) {
        throw new Error("Failed to fetch finished photos");
      }
      const data: PhotoDto[] = await response.json();
      data.forEach((photo) => {
        photo.file_path = `${webApiUrl}/photos/${photo.id}`;
      });
      setPhotos(data);
    } catch (_err) {
      setError("Failed to load finished photos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFinishedPhotos();
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <CircularProgress color="inherit" />
      </Box>
    );
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  return (
    <Box sx={{ p: 4, bgcolor: "#121212", minHeight: "100vh" }}>
      {photos.length === 0 ? (
        <Typography variant="h6" align="center" color="white">
          No finished photos found.
        </Typography>
      ) : (
        <Grid container spacing={3}>
          {photos.map((photo) => (
            <Grid item xs={12} sm={6} md={3} key={photo.id}>
              <Card
                sx={{
                  borderRadius: 2,
                  boxShadow: 3,
                  cursor: "pointer",
                  bgcolor: "#1e1e1e",
                  "&:hover": { transform: "scale(1.03)", boxShadow: 6 },
                }}
                onClick={() => setSelectedPhoto(photo)}
              >
                <CardMedia
                  component="img"
                  image={photo.file_path}
                  alt={`Finished Photo ${photo.id}`}
                  sx={{ height: 180, objectFit: "cover" }}
                />
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Modal for Photo */}
      <Dialog
        open={!!selectedPhoto}
        onClose={() => setSelectedPhoto(null)}
        maxWidth="sm"
      >
        <DialogContent sx={{ bgcolor: "#1e1e1e", p: 2 }}>
          {selectedPhoto && (
            <>
              <img
                src={selectedPhoto.file_path}
                alt={`Photo ${selectedPhoto.id}`}
                style={{
                  width: "100%",
                  maxHeight: "500px",
                  objectFit: "contain",
                  borderRadius: "8px",
                }}
              />
              <Typography
                variant="body2"
                color="gray"
                align="center"
                mt={2}
              >
                {`Photo ID: ${selectedPhoto.id}`}
              </Typography>
            </>
          )}
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default FinishedPhotos;
