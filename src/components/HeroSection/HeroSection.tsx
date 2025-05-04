import React, { useState } from "react";
import { Box, Typography, InputBase} from "@mui/material";
import CustomModal from "../CustomModal/CustomModal";
import HeroBackground from "/HeroBackground.jpg";
import useRequireAuth from "../../Hooks/useRequireAuth";
import { useNavigate } from "react-router-dom";

interface HeroSectionProps {
  onCategorySearch: (categoryName: string) => void;
}

const HeroSection: React.FC<HeroSectionProps> = ({ onCategorySearch }) => {
  const { open, requireAuth, handleClose, handleLogin } = useRequireAuth();
  const navigate = useNavigate();
  const [searchValue, setSearchValue] = useState("");

  return (
    <>
      <Box
        sx={{
          position: "relative",
          backgroundImage: `url("${HeroBackground}")`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          height: 550,
          width: "100%",
          cursor: "pointer",
        }}
        onClick={() => requireAuth()}
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            textAlign: "center",
            width: "90%",
            maxWidth: "none",  
            mx: "auto",
          }}
        >
          <Typography
            variant="h5"
            noWrap                 
            sx={{
              color: "#fff",
              mb: 2,
              whiteSpace: "nowrap", 
            }}
          >
            The best stock photos shared by creators and travelers.
          </Typography>

          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              bgcolor: "#fff",
              borderRadius: 2,
              p: "0.5rem 1rem",
              boxShadow: 1,
              border: "1px solid #ccc",
              width: "100%",         
              maxWidth: 500,        
              mx: "auto",            
            }}
          >
            <InputBase
              placeholder="Search"
              fullWidth
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  const trimmed = searchValue.trim(); // ← boşlukları sil
              
                  if (trimmed) {
                    requireAuth(() => {
                      onCategorySearch(trimmed);
                    });
                  }
                }
              }}
              sx={{ textAlign: "center" }}
            />
          </Box>
        </Box>
      </Box>

      <CustomModal
        open={open}
        title="Login or Register?"
        onClose={handleClose}

        // Login with Google 
        onPrimary={handleLogin}
        primaryText="Login with Google"

        // Register
        onSecondary={() => {
          handleClose();
          navigate("/register");
        }}
        secondaryText="Register"
        simpleLoginText="Simple Login" 
        
        onSimpleLogin={() => {
          handleClose();
          navigate("/login"); 
        }}
      />
    </>
  );
};

export default HeroSection;
