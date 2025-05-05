import { Box, Typography,Button } from "@mui/material";
import React from "react";
import SystemSettings from "../../components/SystemSettings/SystemSettings";
import AdminUsers from "../../components/AdminUsers/AdminUsers";
import EndedAuctions from "../../components/EndedAuctions/EndedAuctions";
import { useNavigate } from "react-router-dom";


const AdminPanel: React.FC = () => {
  const navigate = useNavigate();
	return (
		<Box sx={{ backgroundColor: "#000", color: "#fff", pt: 5, px: 5, minHeight: "100vh", position: "relative" }}>
      <Button
        variant="contained"
        sx={{
          position: "absolute",
          top: 20,
          right: 20, 
          background: "linear-gradient(135deg, #555 0%, #888 100%)",
          color: "#fff",
          fontWeight: "bold",
          "&:hover": {
            background: "linear-gradient(135deg, #888 0%, #555 100%)",
          },
        }}
        onClick={() => navigate("/home")}
      >
        Back to Homepage
      </Button>
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
          Finished Photos
        </Typography>
        <EndedAuctions />
      </Box>
    </Box>
	);
};

export default AdminPanel;
