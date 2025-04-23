import React, { useEffect, useState } from "react";
import PhotoDto from "../../dto/photo/PhotoDto";
import { webApiUrl } from "../../env/envVars";
import useRequireAuth from "../../Hooks/useRequireAuth";
import "../../styles/Styles.css";
import AuctionModal from "../AuctionModal/AuctionModal";
import { Typography } from "@mui/material";

const Auctions: React.FC = () => {
	const { requireAuth } = useRequireAuth();

	const [auctionPhotos, setAuctionPhotos] = useState<Record<number, PhotoDto[]>>({});
	const [selectedPhoto, setSelectedPhoto] = useState<PhotoDto | null>(null);
	const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

	// /photos endpoint’inden veri çekiyoruz
	const fetchWatermarkedImages = async () => {
		try {
			const response = await fetch(`${webApiUrl}/photos/auction`);
			if (!response.ok) {
				throw new Error("Failed to fetch photos");
			}
			const data: Record<number, PhotoDto[]> = await response.json();

			Object.keys(data).forEach((key) => {
				data[+key].forEach((img) => {
					img.file_path = `${webApiUrl}/photos/${img.id}`;
				});
				data[+key].sort((a, b) => b.vote_count - a.vote_count);

				if (data[+key].length === 0) {
					delete data[+key];
				}
			});

			setAuctionPhotos(data);
		} catch (err) {
			console.error(err);
		}
	};

	useEffect(() => {
		fetchWatermarkedImages();
	}, []);

	// Resme tıklanınca auth kontrolü ve modal açma
	const handleImageClick = (img: PhotoDto) => {
		requireAuth(() => {
			setSelectedPhoto(img);
			setIsModalOpen(true);
		});
	};

	const handleCloseModal = () => {
		fetchWatermarkedImages();
		setSelectedPhoto(null);
		setIsModalOpen(false);
	};

	return (
		<div className="container">
			<div>
				{Object.keys(auctionPhotos).length > 0 ? (
					Object.keys(auctionPhotos).map((category_id) => (
						<React.Fragment key={category_id}>
							<Typography variant="h6">{auctionPhotos[+category_id][0].category.name}</Typography>
							<div className="imageGrid" key={category_id}>
								{auctionPhotos[+category_id].map((img, index) => (
									<div key={index} className="imageCard" onClick={() => handleImageClick(img)}>
										<img src={img.file_path} alt={`Auction Photo ${index + 1}`} className="image" />
									</div>
								))}
							</div>
						</React.Fragment>
					))
				) : (
					<div className="noImages">
						<Typography variant="h6">No images are being auctioned right now.</Typography>
					</div>
				)}
			</div>

			{/* Auction detay modal'ı: AuctionModal kullanıyoruz */}
			{selectedPhoto && <AuctionModal open={isModalOpen} onClose={handleCloseModal} photo={selectedPhoto} />}
		</div>
	);
};

export default Auctions;
