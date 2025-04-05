import React, { useState, useEffect } from "react";
import "../../styles/Styles.css";
import { webApiUrl } from "../../env/envVars";
// import { useAuth } from "../../providers/AuthHook";
import PhotoDto from "../../dto/photo/PhotoDto";
import useRequireAuth from "../../Hooks/useRequireAuth";
// import redirectWithPost from "../../util/redirectWithPost";
import CustomModal from "../CustomModal/CustomModal";
import VoteModal from "../VoteModal/VoteModal"; // VoteModal dosyanızın yolu

const Vote: React.FC = () => {
	// const { user } = useAuth();
	const { open, requireAuth, handleClose, handleLogin } = useRequireAuth();

	const [photosToVote, setPhotosToVote] = useState<PhotoDto[]>([]);
	const [selectedPhoto, setSelectedPhoto] = useState<PhotoDto | null>(null);
	const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

	// Fotoğrafları çekme
	const fetchPhotosToVote = async () => {
		try {
			const response = await fetch(`${webApiUrl}/photos/vote`);
			if (!response.ok) {
				throw new Error("Failed to fetch photos");
			}
			const data: PhotoDto[] = await response.json();

			// Her fotoğraf için file_path oluşturuluyor.
			data.forEach((img) => {
				img.file_path = `${webApiUrl}/photos/${img.id}`;
			});

			setPhotosToVote(data);
		} catch (err) {
			console.error(err);
		}
	};

	useEffect(() => {
		fetchPhotosToVote();
	}, []);

	// Oy gönderme (Vote işlemi örneği)
	// const sendVote = async (img: PhotoDto) => {
	// 	if (!user) {
	// 		redirectWithPost("/auth/google");
	// 		return;
	// 	}

	// 	try {
	// 		const response = await fetch(`${webApiUrl}/mail/send`, {
	// 			method: "POST",
	// 			headers: { "Content-Type": "application/json" },
	// 			body: JSON.stringify({ photoId: img.id, action: "Vote" }),
	// 			credentials: "include",
	// 		});

	// 		if (!response.ok) {
	// 			const errorText = await response.text();
	// 			throw new Error(`Failed to send vote. Status: ${response.status}, Message: ${errorText}`);
	// 		}

	// 		alert(`Vote registered successfully from ${user.email}!`);
	// 		setSelectedImage(null);
	// 		setIsModalOpen(false);
	// 		fetchPhotosToVote();
	// 	} catch (error) {
	// 		console.error("Error sending vote:", error);
	// 		alert("Failed to send vote. Check console for details.");
	// 	}
	// };

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
				{photosToVote.map((img, index) => (
					<div key={index} className="imageCard" onClick={() => handleImageClick(img)}>
						<img src={img.file_path} alt={`Vote Photo ${index + 1}`} className="image" />
					</div>
				))}
			</div>

			{/* Giriş (Login) Modal'ı */}
			<CustomModal open={open} title="Login to Vote" onClose={handleClose} onConfirm={handleLogin} confirmText="Login with Google" />

			{/* Vote Modal: Fotoğrafa tıklandığında VoteModal açılıyor */}
			{selectedPhoto && <VoteModal open={isModalOpen} onClose={handleCloseModal} photo={selectedPhoto} />}
		</div>
	);
};

export default Vote;
