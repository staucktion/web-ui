import React, { useEffect, useState } from "react";
import { Box, Grid, Card, CardMedia, CardContent, CardActions, Typography, Button, Chip, CircularProgress, Paper } from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import ClearIcon from "@mui/icons-material/Clear";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import CategoryIcon from "@mui/icons-material/Category";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { webApiUrl } from "../../env/envVars";
import PhotoDto from "../../dto/photo/PhotoDto";
import getPhotoSrc from "../../util/getPhotoSrc";
import { toastError, toastSuccess, toastWarning } from "../../util/toastUtil";
import { generateLocationUrl } from "../../util/generateLocationUrl";

const ValidatePhotos: React.FC = () => {
	const [photos, setPhotos] = useState<PhotoDto[]>([]);
	const [loading, setLoading] = useState<boolean>(true);

	//Pagination
	const [currentPage, setCurrentPage] = useState<number>(0);
	const itemsPerPage = 3; // Photos per page

	const fetchWaitingPhotos = async () => {
		const response = await fetch(`${webApiUrl}/photos/waiting`);
		const data: PhotoDto[] = await response.json();
		setPhotos(data);
		setLoading(false);
	};

	useEffect(() => {
		fetchWaitingPhotos();
	}, []);

	const handleApprovePhoto = async (id: number) => {
		

		const photo = photos.find((p) => p.id === id);
		if (!photo) {
			toastError("Photo not found.");
			return;
		}

		if (photo.category.status_id !== 2)  {
			toastWarning("Cannot approve photo. Theme is not approved yet.");
			return;
		}


		const response = await fetch(`${webApiUrl}/photos/${id}/status`, {
			method: "PUT",
			body: JSON.stringify({ action: "approve" }),
			headers: {
				"Content-Type": "application/json",
			},
		});
		if (response.ok) {
			toastSuccess("Photo approved successfully");
			await fetchWaitingPhotos(); 
		} else {
			toastError("Failed to approve photo");
		}
		fetchWaitingPhotos();
	};

	const handleRejectPhoto = async (id: number) => {
		const photo = photos.find((p) => p.id === id);
		if (!photo) {
			toastError("Photo not found.");
			return;
		}

		if (photo.category.status_id !== 2) {
			toastWarning("Cannot reject photo. Theme is not approved yet.");
			return;
		}
		
		const rejectReason = prompt("Please enter the reason for rejecting the photo");
		if (rejectReason && !!rejectReason.trim()) {
			const response = await fetch(`${webApiUrl}/photos/${id}/status`, {
				method: "PUT",
				body: JSON.stringify({ action: "reject", reason: rejectReason.trim() }),
				headers: {
					"Content-Type": "application/json",
				},
			});
			if (response.ok) {
				toastSuccess("Photo rejected successfully");
				await fetchWaitingPhotos(); 
			} else {
				toastError("Failed to reject photo");
			}
			fetchWaitingPhotos();
		} else {
			toastWarning("Cancelled rejecting photo");
		}
	};

	const startIndex = currentPage * itemsPerPage;
	const endIndex = startIndex + itemsPerPage;
	
	const filteredPhotos = photos.filter((p) => p.category && p.category.status_id !== 3);
	const totalPages = Math.ceil(filteredPhotos.length / itemsPerPage);
	const displayedPhotos = filteredPhotos.slice(startIndex, endIndex);
  
	const displayCurrent = totalPages === 0 ? 0 : currentPage + 1;
	const displayTotal   = totalPages;

	const handlePreviousPage = () => {
		setCurrentPage((prev) => Math.max(prev - 1, 0));
	};

	const handleNextPage = () => {
		setCurrentPage((prev) => (prev + 1 < totalPages ? prev + 1 : prev));
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
		<>
			<Typography variant="h4" align="center" gutterBottom sx={{ fontWeight: "bold", color: "#fff", mb: 4 }}>
				Photos
			</Typography>
			<Grid container spacing={4} justifyContent="center">
				{displayedPhotos.map((photo) => {
					return (
						<Grid item xs={12} sm={6} md={4} lg={3} key={photo.id}>
							<Paper elevation={6} sx={{ borderRadius: 3, overflow: "hidden" }}>
								<Card sx={{ borderRadius: 0, boxShadow: "none" }}>
									<CardMedia component="img" height="200" image={getPhotoSrc(photo)} alt="Photo" sx={{ objectFit: "cover" }} />
									<CardContent>
										<Box display="flex" alignItems="center" mb={1} gap={1}>
											<LocationOnIcon color="error" />
											<Typography variant="body1" fontWeight="bold">
												<a href={generateLocationUrl(photo.category.location)} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none", color: "inherit" }}>
													{photo.category.address}
												</a>
											</Typography>
										</Box>
										<Box display="flex" alignItems="center" gap={1} mb={1}>
											<PhotoCameraIcon color="primary" />
											<Typography variant="body2" fontWeight="bold">
												Photo Status:
											</Typography>
											<Chip label={photo.status.status.toUpperCase()} color="warning" size="small" sx={{ fontWeight: "bold" }} />
										</Box>
										<Box display="flex" alignItems="center" gap={1} mb={1}>
											<CategoryIcon color="secondary" />
											<Typography variant="body2" fontWeight="bold">
												Theme: {photo.category.name}
											</Typography>
										</Box>
									</CardContent>
									<CardActions
										sx={{
											display: "flex",
											justifyContent: "center",
											gap: 2,
										}}
									>
										<Button variant="contained" color="success" startIcon={<CheckIcon />} onClick={() => handleApprovePhoto(photo.id)}>
											Approve Photo
										</Button>
										<Button variant="contained" color="error" startIcon={<ClearIcon />} onClick={() => handleRejectPhoto(photo.id)}>
											Reject Photo
										</Button>
									</CardActions>
								</Card>
							</Paper>
						</Grid>
					);
				})}
			</Grid>

			<Box
			sx={{
				display: "flex",
				justifyContent: "center",
				alignItems: "center",
				mt: 4,
				gap: 2,
			}}
			>
			<Button
				onClick={handlePreviousPage}
				disabled={displayTotal === 0 || currentPage === 0}
			>
				<ArrowBackIosIcon />
			</Button>

			<Typography variant="body1" sx={{ color: "#fff" }}>
				Page {displayCurrent} / {displayTotal}
			</Typography>

			<Button
				onClick={handleNextPage}
				disabled={displayTotal === 0 || displayCurrent === displayTotal}
			>
			<ArrowForwardIosIcon />
					</Button>
				</Box>
			</>
	);
};

export default ValidatePhotos;
