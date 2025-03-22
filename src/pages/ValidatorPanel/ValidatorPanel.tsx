import React from "react";
import { Box, Typography } from "@mui/material";
import ValidatePhotos from "../../components/ValidatePhotos/ValidatePhotos";
import ValidateCategories from "../../components/ValidateCategories/ValidateCategories";

const ValidatorPanel: React.FC = () => {
	return (
		<Box
			sx={{
				minHeight: "100vh",
				padding: "40px 20px",
				background: "linear-gradient(135deg, #c3ec52 0%, #0ba29d 100%)",
			}}
		>
			<Typography variant="h3" align="center" gutterBottom sx={{ fontWeight: "bold", color: "#fff", mb: 4 }}>
				Validator Panel
			</Typography>

			<ValidatePhotos />
			<br />
			<br />
			<br />
			<ValidateCategories />
		</Box>
	);
};

export default ValidatorPanel;
