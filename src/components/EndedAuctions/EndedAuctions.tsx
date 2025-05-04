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

const EndedAuctions: React.FC = () => {
  const [notPurchasedPhotos, setNotPurchasedPhotos] = useState<PhotoDto[]>([]);
  const [notBiddedPhotos, setNotBiddedPhotos] = useState<PhotoDto[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPhoto, setSelectedPhoto] = useState<PhotoDto | null>(null);

  const fetchFinishedPhotos = async () => {
    try {
      const response = await fetch(`${webApiUrl}/photos/finished`, {
        credentials: "include",
      });
      if (!response.ok) throw new Error("Failed to fetch finished photos");

      const data = await response.json();
      const { notPurchasedPhotos, notBiddedPhotos } = data;

      // Fotoğrafların gerçek path'lerini ayarla
      const updatePaths = (photos: PhotoDto[]) =>
        photos.map((p) => ({ ...p, file_path: `${webApiUrl}/photos/${p.id}` }));

      setNotPurchasedPhotos(updatePaths(notPurchasedPhotos));
      setNotBiddedPhotos(updatePaths(notBiddedPhotos));
    } catch {
      setError("Failed to load finished photos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFinishedPhotos();
  }, []);

  const renderPhotoGrid = (photos: PhotoDto[]) => (
    <Grid container spacing={3} sx={{ mb: 5 }}>
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
  );

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
    <Box sx={{ p: { xs: 2, md: 4 }, bgcolor: "#121212", minHeight: "100vh", color: "white" }}>
      {/* Not Purchased Section */}
      <Box sx={{ mb: 6 }}>
        <Typography variant="h4" gutterBottom sx={{ borderBottom: "2px solid #66a6ff", pb: 1 }}>
          📦 Photos Not Purchased
        </Typography>
        {notPurchasedPhotos.length === 0 ? (
          <Box
            sx={{
              backgroundColor: "#1e1e1e",
              borderRadius: 2,
              padding: 3,
              textAlign: "center",
              boxShadow: 2,
            }}
          >
            <Typography variant="body1" color="gray">
              No unpurchased photos found.
            </Typography>
          </Box>
        ) : (
          renderPhotoGrid(notPurchasedPhotos)
        )}
      </Box>
  
      {/* Not Bidded Section */}
      <Box>
        <Typography variant="h4" gutterBottom sx={{ borderBottom: "2px solid #ff6b6b", pb: 1 }}>
          🚫 Photos With No Bids
        </Typography>
        {notBiddedPhotos.length === 0 ? (
          <Box
            sx={{
              backgroundColor: "#1e1e1e",
              borderRadius: 2,
              padding: 3,
              textAlign: "center",
              boxShadow: 2,
            }}
          >
            <Typography variant="body1" color="gray">
              No photos without bids found.
            </Typography>
          </Box>
        ) : (
          renderPhotoGrid(notBiddedPhotos)
        )}
      </Box>
  
      {/* Modal */}
      <Dialog
        open={!!selectedPhoto}
        onClose={() => setSelectedPhoto(null)}
        maxWidth="sm"
        fullWidth
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
              <Typography variant="body2" color="gray" align="center" mt={2}>
                {`Photo ID: ${selectedPhoto.id}`}
              </Typography>
            </>
          )}
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default EndedAuctions;
