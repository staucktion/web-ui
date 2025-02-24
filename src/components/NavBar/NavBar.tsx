import React from "react";
import { useNavigate } from "react-router-dom"; // ✅ Sayfa yönlendirme için import edildi
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import MoreVertIcon from "@mui/icons-material/MoreVert";

const NavBar: React.FC = () => {
  const navigate = useNavigate();

 
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleExploreClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleExploreClose = () => {
    setAnchorEl(null);
  };

  // Profile sayfasına yönlendirme fonksiyonu
  const goToProfile = () => {
    navigate("/profile");
  };

  return (
    <AppBar
      position="static"
      elevation={0}
      sx={{
        backgroundColor: "black",
        color: "white",
      }}
    >
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          {/* Brand or empty space */}
        </Typography>

        {/* Explore (Dropdown) */}
        <Button
          id="explore-button"
          aria-controls={open ? "explore-menu" : undefined}
          aria-haspopup="true"
          aria-expanded={open ? "true" : undefined}
          onClick={handleExploreClick}
          endIcon={<ExpandMoreIcon />}
          sx={{
            textTransform: "none",
            color: "white",
            mr: 1,
          }}
        >
          Explore
        </Button>
        <Menu
          id="explore-menu"
          anchorEl={anchorEl}
          open={open}
          onClose={handleExploreClose}
          MenuListProps={{ "aria-labelledby": "explore-button" }}
        >
          <MenuItem onClick={handleExploreClose}>Photos</MenuItem>
          <MenuItem onClick={handleExploreClose}>Something</MenuItem>
          <MenuItem onClick={handleExploreClose}>Something Else</MenuItem>
        </Menu>

        {/* License */}
        <Button
          sx={{
            textTransform: "none",
            color: "white",
            mr: 1,
          }}
        >
          License
        </Button>

        {/* Overflow menu */}
        <IconButton
          sx={{ color: "white", mr: 1 }}
          onClick={() => alert("Overflow menu clicked!")}
        >
          <MoreVertIcon />
        </IconButton>

        {/* Profile Button (Yönlendirme eklenmiş hali) */}
        <Button
          variant="contained"
          sx={{
            textTransform: "none",
            backgroundColor: "white",
            color: "black",
            borderRadius: "9999px",
            "&:hover": {
              backgroundColor: "#f0f0f0",
            },
          }}
          onClick={goToProfile} 
        >
          Profile
        </Button>
      </Toolbar>
    </AppBar>
  );
};

export default NavBar;
