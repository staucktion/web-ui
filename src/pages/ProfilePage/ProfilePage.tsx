import React, { useState, useEffect } from "react";
import { Box, Avatar, Typography, Button, Tabs, Tab, Grid, Paper, Container, Card, CardMedia } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { useAuth } from "../../providers/AuthContext";
import NavBarProfile from "../../components/NavBarProfile/NavBarProfile";
import { webApiUrl } from "../../env/envVars.tsx";
import { useNavigate } from "react-router-dom"; // EKLENDİ

interface Photo {
	id: number;
	file_path: string;
}

import getProfilePictureSrc from "../../util/getProfilePictureSrc";

const ProfilePage: React.FC = () => {
	const { user } = useAuth();
	const navigate = useNavigate(); // EKLENDİ
	const [selectedTab, setSelectedTab] = useState(0);
	const [photos, setPhotos] = useState<Photo[]>([]);
	const [selectedFile, setSelectedFile] = useState<File | null>(null);
	const [uploading, setUploading] = useState(false);

	const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
		setSelectedTab(newValue);
	};

	// ============================
	//  1) Tüm fotoğrafları çekme
	// ============================
	useEffect(() => {
		const fetchAllPhotos = async () => {
			try {
				const response = await fetch(`${webApiUrl}/photos`);
				if (!response.ok) {
					throw new Error("Failed to fetch photos");
				}

				// Sunucunuzun JSON formatına göre dönüştürün
				const data: Photo[] = await response.json();

				// Eğer sunucudan tam URL yerine sadece ID ya da dosya adı dönüyorsa,
				// AllPhoto.tsx'teki gibi file_path değerini düzenleyebilirsiniz.
				data.forEach((photo) => {
					// Örnek: GET /photos/:id ile fotoğrafı döndüren bir endpoint'iniz varsa
					photo.file_path = `${webApiUrl}/photos/${photo.id}`;
				});

				setPhotos(data);
			} catch (error) {
				console.error("Error fetching photos:", error);
			}
		};

		if (selectedTab === 0) {
			fetchAllPhotos();
		}
	}, [selectedTab]);

	// ================================
	//  2) Dosya seçme ve yükleme
	// ================================
	const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		if (event.target.files && event.target.files[0]) {
			setSelectedFile(event.target.files[0]);
			// Aynı dosyayı tekrar seçebilmek için input'u sıfırlıyoruz
			event.target.value = "";
		}
	};

	const handleUpload = async () => {
		if (!selectedFile || !user) return;
		setUploading(true);

		const formData = new FormData();
		formData.append("photo", selectedFile);
		formData.append("username", user.username);

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

			// Yükleme biter bitmez tekrar "Gallery" sekmesine dönelim ki yeni fotoğraf gözüksün
			setSelectedTab(0);
		} catch (error) {
			console.error("Error uploading file:", error);
			alert("Upload failed.");
			setUploading(false);
		}
	};

	// ================================
	//  3) Arayüz
	// ================================
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
						onClick={() => navigate("/editprofile")} // EKLENDİ: Yönlendirme işlemi
					>
						Edit Profile
					</Button>

					<Tabs value={selectedTab} onChange={handleTabChange} variant="fullWidth" centered sx={{ marginBottom: 2 }}>
						<Tab label="Gallery" />
						<Tab label="Statistics" />
						<Tab label="Followers" />
						<Tab label="Upload" />
					</Tabs>

					{/* GALLERY TAB */}
					{selectedTab === 0 && (
						<Grid container spacing={2}>
							{photos.length > 0 ? (
								photos.map((photo) => (
									<Grid item xs={6} sm={4} md={3} key={photo.id}>
										<Card>
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
					{selectedTab === 3 && (
						<>
							<Typography variant="h6" sx={{ marginBottom: 2 }}>
								Upload a Photo
							</Typography>
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
								disabled={!selectedFile || uploading}
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
		</>
	);
};

export default ProfilePage;
