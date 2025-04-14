import { Button, FormControl, InputLabel, MenuItem, Paper, Select, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import React, { useEffect, useState } from "react";
import UserDto from "../../dto/user/UserDto";
import { webApiUrl } from "../../env/envVars";

const AdminUsers: React.FC = () => {
	const [users, setUsers] = useState<UserDto[]>([]);
	const [roleSelections, setRoleSelections] = useState<{ [key: number]: string }>({});
	const [banSelections, setBanSelections] = useState<{ [key: number]: boolean }>({});

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
										<Select label="Role" value={roleSelections[Number(user.id)] || ""} onChange={(e) => handleRoleChange(Number(user.id), e.target.value)} sx={{ color: "#fff" }}>
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
	);
};

export default AdminUsers;
