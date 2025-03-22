import React from "react";
import { Box, Button, Typography } from "@mui/material";
import useRequireAuth from "../../Hooks/useRequireAuth";
import CustomModal from "../CustomModal/CustomModal";

interface NavBarMiddleProps {
	onAuctionClick: () => void;
	onPurchasablePhotosClick: () => void;
	onVoteClick: () => void;
	onCategoriesClick: () => void;
}

const NavBarMiddle: React.FC<NavBarMiddleProps> = ({ onAuctionClick, onPurchasablePhotosClick, onVoteClick, onCategoriesClick }) => {
	const { open, requireAuth, handleClose, handleLogin } = useRequireAuth();

	return (
		<>
			<Box display="flex" alignItems="center" justifyContent="center" gap={4} sx={{ marginTop: "40px" }}>
				{/* Purchase (Siyah Buton) */}
				<Button
					variant="contained"
					sx={{
						backgroundColor: "#000",
						color: "#fff",
						borderRadius: "9999px",
						textTransform: "none",
						fontSize: "1.2rem",
						padding: "15px 30px",
						height: "55px",
						"&:hover": { backgroundColor: "#333" },
					}}
					onClick={() => requireAuth(() => onPurchasablePhotosClick())}
				>
					Purchase
				</Button>

				{/* Auction (Metin) */}
				<Typography
					variant="body1"
					sx={{
						color: "#555",
						cursor: "pointer",
						fontSize: "1.2rem",
						"&:hover": { color: "#000" },
					}}
					onClick={() => requireAuth(() => onAuctionClick())}
				>
					Auction
				</Typography>

				{/* Vote (Metin) */}
				<Typography
					variant="body1"
					sx={{
						color: "#555",
						cursor: "pointer",
						fontSize: "1.2rem",
						"&:hover": { color: "#000" },
					}}
					onClick={() => requireAuth(() => onVoteClick())}
				>
					Vote
				</Typography>

				{/* Categories (Metin) */}
				<Typography
					variant="body1"
					sx={{
						color: "#555",
						cursor: "pointer",
						fontSize: "1.2rem",
						"&:hover": { color: "#000" },
					}}
					onClick={() => requireAuth(() => onCategoriesClick())}
				>
					Categories
				</Typography>
			</Box>

			{/* Giriş (Login) Modal'ı */}
			<CustomModal open={open} title="Login or Register?" onClose={handleClose} onConfirm={handleLogin} confirmText="Login with Google" />
		</>
	);
};

export default NavBarMiddle;
