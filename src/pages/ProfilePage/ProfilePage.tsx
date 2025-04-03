import React, { useState, useEffect } from "react";
import { Box, Avatar, Typography, Button, Tabs, Tab, Grid, Paper, Container, Card, CardMedia, FormControl, Select, MenuItem, InputLabel, SelectChangeEvent } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { useAuth } from "../../providers/AuthHook";
import NavBarProfile from "../../components/NavBarProfile/NavBarProfile";
import { webApiUrl } from "../../env/envVars";
import { useNavigate } from "react-router-dom";
import getProfilePictureSrc from "../../util/getProfilePictureSrc";
import PhotoPurchaseEdit from "../../components/PhotoPurchaseEdit/PhotoPurchaseEdit";
import PhotoUnknown from "../../components/PhotoUnknown/PhotoUnknown";
import CategoryDto from "../../dto/category/CategoryDto";
import PhotoDto from "../../dto/photo/PhotoDto";

const ProfilePage: React.FC = () => {
	const { user } = useAuth();
	const navigate = useNavigate();
	const [selectedTab, setSelectedTab] = useState(0);
	const [myPhotos, setMyPhotos] = useState<PhotoDto[]>([]);
	const [selectedFile, setSelectedFile] = useState<File | null>(null);
	const [uploading, setUploading] = useState(false);
	const [categories, setCategories] = useState<CategoryDto[]>([]);
	const [selectedCategory, setSelectedCategory] = useState<string>("");

	// Photo to be displayed in modal
	const [selectedPhoto, setSelectedPhoto] = useState<PhotoDto | null>(null);

	const isPurchaseMode = (photo: PhotoDto): boolean => !photo.is_auctionable;

	const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
		setSelectedTab(newValue);
	};

	const handleCategoryChange = (event: SelectChangeEvent<string>) => {
		setSelectedCategory(event.target.value);
	};

	const fetchMyPhotos = async () => {
		try {
			const response = await fetch(`${webApiUrl}/photos/my`);
			if (!response.ok) {
				throw new Error("Failed to fetch photos");
			}
			const data: PhotoDto[] = await response.json();
			data.forEach((photo) => {
				photo.file_path = `${webApiUrl}/photos/${photo.id}`;
			});
			setMyPhotos(data);
		} catch (error) {
			console.error("Error fetching photos:", error);
		}
	};

	const fetchAllCategories = async () => {
		const response = await fetch(`${webApiUrl}/categories`);
		const data: CategoryDto[] = await response.json();
		setCategories(data);
	};

	useEffect(() => {
		if (selectedTab === 0) {
			fetchMyPhotos();
		} else if (selectedTab === 2) {
			fetchAllCategories();
		}
	}, [selectedTab]);

	const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		if (event.target.files && event.target.files[0]) {
			setSelectedFile(event.target.files[0]);
			event.target.value = "";
		}
	};

	const handleUpload = async () => {
		if (!selectedFile || !user || !selectedCategory) return;
		setUploading(true);

		const formData = new FormData();
		formData.append("photo", selectedFile);
		formData.append("categoryId", selectedCategory);
		formData.append("deviceInfo", navigator.userAgent);

		try {
			const response = await fetch(`${webApiUrl}/photos`, {
				method: "POST",
				body: formData,
			});

			const responseData = await response.text();
			console.log("Response Data:", responseData);

			if (!response.ok) {
				throw new Error(`File upload failed: ${responseData}`);
			}

			alert("File uploaded successfully!");
			setSelectedFile(null);
			setUploading(false);
			setSelectedTab(0);
		} catch (error) {
			console.error("Error uploading file:", error);
			alert("Upload failed.");
			setUploading(false);
		}
	};

	const handlePhotoClick = (photo: PhotoDto) => {
		setSelectedPhoto(photo);
	};

	const handleCloseModal = () => {
		setSelectedPhoto(null);
	};

	return (
		<>
			<NavBarProfile />
			<Container
				sx={{
					display: "flex",
					flexDirection: "column",
					alignItems: "center",
					justifyContent: "center",
					minHeight: "90vh",
					paddingTop: "40px",
					backgroundColor: "#f4f4f4",
				}}
			>
				<Paper
					elevation={3}
					sx={{
						padding: "40px",
						borderRadius: "12px",
						backgroundColor: "white",
						width: "100%",
						maxWidth: "800px",
						textAlign: "center",
					}}
				>
					<Avatar
						src={user ? getProfilePictureSrc(user) ?? undefined : undefined}
						sx={{
							width: 150,
							height: 150,
							backgroundColor: "#E0E0E0",
							margin: "0 auto 20px auto",
						}}
					/>
					<Typography variant="h4" fontWeight="bold" sx={{ marginBottom: 2 }}>
						{user?.username ?? "Guest User"}
					</Typography>
					<Button
						variant="contained"
						startIcon={<EditIcon />}
						sx={{
							backgroundColor: "#4CAF50",
							color: "white",
							borderRadius: "20px",
							marginBottom: "20px",
						}}
						onClick={() => navigate("/editprofile")}
					>
						Edit Profile
					</Button>

					<Tabs value={selectedTab} onChange={handleTabChange} variant="fullWidth" centered sx={{ marginBottom: 2 }}>
						<Tab label="Gallery" />
						<Tab label="Statistics" />
						<Tab label="Upload" />
					</Tabs>

					{/* GALLERY TAB */}
					{selectedTab === 0 && (
						<Grid container spacing={2}>
							{myPhotos.length > 0 ? (
								myPhotos.map((photo) => (
									<Grid item xs={6} sm={4} md={3} key={photo.id}>
										<Card onClick={() => handlePhotoClick(photo)} sx={{ cursor: "pointer" }}>
											<CardMedia component="img" image={photo.file_path} alt={`Photo ${photo.id}`} sx={{ height: 140 }} />
										</Card>
									</Grid>
								))
							) : (
								<Typography>No photos found.</Typography>
							)}
						</Grid>
					)}

					{/* UPLOAD TAB */}
					{selectedTab === 2 && (
						<>
							<Typography variant="h6" sx={{ marginBottom: 2 }}>
								Upload a Photo
							</Typography>
							<Box sx={{ textAlign: "center", mb: 4 }}>
								<FormControl variant="outlined" sx={{ minWidth: 240 }}>
									<InputLabel id="category-select-label">Select Category</InputLabel>
									<Select labelId="category-select-label" value={selectedCategory} onChange={handleCategoryChange} label="Select Category">
										{Array.from(categories.values()).map((cat) => (
											<MenuItem key={cat.id} value={cat.id}>
												{cat.name}
											</MenuItem>
										))}
									</Select>
								</FormControl>
							</Box>
							<Box
								sx={{
									border: "2px dashed #aaa",
									padding: "20px",
									borderRadius: "10px",
									textAlign: "center",
									backgroundColor: "#fafafa",
									width: "100%",
									maxWidth: "400px",
									margin: "0 auto",
								}}
							>
								<input type="file" accept="image/*" onChange={handleFileChange} style={{ display: "none" }} id="upload-input" />
								<label htmlFor="upload-input">
									<Button component="span" startIcon={<CloudUploadIcon />} variant="outlined" sx={{ marginBottom: 2 }}>
										Choose File
									</Button>
								</label>
								<Typography variant="body1">{selectedFile ? selectedFile.name : "No file selected"}</Typography>
							</Box>
							<Button
								variant="contained"
								disabled={!selectedCategory || !selectedFile || uploading}
								onClick={handleUpload}
								sx={{
									marginTop: 2,
									backgroundColor: "#4CAF50",
									"&:hover": { backgroundColor: "#45A049" },
								}}
							>
								{uploading ? "Uploading..." : "Upload"}
							</Button>
						</>
					)}
				</Paper>
			</Container>

			{/* Dummy Condition*/}
			{selectedPhoto &&
				(isPurchaseMode(selectedPhoto) ? (
					<PhotoPurchaseEdit open={true} photo={selectedPhoto} onClose={handleCloseModal} />
				) : (
					<PhotoUnknown open={true} photo={selectedPhoto} onClose={handleCloseModal} />
				))}
		</>
	);
};

export default ProfilePage;
