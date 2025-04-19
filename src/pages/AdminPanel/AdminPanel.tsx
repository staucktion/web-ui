import { Box, Typography } from "@mui/material";
import React from "react";
import SystemSettings from "../../components/SystemSettings/SystemSettings";
import AdminUsers from "../../components/AdminUsers/AdminUsers";

const AdminPanel: React.FC = () => {
	return (
		<Box sx={{ backgroundColor: "#000", color: "#fff", pt: 5, px: 5 }}>
			<Typography variant="h3" gutterBottom>
				Admin Panel
			</Typography>
			<SystemSettings />
			<br />
			<AdminUsers />
		</Box>
	);
};

export default AdminPanel;
