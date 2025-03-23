import React from "react";
import { useNavigate } from "react-router-dom";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import { useAuth } from "../../providers/AuthContext.tsx";
import redirectWithPost from "../../util/redirectWithPost.ts";
import { Modal, Box } from "@mui/material";

const CountdownModal: React.FC<{ open: boolean; onClose: () => void }> = ({ open, onClose }) => {
	const [timeLeft, setTimeLeft] = React.useState(300); // 5 dakika = 300 saniye

	React.useEffect(() => {
		if (!open) return;
		setTimeLeft(300); // Modal açıldığında geri sayımı sıfırla
		const interval = setInterval(() => {
			setTimeLeft((prev) => {
				if (prev <= 1) {
					clearInterval(interval);
					return 0;
				}
				return prev - 1;
			});
		}, 1000);
		return () => clearInterval(interval);
	}, [open]);

	const formatTime = (seconds: number) => {
		const m = Math.floor(seconds / 60);
		const s = seconds % 60;
		return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
	};

	return (
		<Modal open={open} onClose={onClose}>
			<Box
				sx={{
					position: "absolute",
					top: "50%",
					left: "50%",
					transform: "translate(-50%, -50%)",
					width: "500px", // Daha geniş kutu
					bgcolor: "background.paper",
					p: 6, // Daha geniş padding
					borderRadius: 2,
					boxShadow: 24,
					textAlign: "center",
				}}
			>
				<Typography variant="h4" gutterBottom>
					Geri Sayım
				</Typography>
				<Typography variant="h2" gutterBottom>
					{formatTime(timeLeft)}
				</Typography>
				<Button
					variant="contained"
					onClick={onClose}
					sx={{
						background: "linear-gradient(90deg, #ff0000, #ff4d4d)", // Gradient kırmızı
						color: "white",
						padding: "12px 24px",
						fontSize: "1.2rem",
						borderRadius: "8px",
						mt: 2,
						"&:hover": {
							background: "linear-gradient(90deg, #ff4d4d, #ff0000)",
						},
					}}
				>
					Kapat
				</Button>
			</Box>
		</Modal>
	);
};

const NavBar: React.FC = () => {
	const navigate = useNavigate();
	const { user } = useAuth();

	const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
	const open = Boolean(anchorEl);

	// Geri sayım modal'ının açık/kapalı durumunu yönetmek için state
	const [openCountdown, setOpenCountdown] = React.useState(false);

	const handleExploreClick = (event: React.MouseEvent<HTMLElement>) => {
		setAnchorEl(event.currentTarget);
	};

	const handleExploreClose = () => {
		setAnchorEl(null);
	};

	// Profile sayfasına yönlendirme
	const handleProfileButton = () => {
		if (!user) {
			redirectWithPost("/auth/google");
		} else {
			navigate("/profile");
		}
	};

	const getUserFirstLetters = (username: string): string => {
		return username
			.split(" ")
			.map((word) => word[0].toUpperCase())
			.join("");
	};
	return (
		<>
			<AppBar
				position="static"
				elevation={0}
				sx={{
					backgroundColor: "black",
					color: "white",
				}}
			>
				<Toolbar>
					{/* Saat simgesi: Modal'ı açmak için */}
					<IconButton onClick={() => setOpenCountdown(true)} sx={{ color: "white", mr: 1 }}>
						<AccessTimeIcon />
					</IconButton>
					<Typography
						variant="h6"
						sx={{
							cursor: "pointer",
							fontWeight: "bold",
							fontSize: "1.5rem",
						}}
						onClick={() => navigate("/")}
					>
						Staucktion
					</Typography>

					<Typography variant="h6" sx={{ flexGrow: 1 }}>
						{/* Boşluk veya marka */}
					</Typography>

					{/* Explore (Dropdown) */}
					<Button
						id="explore-button"
						aria-controls={open ? "explore-menu" : undefined}
						aria-haspopup="true"
						aria-expanded={open ? "true" : undefined}
						onClick={handleExploreClick}
						endIcon={<ExpandMoreIcon />}
						sx={{
							textTransform: "none",
							color: "white",
							mr: 2,
							fontSize: "1.2rem",
							padding: "12px 25px",
							height: "50px",
						}}
					>
						Explore
					</Button>
					<Menu id="explore-menu" anchorEl={anchorEl} open={open} onClose={handleExploreClose} MenuListProps={{ "aria-labelledby": "explore-button" }}>
						<MenuItem
							onClick={() => {
								handleExploreClose();
								navigate("/photos");
							}}
						>
							Photos
						</MenuItem>
						<MenuItem
							onClick={() => {
								handleExploreClose();
								navigate("/something");
							}}
						>
							Something
						</MenuItem>
						{user?.user_role?.role === "validator" && (
							<MenuItem
								onClick={() => {
									handleExploreClose();
									navigate("/validator");
								}}
							>
								Validator Panel
							</MenuItem>
						)}
					</Menu>

					{/* License */}
					<Button
						sx={{
							textTransform: "none",
							color: "white",
							mr: 2,
							fontSize: "1.2rem",
							padding: "12px 25px",
							height: "50px",
						}}
					>
						License
					</Button>

					{/* Overflow menü */}
					<IconButton sx={{ color: "white", mr: 1 }} onClick={() => alert("Overflow menu clicked!")}>
						<MoreVertIcon />
					</IconButton>

					{/* Profile Button */}
					<Button
						variant="contained"
						sx={{
							textTransform: "none",
							backgroundColor: "white",
							color: "black",
							borderRadius: "9999px",
							fontSize: "1rem",
							padding: "8px 20px",
							height: "45px",
							"&:hover": {
								backgroundColor: "#f0f0f0",
							},
						}}
						onClick={handleProfileButton}
					>
						{user ? getUserFirstLetters(user?.username) : "Login"}
					</Button>
				</Toolbar>
			</AppBar>
			{/* Geri Sayım Modal'ı */}
			<CountdownModal open={openCountdown} onClose={() => setOpenCountdown(false)} />
		</>
	);
};

export default NavBar;
