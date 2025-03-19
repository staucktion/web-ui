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
  TextField,
} from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import ClearIcon from "@mui/icons-material/Clear";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import CategoryIcon from "@mui/icons-material/Category";

interface ValidationItem {
  id: number;
  photoUrl: string;
  locationCategory: string;
  locationUrl: string;
  categoryRequest: string;
  photoStatus: "pending" | "approved" | "rejected";
}

const ValidatorPanel: React.FC = () => {
  const [items, setItems] = useState<ValidationItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [categoryEdits, setCategoryEdits] = useState<{ [key: number]: string }>({});

  // Dummy condition: false ise hiçbir öğede kategori kısmı gösterilmez.
  // İhtiyaca göre true yaparsanız; "pending" ve id'si tek olan öğelerde kategori alanı görünür.
  const dummyCondition = false;

  useEffect(() => {
    setTimeout(() => {
      const mockData: ValidationItem[] = [
        {
          id: 1,
          photoUrl:
            "https://images.unsplash.com/photo-1549144511-f099e773c147?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
          locationCategory: "Istanbul / Historical",
          locationUrl: "https://maps.google.com/?q=Istanbul",
          categoryRequest: "Historical Site",
          photoStatus: "pending",
        },
        {
          id: 2,
          photoUrl:
            "https://images.unsplash.com/photo-1549144511-f099e773c147?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
          locationCategory: "Paris / Romantic",
          locationUrl: "https://maps.google.com/?q=Paris",
          categoryRequest: "Romantic Spot",
          photoStatus: "approved",
        },
        {
          id: 3,
          photoUrl:
            "https://images.unsplash.com/photo-1549144511-f099e773c147?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
          locationCategory: "New York / City",
          locationUrl: "https://maps.google.com/?q=New+York",
          categoryRequest: "City Landscape",
          photoStatus: "pending",
        },
      ];
      setItems(mockData);
      setLoading(false);
    }, 1000);
  }, []);

  const handleApprove = (id: number) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, photoStatus: "approved" } : item
      )
    );
  };

  const handleReject = (id: number) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, photoStatus: "rejected" } : item
      )
    );
  };

  const handleCategoryChange = (id: number, value: string) => {
    setCategoryEdits((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleSaveCategory = (id: number) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, categoryRequest: categoryEdits[id] || item.categoryRequest }
          : item
      )
    );
  };

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <CircularProgress />
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
      <Typography
        variant="h3"
        align="center"
        gutterBottom
        sx={{ fontWeight: "bold", color: "#fff", mb: 4 }}
      >
        Validator Panel
      </Typography>

      <Grid container spacing={4} justifyContent="center">
        {items.map((item) => {
          // Eğer dummyCondition false ise, shouldShowCategory otomatik false olur.
          // dummyCondition true ise; sadece "pending" statüsünde ve id'si tek olan öğelerde kategori kısmı gösterilir.
          const shouldShowCategory =
            dummyCondition && item.photoStatus === "pending" && item.id % 2 !== 0;
          return (
            <Grid item xs={12} sm={6} md={4} lg={3} key={item.id}>
              <Paper elevation={6} sx={{ borderRadius: 3, overflow: "hidden" }}>
                <Card sx={{ borderRadius: 0, boxShadow: "none" }}>
                  <CardMedia
                    component="img"
                    height="200"
                    image={item.photoUrl}
                    alt="Photo"
                    sx={{ objectFit: "cover" }}
                  />
                  <CardContent>
                    <Box display="flex" alignItems="center" mb={1} gap={1}>
                      <LocationOnIcon color="error" />
                      <Typography variant="body1" fontWeight="bold">
                        <a
                          href={item.locationUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{ textDecoration: "none", color: "inherit" }}
                        >
                          {item.locationCategory}
                        </a>
                      </Typography>
                    </Box>
                    <Box display="flex" alignItems="center" gap={1} mb={1}>
                      <PhotoCameraIcon color="primary" />
                      <Typography variant="body2" fontWeight="bold">
                        Photo Status:
                      </Typography>
                      <Chip
                        label={item.photoStatus.toUpperCase()}
                        color="warning"
                        size="small"
                        sx={{ fontWeight: "bold" }}
                      />
                    </Box>
                    {shouldShowCategory && (
                      <Box display="flex" alignItems="center" gap={1} mb={1}>
                        <CategoryIcon color="secondary" />
                        <TextField
                          value={categoryEdits[item.id] ?? item.categoryRequest}
                          onChange={(e) =>
                            handleCategoryChange(item.id, e.target.value)
                          }
                          variant="outlined"
                          size="small"
                          sx={{ flex: 1 }}
                        />
                        <Button
                          variant="contained"
                          color="info"
                          size="small"
                          onClick={() => handleSaveCategory(item.id)}
                        >
                          Save
                        </Button>
                      </Box>
                    )}
                  </CardContent>
                  <CardActions
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      gap: 2,
                    }}
                  >
                    <Button
                      variant="contained"
                      color="success"
                      startIcon={<CheckIcon />}
                      onClick={() => handleApprove(item.id)}
                    >
                      Approve Photo
                    </Button>
                    <Button
                      variant="contained"
                      color="error"
                      startIcon={<ClearIcon />}
                      onClick={() => handleReject(item.id)}
                    >
                      Reject Photo
                    </Button>
                  </CardActions>
                </Card>
              </Paper>
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
};

export default ValidatorPanel;
