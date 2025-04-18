import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardActions,
  Button,
  Grid,
  CircularProgress,
  CardMedia
} from "@mui/material";
import { useNavigate } from "react-router-dom";               
import { useAuth } from "../../providers/AuthHook";
import { webApiUrl } from "../../env/envVars";
import PhotoDto from "../../dto/photo/PhotoDto";

const AuctionStatusPage: React.FC = () => {
  const { user } = useAuth();
  const [photos, setPhotos] = useState<PhotoDto[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();      

  useEffect(() => {
    const fetchPhotos = async () => {
      try {
        const res = await fetch(`${webApiUrl}/photos/my`);
        if (!res.ok) throw new Error("Failed to fetch photos");
        const data: PhotoDto[] = await res.json();

        const formatted = data
          .map(p => ({
            ...p,
            file_path: `${webApiUrl}/photos/${p.id}`
          }))
          .filter(p => !p.is_auctionable);
        setPhotos(formatted);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    if (user) fetchPhotos();
  }, [user]);

  
  const handleGoToPayment = (photoId: number) => {
    navigate(`/payment-auction/${photoId}`);
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 4, bgcolor: "#f5f5f5" }}>
      <Typography
        variant="h4"
        align="center"
        sx={{ mb: 4, fontWeight: 600, color: "#333" }}
      >
        Photos available for your purchase
      </Typography>

      {photos.length === 0 ? (
        <Typography variant="h6" align="center" color="textSecondary">
          No photos available for purchase.
        </Typography>
      ) : (
        <Grid container spacing={3}>
          {photos.map(photo => (
            <Grid item xs={12} sm={6} md={4} key={photo.id}>
              <Card
                sx={{
                  borderRadius: 2,
                  boxShadow: 3,
                  overflow: "hidden",
                  transition: "transform 0.2s",
                  '&:hover': { transform: 'scale(1.03)', boxShadow: 6 }
                }}
              >
                {photo.file_path && (
                  <CardMedia
                    component="img"
                    image={photo.file_path}
                    alt={photo.title || "Photo"}
                    sx={{ height: 200, objectFit: "cover" }}
                  />
                )}
                <CardContent sx={{ bgcolor: "#fff" }}>
                  <Typography
                    variant="h6"
                    component="div"
                    sx={{ mb: 1, color: "#000" }}
                  >
                    {photo.title || "Untitled"}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Ready for purchase until 07.07.07
                  </Typography>
                </CardContent>
                <CardActions sx={{ justifyContent: "center", pb: 2, bgcolor: "#fff" }}>
                  <Button
                    variant="contained"
                    size="medium"
                    sx={{
                      borderRadius: "20px",
                      textTransform: "none",
                      bgcolor: "#000",
                      '&:hover': { bgcolor: '#333' }
                    }}
                    onClick={() => handleGoToPayment(photo.id)} 
                  >
                    Purchase
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};

export default AuctionStatusPage;
