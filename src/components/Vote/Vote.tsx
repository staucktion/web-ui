import React, { useState, useEffect } from "react";
import "../../styles/Styles.css";
import { webApiUrl } from "../../env/envVars";
import PhotoDto from "../../dto/photo/PhotoDto";
import useRequireAuth from "../../Hooks/useRequireAuth";
import CustomModal from "../CustomModal/CustomModal";
import VoteModal from "../VoteModal/VoteModal";
import { Typography } from "@mui/material";

const Vote: React.FC = () => {
	const { open, requireAuth, handleClose, handleLogin } = useRequireAuth();

	const [photosToVote, setPhotosToVote] = useState<Record<number, PhotoDto[]>>({});
	const [selectedPhoto, setSelectedPhoto] = useState<PhotoDto | null>(null);
	const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

	// Fotoğrafları çekme
	const fetchPhotosToVote = async () => {
		try {
			const response = await fetch(`${webApiUrl}/photos/vote`);
			if (!response.ok) {
				throw new Error("Failed to fetch photos");
			}
			const data: Record<number, PhotoDto[]> = await response.json();

			Object.keys(data).forEach((key) => {
				data[+key].forEach((img) => {
					img.file_path = `${webApiUrl}/photos/${img.id}`;
				});
				data[+key].sort(() => Math.random() - 0.5);

				if (data[+key].length === 0) {
					delete data[+key];
				}
			});

			setPhotosToVote(data);
		} catch (err) {
			console.error(err);
		}
	};

	useEffect(() => {
		fetchPhotosToVote();
	}, []);

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
			<div>
				{Object.keys(photosToVote).length > 0 ? (
					Object.keys(photosToVote).map((category_id) => (
						<React.Fragment key={category_id}>
							<Typography variant="h6">{photosToVote[+category_id][0].category.name}</Typography>
							<div className="imageGrid" key={category_id}>
								{photosToVote[+category_id].map((img, index) => (
									<div key={index} className="imageCard" onClick={() => handleImageClick(img)}>
										<img src={img.file_path} alt={`Vote Photo ${index + 1}`} className="image" />
									</div>
								))}
							</div>
						</React.Fragment>
					))
				) : (
					<div className="noImages">
						<Typography variant="h6">No images are in voting process right now.</Typography>
					</div>
				)}
			</div>

			{/* Giriş (Login) Modal'ı */}
			<CustomModal open={open} title="Login to Vote" onClose={handleClose} onConfirm={handleLogin} confirmText="Login with Google" />

			{/* Vote Modal: Fotoğrafa tıklandığında VoteModal açılıyor */}
			{selectedPhoto && <VoteModal open={isModalOpen} onClose={handleCloseModal} photo={selectedPhoto} />}
		</div>
	);
};

export default Vote;
