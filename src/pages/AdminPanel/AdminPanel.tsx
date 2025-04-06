import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Avatar,
  Button,
  Grid,
  TextField,
  Switch,
  FormControlLabel,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";
import { webApiUrl } from "../../env/envVars";
import getPhotoSrc from "../../util/getPhotoSrc";
import PhotoDto from "../../dto/photo/PhotoDto";

// Dummy user data

type User = {
  id: number;
  username: string;
  first_name: string;
  last_name: string;
  email: string;
  user_role: string;
  tc_identity_no: string;
};

const dummyUsers: User[] = [
  {
    id: 1,
    username: "johndoe",
    first_name: "John",
    last_name: "Doe",
    email: "john@example.com",
    user_role: "photographer",
    tc_identity_no: "12345678901",
  },
  {
    id: 2,
    username: "alicewonder",
    first_name: "Alice",
    last_name: "Wonder",
    email: "alice@example.com",
    user_role: "voter",
    tc_identity_no: "98765432109",
  },
];

const AdminPanel: React.FC = () => {
  const [voterCommission, setVoterCommission] = useState(10);
  const [photographerCommission, setPhotographerCommission] = useState(15);
  const [timerActive, setTimerActive] = useState(true);
  const [viewMode, setViewMode] = useState<'users' | 'photos'>('users');
  const [allPhotos, setAllPhotos] = useState<PhotoDto[]>([]);

  const fetchAllPhotos = async () => {
    try {
      const response = await fetch(`${webApiUrl}/photos`);
      if (!response.ok) {
        throw new Error("Failed to fetch photos");
      }
      const data: PhotoDto[] = await response.json();
      data.forEach((img) => (img.file_path = getPhotoSrc(img)));
      setAllPhotos(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (viewMode === "photos") {
      fetchAllPhotos();
    }
  }, [viewMode]);

  const handleCommissionChange = (
    setter: React.Dispatch<React.SetStateAction<number>>,
    value: string
  ) => {
    const numericValue = parseFloat(value);
    if (!isNaN(numericValue)) {
      setter(numericValue);
    }
  };

  const handleChangeRole = (userId: number) => {
    console.log(`Change role clicked for user ${userId}`);
  };

  return (
    <Box sx={{ backgroundColor: "#000", color: "#fff", minHeight: "100vh", p: 5 }}>
      <Typography variant="h3" gutterBottom>
        Admin Panel
      </Typography>
      <Typography variant="subtitle1" color="#aaa" gutterBottom>
        Manage users and update system settings.
      </Typography>

      <Box sx={{ backgroundColor: "#111", p: 4, borderRadius: 2, mb: 5 }}>
        <Typography variant="h5" gutterBottom>
          Sistem Ayarları
        </Typography>

        <Box display="flex" flexWrap="wrap" gap={4} mt={2}>
          <TextField
            label="Voter Komisyon (%)"
            type="number"
            value={voterCommission}
            onChange={(e) => handleCommissionChange(setVoterCommission, e.target.value)}
            InputProps={{ inputProps: { min: 0, max: 100 } }}
            sx={{ input: { color: "#fff" }, label: { color: "#aaa" } }}
            fullWidth
          />

          <TextField
            label="Photographer Komisyon (%)"
            type="number"
            value={photographerCommission}
            onChange={(e) => handleCommissionChange(setPhotographerCommission, e.target.value)}
            InputProps={{ inputProps: { min: 0, max: 100 } }}
            sx={{ input: { color: "#fff" }, label: { color: "#aaa" } }}
            fullWidth
          />

          <FormControlLabel
            control={
              <Switch
                checked={timerActive}
                onChange={() => setTimerActive((prev) => !prev)}
                sx={{
                  "& .MuiSwitch-switchBase.Mui-checked": {
                    color: "red",
                  },
                  "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
                    backgroundColor: "red",
                  },
                }}
              />
            }
            label="Timer Aktif"
            sx={{ color: "#fff" }}
          />
        </Box>
      </Box>

      <ToggleButtonGroup
        value={viewMode}
        exclusive
        onChange={(e, newValue) => newValue && setViewMode(newValue)}
        sx={{ mb: 4 }}
      >
        <ToggleButton value="users" sx={{ color: "white", borderColor: "#555" }}>
          Kullanıcılar
        </ToggleButton>
        <ToggleButton value="photos" sx={{ color: "white", borderColor: "#555" }}>
          Fotoğraflar
        </ToggleButton>
      </ToggleButtonGroup>

      {viewMode === 'users' ? (
        <Grid container spacing={4}>
          {dummyUsers.map((user) => (
            <Grid item xs={12} md={6} lg={4} key={user.id}>
              <Card sx={{ backgroundColor: "#111", color: "#fff", borderRadius: 2 }}>
                <CardContent>
                  <Box display="flex" alignItems="center" mb={2}>
                    <Avatar sx={{ bgcolor: "#333", mr: 2 }}>
                      {user.username[0].toUpperCase()}
                    </Avatar>
                    <Box>
                      <Typography variant="h6">{user.username}</Typography>
                      <Typography variant="body2" color="#aaa">
                        {user.first_name} {user.last_name}
                      </Typography>
                    </Box>
                  </Box>
                  <Typography variant="body2" color="#ccc">Email: {user.email}</Typography>
                  <Box display="flex" alignItems="center" justifyContent="space-between" mt={1}>
                    <Typography variant="body2" color="#ccc">Role: {user.user_role}</Typography>
                    <Button
                      size="small"
                      variant="outlined"
                      onClick={() => handleChangeRole(user.id)}
                      sx={{
                        color: "#fff",
                        borderColor: "#555",
                        ml: 2,
                        "&:hover": {
                          borderColor: "#888",
                          backgroundColor: "#222",
                        },
                      }}
                    >
                      Change
                    </Button>
                  </Box>
                  <Typography variant="body2" color="#ccc" mt={1}>TC: {user.tc_identity_no}</Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      ) : (
        allPhotos.length > 0 ? (
          <Grid container spacing={4}>
            {allPhotos.map((photo, index) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={photo.id}>
                <Card sx={{ backgroundColor: "#111", color: "#fff", borderRadius: 2 }}>
                  <Box sx={{ p: 1, textAlign: "center", backgroundColor: "#222" }}>
                    <Typography variant="caption" color="gray">
                      Timer: {index % 2 === 0 ? "Aktif" : "Pasif"}
                    </Typography>
                  </Box>
                  <img
                    src={photo.file_path}
                    alt={photo.title || "Photo"}
                    style={{ width: "100%", height: "180px", objectFit: "cover" }}
                  />
                  <CardContent>
                    <Typography variant="body2" color="gray">
                      {"Unknown location"}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        ) : (
          <Typography variant="h6" align="center" color="gray">
            No available photos.
          </Typography>
        )
      )}
    </Box>
  );
};

export default AdminPanel;
