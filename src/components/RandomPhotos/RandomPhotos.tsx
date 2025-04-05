import React, { useState, useEffect } from "react";
import "../../styles/Styles.css";
import EmailButtons from "../EmailButtons/EmailButtons";
import { webApiUrl } from "../../env/envVars";
import { useAuth } from "../../providers/AuthHook";
import PhotoDto from "../../dto/photo/PhotoDto";
import useRequireAuth from "../../Hooks/useRequireAuth";
import redirectWithPost from "../../util/redirectWithPost";
import CustomModal from "../CustomModal/CustomModal";

const RandomPhotos: React.FC = () => {
	const { user } = useAuth();
	const { open, requireAuth, handleClose, handleLogin } = useRequireAuth();

	const [watermarkedImages, setWatermarkedImages] = useState<PhotoDto[]>([]);
	const [selectedImage, setSelectedImage] = useState<PhotoDto | null>(null);
	const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

	const shuffleAndPick = (array: PhotoDto[], count: number) => {
		const shuffled = [...array].sort(() => 0.5 - Math.random());
		return shuffled.slice(0, count);
	};

	const fetchWatermarkedImages = async () => {
		try {
			const response = await fetch(`${webApiUrl}/photos`);
			if (!response.ok) {
				throw new Error("Failed to fetch photos");
			}
			const data: PhotoDto[] = await response.json();
			data.forEach((img) => (img.file_path = `${webApiUrl}/photos/${img.id}`));

			const randomImages = shuffleAndPick(data, 4);
			setWatermarkedImages(randomImages);
		} catch (err) {
			console.error(err);
		}
	};

	useEffect(() => {
		fetchWatermarkedImages();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const sendApproveMail = async (img: PhotoDto) => {
		if (!user) {
			redirectWithPost("/auth/google");
			return;
		}

		try {
			const response = await fetch(`${webApiUrl}/mail/send`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ photoId: img.id, action: "Approve Purchase" }),
				credentials: "include",
			});

			if (!response.ok) {
				const errorText = await response.text();
				throw new Error(`Failed to send mail. Status: ${response.status}, Message: ${errorText}`);
			}

			alert(`Purchase approved mail sent successfully to ${user.email}!`);
			setSelectedImage(null);
			setIsModalOpen(false);
			fetchWatermarkedImages();
		} catch (error) {
			console.error("Error sending mail:", error);
			alert("Failed to send mail. Check console for details.");
		}
	};

	const handleImageClick = (img: PhotoDto) => {
		requireAuth(() => {
			setSelectedImage(img);
			setIsModalOpen(true);
		});
	};

	const handleCloseModal = () => {
		setSelectedImage(null);
		setIsModalOpen(false);
	};

	return (
		<div className="container">
			<div className="imageGrid">
				{watermarkedImages.map((img, index) => (
					<div key={index} className="imageCard" onClick={() => handleImageClick(img)}>
						<img src={img.file_path} alt={`Watermarked ${index + 1}`} className="image" />
					</div>
				))}
			</div>

			<CustomModal open={open} title="Login to View Images" onClose={handleClose} onConfirm={handleLogin} confirmText="Login with Google" />

			<CustomModal open={isModalOpen} title="Image Preview" onClose={handleCloseModal}>
				<img src={selectedImage?.file_path || ""} alt="Selected" className="modalImage" />
				<EmailButtons onApprove={() => selectedImage && sendApproveMail(selectedImage)} />
			</CustomModal>
		</div>
	);
};

export default RandomPhotos;
