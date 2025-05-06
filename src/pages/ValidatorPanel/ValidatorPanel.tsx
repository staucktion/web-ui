import React from "react";
import { Box, Typography, Button } from "@mui/material";
import ValidatePhotos from "../../components/ValidatePhotos/ValidatePhotos";
import ValidateCategories from "../../components/ValidateCategories/ValidateCategories";
import { useNavigate } from "react-router-dom";



const ValidatorPanel: React.FC = () => {
	 const navigate = useNavigate();
	return (
		<Box
			sx={{
				minHeight: "100vh",
				padding: "40px 20px",
				background: "linear-gradient(135deg, #c3ec52 0%, #0ba29d 100%)",
			}}
		>
			<Button
				variant="contained"
				sx={{
				position: "absolute",
				top: 20,
				right: 20,
				background: "linear-gradient(135deg, #89f7fe 0%, #66a6ff 100%)",
				color: "#fff",
				fontWeight: "bold",
				boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.3)",
				transition: "box-shadow 0.3s ease, transform 0.3s ease",
				"&:hover": {
					background: "linear-gradient(135deg, #66a6ff 0%, #89f7fe 100%)",
					boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.5)",
					transform: "translateY(-2px)",
				},
				}}
				onClick={() => navigate("/home")}
			>
				Back to Homepage
			</Button>


			<Typography variant="h3" align="center" gutterBottom sx={{ fontWeight: "bold", color: "#fff", mb: 4 }}>
				Validator Panel
			</Typography>

			<ValidateCategories />
			<br />
			<br />
			<br />
			<ValidatePhotos />
		</Box>
	);
};

export default ValidatorPanel;
