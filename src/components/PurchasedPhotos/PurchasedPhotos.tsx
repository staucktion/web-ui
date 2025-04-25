import React, { useEffect, useState } from "react";
import { Box, Card, CardMedia, CircularProgress, Grid, Typography } from "@mui/material";
import PhotoDto from "../../dto/photo/PhotoDto";
import { webApiUrl } from "../../env/envVars";

const PurchasedPhotos: React.FC = () => {
	const [purchasedPhotos, setPurchasedPhotos] = useState<PhotoDto[]>([]);
	const [loading, setLoading] = useState<boolean>(true);

	const fetchPurchasedPhotos = async () => {
		try {
			const response = await fetch(`${webApiUrl}/photos/purchased`);
			if (!response.ok) {
				throw new Error("Failed to fetch purchased photos");
			}
			const data: PhotoDto[] = await response.json();
			data.forEach((photo) => {
				photo.file_path = `${webApiUrl}/photos/${photo.id}`;
			});
			setPurchasedPhotos(data);
		} catch (error) {
			console.error("Error fetching purchased photos:", error);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchPurchasedPhotos();
	}, []);

	if (loading) {
		return (
			<Box sx={{ display: "flex", justifyContent: "center", mt: 8 }}>
				<CircularProgress />
			</Box>
		);
	}

	return (
		<Box sx={{ p: 4, bgcolor: "#f5f5f5" }}>
			{purchasedPhotos.length === 0 ? (
				<Typography variant="h6" align="center" color="textSecondary">
					No purchased photos found.
				</Typography>
			) : (
				<Grid container spacing={3}>
					{purchasedPhotos.map((photo) => (
						<Grid item xs={12} sm={6} md={4} key={photo.id}>
							<Card
								sx={{
									borderRadius: 2,
									boxShadow: 3,
									overflow: "hidden",
									transition: "transform 0.2s",
									"&:hover": { transform: "scale(1.03)", boxShadow: 6 },
								}}
							>
								<CardMedia component="img" image={photo.file_path} alt={`Purchased Photo ${photo.id}`} sx={{ height: 200, objectFit: "cover" }} />
							</Card>
						</Grid>
					))}
				</Grid>
			)}
		</Box>
	);
};

export default PurchasedPhotos;
