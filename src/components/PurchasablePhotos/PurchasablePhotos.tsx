import React, { useState, useEffect } from "react";
import { Typography } from "@mui/material";
import "../../styles/Styles.css";
import { webApiUrl } from "../../env/envVars";
import PhotoDto from "../../dto/photo/PhotoDto";
import getPhotoSrc from "../../util/getPhotoSrc";
import PhotoDetailModal from "../PhotoDetailModal/PhotoDetailModal";

const PurchasablePhotos: React.FC = () => {
	const [purchasablePhotos, setPurchasablePhotos] = useState<PhotoDto[]>([]);
	const [selectedPhoto, setSelectedPhoto] = useState<PhotoDto | null>(null);
	const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

	const fetchWatermarkedImages = async () => {
		try {
			const response = await fetch(`${webApiUrl}/photos/purchasable`);
			if (!response.ok) {
				throw new Error("Failed to fetch photos");
			}
			const data: PhotoDto[] = await response.json();
			data.forEach((img) => (img.file_path = getPhotoSrc(img)));
			setPurchasablePhotos(data);
		} catch (err) {
			console.error(err);
		}
	};

	useEffect(() => {
		fetchWatermarkedImages();
	}, []);

	const handleImageClick = (img: PhotoDto) => {
		setSelectedPhoto(img);
		setIsModalOpen(true);
	};

	const handleCloseModal = () => {
		fetchWatermarkedImages();
		setSelectedPhoto(null);
		setIsModalOpen(false);
	};

	return (
		<div className="container">
			<div>
				{purchasablePhotos.length > 0 ? (
					<div className="imageGrid">
						{purchasablePhotos.map((img, index) => (
							<div key={index} className="imageCard" onClick={() => handleImageClick(img)}>
								<img src={img.file_path} alt={`Watermarked ${index + 1}`} className="image" />
							</div>
						))}
					</div>
				) : (
					<div className="noImages">
						<Typography variant="h6">No images are available right now for purchase.</Typography>
					</div>
				)}
			</div>

			{selectedPhoto && <PhotoDetailModal open={isModalOpen} onClose={handleCloseModal} photo={selectedPhoto} />}
		</div>
	);
};

export default PurchasablePhotos;
