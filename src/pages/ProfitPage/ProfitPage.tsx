import { Box, Button, CircularProgress, Modal, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import ProfitResponseDto from "../../dto/profit/ProfitResponseDto";
import { webApiUrl } from "../../env/envVars";
import { toastSuccess } from "../../util/toastUtil";
import PaymentPage from "../PaymentPage/PaymentPage";

const ProfitPage: React.FC = () => {
	const [profit, setProfit] = useState<number>(0);
	const [loading, setLoading] = useState<boolean>(true);
	const [isPaymentModalOpen, setIsPaymentModalOpen] = useState<boolean>(false);

	useEffect(() => {
		init();
	}, []);

	const init = async () => {
		setLoading(true);
		fetchProfit();
		setLoading(false);
	};

	const fetchProfit = async () => {
		try {
			const response = await fetch(`${webApiUrl}/profits/own`);
			if (!response.ok) {
				throw new Error("Failed to fetch profit");
			}
			const data: ProfitResponseDto = await response.json();
			setProfit(data.profitAmount);
		} catch (error) {
			console.error("Error fetch profit:", error);
		}
	};

	const handleWithdraw = async () => {
		setIsPaymentModalOpen(true);
	};

	const onPaymentSuccess = () => {
		toastSuccess("Withdrawal was successful.");
		init();
		setIsPaymentModalOpen(false);
	};

	const handleCloseModal = () => {
		setIsPaymentModalOpen(false);
		init();
	};

	return (
		<Box sx={{ p: 4, bgcolor: "#f5f5f5" }}>
			<Typography variant="h6" color="textSecondary" align="center" mb={3}>
				You can withdraw money from the profit you make by selling photos and voting on photos that were auctioned based on your vote.
			</Typography>

			{loading ? (
				<Box display="flex" justifyContent="center" mt={3}>
					<CircularProgress />
				</Box>
			) : (
				<Box textAlign="center" mt={3}>
					{profit > 0 ? (
						<>
							<Typography variant="h5">Profit: ${profit}</Typography>
							<Button
								variant="contained"
								color="primary"
								onClick={handleWithdraw}
								sx={{ mt: 2, borderRadius: "20px", textTransform: "none", bgcolor: "#000", "&:hover": { bgcolor: "#333" } }}
							>
								Withdraw
							</Button>
						</>
					) : (
						<Typography variant="h6" align="center" color="textSecondary">
							No profit available.
						</Typography>
					)}
				</Box>
			)}

			{/* payment modal */}
			<Modal open={isPaymentModalOpen} onClose={handleCloseModal} slotProps={{ backdrop: { style: { backgroundColor: "rgba(0, 0, 0, 0.8)" } } }}>
				<div>
					<PaymentPage photo={null} action="profit" onClose={handleCloseModal} onSuccess={onPaymentSuccess} />
				</div>
			</Modal>
		</Box>
	);
};

export default ProfitPage;
