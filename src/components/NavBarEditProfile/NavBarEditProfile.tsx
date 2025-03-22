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

const NavBarEditProfile: React.FC = () => {
  const navigate = useNavigate(); // Hook for navigation

  // Navigation functions
  const goToHome = () => {
    navigate("/");
  };

  const goToProfile = () => {
    navigate("/profile");
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
        <IconButton sx={{ color: "white", mr: 1 }} onClick={handleNotifications}>
          <NotificationsIcon />
        </IconButton>

        {/* Profile Button - White background */}
        <Button
          sx={{
            textTransform: "none",
            backgroundColor: "white",
            color: "black",
            borderRadius: "9999px",
            fontSize: "1rem",
            padding: "8px 20px",
            height: "45px",
            mr: 2, // Adds spacing between buttons
            "&:hover": {
              backgroundColor: "#f0f0f0",
            },
          }}
          onClick={goToProfile}
        >
          Profile
        </Button>

        {/* Home Button - White text only */}
        <Button
          sx={{
            textTransform: "none",
            color: "white",
            fontSize: "1rem",
            "&:hover": {
              textDecoration: "underline",
            },
          }}
          onClick={goToHome}
        >
          Home
        </Button>

        {/* Logout Button - White text only */}
        <Button
          sx={{
            textTransform: "none",
            color: "white",
            fontSize: "1rem",
            ml: 2, 
            "&:hover": {
              textDecoration: "underline",
            },
          }}
          onClick={handleLogout}
        >
          Logout
        </Button>
      </Toolbar>
    </AppBar>
  );
};

export default NavBarEditProfile;
