import AccessTimeIcon from "@mui/icons-material/AccessTime";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { Box, Button, Divider, IconButton, Menu, MenuItem, Modal, TextField, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import AuctionPhotoDto from "../../dto/auctionPhoto/AuctionPhotoDto";
import BidResponseDto from "../../dto/bid/BidResponseDto";
import PhotoDto from "../../dto/photo/PhotoDto";
import { StatusEnum } from "../../enum/statusEnum";
import { webApiUrl } from "../../env/envVars";
import PaymentPage from "../../pages/PaymentPage/PaymentPage";
import { useAuth } from "../../providers/AuthHook";
import { generateLocationUrl } from "../../util/generateLocationUrl";
import { toastError, toastSuccess, toastWarning } from "../../util/toastUtil";

interface AuctionModalProps {
	open: boolean;
	onClose: () => void;
	photo: PhotoDto;
	onNext?: () => void;
	onPrev?: () => void;
}

const AuctionModal: React.FC<AuctionModalProps> = ({ open, onClose, photo, onNext, onPrev }) => {
	const { user, socket } = useAuth();
	const [auctionPhoto, setAuctionPhoto] = useState<AuctionPhotoDto | null>(null);
	const [lastBidAmount, setLastBidAmount] = useState<number>(0);
	const [bidAmount, setBidAmount] = useState<number>(0);
	const [isProvisionModalOpen, setIsProvisionModalOpen] = useState(false);
	const [bidCount, setBidCount] = useState<number>(0);
	const [isLastBidBelongToCurrentUser, setIsLastBidBelongToCurrentUser] = useState<boolean>(false);

	useEffect(() => {
		let dataAuctionPhoto: AuctionPhotoDto;
		let myPhotos: PhotoDto[];
		const init = async () => {
			try {
				dataAuctionPhoto = await fetchAuctionPhotoData();
				myPhotos = await fetchMyPhotos();

				// ws implementation
				if (socket) {
					const roomName = `auction_photo_id_${dataAuctionPhoto?.id}`;
					console.log(`[INFO] WS: joining room: ${roomName}`);
					socket.emit("joinRoom", roomName);

					socket.on(`new_bid`, (bidMessage: BidResponseDto & { room: string }) => {
						if (bidMessage?.room === roomName) {
							fetchAuctionPhotoData();
						}
					});

					socket.on(`finish_auction`, (message: { aucitonPhoto: AuctionPhotoDto; room: string }) => {
						onClose();

						if (message?.room === roomName) {
							if (user?.id === message.aucitonPhoto.winner_user_id_1) toastSuccess("Congratulations! You won the auction, make payment to photo as soon as possible to buy it.");
							else if (user?.id === message.aucitonPhoto.winner_user_id_2)
								toast("You are the second winner. If the first winner does not purchase the photo from the auction, you would buy it.");
							else if (user?.id === message.aucitonPhoto.winner_user_id_3)
								toast("You are the third winner. If the second winner does not purchase the photo from the auction, you would buy it.");
							else if (!myPhotos.some((photo) => photo.id === dataAuctionPhoto.photo_id)) toastWarning("You did not win the auction.");
							else toastWarning("Auction is over.");
						}
					});
				}
			} catch (err) {
				console.error(err);
			}
		};

		init();

		// Cleanup function
		return () => {
			// console.log("component unmount, will leave the ws room");
			if (socket && dataAuctionPhoto) {
				const roomName = `auction_photo_id_${dataAuctionPhoto.id}`;
				socket.emit("leaveRoom", roomName);
				console.log(`[INFO] WS: leaving room: ${roomName}`);
			}
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const fetchAuctionPhotoData = async (): Promise<AuctionPhotoDto> => {
		const responseAuctionPhoto = await fetch(`${webApiUrl}/auctions/photos/${photo.id}`);
		if (!responseAuctionPhoto.ok) {
			throw new Error("Failed to fetch auction photo");
		}
		const dataAuctionPhoto = await responseAuctionPhoto.json();

		const responseBid = await fetch(`${webApiUrl}/bids/${dataAuctionPhoto.id}`);
		if (!responseBid.ok) {
			throw new Error("Failed to fetch auction photo");
		}
		const dataBid: BidResponseDto[] = await responseBid.json();

		setAuctionPhoto(dataAuctionPhoto);
		setLastBidAmount(dataAuctionPhoto.last_bid_amount);
		setBidAmount(dataAuctionPhoto.last_bid_amount + 100);
		setBidCount(dataBid.length);

		dataBid?.sort((b, a) => a.bid_amount - b.bid_amount);
		if (dataBid?.[0]?.user_id === user?.id) setIsLastBidBelongToCurrentUser(true);
		else setIsLastBidBelongToCurrentUser(false);

		return dataAuctionPhoto;
	};

	const fetchMyPhotos = async (): Promise<PhotoDto[]> => {
		const responseMyPhotos = await fetch(`${webApiUrl}/photos/my/all`);
		if (!responseMyPhotos.ok) throw new Error("Failed to fetch photo data");
		const myPhotos: PhotoDto[] = await responseMyPhotos.json();
		return myPhotos;
	};

	const handleBidSubmit = async () => {
		if (user?.id === photo.user_id) {
			toast("Photo is belong to you, you cannot place bid to your photo.");
			return;
		}

		if (user?.status_id !== StatusEnum.ACTIVE) {
			toastWarning("You need to make provision before place a bid.");
			setIsProvisionModalOpen(true);
			return;
		}

		if (bidAmount == null) {
			toastError("Please enter an amount!");
			return;
		}

		if (bidAmount <= lastBidAmount) {
			toastError("Current bid is lower than last bid amount!");
			return;
		}

		try {
			const response = await fetch(`${webApiUrl}/bids/${photo?.id}`, {
				method: "POST",
				body: JSON.stringify({
					bidAmount,
				}),
				headers: {
					"Content-Type": "application/json",
				},
			});

			if (response.ok) {
				toastSuccess(`Bid placed successfully with an amount of ${bidAmount}.`);
			} else {
				toastError(`Failed to place a bid: ${(await response.json()).message}`);
			}
		} catch (error) {
			toastError("Failed to bid. Check console for details.");
			console.error("Failed to bid:", error);
		}
	};

	const onProvisionSuccess = () => {
		toastSuccess("Provision completed successfully. You can now place a bid.");
		if (user) user.status_id = StatusEnum.ACTIVE;
		setIsProvisionModalOpen(false);
	};

	const onProvisionClose = () => {
		toastError("You need to make provision before place a bid.");
		setIsProvisionModalOpen(false);
	};

	// Detay dropdown için state
	const [detailAnchorEl, setDetailAnchorEl] = useState<null | HTMLElement>(null);
	const openDetailMenu = Boolean(detailAnchorEl);

	const handleDetailClick = (event: React.MouseEvent<HTMLButtonElement>) => {
		setDetailAnchorEl(event.currentTarget);
	};

	const handleDetailClose = () => {
		setDetailAnchorEl(null);
	};

	const handleTimerClick = () => {
		const now = new Date();
		if (auctionPhoto?.finish_time) {
			const finishTime = new Date(auctionPhoto?.finish_time);
			const remainingTimeInMillis = finishTime.getTime() - now.getTime();
			const remainingTimeInSeconds = Math.floor(remainingTimeInMillis / 1000);
			const remainingTimeInMinutes = Math.floor(remainingTimeInSeconds / 60);
			const remainingTimeInHours = Math.floor(remainingTimeInMinutes / 60);
			const remainingTimeInDays = Math.floor(remainingTimeInHours / 24);
			const remainingSeconds = remainingTimeInSeconds % 60;
			const timeRemaining = `${remainingTimeInDays} days ${remainingTimeInHours % 24} hours ${remainingTimeInMinutes % 60} minutes ${remainingSeconds} seconds.`;
			toast(`Time remaining: ${timeRemaining}`);
		}
	};

	return (
		<>
			{/* payment modal */}
			<Modal open={isProvisionModalOpen} onClose={onClose} slotProps={{ backdrop: { style: { backgroundColor: "rgba(0, 0, 0, 0.8)" } } }}>
				<div>
					<PaymentPage photo={null} action="provision" onClose={onProvisionClose} onSuccess={onProvisionSuccess} />
				</div>
			</Modal>

			{/* bid modal */}
			<Modal open={open} onClose={onClose} slotProps={{ backdrop: { style: { backgroundColor: "rgba(0, 0, 0, 0.8)" } } }}>
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
								{photo.user?.username}
							</Typography>
						</Box>
						<Box display="flex" alignItems="center" gap={2}>
							<Typography variant="h6" sx={{ fontWeight: "bold", color: "#fff" }}>
								{bidCount === 0 ? "Initial Price" : "Last Bid"} {isLastBidBelongToCurrentUser ? "From You" : ""}: {lastBidAmount} ₺
							</Typography>
						</Box>

						{/* Sağdaki alan: Detay Dropdown ve Bid Count */}
						<Box display="flex" alignItems="center" gap={2}>
							<Typography variant="body1" sx={{ color: "#fff" }}>
								Bids: {bidCount}
							</Typography>

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
								<MenuItem>Title: {photo.title}</MenuItem>
								<MenuItem>Vote Count: {photo.vote_count}</MenuItem>
								<MenuItem>Device Info: {photo.device_info}</MenuItem>
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
							<TextField
								label="Enter your bid"
								type="number"
								value={bidAmount}
								onChange={(e) => {
									const newBidAmount = Number(e.target.value) || 0;
									if (newBidAmount >= 0) {
										setBidAmount(newBidAmount);
									}
								}}
								fullWidth
							/>
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
								{user?.status_id !== StatusEnum.ACTIVE ? "Make Provision Before Bid" : "Place Bid"}
							</Button>
						</Box>
						<Typography variant="body2" color="textSecondary" align="center">
							{bidAmount === 0 ? "Enter bid amount above" : ""}
						</Typography>
					</Box>
				</Box>
			</Modal>
		</>
	);
};

export default AuctionModal;
