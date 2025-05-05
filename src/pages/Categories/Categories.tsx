import React, { useState, useEffect } from "react";
import {
	Box,
	Typography,
	FormControl,
	InputLabel,
	Select,
	MenuItem,
	Grid,
	Card,
	CardActionArea,
	CardMedia,
	CardContent,
	Chip,
	Container,
  } from "@mui/material";
import { SelectChangeEvent } from "@mui/material/Select";
import PhotoDto from "../../dto/photo/PhotoDto";
import { webApiUrl } from "../../env/envVars";
import getPhotoSrc from "../../util/getPhotoSrc";
import CategoryDto from "../../dto/category/CategoryDto";

interface CategoriesPageProps {
	categorySearch: string | null;
  }


  const CategoriesPage: React.FC<CategoriesPageProps> = ({ categorySearch }) => {
	const [photos, setPhotos] = useState<PhotoDto[]>([]);
	const [selectedCategory, setSelectedCategory] = useState<string>("All");
	const [categories, setCategories] = useState<Map<number, CategoryDto>>(new Map());
	const searchCategory = categorySearch;
	const [noCategoryMatch, setNoCategoryMatch] = useState<boolean>(false);


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

			setCategories(new Map(data.map((img) => [img.category_id, img.category])));
		} catch (error) {
			console.error("Error fetching photos:", error);
		}
	};

	useEffect(() => {
		fetchPhotos();
	}, []);

	useEffect(() => {
		if (searchCategory && categories.size > 0) {
			const normalize = (text: string) =>
				text.toLowerCase().replace(/\s+/g, "").trim();
	
			const matchingCategory = Array.from(categories.values()).find(
				(cat) => normalize(cat.name) === normalize(searchCategory)
			);
	
			if (matchingCategory) {
				setSelectedCategory(String(matchingCategory.id));
				setNoCategoryMatch(false);
			} else {
				setNoCategoryMatch(true);
			}
		}
	}, [categories, searchCategory]);

	const handleCategoryChange = (event: SelectChangeEvent<string>) => {
		setSelectedCategory(event.target.value);
	};

	const filteredPhotos = selectedCategory === "All" ? photos : photos.filter((photo) => String(photo.category_id) === selectedCategory);

	return (
		<Box sx={{ background: "#fafafa", minHeight: "100vh", py: 4 }}>
		  {/* Simple Header */}
		  <Container maxWidth="md" sx={{ textAlign: "center", mb: 4 }}>
		  </Container>
	
		  {/* Category Selector */}
		  <Box sx={{ display: "flex", justifyContent: "center", mb: 6 }}>
			<FormControl sx={{ minWidth: 200, background: "#fff", borderRadius: 3, boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}>
			  <InputLabel id="category-select-label">Theme</InputLabel>
			  <Select
				labelId="category-select-label"
				value={selectedCategory}
				onChange={handleCategoryChange}
				label="Theme"
				sx={{ borderRadius: 3 }}
			  >
				<MenuItem value="All">All</MenuItem>
				{Array.from(categories.values()).map((cat) => (
				  <MenuItem key={cat.id} value={String(cat.id)}>
					{cat.name}
				  </MenuItem>
				))}
			  </Select>
			</FormControl>
		  </Box>

		  {noCategoryMatch && (
		<Box sx={{ textAlign: "center", my: 4 }}>
			<Typography variant="h6" color="error">
			No theme found matching “{searchCategory}”
			</Typography>
		</Box>
		)}
	
		  {/* Photo Grid */}
		  <Container maxWidth="lg">
			<Grid container spacing={4}>
			  {filteredPhotos.map((photo) => (
				<Grid item xs={12} sm={6} md={4} lg={3} key={photo.id}>
				  <Card
					sx={{
					  borderRadius: 2,
					  overflow: "hidden",
					  boxShadow: "0 4px 16px rgba(0,0,0,0.1)",
					  transition: "transform 0.3s",
					  "&:hover": { transform: "translateY(-6px)" },
					}}
				  >
					<CardActionArea>
					  <Box sx={{ position: "relative" }}>
						<CardMedia
						  component="img"
						  image={photo.file_path}
						  alt={`Photo ${photo.id}`}
						  sx={{ height: 0, paddingTop: "75%" }}
						/>
						<Chip
						  label={photo.category.name}
						  size="small"
						  sx={{
							position: "absolute",
							top: 8,
							left: 8,
							backgroundColor: "rgba(255,255,255,0.9)",
							fontWeight: 600,
						  }}
						/>
					  </Box>
					  <CardContent>
						<Typography variant="body2" noWrap>
						  {photo.title || `Photo #${photo.id}`}
						</Typography>
					  </CardContent>
					</CardActionArea>
				  </Card>
				</Grid>
			  ))}
			</Grid>
		  </Container>
		</Box>
	  );
	};
	  
export default CategoriesPage;
