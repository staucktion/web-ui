import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Grid,
  Card,
  CardMedia,
  CardContent,
} from "@mui/material";
import { SelectChangeEvent } from "@mui/material/Select";
import PhotoDto from "../../dto/photo/PhotoDto";
import { webApiUrl } from "../../env/envVars";
import getPhotoSrc from "../../util/getPhotoSrc";

const CategoriesPage: React.FC = () => {
  const [photos, setPhotos] = useState<PhotoDto[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [categories, setCategories] = useState<string[]>([]);

  const fetchPhotos = async () => {
    try {
      const response = await fetch(`${webApiUrl}/photos`);
      if (!response.ok) {
        throw new Error("Failed to fetch photos");
      }
      const data: PhotoDto[] = await response.json();
      data.forEach((img) => {
        img.file_path = getPhotoSrc(img);
      });
      setPhotos(data);

      const cats = Array.from(
        new Set(data.map((img) => String(img.category_id)))
      ).filter(Boolean);
      setCategories(cats);
    } catch (error) {
      console.error("Error fetching photos:", error);
    }
  };

  useEffect(() => {
    fetchPhotos();
  }, []);

  const handleCategoryChange = (event: SelectChangeEvent<string>) => {
    setSelectedCategory(event.target.value);
  };

  const filteredPhotos =
    selectedCategory === "All"
      ? photos
      : photos.filter((photo) => String(photo.category_id) === selectedCategory);

  return (
    <Box 
      sx={{ 
        backgroundColor: "#f7f7f7", 
        minHeight: "100vh",
        // 🔽 NavBar ile bu bölüm arasında boşluk ekliyoruz
        mt: 4 
      }}
    >
      {/* Header Bölümü */}
      <Box
        sx={{
          backgroundImage: "url('https://via.placeholder.com/1200x400?text=Explore+Categories')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          height: "300px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          mb: 4,
        }}
      >
        {/* Opak Katman */}
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
          }}
        />
        <Typography variant="h3" sx={{ color: "#fff", zIndex: 1 }}>
          Explore Categories
        </Typography>
      </Box>

      {/* Dropdown ile Kategori Seçimi */}
      <Box sx={{ textAlign: "center", mb: 4 }}>
        <FormControl variant="outlined" sx={{ minWidth: 240 }}>
          <InputLabel id="category-select-label">Select Category</InputLabel>
          <Select
            labelId="category-select-label"
            value={selectedCategory}
            onChange={handleCategoryChange}
            label="Select Category"
          >
            <MenuItem value="All">All</MenuItem>
            {categories.map((cat) => (
              <MenuItem key={cat} value={cat}>
                {cat}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {/* Fotoğraf Grid'i */}
      <Grid container spacing={3} sx={{ p: 3 }}>
        {filteredPhotos.map((photo) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={photo.id}>
            <Card
              sx={{
                borderRadius: "16px",
                boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
                transition: "transform 0.3s",
                "&:hover": { transform: "scale(1.05)" },
              }}
            >
              <CardMedia
                component="img"
                image={photo.file_path}
                alt={`Photo ${photo.id}`}
                sx={{
                  height: "200px",
                  objectFit: "cover",
                  borderTopLeftRadius: "16px",
                  borderTopRightRadius: "16px",
                }}
              />
              <CardContent>
                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                  Category: {photo.category_id}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default CategoriesPage;
