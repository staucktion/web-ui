import { Box } from "@mui/material";
import React, { useState } from "react";
import useRequireAuth from "../../Hooks/useRequireAuth";
import CustomModal from "../CustomModal/CustomModal";
import CustomNavButton from "../CustomNavButton/CustomNavButton";
import { useAuth } from "../../providers/AuthHook";
import { useNavigate } from "react-router-dom";

interface NavBarMiddleProps {
	onAuctionClick: () => void;
	onPurchasablePhotosClick: () => void;
	onVoteClick: () => void;
	onCategoriesClick: () => void;
}

const NavBarMiddle: React.FC<NavBarMiddleProps> = ({ onAuctionClick, onPurchasablePhotosClick, onVoteClick, onCategoriesClick }) => {
	const { user } = useAuth();
	const { open, requireAuth, handleClose, handleLogin } = useRequireAuth();
	const [activeTab, setActiveTab] = useState<string>(user === null ? "" : "purchase");
	const navigate = useNavigate();

	const handleClick = (tab: string, action: () => void) => {
		requireAuth(() => {
			setActiveTab(tab);
			action();
		});
	};

	return (
		<>
			<Box display="flex" alignItems="center" justifyContent="center" gap={4} sx={{ marginTop: "40px" }}>
				<CustomNavButton isActive={activeTab === "purchase"} onClick={() => handleClick("purchase", onPurchasablePhotosClick)}>
					Purchase
				</CustomNavButton>
				<CustomNavButton isActive={activeTab === "categories"} onClick={() => handleClick("categories", onCategoriesClick)}>
					Categories
				</CustomNavButton>
				<CustomNavButton isActive={activeTab === "vote"} onClick={() => handleClick("vote", onVoteClick)}>
					Vote
				</CustomNavButton>
				<CustomNavButton isActive={activeTab === "auction"} onClick={() => handleClick("auction", onAuctionClick)}>
					Auction
				</CustomNavButton>
			</Box>

			{/* Login Modal */}
			<CustomModal
				open={open}
				title="Login or Register?"
				onClose={handleClose}
				// Login with Google
				onPrimary={handleLogin}
				primaryText="Login with Google"
				// Register
				onSecondary={() => {
					handleClose();
					navigate("/register");
				}}
				secondaryText="Register"
				simpleLoginText="Login"
				onSimpleLogin={() => {
					handleClose();
					navigate("/login");
				}}
			/>
		</>
	);
};

export default NavBarMiddle;
