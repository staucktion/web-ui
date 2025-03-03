import React, { useState } from "react";
import { Box, Avatar, Typography, Button, Tabs, Tab } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import { useAuth } from "../../providers/AuthContext";
import getProfilePictureSrc from "../../util/getProfilePictureSrc";
const ProfilePage: React.FC = () => {
	const { user } = useAuth();

	const [selectedTab, setSelectedTab] = useState(0);

	const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
		setSelectedTab(newValue);
	};

	return (
		<Box
			sx={{
				display: "flex",
				flexDirection: "column",
				alignItems: "center",
				justifyContent: "flex-start",
				minHeight: "90vh",
				backgroundColor: "#fff",
				textAlign: "center",
				paddingTop: "40px",
			}}
		>
			{/* Profil Resmi */}
			<Avatar
				sx={{
					width: 120,
					height: 120,
					backgroundColor: "#E0E0E0",
					marginBottom: 1,
				}}
				src={user ? getProfilePictureSrc(user) ?? undefined : undefined}
			/>

			{/* Kullanıcı Adı */}
			<Typography variant="h4" fontWeight="bold" sx={{ marginBottom: 1 }}>
				{user?.username ?? "Guest User"}
			</Typography>

			{/* Profili Düzenle Butonu */}
			<Button
				variant="contained"
				startIcon={<EditIcon />}
				sx={{
					backgroundColor: "#4CAF50",
					color: "white",
					textTransform: "none",
					borderRadius: "20px",
					padding: "8px 16px",
					"&:hover": { backgroundColor: "#45A049" },
					marginBottom: "20px",
				}}
			>
				Edit Profile
			</Button>

			{/* Sekmeli Menü (Tabs) - Ortalandı */}
			<Box sx={{ width: "100%", display: "flex", justifyContent: "center", marginBottom: "20px" }}>
				<Tabs value={selectedTab} onChange={handleTabChange} variant="scrollable" scrollButtons="auto" sx={{ maxWidth: "600px" }}>
					<Tab
						label="Highlighted 0"
						sx={{
							color: selectedTab === 0 ? "white" : "black",
							backgroundColor: selectedTab === 0 ? "black" : "transparent",
							borderRadius: "20px",
							marginRight: "8px",
							padding: "8px 16px",
						}}
					/>
					<Tab
						label="Gallery 0"
						sx={{
							color: selectedTab === 1 ? "white" : "black",
							backgroundColor: selectedTab === 1 ? "black" : "transparent",
							borderRadius: "20px",
							marginRight: "8px",
							padding: "8px 16px",
						}}
					/>
					<Tab label="Statistics" sx={{ color: "black", marginRight: "8px", padding: "8px 16px" }} />
					<Tab label="Followers 0" sx={{ color: "black", marginRight: "8px", padding: "8px 16px" }} />
				</Tabs>
			</Box>

			{/* İçerik Alanı */}
			<Box sx={{ width: "100%", maxWidth: "800px", textAlign: "center" }}>
				{selectedTab === 0 && <Typography>Highlights Content...</Typography>}
				{selectedTab === 1 && <Typography>Gallery Content...</Typography>}
				{selectedTab === 2 && <Typography>Statistics Content...</Typography>}
				{selectedTab === 3 && <Typography>Followers Content...</Typography>}
			</Box>
		</Box>
	);
};

export default ProfilePage;
