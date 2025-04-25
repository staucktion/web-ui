import React from "react";
import { Box, Card, CardMedia, Grid, Typography } from "@mui/material";
import PhotoDto from "../../dto/photo/PhotoDto";

interface ProfileGalleryProps {
	myPhotos: PhotoDto[];
	onPhotoClick: (photo: PhotoDto) => void;
}

const ProfileGallery: React.FC<ProfileGalleryProps> = ({ myPhotos, onPhotoClick }) => {
	return (
		<Box sx={{ p: 4, bgcolor: "#f5f5f5" }}>
			{myPhotos.length > 0 ? (
				<Grid container spacing={3}>
					{myPhotos.map((photo) => (
						<Grid item xs={6} sm={4} md={3} key={photo.id}>
							<Card
								onClick={() => onPhotoClick(photo)} 
								sx={{
									cursor: "pointer",
									borderRadius: 2,
									boxShadow: 3,
									overflow: "hidden",
									transition: "transform 0.2s",
									"&:hover": { transform: "scale(1.03)", boxShadow: 6 },
								}}
							>
								<CardMedia
									component="img"
									image={photo.file_path}
									alt={`Photo ${photo.id}`}
									sx={{ height: 200, objectFit: "cover" }}
								/>
							</Card>
						</Grid>
					))}
				</Grid>
			) : (
				<Typography variant="h6" align="center" color="textSecondary">
					No photos found.
				</Typography>
			)}
		</Box>
	);
};

export default ProfileGallery;
