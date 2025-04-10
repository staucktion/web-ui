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
	Table,
	TableHead,
	TableRow,
	TableCell,
	TableBody,
	TableContainer,
	Paper,
	Button,
} from "@mui/material";
import { webApiUrl } from "../../env/envVars";
import UserDto from "../../dto/user/UserDto";

const AdminPanel: React.FC = () => {
	const [voterCommission, setVoterCommission] = useState(10);
	const [photographerCommission, setPhotographerCommission] = useState(15);
	const [timerActive, setTimerActive] = useState(true);

	const [users, setUsers] = useState<UserDto[]>([]);
	const [roleSelections, setRoleSelections] = useState<{ [key: number]: string }>({});
	const [banSelections, setBanSelections] = useState<{ [key: number]: boolean }>({});

	const [voteDuration, setVoteDuration] = useState(1);
	const [auctionDuration, setAuctionDuration] = useState(1);
	const [purchaseDuration, setPurchaseDuration] = useState(1);
	const [voteUnit, setVoteUnit] = useState("day");
	const [auctionUnit, setAuctionUnit] = useState("day");
	const [purchaseUnit, setPurchaseUnit] = useState("day");

	const roleOptions = ["admin", "photographer", "voter"];

	const fetchAllUsers = async () => {
		try {
			const response = await fetch(`${webApiUrl}/admin/users`);
			if (!response.ok) {
				throw new Error("Failed to fetch users");
			}
			const data: UserDto[] = await response.json();
			setUsers(data);
			const initialRoleSelections = data.reduce((acc, user) => {
				const role = user.user_role && typeof user.user_role === "object" ? user.user_role.role : "";
				return { ...acc, [Number(user.id)]: role };
			}, {} as { [key: number]: string });
			setRoleSelections(initialRoleSelections);

			const initialBanSelections = data.reduce((acc, user) => {
				const banned = "banned" in user ? Boolean((user as UserDto & { banned: boolean }).banned) : false;
				return { ...acc, [Number(user.id)]: banned };
			}, {} as { [key: number]: boolean });
			setBanSelections(initialBanSelections);
		} catch (err) {
			console.error(err);
		}
	};

	useEffect(() => {
		fetchAllUsers();
	}, []);

	const handleCommissionChange = (setter: React.Dispatch<React.SetStateAction<number>>, value: string) => {
		const numericValue = parseFloat(value);
		if (!isNaN(numericValue)) {
			setter(numericValue);
		}
	};

	const handleTimerToggle = async () => {
		const newTimerState = !timerActive;
		setTimerActive(newTimerState);

		try {
			const response = await fetch(`${webApiUrl}/admin/settings/timer`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ timerActive: newTimerState }),
			});
			if (!response.ok) {
				throw new Error("Timer Active güncelleme isteği başarısız oldu");
			}
			const result = await response.json();
			console.log("Timer güncellendi", result);
		} catch (error) {
			console.error("Timer Active güncellenemedi:", error);
		}
	};

	const handleRoleChange = async (userId: number, newRole: string) => {
		setRoleSelections((prev) => ({
			...prev,
			[userId]: newRole,
		}));

		try {
			const response = await fetch(`${webApiUrl}/admin/users/${userId}/role`, {
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ role: newRole }),
			});
			if (!response.ok) {
				throw new Error("Role update failed");
			}
			const result = await response.json();
			console.log("Role updated:", result);
		} catch (error) {
			console.error("Role update error:", error);
		}
	};

	const handleBanToggle = async (userId: number) => {
		// Yeni yasaklama durumu
		const newBanState = !banSelections[userId];
		setBanSelections((prev) => ({
			...prev,
			[userId]: newBanState,
		}));

		try {
			const response = await fetch(`${webApiUrl}/admin/users/${userId}/ban`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ banned: newBanState }),
			});
			if (!response.ok) {
				throw new Error("Ban update failed");
			}
			const result = await response.json();
			console.log("Ban updated:", result);
		} catch (error) {
			console.error("Ban update error:", error);
		}
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
					System Settings
				</Typography>
				<Box display="flex" flexWrap="wrap" gap={4} mt={2}>
					<TextField
						label="Voter Commission (%)"
						type="number"
						value={voterCommission}
						onChange={(e) => handleCommissionChange(setVoterCommission, e.target.value)}
						InputProps={{ inputProps: { max: 100 } }}
						sx={{ input: { color: "#fff" }, label: { color: "#aaa" } }}
						fullWidth
					/>
					<TextField
						label="Photographer Commission (%)"
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
								onChange={handleTimerToggle}
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
								onChange={(e) => item.setValue(parseInt(e.target.value, 10))}
								InputProps={{ inputProps: { min: 0 } }}
								sx={{ input: { color: "#fff" }, label: { color: "#aaa" }, width: 150 }}
							/>
							<FormControl sx={{ minWidth: 120 }}>
								<InputLabel sx={{ color: "#fff" }}>Unit</InputLabel>
								<Select value={item.unit} label="Unit" onChange={(e) => item.setUnit(e.target.value)} sx={{ color: "#fff", borderColor: "#555" }}>
									<MenuItem value="day">Day</MenuItem>
									<MenuItem value="hour">Hour</MenuItem>
									<MenuItem value="minute">Minute</MenuItem>
								</Select>
							</FormControl>
						</Box>
					))}
				</Box>
			</Box>

			<TableContainer component={Paper} sx={{ backgroundColor: "#111" }}>
				<Table>
					<TableHead>
						<TableRow>
							<TableCell sx={{ color: "#fff" }}>ID</TableCell>
							<TableCell sx={{ color: "#fff" }}>Username</TableCell>
							<TableCell sx={{ color: "#fff" }}>Name</TableCell>
							<TableCell sx={{ color: "#fff" }}>Email</TableCell>
							<TableCell sx={{ color: "#fff" }}>TC Identity</TableCell>
							<TableCell sx={{ color: "#fff" }}>Role</TableCell>
							<TableCell sx={{ color: "#fff" }}>Ban</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{users.map((user) => {
							const userIdStr = String(user.id);
							return (
								<TableRow key={userIdStr}>
									<TableCell sx={{ color: "#fff" }}>{userIdStr}</TableCell>
									<TableCell sx={{ color: "#fff" }}>{user.username}</TableCell>
									<TableCell sx={{ color: "#fff" }}>
										{user.first_name} {user.last_name}
									</TableCell>
									<TableCell sx={{ color: "#fff" }}>{user.email}</TableCell>
									<TableCell sx={{ color: "#fff" }}>{user.tc_identity_no || "-"}</TableCell>
									<TableCell>
										<FormControl
											variant="outlined"
											sx={{
												minWidth: 120,
												"& .MuiOutlinedInput-root": {
													backgroundColor: "#222",
													borderColor: "#555",
													borderRadius: "4px",
												},
												"& .MuiOutlinedInput-notchedOutline": {
													borderColor: "#555",
												},
												"&:hover .MuiOutlinedInput-notchedOutline": {
													borderColor: "#888",
												},
												"& .MuiSvgIcon-root": {
													color: "#fff",
												},
												"& .MuiInputLabel-root": {
													color: "#aaa",
												},
											}}
										>
											<InputLabel sx={{ color: "#aaa" }}>Role</InputLabel>
											<Select
												label="Role"
												value={roleSelections[Number(user.id)] || ""}
												onChange={(e) => handleRoleChange(Number(user.id), e.target.value)}
												sx={{ color: "#fff" }}
											>
												{roleOptions.map((roleOption) => (
													<MenuItem key={roleOption} value={roleOption}>
														{roleOption}
													</MenuItem>
												))}
											</Select>
										</FormControl>
									</TableCell>
									<TableCell>
										<Button
											variant="contained"
											onClick={() => handleBanToggle(Number(user.id))}
											sx={{
												backgroundColor: "red",
												"&:hover": { backgroundColor: "darkred" },
											}}
										>
											{banSelections[Number(user.id)] ? "Unban" : "Ban"}
										</Button>
									</TableCell>
								</TableRow>
							);
						})}
					</TableBody>
				</Table>
			</TableContainer>
		</Box>
	);
};

export default AdminPanel;
