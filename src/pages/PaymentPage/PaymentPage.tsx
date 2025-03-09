import React from "react";
import { Box, Typography, Button, Paper, TextField, Grid } from "@mui/material";
import { useNavigate } from "react-router-dom";

const PaymentPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        backgroundImage: "url('https://source.unsplash.com/random/1600x900?abstract')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        p: 3,
      }}
    >
      <Paper
        elevation={10}
        sx={{
          maxWidth: 600,
          width: "100%",
          p: 4,
          borderRadius: 3,
          backgroundColor: "rgba(255,255,255,0.85)",
        }}
      >
        <Typography variant="h4" align="center" gutterBottom>
          Payment Page
        </Typography>
        <Typography variant="body1" align="center" sx={{ mb: 3 }}>
          Please Enter the Card Information.
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField label="Card Number" variant="outlined" fullWidth />
          </Grid>
          <Grid item xs={6}>
            <TextField label="Date" variant="outlined" fullWidth />
          </Grid>
          <Grid item xs={6}>
            <TextField label="CVV" variant="outlined" fullWidth />
          </Grid>
          <Grid item xs={12}>
            <TextField label="Name on the card" variant="outlined" fullWidth />
          </Grid>
        </Grid>
        <Button
          variant="contained"
          color="success" // Yeşil renk
          fullWidth
          sx={{ mt: 3, py: 1.5 }}
          onClick={() => navigate("/home")}
        >
          Pay
        </Button>
        <Button
          variant="text"
          fullWidth
          sx={{ mt: 1 }}
          onClick={() => navigate("/home")}
        >
          Cancel
        </Button>
      </Paper>
    </Box>
  );
};

export default PaymentPage;
