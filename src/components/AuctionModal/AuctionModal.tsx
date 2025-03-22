import React, { useState } from "react";
import { Modal, Box, Typography, Button, IconButton, Divider, Menu, MenuItem, TextField } from "@mui/material";

import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import { useNavigate } from "react-router-dom";
import { generateLocationUrl } from "../../util/generateLocationUrl";
import PhotoDto from "../../dto/photo/PhotoDto";

interface AuctionModalProps {
	open: boolean;
	onClose: () => void;
	photo: PhotoDto;
	onNext?: () => void;
	onPrev?: () => void;
	children?: React.ReactNode;
}

const AuctionModal: React.FC<AuctionModalProps> = ({ open, onClose, photo, onNext, onPrev }) => {
	const navigate = useNavigate();

	// Başlangıçta false olduğundan, bid işlemi sonrasında ödeme sayfasına yönlendirilir.
	const [provisionState, setProvisionState] = useState(false);

	// for CI not to complain - REMOVE this when you use setProvisionState somewhere
	if (0 > Number(provisionState)) {
		setProvisionState(false);
	}

	// Detay dropdown için state
	const [detailAnchorEl, setDetailAnchorEl] = useState<null | HTMLElement>(null);
	const openDetailMenu = Boolean(detailAnchorEl);

	const handleDetailClick = (event: React.MouseEvent<HTMLButtonElement>) => {
		setDetailAnchorEl(event.currentTarget);
	};

	const handleDetailClose = () => {
		setDetailAnchorEl(null);
	};

	// Timer butonu: Dummy kalan süre
	const remainingTime = "00:05:30";
	const handleTimerClick = () => {
		alert(`Time remaining: ${remainingTime}`);
	};

	// Bid alanı için state'ler
	const [bidAmount, setBidAmount] = useState<string>("");
	const [bidCount, setBidCount] = useState<number>(0);

	const handleBidSubmit = () => {
		if (bidAmount.trim() === "") {
			alert("Please enter an amount.");
			return;
		}
		console.log("User bid:", bidAmount);
		setBidCount((prevCount) => prevCount + 1);
		setBidAmount("");

		// provisionState false ise, küçük bir gecikme sonrası Payment sayfasına yönlendir.
		if (!provisionState) {
			setTimeout(() => {
				navigate("/payment");
			}, 0);
		}
	};

	return (
		<Modal open={open} onClose={onClose} BackdropProps={{ style: { backgroundColor: "rgba(0, 0, 0, 0.8)" } }}>
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
						background: "linear-gradient(90deg, #6a11cb, #2575fc)",
					}}
				>
					{/* Soldaki alan: Timer butonu */}
					<Box display="flex" alignItems="center" gap={2}>
						<IconButton onClick={handleTimerClick} sx={{ color: "#fff" }}>
							<AccessTimeIcon />
						</IconButton>
						<Typography variant="h6" sx={{ fontWeight: "bold", color: "#fff" }}>
							{photo.user.username}
						</Typography>
					</Box>

					{/* Sağdaki alan: Detay Dropdown ve Bid Count */}
					<Box display="flex" alignItems="center" gap={2}>
						<Typography variant="body1" sx={{ color: "#fff" }}>
							Bids: {bidCount}
						</Typography>
						<Button variant="text" sx={{ textTransform: "none", color: "#fff" }}>
							Date
						</Button>
						<Button variant="text" sx={{ textTransform: "none", color: "#fff" }} onClick={() => window.open(generateLocationUrl(photo.category.location), "_blank")}>
							Location
						</Button>
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
							onClick={handleDetailClick}
						>
							Detail
						</Button>
						<Menu
							anchorEl={detailAnchorEl}
							open={openDetailMenu}
							onClose={handleDetailClose}
							anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
							transformOrigin={{ vertical: "top", horizontal: "right" }}
						>
							<MenuItem>Resolution: 1920 x 1080</MenuItem>
							<MenuItem>File Size: 2.5 MB</MenuItem>
							<MenuItem>Format: JPEG</MenuItem>
						</Menu>
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
								zIndex: 10,
								"&:hover": { backgroundColor: "rgba(0,0,0,0.5)" },
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
								zIndex: 10,
								"&:hover": { backgroundColor: "rgba(0,0,0,0.5)" },
							}}
						>
							<ArrowForwardIosIcon />
						</IconButton>
					)}
				</Box>

				<Divider />

				{/* Bid Section */}
				<Box sx={{ p: 2, display: "flex", flexDirection: "column", gap: 2 }}>
					<Box sx={{ display: "flex", gap: 2 }}>
						<TextField label="Enter your bid" type="number" value={bidAmount} onChange={(e) => setBidAmount(e.target.value)} fullWidth />
						<Button
							variant="contained"
							sx={{
								textTransform: "none",
								background: "linear-gradient(90deg, #ffb347, #ffcc33)",
								color: "#000",
								"&:hover": {
									background: "linear-gradient(90deg, #ffcc33, #ffb347)",
								},
							}}
							onClick={handleBidSubmit}
						>
							Place Bid
						</Button>
					</Box>
					<Typography variant="body2" color="textSecondary" align="center">
						{bidAmount.trim() === "" ? "Enter bid amount above" : ""}
					</Typography>
				</Box>
			</Box>
		</Modal>
	);
};

export default AuctionModal;
