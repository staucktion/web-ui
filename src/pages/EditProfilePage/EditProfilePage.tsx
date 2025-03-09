import React, { useState } from "react";
import {
  Container,
  Paper,
  Typography,
  Avatar,
  Box,
  TextField,
  Button,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import { useAuth } from "../../providers/AuthContext";
import NavBarEditProfile from "../../components/NavBarEditProfile/NavBarEditProfile";

const EditProfilePage: React.FC = () => {
  const { user } = useAuth();
  const [username, setUsername] = useState(user?.username || ""); // ✅ Editable
  const [email, setEmail] = useState(user?.email || ""); // ✅ Editable

  const dummyNationalId = "12345678901"; // Dummy National Identity Number (Read-only)

  const handleSave = () => {
    alert(`Saved!
New Username: ${username}
New Email: ${email}`);
    
    // If updating user context:
    // updateUser({ username, email });

    // If sending an API request:
    // fetch("/api/update-profile", { method: "POST", body: JSON.stringify({ username, email }) });
  };

  return (
    <>
      <NavBarEditProfile />
      <Container
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "90vh",
          paddingTop: "40px",
          backgroundColor: "#f4f4f4",
        }}
      >
        <Paper
          elevation={3}
          sx={{
            padding: "40px",
            borderRadius: "12px",
            backgroundColor: "white",
            width: "100%",
            maxWidth: "800px",
            textAlign: "center",
          }}
        >
          <Avatar
            sx={{
              width: 150,
              height: 150,
              backgroundColor: "#E0E0E0",
              margin: "0 auto 20px auto",
            }}
          >
            {username ? username.charAt(0).toUpperCase() : "U"} {/* ✅ Avatar Updates */}
          </Avatar>
          <Typography variant="h4" fontWeight="bold" sx={{ marginBottom: 2 }}>
            {username || "User"} {/* ✅ Display Live Updated Username */}
          </Typography>
          <Box
            component="form"
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 2,
              marginTop: 2,
            }}
            noValidate
            autoComplete="off"
          >
            {/* Editable Username */}
            <TextField
              label="Username"
              variant="outlined"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              fullWidth
            />

            {/* Editable Email */}
            <TextField
              label="Email"
              variant="outlined"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              fullWidth
            />

            {/* Read-Only National Identity Number */}
            <TextField
              label="National Identity Number"
              variant="outlined"
              value={dummyNationalId} // Dummy value
              fullWidth
              InputProps={{ readOnly: true }} // Makes it non-editable
            />

            <Button
              variant="contained"
              startIcon={<EditIcon />}
              onClick={handleSave}
              sx={{
                backgroundColor: "#4CAF50",
                color: "white",
                borderRadius: "20px",
                marginTop: "20px",
                "&:hover": { backgroundColor: "#45A049" },
              }}
            >
              Save Changes
            </Button>
          </Box>
        </Paper>
      </Container>
    </>
  );
};

export default EditProfilePage;
