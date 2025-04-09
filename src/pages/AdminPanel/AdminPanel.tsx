import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  TextField,
  Switch,
  FormControlLabel,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Button,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableContainer,
  Paper,
} from "@mui/material";
import { webApiUrl } from "../../env/envVars";

// Kullanıcı tipi: user_role artık { role: string } nesnesi olarak varsayılmıştır.
type User = {
  id: number;
  username: string;
  first_name: string;
  last_name: string;
  email: string;
  user_role: { role: string } | string;
  tc_identity_no: string;
};

const AdminPanel: React.FC = () => {
  // Sistem ayarları ve diğer state'ler
  const [voterCommission, setVoterCommission] = useState(10);
  const [photographerCommission, setPhotographerCommission] = useState(15);
  const [timerActive, setTimerActive] = useState(true);
  
  const [users, setUsers] = useState<User[]>([]);
  // Her kullanıcı için rol seçimini tutan state (key: user id, value: selected role)
  const [roleSelections, setRoleSelections] = useState<{ [key: number]: string }>({});

  const [voteDuration, setVoteDuration] = useState(1);
  const [auctionDuration, setAuctionDuration] = useState(1);
  const [purchaseDuration, setPurchaseDuration] = useState(1);
  const [voteUnit, setVoteUnit] = useState("day");
  const [auctionUnit, setAuctionUnit] = useState("day");
  const [purchaseUnit, setPurchaseUnit] = useState("day");

  // Rol seçenekleri
  const roleOptions = ["admin", "photographer", "voter"];

  // API'den kullanıcıları çekme fonksiyonu
  const fetchAllUsers = async () => {
    try {
      const response = await fetch(`${webApiUrl}/admin/users`, {
        // Gerekirse auth token veya diğer header bilgilerini ekleyin.
      });
      if (!response.ok) {
        throw new Error("Failed to fetch users");
      }
      const data: User[] = await response.json();
      setUsers(data);
      // Her kullanıcı için başlangıç rolü, user_role nesnesinin role değeri olarak ayarlanıyor.
      const initialSelections = data.reduce((acc, user) => {
        const role =
          typeof user.user_role === "object" ? user.user_role.role : user.user_role;
        return { ...acc, [user.id]: role };
      }, {} as { [key: number]: string });
      setRoleSelections(initialSelections);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchAllUsers();
  }, []);

  // Komisyon güncelleme fonksiyonu
  const handleCommissionChange = (
    setter: React.Dispatch<React.SetStateAction<number>>,
    value: string
  ) => {
    const numericValue = parseFloat(value);
    if (!isNaN(numericValue)) {
      setter(numericValue);
    }
  };

  // Seçim değiştiğinde rol değerini state'e aktarır
  const handleRoleSelectChange = (userId: number, newRole: string) => {
    setRoleSelections((prev) => ({ ...prev, [userId]: newRole }));
  };

  // "Change" butonu tıklandığında, seçilen rolü güncelleme işlemi tetiklenir (şimdilik console.log ile)
  const handleRoleUpdate = (userId: number) => {
    console.log(`Update role for user ${userId} to ${roleSelections[userId]}`);
    // Burada update API çağrısı ekleyebilirsiniz.
  };

  return (
    <Box sx={{ backgroundColor: "#000", color: "#fff", minHeight: "100vh", p: 5 }}>
      <Typography variant="h3" gutterBottom>
        Admin Panel
      </Typography>
      <Typography variant="subtitle1" color="#aaa" gutterBottom>
        Manage users and update system settings.
      </Typography>

      {/* Sistem Ayarları */}
      <Box sx={{ backgroundColor: "#111", p: 4, borderRadius: 2, mb: 5 }}>
        <Typography variant="h5" gutterBottom>
          System Settings
        </Typography>
        <Box display="flex" flexWrap="wrap" gap={4} mt={2}>
          <TextField
            label="Voter Commission (%)"
            type="number"
            value={voterCommission}
            onChange={(e) =>
              handleCommissionChange(setVoterCommission, e.target.value)
            }
            InputProps={{ inputProps: { min: 0, max: 100 } }}
            sx={{ input: { color: "#fff" }, label: { color: "#aaa" } }}
            fullWidth
          />
          <TextField
            label="Photographer Commission (%)"
            type="number"
            value={photographerCommission}
            onChange={(e) =>
              handleCommissionChange(setPhotographerCommission, e.target.value)
            }
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
                  "& .MuiSwitch-switchBase.Mui-checked": { color: "red" },
                  "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
                    backgroundColor: "red",
                  },
                }}
              />
            }
            label="Timer Active"
            sx={{ color: "#fff" }}
          />
          {[
            {
              label: "Vote Duration",
              value: voteDuration,
              unit: voteUnit,
              setValue: setVoteDuration,
              setUnit: setVoteUnit,
            },
            {
              label: "Auction Duration",
              value: auctionDuration,
              unit: auctionUnit,
              setValue: setAuctionDuration,
              setUnit: setAuctionUnit,
            },
            {
              label: "Purchase Duration",
              value: purchaseDuration,
              unit: purchaseUnit,
              setValue: setPurchaseDuration,
              setUnit: setPurchaseUnit,
            },
          ].map((item, i) => (
            <Box key={i} display="flex" gap={2} flexDirection="row" alignItems="center">
              <TextField
                label={item.label}
                type="number"
                value={item.value}
                onChange={(e) => item.setValue(parseInt(e.target.value))}
                InputProps={{ inputProps: { min: 0 } }}
                sx={{ input: { color: "#fff" }, label: { color: "#aaa" }, width: 150 }}
              />
              <FormControl sx={{ minWidth: 120 }}>
                <InputLabel sx={{ color: "#fff" }}>Unit</InputLabel>
                <Select
                  value={item.unit}
                  label="Unit"
                  onChange={(e) => item.setUnit(e.target.value)}
                  sx={{ color: "#fff", borderColor: "#555" }}
                >
                  <MenuItem value="day">Day</MenuItem>
                  <MenuItem value="hour">Hour</MenuItem>
                  <MenuItem value="minute">Minute</MenuItem>
                </Select>
              </FormControl>
            </Box>
          ))}
        </Box>
      </Box>

      {/* Kullanıcı Tablosu */}
      <TableContainer component={Paper} sx={{ backgroundColor: "#111" }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ color: "#fff" }}>ID</TableCell>
              <TableCell sx={{ color: "#fff" }}>Username</TableCell>
              <TableCell sx={{ color: "#fff" }}>Name</TableCell>
              <TableCell sx={{ color: "#fff" }}>Email</TableCell>
              <TableCell sx={{ color: "#fff" }}>Current Role</TableCell>
              <TableCell sx={{ color: "#fff" }}>TC Identity</TableCell>
              <TableCell sx={{ color: "#fff" }}>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell sx={{ color: "#fff" }}>{user.id}</TableCell>
                <TableCell sx={{ color: "#fff" }}>{user.username}</TableCell>
                <TableCell sx={{ color: "#fff" }}>
                  {user.first_name} {user.last_name}
                </TableCell>
                <TableCell sx={{ color: "#fff" }}>{user.email}</TableCell>
                <TableCell sx={{ color: "#fff" }}>
                  {user.user_role && typeof user.user_role === "object"
                    ? user.user_role.role || "Unknown"
                    : user.user_role}
                </TableCell>
                <TableCell sx={{ color: "#fff" }}>{user.tc_identity_no}</TableCell>
                <TableCell>
                  <Box display="flex" alignItems="center">
                    <FormControl variant="standard" sx={{ minWidth: 120, mr: 1 }}>
                      <InputLabel sx={{ color: "#fff" }}>Role</InputLabel>
                      <Select
                        value={roleSelections[user.id] || ""}
                        onChange={(e) =>
                          handleRoleSelectChange(user.id, e.target.value)
                        }
                        sx={{ 
                          color: "#fff", 
                          "& .MuiInputBase-root": { color: "#fff" },
                        }}
                      >
                        {roleOptions.map((roleOption) => (
                          <MenuItem key={roleOption} value={roleOption}>
                            {roleOption}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                    <Button
                      size="small"
                      variant="outlined"
                      onClick={() => handleRoleUpdate(user.id)}//dummy
                      sx={{
                        color: "#fff",
                        borderColor: "#555",
                        "&:hover": {
                          borderColor: "#888",
                          backgroundColor: "#222",
                        },
                      }}
                    >
                      Change
                    </Button>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default AdminPanel;
