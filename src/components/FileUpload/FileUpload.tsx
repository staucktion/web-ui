import React, { useState, useEffect } from "react";
import { Box, Modal, Typography } from "@mui/material";
import "../../styles/Styles.css";
import EmailButtons from "../EmailButtons/EmailButtons.tsx";
import { webApiUrl } from "../../env/envVars.tsx";
import { useAuth } from "../../providers/AuthContext.tsx";
import PhotoDto from "../../dto/photo/PhotoDto.ts";
import redirectWithPost from "../../util/redirectWithPost.ts";
import getPhotoSrc from "../../util/getPhotoSrc.ts";
import { useNavigate } from "react-router-dom";
import { toastWarning, toastSuccess, toastError } from "../../util/toastUtil.ts";

const FileUpload: React.FC = () => {
	const { user } = useAuth();
	const navigate = useNavigate();

	const [watermarkedImages, setWatermarkedImages] = useState<PhotoDto[]>([]);
	const [selectedImage, setSelectedImage] = useState<PhotoDto | null>(null);
	const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

	const fetchWatermarkedImages = async () => {
		try {
			const response = await fetch(`${webApiUrl}/photos`);
			if (!response.ok) {
				throw new Error("Failed to fetch photos");
			}
			const data: PhotoDto[] = await response.json();
			data.forEach((img) => (img.file_path = getPhotoSrc(img)));
			setWatermarkedImages(data);
		} catch (err) {
			console.error(err);
		}
	};

	useEffect(() => {
		fetchWatermarkedImages();
	}, []);

	const sendApproveMail = async (img: PhotoDto) => {
		if (!user) {
			redirectWithPost("/auth/google");
			return;
		}

		if (!user.tc_identity_no) {
			toastWarning("Please update your TC Identity Number first by editing your profile");
			navigate("/profile");
			return;
		}

		try {
			const response = await fetch(`${webApiUrl}/mail/send`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					photoId: img.id,
					action: "Approve Purchase",
				}),
				credentials: "include",
			});

			if (!response.ok) {
				const errorText = await response.text();
				throw new Error(`Failed to send mail. Status: ${response.status}, Message: ${errorText}`);
			}

			toastSuccess(`Purchase approved mail sent successfully to ${user.email}!`);
			setSelectedImage(null);
			setIsModalOpen(false);
			fetchWatermarkedImages(); // refresh list of available images
		} catch (error) {
			console.error("Error sending mail:", error);
			toastError("Failed to send mail. Check console for details.");
		}
	};

	const handleImageClick = (img: PhotoDto) => {
		setSelectedImage(img);
		setIsModalOpen(true);
	};

	const handleCloseModal = () => {
		setSelectedImage(null);
		setIsModalOpen(false);
	};

	return (
		<div className="container">
			<div>
				{watermarkedImages.length > 0 ? (
					<div className="imageGrid">
						{watermarkedImages.map((img, index) => (
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
					<img src={selectedImage?.file_path || ""} alt="Selected" className="modalImage" />
					<EmailButtons onApprove={() => selectedImage && sendApproveMail(selectedImage)} />
				</Box>
			</Modal>
		</div>
	);
};

export default FileUpload;
