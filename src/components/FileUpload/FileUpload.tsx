import React, { useState, useEffect } from "react";
import { Box, Modal } from "@mui/material";
import "../../styles/Styles.css";
import EmailButtons from "../EmailButtons/EmailButtons.tsx";
import { webApiUrl } from "../../env/envVars.tsx";
import { useAuth } from "../../providers/AuthContext.tsx";
import ReadAllPhotoResponseDto from "../../dto/photo/ReadAllPhotoResponseDto.ts";
import redirectWithPost from "../../util/redirectWithPost.ts";

const FileUpload: React.FC = () => {
	const { user } = useAuth();
	const [watermarkedImages, setWatermarkedImages] = useState<string[]>([]);
	const [selectedImage, setSelectedImage] = useState<string | null>(null);
	const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

	useEffect(() => {
		const fetchWatermarkedImages = async () => {
			try {
				const response = await fetch(`${webApiUrl}/photos`);
				if (!response.ok) {
					throw new Error("Failed to fetch photos");
				}
				const data: ReadAllPhotoResponseDto[] = await response.json();
				const photoUrls = data.map((instance) => `${webApiUrl}/photos/${instance.id}`);
				setWatermarkedImages(photoUrls);
			} catch (err) {
				console.error(err);
			}
		};
		fetchWatermarkedImages();
	}, []);

	const sendApproveMail = async (imgSrc: string) => {
		if (!user) {
			redirectWithPost("/auth/google");
			return;
		}
		const fileName = imgSrc.split("/").pop();

		try {
			const response = await fetch(`${webApiUrl}/mail/send`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					photoName: fileName,
					action: "Approve Purchase",
				}),
				credentials: "include",
			});

			if (!response.ok) {
				const errorText = await response.text();
				throw new Error(`Failed to send mail. Status: ${response.status}, Message: ${errorText}`);
			}

			alert(`Purchase approved mail sent successfully to ${user.email}!`);
			setSelectedImage(null);
			setIsModalOpen(false);
		} catch (error) {
			console.error("Error sending mail:", error);
			alert("Failed to send mail. Check console for details.");
		}
	};

	const handleImageClick = (imgSrc: string) => {
		setSelectedImage(imgSrc);
		setIsModalOpen(true);
	};

	const handleCloseModal = () => {
		setSelectedImage(null);
		setIsModalOpen(false);
	};

	return (
		<div className="container">
			<div>
				<div className="imageGrid">
					{watermarkedImages.map((imgSrc, index) => (
						<div key={index} className="imageCard" onClick={() => handleImageClick(imgSrc)}>
							<img src={imgSrc} alt={`Watermarked ${index + 1}`} className="image" />
						</div>
					))}
				</div>
			</div>

			<Modal
				open={isModalOpen}
				onClose={handleCloseModal}
				aria-labelledby="modal-title"
				aria-describedby="modal-description"
				BackdropProps={{
					style: { backgroundColor: "rgba(0, 0, 0, 0.8)" },
				}}
			>
				<Box
					sx={{
						position: "absolute",
						top: "50%",
						left: "50%",
						transform: "translate(-50%, -50%)",
						width: "80%",
						maxWidth: "600px",
						backgroundColor: "transparent",
						boxShadow: "none",
						p: 4,
						textAlign: "center",
						outline: "none",
					}}
				>
					<img src={selectedImage || ""} alt="Selected" className="modalImage" />
					<EmailButtons onApprove={() => selectedImage && sendApproveMail(selectedImage)} />
				</Box>
			</Modal>
		</div>
	);
};

export default FileUpload;
