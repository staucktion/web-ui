import { Box, Typography } from "@mui/material";
import React from "react";
import SystemSettings from "../../components/SystemSettings/SystemSettings";
import AdminUsers from "../../components/AdminUsers/AdminUsers";
import EndedAuctions from "../../components/EndedAuctions/EndedAuctions";

const AdminPanel: React.FC = () => {
	return (
		<Box sx={{ backgroundColor: "#000", color: "#fff", pt: 5, px: 5 }}>
      <Typography variant="h3" gutterBottom>
        Admin Panel
      </Typography>

      <SystemSettings />

      <Box sx={{ mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          Users
        </Typography>
        <AdminUsers />
      </Box>

      <Box sx={{ mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          Ended Auctions
        </Typography>
        <EndedAuctions />
      </Box>
    </Box>
	);
};

export default AdminPanel;
