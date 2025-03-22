import React from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Box, Typography, IconButton } from "@mui/material";
import GavelIcon from "@mui/icons-material/Gavel";
import PhotoDto from "../../dto/photo/PhotoDto";
import { webApiUrl } from "../../env/envVars";
import { toastError, toastSuccess } from "../../util/toastUtil";
interface PhotoUnknownProps {
	open: boolean;
	photo: PhotoDto | null;
	onClose: () => void;
}

const PhotoUnknown: React.FC<PhotoUnknownProps> = ({ open, photo, onClose }) => {
	if (!photo) return null;

	const handleWithdrawFromAuction = async () => {
		const response = await fetch(`${webApiUrl}/photos/${photo.id}/auctionable`, {
			method: "POST",
			body: JSON.stringify({ auctionable: false }),
			headers: {
				"Content-Type": "application/json",
			},
		});
		if (response.ok) {
			toastSuccess("Photo is withdrawn from auction");
			photo.is_auctionable = false;
			onClose();
		} else {
			toastError("Failed to withdraw photo from auction");
		}
	};

	return (
		<Dialog
			open={open}
			onClose={onClose}
			fullWidth
			maxWidth="xs"
			PaperProps={{
				sx: {
					overflow: "visible",
					background: "linear-gradient(135deg, #c3ec52 0%, #0ba29d 100%)",
					borderRadius: 3,
				},
			}}
		>
			<DialogTitle
				sx={{
					display: "flex",
					alignItems: "center",
					gap: 1,
					color: "#fff",
				}}
			>
				<GavelIcon />
				<Typography variant="h6" sx={{ flex: 1, fontWeight: "bold" }}>
					Waiting for Auction
				</Typography>
				<IconButton onClick={onClose} sx={{ color: "#fff" }}>
					X
				</IconButton>
			</DialogTitle>

			<DialogContent>
				<Box
					sx={{
						textAlign: "center",
						p: 2,
						backgroundColor: "rgba(255, 255, 255, 0.2)",
						borderRadius: 2,
					}}
				>
					<img
						src={photo.file_path}
						alt={`Photo ${photo.id}`}
						style={{
							width: "100%",
							marginBottom: "20px",
							borderRadius: "8px",
							boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
						}}
					/>
					<Typography variant="body1" sx={{ mb: 2, color: "#fff" }}>
						This photo is currently waiting for auction.
					</Typography>
				</Box>
			</DialogContent>

			<DialogActions
				sx={{
					justifyContent: "space-between",
					p: 2,
				}}
			>
				<Button onClick={onClose} color="inherit" sx={{ fontWeight: "bold" }}>
					Close
				</Button>
				<Button
					variant="contained"
					color="error"
					sx={{
						fontWeight: "bold",
					}}
					onClick={handleWithdrawFromAuction}
				>
					Do not Attend Auction
				</Button>
			</DialogActions>
		</Dialog>
	);
};

export default PhotoUnknown;
