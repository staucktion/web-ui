import { Box, Button, Grid, Paper, TextField, Typography } from "@mui/material";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import PhotoDto from "../../dto/photo/PhotoDto";
import { webApiUrl } from "../../env/envVars";
import { useAuth } from "../../providers/AuthHook";
import redirectWithPost from "../../util/redirectWithPost";
import { toastError, toastSuccess, toastWarning } from "../../util/toastUtil";

interface PaymentPageProps {
	photo: PhotoDto | null;
	action: "purchaseNow" | "provision" | "purchaseAfterAuction" | "profit";
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
			navigate("/editprofile");
			return;
		}

		if (action === "purchaseNow") {
			try {
				const response = await fetch(`${webApiUrl}/banks/purchase/now/photo/${photo?.id}`, {
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
		} else if (action === "provision") {
			// alert("Implemented by Ahmet :D, thx for navigation :)");
			try {
				const response = await fetch(`${webApiUrl}/banks/approve-user`, {
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
					onSuccess();
				} else {
					const responseJson = await response.json();
					if (responseJson.message.toLowerCase().includes("missing fields")) toastError("Provision failed. Please fill in the missing fields.");
					else if (responseJson.message.toLowerCase().includes("not enough")) toastError("Provision failed. Insufficient balance to complete the transaction.");
					else if (responseJson.message.toLowerCase().includes("credentials")) toastError("Purchased failed. Invalid credentials.");
					else toastError(`Cannot make provision: ${responseJson.message}`);
				}
			} catch (error) {
				toastError("Failed to make provision. Check console for details.");
				console.error("Error make provision:", error);
			}
		} else if (action === "purchaseAfterAuction") {
			try {
				const response = await fetch(`${webApiUrl}/banks/purchase/auction/photo/${photo?.id}`, {
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
					onSuccess();
				} else {
					const responseJson = await response.json();
					if (responseJson.message.toLowerCase().includes("missing fields")) toastError("Provision failed. Please fill in the missing fields.");
					else if (responseJson.message.toLowerCase().includes("not enough")) toastError("Provision failed. Insufficient balance to complete the transaction.");
					else if (responseJson.message.toLowerCase().includes("credentials")) toastError("Purchased failed. Invalid credentials.");
					else toastError(`Cannot purchase photo: ${responseJson.message}`);
				}
			} catch (error) {
				toastError("Failed to purchase after auction. Check console for details.");
				console.error("Error purchase after auction:", error);
			}
		} else if (action === "profit") {
			try {
				const response = await fetch(`${webApiUrl}/banks/withdraw-profit`, {
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
				if (response.ok) onSuccess();
				else toastError(`Withdrawal was unsuccessful.`);
			} catch (error) {
				toastError(`Withdrawal was unsuccessful.`);
				console.error("Withdrawal was unsuccessful:", error);
			}
		}
	};

	return (
		<Box
			sx={{
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
					{action === "profit" ? "Withdraw" : "Payment"} Page
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
				</Grid>
				<Button
					variant="contained"
					color="success" // Yeşil renk
					fullWidth
					sx={{ mt: 3, py: 1.5 }}
					onClick={handlePayment}
				>
					{action === "profit" ? "Withdraw" : "Pay"}
				</Button>
				<Button variant="text" fullWidth sx={{ mt: 1 }} onClick={onClose}>
					Cancel
				</Button>
			</Paper>
		</Box>
	);
};

export default PaymentPage;
