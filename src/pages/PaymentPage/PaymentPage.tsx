import React from "react";
import { Box, Typography, Button, Paper, TextField, Grid } from "@mui/material";
import PhotoDto from "../../dto/photo/PhotoDto";

interface PaymentPageProps {
	photo: PhotoDto;
	action: "purchaseNow" | "auctionBid";
	onClose: () => void;
}

const PaymentPage: React.FC<PaymentPageProps> = ({ photo, action, onClose }) => {
	const handlePayment = () => {
		console.log(`Payment for ${photo.id} with action ${action}`);
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
						<TextField label="Card Number" variant="outlined" fullWidth />
					</Grid>
					<Grid item xs={6}>
						<TextField label="Date" variant="outlined" fullWidth />
					</Grid>
					<Grid item xs={6}>
						<TextField label="CVV" variant="outlined" fullWidth />
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
