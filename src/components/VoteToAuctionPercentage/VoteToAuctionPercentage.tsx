
import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  CircularProgress,
  InputAdornment,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { webApiUrl } from "../../env/envVars";
import { toastSuccess, toastError } from "../../util/toastUtil";

const VoteToAuctionPercentage: React.FC = () => {
  const [percentage, setPercentage] = useState<number>(50);
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`${webApiUrl}/settings/auction-percentage`);
        if (!res.ok) throw new Error();
        const { percentage } = await res.json();
        setPercentage(percentage);
      } catch {
        toastError("Failed to load ratio");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch(`${webApiUrl}/settings/auction-percentage`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ percentage }),
      });
      if (!res.ok) throw new Error();
      toastSuccess("Ratio updated");
    } catch {
      toastError("Failed to save ratio");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Paper
      elevation={0}
      sx={{
        backgroundColor: "#1A1A1A",
        borderRadius: 2,
        p: 2,
        mb: 3,
      }}
    >
      <Box display="flex" alignItems="center">
        <Typography
          variant="body1"
          sx={{ color: "#fff", minWidth: 180 }}
        >
          Photo → Auction Ratio:
        </Typography>

        {loading ? (
          <CircularProgress color="inherit" size={24} sx={{ ml: 2 }} />
        ) : (
          <TextField
            label="Ratio"
            type="number"
            variant="outlined"
            size="small"
            value={percentage}
            onChange={(e) =>
              setPercentage(Math.max(0, Math.min(100, +e.target.value)))
            }
            InputProps={{
              endAdornment: (
                <InputAdornment position="end" sx={{ color: "#aaa" }}>
                  %
                </InputAdornment>
              ),
            }}
            sx={{
              ml: 2,
              width: 100,
              "& .MuiOutlinedInput-root": {
                backgroundColor: "#111",
                "& fieldset": { borderColor: "#444" },
                "&:hover fieldset": { borderColor: "#666" },
              },
              "& .MuiInputBase-input": { color: "#fff" },
              "& .MuiInputLabel-root": { color: "#aaa" },
            }}
          />
        )}

        <Box flexGrow={1} />

        <Button
          variant="contained"
          onClick={handleSave}
          disabled={loading || saving}
          sx={{
            ml: 2,
            backgroundColor: "red",
            "&:hover": { backgroundColor: "darkred" },
          }}
        >
          {saving ? <CircularProgress color="inherit" size={20} /> : "Save"}
        </Button>
      </Box>
    </Paper>
  );
};

export default VoteToAuctionPercentage;
