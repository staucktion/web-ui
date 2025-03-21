import React, { useEffect, useState } from "react";
import { Box, Grid, Card, CardContent, CardActions, Typography, Button, Chip, CircularProgress, Paper } from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import ClearIcon from "@mui/icons-material/Clear";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import CategoryIcon from "@mui/icons-material/Category";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { webApiUrl } from "../../env/envVars";
import { toastError, toastSuccess, toastWarning } from "../../util/toastUtil";
import { generateLocationUrl } from "../../util/generateLocationUrl";
import CategoryDto from "../../dto/category/CategoryDto";

const ValidateCategories: React.FC = () => {
	const [categories, setCategories] = useState<CategoryDto[]>([]);
	const [loading, setLoading] = useState<boolean>(true);

	//Pagination
	const [currentPage, setCurrentPage] = useState<number>(0);
	const itemsPerPage = 3; // Categories per page

	const fetchWaitingCategories = async () => {
		const response = await fetch(`${webApiUrl}/categories/waiting`);
		const data: CategoryDto[] = await response.json();
		setCategories(data);
		setLoading(false);
	};

	useEffect(() => {
		fetchWaitingCategories();
	}, []);

	const handleApproveCategory = async (id: number) => {
		const response = await fetch(`${webApiUrl}/categories/${id}/status`, {
			method: "PUT",
			body: JSON.stringify({ action: "approve" }),
			headers: {
				"Content-Type": "application/json",
			},
		});
		if (response.ok) {
			toastSuccess("Category approved successfully");
		} else {
			toastError("Failed to approve category");
		}
		fetchWaitingCategories();
	};

	const handleRejectCategory = async (id: number) => {
		const rejectReason = prompt("Please enter the reason for rejecting the category");
		if (rejectReason && !!rejectReason.trim()) {
			const response = await fetch(`${webApiUrl}/categories/${id}/status`, {
				method: "PUT",
				body: JSON.stringify({ action: "reject", reason: rejectReason.trim() }),
				headers: {
					"Content-Type": "application/json",
				},
			});
			if (response.ok) {
				toastSuccess("Category rejected successfully");
			} else {
				toastError("Failed to reject category");
			}
			fetchWaitingCategories();
		} else {
			toastWarning("Cancelled rejecting category");
		}
	};

	const startIndex = currentPage * itemsPerPage;
	const endIndex = startIndex + itemsPerPage;
	const displayedCategories = categories.slice(startIndex, endIndex);
	const totalPages = Math.ceil(categories.length / itemsPerPage);

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
				Categories
			</Typography>
			<Grid container spacing={4} justifyContent="center">
				{displayedCategories.map((category) => {
					return (
						<Grid item xs={12} sm={6} md={4} lg={3} key={category.id}>
							<Paper elevation={6} sx={{ borderRadius: 3, overflow: "hidden" }}>
								<Card sx={{ borderRadius: 0, boxShadow: "none" }}>
									<CardContent>
										<Box display="flex" alignItems="center" mb={1} gap={1}>
											<LocationOnIcon color="error" />
											<Typography variant="body1" fontWeight="bold">
												<a href={generateLocationUrl(category.location)} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none", color: "inherit" }}>
													{category.address}
												</a>
											</Typography>
										</Box>
										<Box display="flex" alignItems="center" gap={1} mb={1}>
											<PhotoCameraIcon color="primary" />
											<Typography variant="body2" fontWeight="bold">
												Category Status:
											</Typography>
											<Chip label={category.status.status.toUpperCase()} color="warning" size="small" sx={{ fontWeight: "bold" }} />
										</Box>
										<Box display="flex" alignItems="center" gap={1} mb={1}>
											<CategoryIcon color="secondary" />
											<Typography variant="body2" fontWeight="bold">
												Category: {category.name}
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
										<Button variant="contained" color="success" startIcon={<CheckIcon />} onClick={() => handleApproveCategory(category.id)}>
											Approve Category
										</Button>
										<Button variant="contained" color="error" startIcon={<ClearIcon />} onClick={() => handleRejectCategory(category.id)}>
											Reject Category
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
				<Button onClick={handlePreviousPage} disabled={currentPage === 0}>
					<ArrowBackIosIcon />
				</Button>
				<Typography variant="body1" sx={{ color: "#fff" }}>
					Page {currentPage + 1} / {totalPages}
				</Typography>
				<Button onClick={handleNextPage} disabled={currentPage + 1 === totalPages}>
					<ArrowForwardIosIcon />
				</Button>
			</Box>
		</>
	);
};

export default ValidateCategories;
