import AccessTimeIcon from "@mui/icons-material/AccessTime";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { Box, Button, Divider, IconButton, Modal, Typography } from "@mui/material";
import React from "react";
import { toast } from "react-toastify";
import CronDto from "../../dto/cron/CronDto";
import PhotoDto from "../../dto/photo/PhotoDto";
import { cronEnum } from "../../enum/cronEnum";
import { webApiUrl } from "../../env/envVars";
import { generateLocationUrl } from "../../util/generateLocationUrl";
import { toastError, toastSuccess } from "../../util/toastUtil";

interface VoteModalProps {
	open: boolean;
	onClose: () => void;
	photo: PhotoDto;
	onNext?: () => void;
	onPrev?: () => void;
	children?: React.ReactNode;
}

const fetchCron = async (): Promise<CronDto | null> => {
	const responseCrons = await fetch(`${webApiUrl}/crons`);
	if (!responseCrons.ok) throw new Error("Failed to fetch cron data");
	const cronsData: CronDto[] = await responseCrons.json();
	const cronData = cronsData.find((cron) => cron.id === cronEnum.VOTE);
	if (cronData) return cronData;
	return null;
};

const handleTimerClick = async () => {
	const now = new Date();
	const cron = await fetchCron();
	if (cron?.next_trigger_time) {
		const finishTime = new Date(cron.next_trigger_time);
		const remainingTimeInMillis = finishTime.getTime() - now.getTime();
		const remainingTimeInSeconds = Math.max(Math.floor(remainingTimeInMillis / 1000), 0); // 👈 always >= 0
		const remainingTimeInMinutes = Math.floor(remainingTimeInSeconds / 60);
		const remainingTimeInHours = Math.floor(remainingTimeInMinutes / 60);
		const remainingTimeInDays = Math.floor(remainingTimeInHours / 24);
		const remainingSeconds = remainingTimeInSeconds % 60;
		const parts = [];
		if (remainingTimeInDays > 0) parts.push(`${remainingTimeInDays} days`);
		if (remainingTimeInHours % 24 > 0) parts.push(`${remainingTimeInHours % 24} hours`);
		if (remainingTimeInMinutes % 60 > 0) parts.push(`${remainingTimeInMinutes % 60} minutes`);
		parts.push(`${remainingSeconds} seconds`);
		const timeRemaining = parts.join(" ");
		toast(`Time remaining: ${timeRemaining}`);
	}
};

const VoteModal: React.FC<VoteModalProps> = ({ open, onClose, onNext, onPrev, photo }) => {
	const handleVote = async () => {
		const response = await fetch(`${webApiUrl}/votes/${photo.id}`, {
			method: "POST",
			credentials: "include",
		});

		if (response.ok) {
			toastSuccess("Voted successfully");
		} else {
			toastError("Failed to vote: " + (await response.json()).message);
		}
	};

	return (
		<Modal
			open={open}
			onClose={onClose}
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
					width: "90vw",
					maxWidth: 1200,
					height: "90vh",
					bgcolor: "#fff",
					borderRadius: 2,
					boxShadow: 24,
					display: "flex",
					flexDirection: "column",
					outline: "none",
				}}
			>
				{/* Üst Kısım */}
				<Box
					sx={{
						display: "flex",
						alignItems: "center",
						justifyContent: "space-between",
						py: 1,
						px: 2,
						background: "linear-gradient(90deg, #ff69b4, #1e90ff)",
					}}
				>
					{/* Soldaki alan */}
					<Box display="flex" alignItems="center" gap={2}>
						<IconButton onClick={handleTimerClick} sx={{ color: "#fff" }}>
							<AccessTimeIcon />
						</IconButton>
						<Typography variant="h6" sx={{ fontWeight: "bold", color: "#fff" }}>
							{photo.user.username}
						</Typography>
					</Box>

					{/* Sağdaki alan */}
					<Box display="flex" alignItems="center" gap={2}>
						<Button
							variant="text"
							sx={{
								textTransform: "none",
								background: "linear-gradient(90deg, #ff69b4, #1e90ff)",
								color: "#fff",
								"&:hover": {
									background: "linear-gradient(90deg, #ff85c0, #1eaaff)",
								},
							}}
							onClick={() => window.open(generateLocationUrl(photo.category.location), "_blank")}
						>
							Location
						</Button>
					</Box>
				</Box>

				<Divider />

				{/* Orta Kısım: Fotoğraf + Oklar */}
				<Box
					sx={{
						flex: 1,
						display: "flex",
						position: "relative",
						alignItems: "center",
						justifyContent: "center",
						overflow: "hidden",
					}}
				>
					{onPrev && (
						<IconButton
							onClick={onPrev}
							sx={{
								position: "absolute",
								left: 16,
								color: "#fff",
								backgroundColor: "rgba(0,0,0,0.3)",
								"&:hover": { backgroundColor: "rgba(0,0,0,0.5)" },
								zIndex: 10,
							}}
						>
							<ArrowBackIosNewIcon />
						</IconButton>
					)}

					<img
						src={photo.file_path}
						alt="detail"
						style={{
							display: "block",
							maxWidth: "90%",
							maxHeight: "90%",
							objectFit: "contain",
						}}
					/>

					{onNext && (
						<IconButton
							onClick={onNext}
							sx={{
								position: "absolute",
								right: 16,
								color: "#fff",
								backgroundColor: "rgba(0,0,0,0.3)",
								"&:hover": { backgroundColor: "rgba(0,0,0,0.5)" },
								zIndex: 10,
							}}
						>
							<ArrowForwardIosIcon />
						</IconButton>
					)}
				</Box>

				{/* Alt Kısım */}
				<Divider />
				<Box sx={{ p: 2, display: "flex", justifyContent: "center" }}>
					<Button
						variant="contained"
						sx={{
							textTransform: "none",
							background: "linear-gradient(90deg, #ff69b4, #1e90ff)",
							color: "#fff",
							"&:hover": {
								background: "linear-gradient(90deg, #ff85c0, #1eaaff)",
							},
						}}
						onClick={handleVote}
					>
						Vote
					</Button>
				</Box>
			</Box>
		</Modal>
	);
};

export default VoteModal;
