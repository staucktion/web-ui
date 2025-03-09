import React, { useEffect, useState } from "react";
import {
  Box,
  Grid,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Typography,
  Button,
  Chip,
  CircularProgress,
  Paper,
} from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import ClearIcon from "@mui/icons-material/Clear";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";

// Örnek veri tipi
interface ValidationItem {
  id: number;
  photoUrl: string;
  locationCategory: string;
  photoStatus: "pending" | "approved" | "rejected";
  locationStatus: "pending" | "approved" | "rejected";
}

const ValidatorPanel: React.FC = () => {
  const [items, setItems] = useState<ValidationItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Örnek veri çekme simülasyonu
  useEffect(() => {
    // Normalde bir API isteği yaparsınız.
    // setTimeout ile 1 saniye gecikmeli mock veri atıyoruz.
    setTimeout(() => {
      const mockData: ValidationItem[] = [
        {
          id: 1,
          photoUrl: "https://images.unsplash.com/photo-1549144511-f099e773c147?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
          locationCategory: "Istanbul / Historical",
          photoStatus: "pending",
          locationStatus: "pending",
        },
        {
          id: 2,
          photoUrl: "https://images.unsplash.com/photo-1549144511-f099e773c147?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
          locationCategory: "Paris / Romantic",
          photoStatus: "pending",
          locationStatus: "pending",
        },
        {
          id: 3,
          photoUrl: "https://images.unsplash.com/photo-1549144511-f099e773c147?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
          locationCategory: "New York / City",
          photoStatus: "pending",
          locationStatus: "pending",
        },
      ];
      setItems(mockData);
      setLoading(false);
    }, 1000);
  }, []);

  // Fotoğraf onay/red
  const handleApprovePhoto = (id: number) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, photoStatus: "approved" } : item
      )
    );
  };
  const handleRejectPhoto = (id: number) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, photoStatus: "rejected" } : item
      )
    );
  };

  // Lokasyon onay/red
  const handleApproveLocation = (id: number) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, locationStatus: "approved" } : item
      )
    );
  };
  const handleRejectLocation = (id: number) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, locationStatus: "rejected" } : item
      )
    );
  };

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          background: "linear-gradient(135deg, #ff9a9e 0%, #fad0c4 100%)",
        }}
      >
        <CircularProgress size={80} />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        padding: "40px 20px",
        background: "linear-gradient(135deg, #c3ec52 0%, #0ba29d 100%)",
      }}
    >
      {/* Başlık */}
      <Typography
        variant="h3"
        align="center"
        gutterBottom
        sx={{ fontWeight: "bold", color: "#fff", mb: 4 }}
      >
        Validator Panel
      </Typography>

      {/* Kartlar */}
      <Grid container spacing={4} justifyContent="center">
        {items.map((item) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={item.id}>
            <Paper
              elevation={6}
              sx={{
                borderRadius: 3,
                overflow: "hidden",
                // MUI Paper'ın default arka plan rengini koruyabilir veya değiştirebilirsiniz.
              }}
            >
              <Card
                sx={{
                  borderRadius: 0, // Paper ile bütünleşmesi için
                  boxShadow: "none",
                }}
              >
                {/* Fotoğraf */}
                <CardMedia
                  component="img"
                  height="200"
                  image={item.photoUrl}
                  alt="Photo"
                  sx={{
                    objectFit: "cover",
                  }}
                />

                {/* İçerik */}
                <CardContent>
                  {/* Lokasyon */}
                  <Box display="flex" alignItems="center" mb={1} gap={1}>
                    <LocationOnIcon color="error" />
                    <Typography variant="body1" fontWeight="bold">
                      {item.locationCategory}
                    </Typography>
                  </Box>

                  {/* Fotoğraf Durumu */}
                  <Box display="flex" alignItems="center" gap={1} mb={1}>
                    <PhotoCameraIcon color="primary" />
                    <Typography variant="body2" fontWeight="bold">
                      Photo Status:
                    </Typography>
                    <Chip
                      label={item.photoStatus.toUpperCase()}
                      color={
                        item.photoStatus === "approved"
                          ? "success"
                          : item.photoStatus === "rejected"
                          ? "error"
                          : "warning"
                      }
                      size="small"
                      sx={{ fontWeight: "bold" }}
                    />
                  </Box>

                  {/* Lokasyon Durumu */}
                  <Box display="flex" alignItems="center" gap={1}>
                    <LocationOnIcon color="primary" />
                    <Typography variant="body2" fontWeight="bold">
                      Location Status:
                    </Typography>
                    <Chip
                      label={item.locationStatus.toUpperCase()}
                      color={
                        item.locationStatus === "approved"
                          ? "success"
                          : item.locationStatus === "rejected"
                          ? "error"
                          : "warning"
                      }
                      size="small"
                      sx={{ fontWeight: "bold" }}
                    />
                  </Box>
                </CardContent>

                {/* Butonlar */}
                <CardActions
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 1,
                    alignItems: "stretch",
                    padding: "16px",
                  }}
                >
                  {/* Fotoğraf Onay/Reddet */}
                  <Box display="flex" justifyContent="space-between" width="100%">
                    <Button
                      variant="contained"
                      color="success"
                      startIcon={<CheckIcon />}
                      onClick={() => handleApprovePhoto(item.id)}
                      disabled={item.photoStatus !== "pending"}
                    >
                      Approve Photo
                    </Button>
                    <Button
                      variant="contained"
                      color="error"
                      startIcon={<ClearIcon />}
                      onClick={() => handleRejectPhoto(item.id)}
                      disabled={item.photoStatus !== "pending"}
                    >
                      Reject Photo
                    </Button>
                  </Box>

                  {/* Lokasyon Onay/Reddet */}
                  <Box display="flex" justifyContent="space-between" width="100%">
                    <Button
                      variant="contained"
                      color="success"
                      startIcon={<CheckIcon />}
                      onClick={() => handleApproveLocation(item.id)}
                      disabled={item.locationStatus !== "pending"}
                    >
                      Approve Location
                    </Button>
                    <Button
                      variant="contained"
                      color="error"
                      startIcon={<ClearIcon />}
                      onClick={() => handleRejectLocation(item.id)}
                      disabled={item.locationStatus !== "pending"}
                    >
                      Reject Location
                    </Button>
                  </Box>
                </CardActions>
              </Card>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default ValidatorPanel;
