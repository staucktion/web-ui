import React from "react";
import { Box, Button, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

const LicensePage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Box sx={{ width: "100%", height: "100vh", display: "flex", flexDirection: "column" }}>
      {/* Üst toolbar */}
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", p: 2 }}>
        <Typography variant="h4" component="h1">
          Auction Rules / Müzayede Kuralları
        </Typography>
        <Button
          variant="contained"
          onClick={() => navigate("/")}
          sx={{ backgroundColor: "#000", color: "#fff", "&:hover": { backgroundColor: "#333" } }}
        >
          Back to Home
        </Button>
      </Box>

      {/* PDF görüntüleme */}
      <Box sx={{ flexGrow: 1, overflow: "hidden" }}>
        <iframe
          src="/staucktion-auction-requirements.pdf"
          title="Staucktion Auction Requirements"
          width="100%"
          height="100%"
          style={{ border: "none" }}
        />
      </Box>
    </Box>
  );
};

export default LicensePage;