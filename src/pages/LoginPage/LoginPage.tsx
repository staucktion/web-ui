import React, { useCallback, useEffect, useState } from "react";
import { Box, TextField, Button, Typography, Paper } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { webApiUrl } from "../../env/envVars";
import { useAuth } from "../../providers/AuthHook"; // Context'ten setUser çekiyoruz
import { toastError, toastSuccess } from "../../util/toastUtil";

const LoginPage: React.FC = () => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const navigate = useNavigate();
	const { setUser } = useAuth(); // 🌟 getUserInfo yoksa setUser çekiyoruz

	const handleLogin = useCallback(async () => {
		try {
			const response = await fetch(`${webApiUrl}/auth/login`, {
				method: "POST",
				credentials: "include", // Cookie almak için şart
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ email, password }),
			});

			if (!response.ok) {
				const errorData = await response.json();
				throw new Error(errorData.message || "Login failed");
			}

			// 🌟 Login sonrası user'ı çekiyoruz
			const userResponse = await fetch(`${webApiUrl}/auth/info`, {
				method: "POST",
				credentials: "include",
			});

			if (!userResponse.ok) {
				throw new Error("Failed to fetch user info");
			}

			const userData = await userResponse.json();
			setUser(userData.user); // 🌟 context'teki user'ı güncelliyoruz

			toastSuccess("Login successful!");
			navigate("/home"); // yönlendiriyoruz
		} catch (error: unknown) {
			const err = error as { message?: string };
			toastError(err.message || "Login failed");
		}
	}, [email, password, navigate, setUser]);

  useEffect(() => {
    const keyEventHandler = (e: KeyboardEvent) => {
      if (e.key === "Enter") {
        handleLogin();
      }
    };

    window.addEventListener("keydown", keyEventHandler);

    return () => {
      window.removeEventListener("keydown", keyEventHandler);
    };
  }, [handleLogin]);

	return (
		<Box
			sx={{
				minHeight: "100vh",
				bgcolor: "#f5f5f5",
				display: "flex",
				justifyContent: "center",
				alignItems: "center",
			}}
		>
			<Paper elevation={3} sx={{ p: 4, width: 320, textAlign: "center" }}>
				<Typography variant="h5" sx={{ mb: 3 }}>
					Login
				</Typography>

				<TextField label="Email" type="email" fullWidth sx={{ mb: 2 }} value={email} onChange={(e) => setEmail(e.target.value)} />

				<TextField label="Password" type="password" fullWidth sx={{ mb: 3 }} value={password} onChange={(e) => setPassword(e.target.value)} />

				<Button
					variant="contained"
					fullWidth
					onClick={handleLogin}
					sx={{
						backgroundColor: "#000000",
						"&:hover": { backgroundColor: "#333333" },
					}}
				>
					Login
				</Button>
			</Paper>
		</Box>
	);
};

export default LoginPage;
