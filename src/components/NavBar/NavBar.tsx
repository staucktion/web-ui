import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import AppBar from "@mui/material/AppBar";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import React from "react";
import { useNavigate } from "react-router-dom";
import useRequireAuth from "../../Hooks/useRequireAuth";
import UserDto from "../../dto/user/UserDto";
import { useAuth } from "../../providers/AuthHook";
import { checkUserRole } from "../../util/checkUserRole";
import CustomModal from "../CustomModal/CustomModal";

const NavBar: React.FC = () => {
	const navigate = useNavigate();
	const { user } = useAuth();

	const { open: authOpen, requireAuth, handleClose, handleLogin } = useRequireAuth();

	const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
	const menuOpen = Boolean(anchorEl);

	const handleExploreClick = (e: React.MouseEvent<HTMLElement>) => setAnchorEl(e.currentTarget);
	const handleExploreClose = () => setAnchorEl(null);

	const getDisplayName = (u: UserDto) =>
		checkUserRole(u, "validator", true)
			? "Vld"
			: checkUserRole(u, "admin", true)
			? "Adm"
			: u.username
					.split(" ")
					.map((w) => w[0].toUpperCase())
					.join("");

	const handleProfileButton = () => {
		navigate("/profile");
	};

	return (
		<>
			<AppBar position="static" elevation={0} sx={{ bgcolor: "black", color: "white" }}>
				<Toolbar>
					{/* Logo */}
					<Typography variant="h6" sx={{ flexGrow: 1, cursor: "pointer", fontWeight: "bold", fontSize: "1.5rem" }} onClick={() => navigate("/")}>
						Staucktion
					</Typography>

					{/* License */}
					<Button sx={{ textTransform: "none", color: "white", mr: 2 }} onClick={() => navigate("/license")}>
						License
					</Button>

					{/* Admin/Validator dropdown */}
					{(checkUserRole(user, "admin") || checkUserRole(user, "validator")) && (
						<>
							<Button
								id="control-panel-button"
								aria-controls={menuOpen ? "control-panel-menu" : undefined}
								aria-haspopup="true"
								aria-expanded={menuOpen ? "true" : undefined}
								onClick={handleExploreClick}
								endIcon={<ExpandMoreIcon />}
								sx={{ textTransform: "none", color: "white", mr: 2 }}
							>
								Control Panel
							</Button>
							<Menu anchorEl={anchorEl} open={menuOpen} onClose={handleExploreClose} MenuListProps={{ "aria-labelledby": "control-panel-button" }}>
								{checkUserRole(user, "validator") && (
									<MenuItem
										onClick={() => {
											handleExploreClose();
											navigate("/validator");
										}}
									>
										Validator Panel
									</MenuItem>
								)}
								{checkUserRole(user, "admin") && (
									<MenuItem
										onClick={() => {
											handleExploreClose();
											navigate("/admin");
										}}
									>
										Admin Panel
									</MenuItem>
								)}
							</Menu>
						</>
					)}

					{user ? (
						<Button
							variant="contained"
							onClick={handleProfileButton}
							sx={{
								textTransform: "none",
								backgroundColor: "white",
								color: "black",
								borderRadius: "9999px",
								fontSize: "1rem",
								px: 3,
								py: 1,
								"&:hover": { backgroundColor: "#f0f0f0" },
							}}
						>
							{getDisplayName(user)}
						</Button>
					) : (
						<Button
							variant="contained"
							onClick={() => requireAuth(() => navigate("/profile"))}
							sx={{
								textTransform: "none",
								backgroundColor: "white",
								color: "black",
								borderRadius: "9999px",
								fontSize: "1rem",
								px: 3,
								py: 1,
								"&:hover": { backgroundColor: "#f0f0f0" },
							}}
						>
							Login
						</Button>
					)}
				</Toolbar>
			</AppBar>

			{/* Login / Register Modal */}
			<CustomModal
				open={authOpen}
				title="Login or Register?"
				onClose={handleClose}
				onPrimary={handleLogin}
				primaryText="Login with Google"
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

export default NavBar;
