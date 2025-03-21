import React, { useState } from "react";
import { Modal, Box, Typography, Button, IconButton, Divider, Menu, MenuItem } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import PhotoDto from "../../dto/photo/PhotoDto";
import getPhotoDetails from "../../util/getPhotoDetails";
import { generateLocationUrl } from "../../util/generateLocationUrl";

interface PhotoDetailModalProps {
	open: boolean;
	onClose: () => void;
	photo: PhotoDto;
	onNext?: () => void;
	onPrev?: () => void;
	children?: React.ReactNode;
}

const PhotoDetailModal: React.FC<PhotoDetailModalProps> = ({ open, onClose, photo, onNext, onPrev, children }) => {
	// Detail dropdown için state
	const [detailAnchorEl, setDetailAnchorEl] = useState<null | HTMLElement>(null);
	const [photoDetails, setPhotoDetails] = useState<{ resolution: string; file_size_mb: number; file_format: string } | null>(null);
	const openDetailMenu = Boolean(detailAnchorEl);

	const handleDetailClick = (event: React.MouseEvent<HTMLButtonElement>) => {
		setDetailAnchorEl(event.currentTarget);
		getPhotoDetails(photo).then((details) => {
			setPhotoDetails(details);
		});
	};

	const handleDetailClose = () => {
		setDetailAnchorEl(null);
	};

	// Swipe (kaydırma) için kendi mantığımızı yazıyoruz.
	const [touchStartX, setTouchStartX] = useState<number | null>(null);
	const minSwipeDistance = 50; // Minimum kaydırma mesafesi

	const onTouchStartHandler = (e: React.TouchEvent<HTMLDivElement>) => {
		setTouchStartX(e.touches[0].clientX);
	};

	const onTouchEndHandler = (e: React.TouchEvent<HTMLDivElement>) => {
		if (touchStartX === null) return;
		const touchEndX = e.changedTouches[0].clientX;
		const distance = touchStartX - touchEndX;
		if (distance > minSwipeDistance && onNext) {
			onNext();
		} else if (distance < -minSwipeDistance && onPrev) {
			onPrev();
		}
		setTouchStartX(null);
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
					}}
				>
					{/* Soldaki alan */}
					<Box display="flex" alignItems="center" gap={2}>
						<IconButton onClick={onClose}>
							<CloseIcon />
						</IconButton>
						<Typography variant="h6" sx={{ fontWeight: "bold" }}>
							{photo.user.username}
						</Typography>
					</Box>

					{/* Sağdaki alan: Dropdown "Detail" */}
					<Box display="flex" alignItems="center" gap={2}>
						<Button variant="text" sx={{ textTransform: "none" }}>
							Date
						</Button>
						<Box display="flex" alignItems="center" gap={1}>
							<Typography variant="body1">{photo.vote_count} Likes</Typography>
							<IconButton color="error" aria-label="like">
								<FavoriteBorderIcon />
							</IconButton>
						</Box>
						<Button variant="text" sx={{ textTransform: "none" }} onClick={() => window.open(generateLocationUrl(photo), "_blank")}>
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
							<MenuItem>Resolution: {photoDetails?.resolution}</MenuItem>
							<MenuItem>File Size: {photoDetails?.file_size_mb.toFixed(2)} MB</MenuItem>
							<MenuItem>Format: {photoDetails?.file_format}</MenuItem>
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
					onTouchStart={onTouchStartHandler}
					onTouchEnd={onTouchEndHandler}
				>
					{/* Geri Ok */}
					{onPrev && (
						<IconButton
							onClick={onPrev}
							sx={{
								position: "absolute",
								left: 16,
								color: "#fff",
								backgroundColor: "rgba(0,0,0,0.3)",
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

					{/* İleri Ok */}
					{onNext && (
						<IconButton
							onClick={onNext}
							sx={{
								position: "absolute",
								right: 16,
								color: "#fff",
								backgroundColor: "rgba(0,0,0,0.3)",
								"&:hover": { backgroundColor: "rgba(0,0,0,0.5)" },
							}}
						>
							<ArrowForwardIosIcon />
						</IconButton>
					)}
				</Box>

				{/* Fiyat Bilgisi */}
				<Box sx={{ textAlign: "center", padding: "16px 0" }}>
					<Typography variant="h6" sx={{ fontWeight: "bold" }}>
						Price: ${photo.purchase_now_price}
					</Typography>
				</Box>

				{/* Alt Kısım: children (ör. EmailButtons vb.) */}
				{children && <Box sx={{ p: 2 }}>{children}</Box>}
			</Box>
		</Modal>
	);
};

export default PhotoDetailModal;
