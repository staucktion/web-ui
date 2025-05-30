import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import EditIcon from "@mui/icons-material/Edit";
import { Avatar, Box, Button, Container, FormControl, InputLabel, MenuItem, Paper, Select, SelectChangeEvent, Tab, Tabs, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import NavBarProfile from "../../components/NavBarProfile/NavBarProfile";
import PhotoPurchaseEdit from "../../components/PhotoPurchaseEdit/PhotoPurchaseEdit";
import PhotoUnknown from "../../components/PhotoUnknown/PhotoUnknown";
import CategoryDto from "../../dto/category/CategoryDto";
import PhotoDto from "../../dto/photo/PhotoDto";
import { webApiUrl } from "../../env/envVars";
import { useAuth } from "../../providers/AuthHook";
import getProfilePictureSrc from "../../util/getProfilePictureSrc";
import PendingPurchase from "../PendingPurchase/PendingPurchase";
import ProfitPage from "../ProfitPage/ProfitPage";
import PurchasedPhotos from "../../components/PurchasedPhotos/PurchasedPhotos";
import ProfileGallery from "../../components/ProfileGallery/ProfileGallery";
import { toastSuccess } from "../../util/toastUtil";

const ProfilePage: React.FC = () => {
	const { user } = useAuth();
	const navigate = useNavigate();
	const [selectedTab, setSelectedTab] = useState(0);
	const [myPhotos, setMyPhotos] = useState<PhotoDto[]>([]);
	const [selectedFile, setSelectedFile] = useState<File | null>(null);
	const [uploading, setUploading] = useState(false);
	const [categories, setCategories] = useState<CategoryDto[]>([]);
	const [selectedCategory, setSelectedCategory] = useState<string>("");

	const isAdminOrValidator =
	user?.role_id === 1 /* admin */ ||
	user?.role_id === 4 /* validator */;


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
		} else if (selectedTab === 1 || selectedTab === 2) {
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

			toastSuccess("File uploaded successfully");
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
					<Typography variant="h4" fontWeight="bold" sx={{ marginBottom: 2, maxWidth: "100%", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
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

					<Tabs
					value={selectedTab}
					onChange={handleTabChange}
					variant="fullWidth"
					centered
					sx={{ mb: 2 }}
					>
					<Tab label="Gallery" value={0} />
					{isAdminOrValidator && <Tab label="Upload" value={1} />}
					<Tab
						label="Pending Purchase"
						value={isAdminOrValidator ? 2 : 1}
					/>
					<Tab
						label="Profit"
						value={isAdminOrValidator ? 3 : 2}
					/>
					<Tab
						label="Purchased Photos"
						value={isAdminOrValidator ? 4 : 3}
					/>
					</Tabs>

					{/* GALLERY TAB */}
					{selectedTab === 0 && <ProfileGallery myPhotos={myPhotos} onPhotoClick={handlePhotoClick} />}

					{/* UPLOAD TAB */}
					{isAdminOrValidator && selectedTab === 1 && (
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

					{/* pending purchase tab */}
					{selectedTab === (isAdminOrValidator ? 2 : 1) && (
						<Box sx={{ marginTop: 2 }}>
							<PendingPurchase />
						</Box>
					)}

					{/* profit tab */}
					{selectedTab === (isAdminOrValidator ? 3 : 2) && (
						<Box sx={{ marginTop: 2 }}>
							<ProfitPage />
						</Box>
					)}

					{/* purchased photos tab */}
					{selectedTab === (isAdminOrValidator ? 4 : 3) && (
						<Box sx={{ marginTop: 2 }}>
							<PurchasedPhotos />
						</Box>
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
