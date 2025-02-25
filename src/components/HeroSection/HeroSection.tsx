import React from "react";
import { Box, Typography, InputBase } from "@mui/material";
import HeroBackground from "../../../public/HeroBackground.jpg"
import Header from "../NavBar/NavBar";

const HeroSection: React.FC = () => {
  return (
    <Box
      sx={{
        position: "relative",
        backgroundImage: `url("${HeroBackground}")`,/** */
        backgroundSize: "cover",
        backgroundPosition: "center",
        height: "350px",
        width: "100%",
      }}
    >
    
      {/* Centered content */}
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          textAlign: "center",
          width: "100%",
          margin: 0,
        }}
      >
        <Typography
          variant="h5"
          sx={{
            color: "white",
          }}
        >
          The best stock photos shared by creators and travelers.
        </Typography>

        {/* Search box */}
        <Box
          sx={{
            marginTop: "16px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "#fff",
            borderRadius: "13px",
            boxShadow: "0 4px 6px rgb(211, 211, 211)",
            padding: "0.5rem 1rem",
            border: "1px solid #ccc",
            maxWidth: "400px",
            width: "80%",
            margin: "16px auto 0 auto",
          }}
        >
          <InputBase
            placeholder="Search for location"
            sx={{
              textAlign: "center",
              background: "transparent",
              border: "none",
              outline: "none",
              fontSize: "1rem",
              color: "rgb(211, 211, 211)",
              width: "200px",
            }}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default HeroSection;
