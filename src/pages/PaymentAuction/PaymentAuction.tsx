import React, { useState } from "react";
import { Box, Typography, Button, Paper, TextField, Grid, CircularProgress } from "@mui/material";
import { toastSuccess, toastError, toastWarning } from "../../util/toastUtil";
import { webApiUrl } from "../../env/envVars";
import { useAuth } from "../../providers/AuthHook";
import { useNavigate, useParams } from "react-router-dom";

const PaymentAuction: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { photoId } = useParams<{ photoId: string }>();

  const [cardNumber, setCardNumber] = useState("");
  const [expirationDate, setExpirationDate] = useState("");
  const [cvv, setCvv] = useState("");
  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    if (!user) {
      navigate("/auth/google");
      return;
    }

    if (!user.tc_identity_no) {
      toastWarning("Please add your T.C. identity number first.");
      navigate("/profile");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(
        `${webApiUrl}/banks/purchase/photo/${photoId}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ cardNumber, expirationDate, cvv }),
        }
      );

      const data = await response.json();
      if (response.ok) {
        toastSuccess("Photo purchased successfully. Check your email for details.");
        navigate("/auctions");
      } else {
        toastError(`Purchase failed: ${data.message}`);
      }
    } catch (error) {
      console.error(error);
      toastError("An error occurred during purchase. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
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
          backgroundColor: "rgba(255,255,255,1)",
        }}
      >
        <Typography variant="h4" align="center" gutterBottom>
          Payment Information
        </Typography>
        <Typography variant="body1" align="center" sx={{ mb: 3 }}>
          Please enter your card details.
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              label="Card Number"
              variant="outlined"
              fullWidth
              value={cardNumber}
              onChange={(e) => setCardNumber(e.target.value)}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="Expiration Date (MM/YY)"
              variant="outlined"
              fullWidth
              value={expirationDate}
              onChange={(e) => setExpirationDate(e.target.value)}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="CVV"
              variant="outlined"
              fullWidth
              value={cvv}
              onChange={(e) => setCvv(e.target.value)}
            />
          </Grid>
        </Grid>
        <Button
          variant="contained"
          color="success"
          fullWidth
          sx={{ mt: 3, py: 1.5 }}
          onClick={handlePayment}
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} /> : "Purchase"}
        </Button>
        <Button
          variant="text"
          fullWidth
          sx={{ mt: 1 }}
          onClick={() => navigate(-1)}
        >
          Cancel
        </Button>
      </Paper>
    </Box>
  );
};

export default PaymentAuction;
