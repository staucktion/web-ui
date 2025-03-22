import React, { useState, useEffect } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Box, TextField, Typography, IconButton } from "@mui/material";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import PhotoDto from "../../dto/photo/PhotoDto";
import { webApiUrl } from "../../env/envVars.tsx";
import { toastError, toastSuccess } from "../../util/toastUtil";
interface PhotoPurchaseEditProps {
	open: boolean;
	photo: PhotoDto | null;
	onClose: () => void;
}

const PhotoPurchaseEdit: React.FC<PhotoPurchaseEditProps> = ({ open, photo, onClose }) => {
	const [editedPrice, setEditedPrice] = useState<number>(0);

	useEffect(() => {
		if (photo) {
			setEditedPrice(photo.purchase_now_price ?? 0);
		}
	}, [photo]);

	const handleSave = async () => {
		if (!photo) return;

		const response = await fetch(`${webApiUrl}/photos/${photo.id}/price`, {
			method: "POST",
			body: JSON.stringify({ price: editedPrice }),
			headers: {
				"Content-Type": "application/json",
			},
		});
		if (response.ok) {
			toastSuccess("Price updated successfully");
			photo.purchase_now_price = editedPrice;
			onClose();
		} else {
			toastError("Failed to update price: " + (await response.json()).message);
		}
	};

	const handleSetAuctionable = async () => {
		if (!photo) return;
		const response = await fetch(`${webApiUrl}/photos/${photo.id}/auctionable`, {
			method: "POST",
			body: JSON.stringify({ auctionable: true }),
			headers: {
				"Content-Type": "application/json",
			},
		});
		if (response.ok) {
			toastSuccess("Photo is set to auctionable");
			photo.is_auctionable = true;
			onClose();
		} else {
			toastError("Failed to set photo to auctionable: " + (await response.json()).message);
		}
	};

	// FOR NOT RENDERING
	if (!photo) return null;

	return (
		<Dialog
			open={open}
			onClose={onClose}
			fullWidth
			maxWidth="sm"
			PaperProps={{
				sx: {
					overflow: "visible",
					background: "linear-gradient(135deg, #f6d365 0%, #fda085 100%)",
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
				<MonetizationOnIcon />
				<Typography variant="h6" sx={{ flex: 1, fontWeight: "bold" }}>
					Purchase Edit
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
						Set a new purchase price for this photo:
					</Typography>
					<TextField
						label="Price"
						type="number"
						fullWidth
						value={editedPrice}
						onChange={(e) => setEditedPrice(Number(e.target.value))}
						sx={{
							backgroundColor: "#fff",
							borderRadius: 1,
						}}
					/>
				</Box>
			</DialogContent>

			<DialogActions
				sx={{
					justifyContent: "space-between",
					p: 2,
				}}
			>
				<Button onClick={onClose} color="inherit" sx={{ fontWeight: "bold" }}>
					Cancel
				</Button>
				<Button
					onClick={handleSetAuctionable}
					variant="contained"
					sx={{
						background: "linear-gradient(135deg, #9fd961 0%, #b6ff18 100%)",
						color: "#fff",
						fontWeight: "bold",
						"&:hover": {
							background: "linear-gradient(135deg, #b6ff18 0%, #9fd961 100%)",
						},
					}}
				>
					Set Photo Auctionable
				</Button>
				<Button
					variant="contained"
					sx={{
						background: "linear-gradient(135deg, #89f7fe 0%, #66a6ff 100%)",
						color: "#fff",
						fontWeight: "bold",
						"&:hover": {
							background: "linear-gradient(135deg, #66a6ff 0%, #89f7fe 100%)",
						},
					}}
					onClick={handleSave}
				>
					Save
				</Button>
			</DialogActions>
		</Dialog>
	);
};

export default PhotoPurchaseEdit;
