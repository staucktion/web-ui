import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import NotificationsIcon from "@mui/icons-material/Notifications"; 
import redirectWithPost from "../../util/redirectWithPost";
import { Box, Typography as MuiTypography } from "@mui/material";

const NavBarProfile: React.FC = () => {
  const navigate = useNavigate(); // Hook for navigation
  const [notificationsOpen, setNotificationsOpen] = useState(false); // State to toggle notifications panel

  // Navigation functions
  const goToHome = () => {
    navigate("/");
  };

  const handleLogout = () => {
    redirectWithPost("/auth/logout");
  };

  const handleNotifications = () => {
    setNotificationsOpen(!notificationsOpen); // Toggle the notifications panel visibility
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

        {/* Notifications Button */}
        <IconButton sx={{ color: "white", mr: 2 }} onClick={handleNotifications}>
          <NotificationsIcon />
        </IconButton>

        {/* Logout Button */}
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

        {/* Home Button */}
        <Button
          sx={{
            textTransform: "none",
            backgroundColor: "white",
            color: "black",
            borderRadius: "9999px",
            fontSize: "1rem",
            padding: "8px 20px",
            height: "45px",
            marginLeft: "auto", 
            "&:hover": {
              backgroundColor: "#f0f0f0",
            },
          }}
          onClick={goToHome}
        >
          Home
        </Button>
      </Toolbar>

      {/* Notifications Panel */}
      {notificationsOpen && (
        <Box
          sx={{
            position: "absolute",
            top: 56, // Adjusted to make sure it's below the AppBar
            right: 0,
            width: "300px", // Fixed width for the notification panel
            backgroundColor: "white",
            color: "black",
            padding: "16px",
            boxShadow: 3,
            zIndex: 10,
          }}
        >
          <MuiTypography variant="h6">Notifications</MuiTypography>
          <Box sx={{ marginTop: 2 }}>
            <MuiTypography variant="body2">You have a new notification!</MuiTypography>
            <MuiTypography variant="body2">Another notification is here.</MuiTypography>
          </Box>
        </Box>
      )}
    </AppBar>
  );
};

export default NavBarProfile;
