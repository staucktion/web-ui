import React from "react";
import { useNavigate } from "react-router-dom";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { useAuth } from "../../providers/AuthContext.tsx";
import redirectWithPost from "../../util/redirectWithPost.ts";

const NavBar: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleExploreClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleExploreClose = () => {
    setAnchorEl(null);
  };

  // Profile sayfasına yönlendirme fonksiyonu
  const handleProfileButton = () => {
    if (!user) {
      redirectWithPost("/auth/google");
    } else {
      navigate("/profile");
    }
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
        <Typography
          variant="h6"
          sx={{
            cursor: "pointer",
            fontWeight: "bold",
            fontSize: "1.5rem",
          }}
          onClick={() => navigate("/")}
        >
          Staucktion
        </Typography>

        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          {/* Boşluk veya marka */}
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
            mr: 2,
            fontSize: "1.2rem",
            padding: "12px 25px",
            height: "50px",
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
          <MenuItem
            onClick={() => {
              handleExploreClose();
              navigate("/photos");
            }}
          >
            Photos
          </MenuItem>
          <MenuItem
            onClick={() => {
              handleExploreClose();
              navigate("/something");
            }}
          >
            Something
          </MenuItem>
          {/* ValidatorPanel menü öğesi */}
          <MenuItem
            onClick={() => {
              handleExploreClose();
              navigate("/validator"); // <-- ValidatorPanel sayfasına gider
            }}
          >
            ValidatorPanel
          </MenuItem>
        </Menu>

        {/* License */}
        <Button
          sx={{
            textTransform: "none",
            color: "white",
            mr: 2,
            fontSize: "1.2rem",
            padding: "12px 25px",
            height: "50px",
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

        {/* Profile Button */}
        <Button
          variant="contained"
          sx={{
            textTransform: "none",
            backgroundColor: "white",
            color: "black",
            borderRadius: "9999px",
            fontSize: "1rem",
            padding: "8px 20px",
            height: "45px",
            "&:hover": {
              backgroundColor: "#f0f0f0",
            },
          }}
          onClick={handleProfileButton}
        >
          {user ? "Profile" : "Login"}
        </Button>
      </Toolbar>
    </AppBar>
  );
};

export default NavBar;
