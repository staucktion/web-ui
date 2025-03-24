import React, { useEffect, useState } from "react";
import PhotoDto from "../../dto/photo/PhotoDto";
import { webApiUrl } from "../../env/envVars";
import useRequireAuth from "../../Hooks/useRequireAuth";
import "../../styles/Styles.css";
// Login modal için CustomModal hâlâ kullanılıyor (gerekirse de değiştirebilirsiniz)
// import CustomModal from "../CustomModal/CustomModal";
import AuctionModal from "../AuctionModal/AuctionModal";

const Auctions: React.FC = () => {
	const { requireAuth } = useRequireAuth();

	const [auctionPhotos, setAuctionPhotos] = useState<PhotoDto[]>([]);
	const [selectedPhoto, setSelectedPhoto] = useState<PhotoDto | null>(null);
	const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

	// /photos endpoint’inden veri çekiyoruz
	const fetchWatermarkedImages = async () => {
		try {
			const response = await fetch(`${webApiUrl}/photos/auction`);
			if (!response.ok) {
				throw new Error("Failed to fetch photos");
			}
			const data: PhotoDto[] = await response.json();

			// Her fotoğrafın file_path'ini oluşturuyoruz
			data.forEach((img) => {
				img.file_path = `${webApiUrl}/photos/${img.id}`;
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
		setSelectedPhoto(null);
		setIsModalOpen(false);
	};

	return (
		<div className="container">
			<div className="imageGrid">
				{auctionPhotos.map((img, index) => (
					<div key={index} className="imageCard" onClick={() => handleImageClick(img)}>
						<img src={img.file_path} alt={`Auction Photo ${index + 1}`} className="image" />
					</div>
				))}
			</div>

			{/* Auction detay modal'ı: AuctionModal kullanıyoruz */}
			{selectedPhoto && <AuctionModal open={isModalOpen} onClose={handleCloseModal} photo={selectedPhoto} />}
		</div>
	);
};

export default Auctions;
