import React from "react";
import { useNavigate } from "react-router-dom"; 
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import MoreVertIcon from "@mui/icons-material/MoreVert";

const NavBarProfile: React.FC = () => {
  const navigate = useNavigate(); //Sayfa yönlendirme için hook

  // Ana sayfaya yönlendirme fonksiyonu
  const goToHome = () => {
    navigate("/");
  };

  return (
    <AppBar
      position="static"
      elevation={0}
      sx={{
        backgroundColor: "#222", //
        color: "white",
      }}
    >
      <Toolbar>
        {/**/}
        <Typography variant="h6" sx={{ flexGrow: 1, cursor: "pointer" }} onClick={goToHome}>
          Staucktion
        </Typography>

        {/* Overflow Menu */}
        <IconButton
          sx={{ color: "white", mr: 1 }}
          onClick={() => alert("Overflow menu clicked!")}
        >
          <MoreVertIcon />
        </IconButton>

        {/* Ana Sayfaya Git Butonu */}
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
          onClick={goToHome} //
        >
          Home
        </Button>
      </Toolbar>
    </AppBar>
  );
};

export default NavBarProfile;
