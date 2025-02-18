import React from "react";
import { Box, Button, Typography } from "@mui/material";

const NavBarMiddle: React.FC = () => {
  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="center" // <-- This centers the items horizontally
      gap={3}
      sx={{
        marginTop: "40px",
      }}
    >
      {/* Home button (black background, white text) */}
      <Button
        variant="contained"
        sx={{
          backgroundColor: "#000",
          color: "#fff",
          borderRadius: "9999px",
          textTransform: "none",
          px: 3,
          "&:hover": {
            backgroundColor: "#333",
          },
        }}
      >
        Home
      </Button>

      <Typography
        variant="body1"
        sx={{
          color: "#555",
          cursor: "pointer",
          "&:hover": {
            color: "#000",
          },
        }}
      >
        Aucktions
      </Typography>

      <Typography
        variant="body1"
        sx={{
          color: "#555",
          cursor: "pointer",
          "&:hover": {
            color: "#000",
          },
        }}
      >
        Vote
      </Typography>

      <Typography
        variant="body1"
        sx={{
          color: "#555",
          cursor: "pointer",
          "&:hover": {
            color: "#012",
          },
        }}
      >
        Leader Board
      </Typography>
    </Box>
  );
};

export default NavBarMiddle;
