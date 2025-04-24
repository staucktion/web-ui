import React from "react";
import { AppBar, Toolbar, Typography, Box } from "@mui/material";
import { SecondaryButton } from "../SecondaryButton/SecondaryButton.styled";
import redirectWithPost from "../../util/redirectWithPost";
import { useAuth } from "../../providers/AuthHook";

const Header: React.FC = () => {
	const { user } = useAuth();

	const handleLogin = () => {
		redirectWithPost("/auth/google");
	};


	const handleLogout = () => {
		redirectWithPost("/auth/logout");
	};

	return (
		<AppBar position="static">
			<Toolbar>
				<Box sx={{ flexGrow: 1 }}>
					<Typography variant="h6" component="div">
						Frontend Dashboard
					</Typography>
				</Box>
				{!user ? <SecondaryButton onClick={handleLogin}>Login</SecondaryButton> : <SecondaryButton onClick={handleLogout}>Logout</SecondaryButton>}
			</Toolbar>
		</AppBar>
	);
};

export default Header;
