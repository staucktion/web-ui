import React, { useState } from "react";
import { Container, Paper, Typography, Avatar, Box, TextField, Button } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import { useAuth } from "../../providers/AuthContext";
import NavBarEditProfile from "../../components/NavBarEditProfile/NavBarEditProfile";
import { webApiUrl } from "../../env/envVars";
import { toastError } from "../../util/toastUtil";
import { toastSuccess } from "../../util/toastUtil";

const EditProfilePage: React.FC = () => {
	const { user } = useAuth();
	const [username, setUsername] = useState(user?.username || "");
	const [identityNumber, setIdentityNumber] = useState(user?.tc_identity_no || "");

	const handleSave = async () => {
		const formData = new FormData();

		if (username !== user?.username) {
			formData.append("username", username);
		}
		if (identityNumber && identityNumber !== user?.tc_identity_no) {
			formData.append("tc_identity_no", identityNumber);
		}

		if (Array.from(formData.keys()).length === 0) {
			toastError("No changes to save");
			return;
		}

		const response = await fetch(`${webApiUrl}/users/profile`, {
			method: "PUT",
			body: formData,
		});
		if (response.ok) {
			toastSuccess("Profile updated successfully");
		} else {
			toastError("Failed to update profile: " + (await response.json()).message);
		}
	};

	return (
		<>
			<NavBarEditProfile />
			<Container
				sx={{
					display: "flex",
					flexDirection: "column",
					alignItems: "center",
					justifyContent: "center",
					minHeight: "90vh",
					paddingTop: "40px",
					backgroundColor: "#f4f4f4",
				}}
			>
				<Paper
					elevation={3}
					sx={{
						padding: "40px",
						borderRadius: "12px",
						backgroundColor: "white",
						width: "100%",
						maxWidth: "800px",
						textAlign: "center",
					}}
				>
					<Avatar
						sx={{
							width: 150,
							height: 150,
							backgroundColor: "#E0E0E0",
							margin: "0 auto 20px auto",
						}}
					>
						{username ? username.charAt(0).toUpperCase() : "U"} {/* ✅ Avatar Updates */}
					</Avatar>
					<Typography variant="h4" fontWeight="bold" sx={{ marginBottom: 2 }}>
						{username || "User"} {/* ✅ Display Live Updated Username */}
					</Typography>
					<Box
						component="form"
						sx={{
							display: "flex",
							flexDirection: "column",
							gap: 2,
							marginTop: 2,
						}}
						noValidate
						autoComplete="off"
					>
						{/* Editable Username */}
						<TextField label="Username" variant="outlined" value={username} onChange={(e) => setUsername(e.target.value)} fullWidth />

						{/* Read Only Email */}
						<TextField label="Email" variant="outlined" value={user?.email} fullWidth InputProps={{ readOnly: true }} />

						{/* If user hasn't set National Identity Number before, allow them to set one. If not, show Read-Only National Identity Number */}
						{user?.tc_identity_no ? (
							<TextField label="National Identity Number" variant="outlined" value={identityNumber} fullWidth InputProps={{ readOnly: true }} />
						) : (
							<TextField label="National Identity Number" variant="outlined" value={identityNumber} onChange={(e) => setIdentityNumber(e.target.value)} fullWidth />
						)}

						<Button
							variant="contained"
							startIcon={<EditIcon />}
							onClick={handleSave}
							sx={{
								backgroundColor: "#4CAF50",
								color: "white",
								borderRadius: "20px",
								marginTop: "20px",
								"&:hover": { backgroundColor: "#45A049" },
							}}
						>
							Save Changes
						</Button>
					</Box>
				</Paper>
			</Container>
		</>
	);
};

export default EditProfilePage;
