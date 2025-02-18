import React from "react";
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
  // State for "Explore" dropdown
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleExploreClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleExploreClose = () => {
    setAnchorEl(null);
  };

  return (
    <AppBar
      position="static"
      color="transparent"
      elevation={0}
      sx={{
        color: "white", // Makes text/icons white
      }}
    >
      <Toolbar>
        {/* You can use a brand/logo here if you want */}
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
            textTransform: "none", // Keep normal text case
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

        {/* License (simple text button) */}
        <Button
          sx={{
            textTransform: "none",
            color: "white",
            mr: 1,
          }}
        >
          License
        </Button>

        {/* Overflow menu icon (the three dots) */}
        <IconButton
          sx={{ color: "white", mr: 1 }}
          onClick={() => alert("Overflow menu clicked!")}
        >
          <MoreVertIcon />
        </IconButton>

        {/* Join button (white background, black text, fully rounded) */}
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
        >
          Profile
        </Button>
      </Toolbar>
    </AppBar>
  );
};

export default NavBar;