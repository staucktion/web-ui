import { Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import PhotoDto from "../../dto/photo/PhotoDto";
import { webApiUrl } from "../../env/envVars";
import useRequireAuth from "../../Hooks/useRequireAuth";
import { useAuth } from "../../providers/AuthHook";
import "../../styles/Styles.css";
import { toastInfo } from "../../util/toastUtil";
import CustomModal from "../CustomModal/CustomModal";
import VoteModal from "../VoteModal/VoteModal";

const Vote: React.FC = () => {
	const { socket } = useAuth();
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

	const listenWsToFinishVote = () => {
		// ws implementation
		if (socket) {
			const roomName = `vote`;
			console.log(`[INFO] WS: joining room: ${roomName}`);
			socket.emit("joinRoom", roomName);

			// socket.onAny((event, ...args) => {
			// 	console.log(`[INFO] Coming ws message, Event: ${event}`, args);
			// });

			socket.on(`vote`, async () => {
				await fetchPhotosToVote();
				leaveRoom();
				setIsModalOpen(false);
				toastInfo("Voting is over.");
			});
		}
	};

	const leaveRoom = (): void => {
		if (socket) {
			const roomName = `vote`;
			socket.emit("leaveRoom", roomName);
			socket.off(roomName);
			// socket.offAny();
			console.log(`[INFO] WS: leaving room: ${roomName}`);
		}
	};

	useEffect(() => {
		fetchPhotosToVote();
	}, []);

	const handleImageClick = (img: PhotoDto) => {
		requireAuth(() => {
			listenWsToFinishVote();
			setSelectedPhoto(img);
			setIsModalOpen(true);
		});
	};

	const handleCloseModal = () => {
		leaveRoom();
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
