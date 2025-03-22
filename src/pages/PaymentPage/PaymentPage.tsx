import React, { useState } from "react";
import { Box, Typography, Button, Paper, TextField, Grid } from "@mui/material";
import PhotoDto from "../../dto/photo/PhotoDto";
import { toastSuccess, toastError } from "../../util/toastUtil";
import { toastWarning } from "../../util/toastUtil";
import { webApiUrl } from "../../env/envVars";
import { useAuth } from "../../providers/AuthContext";
import redirectWithPost from "../../util/redirectWithPost";
import { useNavigate } from "react-router-dom";

interface PaymentPageProps {
	photo: PhotoDto;
	action: "purchaseNow" | "auctionBid";
	onClose: () => void;
	onSuccess: () => void;
}

const PaymentPage: React.FC<PaymentPageProps> = ({ photo, action, onClose, onSuccess }) => {
	const { user } = useAuth();
	const navigate = useNavigate();

	const [cardNumber, setCardNumber] = useState("");
	const [expirationDate, setExpirationDate] = useState("");
	const [cvv, setCvv] = useState("");

	const handlePayment = async () => {
		if (!user) {
			redirectWithPost("/auth/google");
			return;
		}

		if (!user.tc_identity_no) {
			toastWarning("Please update your TC Identity Number first by editing your profile");
			navigate("/profile");
			return;
		}

		if (action === "purchaseNow") {
			try {
				const response = await fetch(`${webApiUrl}/banks/purchase/now/photo/${photo.id}`, {
					method: "POST",
					body: JSON.stringify({
						cardNumber,
						expirationDate,
						cvv,
					}),
					headers: {
						"Content-Type": "application/json",
					},
				});

				if (response.ok) {
					toastSuccess(`Your purchase has been approved! Please check your email for the purchase details.`);
					onSuccess();
				} else {
					toastError(`Failed to purchase photo: ${(await response.json()).message}`);
				}
			} catch (error) {
				toastError("Failed to purchase photo. Check console for details.");
				console.error("Error purchasing photo:", error);
			}
		} else {
			alert("TODO: Implement Ahmet :D");
		}
	};

	return (
		<Box
			sx={{
				backgroundImage: "url('https://source.unsplash.com/random/1600x900?abstract')",
				backgroundSize: "cover",
				backgroundPosition: "center",
				minHeight: "100vh",
				display: "flex",
				alignItems: "center",
				justifyContent: "center",
				p: 3,
			}}
		>
			<Paper
				elevation={10}
				sx={{
					maxWidth: 600,
					width: "100%",
					p: 4,
					borderRadius: 3,
					backgroundColor: "rgba(255,255,255,1)",
				}}
			>
				<Typography variant="h4" align="center" gutterBottom>
					Payment Page
				</Typography>
				<Typography variant="body1" align="center" sx={{ mb: 3 }}>
					Please Enter the Card Information.
				</Typography>
				<Grid container spacing={2}>
					<Grid item xs={12}>
						<TextField label="Card Number" variant="outlined" fullWidth value={cardNumber} onChange={(e) => setCardNumber(e.target.value)} />
					</Grid>
					<Grid item xs={6}>
						<TextField label="Date" variant="outlined" fullWidth value={expirationDate} onChange={(e) => setExpirationDate(e.target.value)} />
					</Grid>
					<Grid item xs={6}>
						<TextField label="CVV" variant="outlined" fullWidth value={cvv} onChange={(e) => setCvv(e.target.value)} />
					</Grid>
					<Grid item xs={12}>
						<TextField label="Name on the card" variant="outlined" fullWidth />
					</Grid>
				</Grid>
				<Button
					variant="contained"
					color="success" // Yeşil renk
					fullWidth
					sx={{ mt: 3, py: 1.5 }}
					onClick={handlePayment}
				>
					Pay
				</Button>
				<Button variant="text" fullWidth sx={{ mt: 1 }} onClick={onClose}>
					Cancel
				</Button>
			</Paper>
		</Box>
	);
};

export default PaymentPage;
