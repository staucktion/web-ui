import { Box, Button, Card, CardActions, CardContent, CardMedia, CircularProgress, Grid, Modal, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import CronDto from "../../dto/cron/CronDto";
import PhotoDto from "../../dto/photo/PhotoDto";
import { cronEnum } from "../../enum/cronEnum";
import { webApiUrl } from "../../env/envVars";
import { useAuth } from "../../providers/AuthHook";
import { toastSuccess } from "../../util/toastUtil";
import PaymentPage from "../PaymentPage/PaymentPage";

const PendingPurchase: React.FC = () => {
	const { user } = useAuth();
	const [photos, setPhotos] = useState<PhotoDto[]>([]);
	const [selectedPhoto, setSelectedPhoto] = useState<PhotoDto | null>(null);
	const [loading, setLoading] = useState(true);
	const [cronInformation, setCronInformation] = useState<CronDto | null>(null);
	const [isPaymentModalOpen, setIsPaymentModalOpen] = useState<boolean>(false);

	const fetchPhotos = async () => {
		try {
			const res = await fetch(`${webApiUrl}/photos/my/pending-purchase`);
			if (!res.ok) throw new Error("Failed to fetch photos");
			const data: PhotoDto[] = await res.json();

			const formatted = data.map((p) => ({
				...p,
				file_path: `${webApiUrl}/photos/${p.id}`,
			}));

			setPhotos(formatted);
		} catch (err) {
			console.error(err);
		} finally {
			setLoading(false);
		}
	};

	const fetchCronInformations = async () => {
		try {
			const res = await fetch(`${webApiUrl}/crons`);
			if (!res.ok) throw new Error("Failed to fetch cron informations");
			const data: CronDto[] = await res.json();
			const tmpCronInformation = data.find((cron) => cron.id === cronEnum.PURCHASE_AFTER_AUCTION);
			if (tmpCronInformation) setCronInformation(tmpCronInformation);
		} catch (err) {
			console.error(err);
		} finally {
			setLoading(false);
		}
	};

	const init = () => {
		fetchPhotos();
		fetchCronInformations();
	};

	useEffect(() => {
		if (user) {
			init();
		}
	}, [user]);

	const handleOpenModal = (photo: PhotoDto) => {
		setSelectedPhoto(photo);
		setIsPaymentModalOpen(true);
	};
	const handleCloseModal = () => {
		setIsPaymentModalOpen(false);
	};

	const onPaymentSuccess = () => {
		toastSuccess("You successfully purchased photo!");
		init();
		setIsPaymentModalOpen(false);
	};

	if (loading) {
		return (
			<Box sx={{ display: "flex", justifyContent: "center", mt: 8 }}>
				<CircularProgress />
			</Box>
		);
	}

	return (
		<Box sx={{ p: 4, bgcolor: "#f5f5f5" }}>
			<Typography variant="h5" align="center" sx={{ mb: 4, color: "#333" }}>
				Photos available for your purchase
			</Typography>

			{photos.length === 0 ? (
				<Typography variant="h6" align="center" color="textSecondary">
					No photos available for purchase.
				</Typography>
			) : (
				<Grid container spacing={3}>
					{photos.map((photo) => (
						<Grid item xs={12} sm={6} md={4} key={photo.id}>
							<Card
								sx={{
									borderRadius: 2,
									boxShadow: 3,
									overflow: "hidden",
									transition: "transform 0.2s",
									"&:hover": { transform: "scale(1.03)", boxShadow: 6 },
								}}
							>
								{photo.file_path && <CardMedia component="img" image={photo.file_path} alt={photo.title || "Photo"} sx={{ height: 200, objectFit: "cover" }} />}
								<CardContent sx={{ bgcolor: "#fff" }}>
									<Typography variant="h6" component="div" sx={{ mb: 1, color: "#000" }}>
										{photo.title || "Untitled"}
									</Typography>
									<Typography variant="body2" color="textSecondary">
										Ready for purchase until {cronInformation?.next_trigger_time ? new Date(cronInformation.next_trigger_time).toLocaleString() : "N/A"}
									</Typography>
								</CardContent>
								<CardActions sx={{ justifyContent: "center", pb: 2, bgcolor: "#fff" }}>
									<Button
										variant="contained"
										size="medium"
										sx={{
											borderRadius: "20px",
											textTransform: "none",
											bgcolor: "#000",
											"&:hover": { bgcolor: "#333" },
										}}
										onClick={() => handleOpenModal(photo)}
									>
										Purchase
									</Button>
								</CardActions>
							</Card>
						</Grid>
					))}
				</Grid>
			)}

			{/* payment modal */}
			<Modal open={isPaymentModalOpen} onClose={handleCloseModal} slotProps={{ backdrop: { style: { backgroundColor: "rgba(0, 0, 0, 0.8)" } } }}>
				<div>
					<PaymentPage photo={selectedPhoto} action="purchaseAfterAuction" onClose={handleCloseModal} onSuccess={onPaymentSuccess} />
				</div>
			</Modal>
		</Box>
	);
};

export default PendingPurchase;
