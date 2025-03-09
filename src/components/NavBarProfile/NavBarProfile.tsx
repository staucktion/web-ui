import React from "react";
import { useNavigate } from "react-router-dom";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import NotificationsIcon from "@mui/icons-material/Notifications"; 
import redirectWithPost from "../../util/redirectWithPost";

const NavBarProfile: React.FC = () => {
  const navigate = useNavigate(); // Hook for navigation

  // Navigation functions
  const goToHome = () => {
    navigate("/");
  };

  const handleLogout = () => {
    redirectWithPost("/auth/logout");
  };

  const handleNotifications = () => {
    alert("Notifications clicked!"); // Replace with actual notification logic
  };

  return (
    <AppBar
      position="static"
      elevation={0}
      sx={{
        backgroundColor: "#222",
        color: "white",
      }}
    >
      <Toolbar>
        {/* Logo / Title */}
        <Typography
          variant="h6"
          sx={{ flexGrow: 1, cursor: "pointer" }}
          onClick={goToHome}
        >
          Staucktion
        </Typography>

        {/* Overflow Menu */}
        <IconButton
          sx={{ color: "white", mr: 1 }}
          onClick={() => alert("Overflow menu clicked!")}
        >
          <MoreVertIcon />
        </IconButton>

        {/* Notifications Button - White text only */}
        <IconButton sx={{ color: "white", mr: 2 }} onClick={handleNotifications}>
          <NotificationsIcon />
        </IconButton>

        {/* Logout Button - White text only */}
        <Button
          sx={{
            textTransform: "none",
            color: "white",
            fontSize: "1rem",
            mr: 2, 
            "&:hover": {
              textDecoration: "underline",
            },
          }}
          onClick={handleLogout}
        >
          Logout
        </Button>

        {/* Home Button - Moved to the right */}
        <Button
          sx={{
            textTransform: "none",
            backgroundColor: "white",
            color: "black",
            borderRadius: "9999px",
            fontSize: "1rem",
            padding: "8px 20px",
            height: "45px",
            marginLeft: "auto", // Moves Home button to the far right
            "&:hover": {
              backgroundColor: "#f0f0f0",
            },
          }}
          onClick={goToHome}
        >
          Home
        </Button>
      </Toolbar>
    </AppBar>
  );
};

export default NavBarProfile;
