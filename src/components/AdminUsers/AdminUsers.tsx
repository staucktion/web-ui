import { Button, FormControl, InputLabel, MenuItem, Paper, Select, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import React, { useEffect, useState } from "react";
import UserDto from "../../dto/user/UserDto";
import { webApiUrl } from "../../env/envVars";
import { RoleEnum } from "../../enum/roleEnum";
import { toastError, toastSuccess } from "../../util/toastUtil";
import { StatusEnum } from "../../enum/statusEnum";
import { getVisibleErrorMessage } from "../../util/getVisibleErrorMessage";
import { roleEnumToRoleName } from "../../util/roleEnumToRoleName";

const AdminUsers: React.FC = () => {
	const [users, setUsers] = useState<UserDto[]>([]);

	const fetchAllUsers = async () => {
		try {
			const response = await fetch(`${webApiUrl}/admin/users`);
			if (!response.ok) {
				throw new Error("Failed to fetch users");
			}
			const data: UserDto[] = await response.json();
			setUsers(data.sort((a, b) => Number(a.id) - Number(b.id)));
		} catch (err) {
			console.error(err);
			toastError("Failed to fetch users");
		}
	};

	useEffect(() => {
		fetchAllUsers();
	}, []);

	const handleRoleChange = async (userId: number, newRole: RoleEnum | string) => {
		if (newRole === "USER") newRole = null;

		const previousRole = users.find((user) => user.id === userId)?.role_id;

		if (!previousRole) {
			toastError("User not found");
			return;
		}

		setUsers(users.map((user) => (user.id === userId ? { ...user, role_id: newRole as RoleEnum } : user)));

		try {
			const response = await fetch(`${webApiUrl}/admin/users/${userId}`, {
				method: "PATCH",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ role_id: newRole }),
			});
			if (!response.ok) {
				throw new Error("Role update failed");
			}
			const result = await response.json();
			console.log("Role updated:", result);
			toastSuccess(`User role successfully updated to ${roleEnumToRoleName(newRole)}`);
		} catch (error) {
			console.error("Role update error:", error);
			toastError(`User role update failed. ${getVisibleErrorMessage(error)}`);
			setUsers(users.map((user) => (user.id === userId ? { ...user, role_id: previousRole } : user)));
		}
	};

	const handleBanToggle = async (userId: number) => {
		const previousStatus = users.find((user) => user.id === userId)?.status_id;

		if (!previousStatus) {
			toastError("User not found");
			return;
		}

		const newStatus = previousStatus === StatusEnum.BANNED ? StatusEnum.ACTIVE : StatusEnum.BANNED;
		console.log(newStatus);
		setUsers(users.map((user) => (user.id === userId ? { ...user, status_id: newStatus } : user)));

		try {
			const response = await fetch(`${webApiUrl}/admin/users/${userId}`, {
				method: "PATCH",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ status_id: newStatus }),
			});
			if (!response.ok) {
				throw new Error("Ban update failed");
			}
			const result = await response.json();
			console.log("Ban updated:", result);
			toastSuccess(`User status successfully updated to ${StatusEnum[newStatus]}`);
		} catch (error) {
			console.error("Ban update error:", error);
			toastError(`User status update failed. ${getVisibleErrorMessage(error)}`);
			setUsers(users.map((user) => (user.id === userId ? { ...user, status_id: previousStatus } : user)));
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
										<Select
											label="Role"
											value={user.role_id || "USER"}
											onChange={(e) => handleRoleChange(Number(user.id), e.target.value as unknown as RoleEnum)}
											sx={{ color: "#fff" }}
										>
											{Object.entries(RoleEnum).map(([key, value]) => (
												<MenuItem key={key} value={value || "USER"}>
													{key}
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
										{user.status_id === StatusEnum.BANNED ? "Unban" : "Ban"}
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
