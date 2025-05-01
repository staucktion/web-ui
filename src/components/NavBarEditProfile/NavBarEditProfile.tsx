import AppBar from "@mui/material/AppBar";
import Button from "@mui/material/Button";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import React from "react";
import { useNavigate } from "react-router-dom";
import redirectWithPost from "../../util/redirectWithPost";

const NavBarEditProfile: React.FC = () => {
	const navigate = useNavigate(); // Hook for navigation

	// Navigation functions
	const goToHome = () => {
		navigate("/");
	};

	const goToProfile = () => {
		navigate("/profile");
	};

	const handleLogout = () => {
		redirectWithPost("/auth/logout");
	};

	return (
		<AppBar
			position="static"
			elevation={0}
			sx={{
				backgroundColor: "#222",
				color: "white",
			}}
		>
			<Toolbar>
				{/* Logo / Title */}
				<Typography variant="h6" sx={{ flexGrow: 1, cursor: "pointer" }} onClick={goToHome}>
					Staucktion
				</Typography>

				{/* Home Button - White text only */}
				<Button
					sx={{
						textTransform: "none",
						color: "white",
						fontSize: "1rem",
						"&:hover": {
							textDecoration: "underline",
						},
					}}
					onClick={goToHome}
				>
					Home
				</Button>

				{/* Logout Button - White text only */}
				<Button
					sx={{
						textTransform: "none",
						color: "white",
						fontSize: "1rem",
						padding: "8px 20px",
						ml: 2,
						"&:hover": {
							textDecoration: "underline",
						},
					}}
					onClick={handleLogout}
				>
					Logout
				</Button>

				{/* Profile Button - White background */}
				<Button
					sx={{
						textTransform: "none",
						backgroundColor: "white",
						color: "black",
						borderRadius: "9999px",
						fontSize: "1rem",
						padding: "8px 20px",
						height: "45px",
						mr: 2, // Adds spacing between buttons
						"&:hover": {
							backgroundColor: "#f0f0f0",
						},
					}}
					onClick={goToProfile}
				>
					Profile
				</Button>
			</Toolbar>
		</AppBar>
	);
};

export default NavBarEditProfile;
