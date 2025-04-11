import { Box, Button, FormControl, FormControlLabel, InputLabel, MenuItem, Select, SelectChangeEvent, Switch, TextField, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { webApiUrl } from "../../env/envVars";

type UnitType = "day" | "hour" | "minute" | null;

const SystemSettings: React.FC = () => {
	const [voterCommission, setVoterCommission] = useState<number | null>(null);
	const [photographerCommission, setPhotographerCommission] = useState<number | null>(null);
	const [timerActive, setTimerActive] = useState<boolean | undefined>(undefined);
	const [voteDuration, setVoteDuration] = useState<number | null>(null);
	const [auctionDuration, setAuctionDuration] = useState<number | null>(null);
	const [purchaseDuration, setPurchaseDuration] = useState<number | null>(null);
	const [voteUnit, setVoteUnit] = useState<UnitType>(null);
	const [auctionUnit, setAuctionUnit] = useState<UnitType>(null);
	const [purchaseUnit, setPurchaseUnit] = useState<UnitType>(null);

	useEffect(() => {
		// fetchConfigs();
	}, []);

	const handleVoterCommissionChange = (value: string) => {
		const numericValue = parseFloat(value);
		if (!isNaN(numericValue)) setVoterCommission(numericValue);
		else setVoterCommission(null);
	};

	const handlePhotographerCommissionChange = (value: string) => {
		const numericValue = parseFloat(value);
		if (!isNaN(numericValue)) setPhotographerCommission(numericValue);
		else setPhotographerCommission(null);
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

	const handeUnitChange = (e: SelectChangeEvent<UnitType>) => {
		console.log(e);
	};
	const handeDurationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		console.log(e);
	};

	const handleSaveConfigs = (e: React.MouseEvent<HTMLButtonElement>) => {
		console.log(e);
	};
	const handleSaveCron = (e: React.MouseEvent<HTMLButtonElement>) => {
		console.log(e);
	};

	return (
		<>
			<Typography variant="h3" gutterBottom>
				Admin Panel
			</Typography>

			<Box sx={{ backgroundColor: "#111", p: 2, borderRadius: 2, mb: 5 }}>
				<Typography variant="h5" gutterBottom sx={{ mb: 2 }}>
					System Settings
				</Typography>
				<Box sx={{ backgroundColor: "#1A1A1A", p: 2, borderRadius: 2, mb: 3 }}>
					<Box mt={2}>
						<TextField
							label="Voter Commission (%)"
							type="number"
							value={voterCommission}
							onChange={(e) => handleVoterCommissionChange(e.target.value)}
							sx={{ input: { color: "#fff" }, label: { color: "#aaa" } }}
							fullWidth
						/>
						<TextField
							label="Photographer Commission (%)"
							type="number"
							value={photographerCommission}
							onChange={(e) => handlePhotographerCommissionChange(e.target.value)}
							sx={{ input: { color: "#fff" }, label: { color: "#aaa" }, mt: 3 }}
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
							label="Global Timer Activation"
							sx={{ color: "#fff", my: 2 }}
						/>

						<br />

						<Button
							variant="contained"
							onClick={handleSaveConfigs}
							sx={{
								backgroundColor: "red",
								"&:hover": { backgroundColor: "darkred" },
							}}
						>
							save
						</Button>
					</Box>
				</Box>
				<Box sx={{ backgroundColor: "#1A1A1A", p: 2, borderRadius: 2 }}>
					<Box display="flex" flexWrap="wrap" gap={4} mt={2}>
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
								<TextField label={item.label} type="number" value={item.value} onChange={handeDurationChange} sx={{ input: { color: "#fff" }, label: { color: "#aaa" }, width: 150 }} />
								<FormControl sx={{ minWidth: 120 }}>
									<InputLabel sx={{ color: "#fff" }}>Unit</InputLabel>
									<Select value={item.unit} label="Unit" onChange={handeUnitChange} sx={{ color: "#fff", borderColor: "#555" }}>
										<MenuItem value="day">Day</MenuItem>
										<MenuItem value="hour">Hour</MenuItem>
										<MenuItem value="minute">Minute</MenuItem>
									</Select>
								</FormControl>
							</Box>
						))}
					</Box>

					<br />

					<Button
						variant="contained"
						onClick={handleSaveCron}
						sx={{
							backgroundColor: "red",
							"&:hover": { backgroundColor: "darkred" },
						}}
					>
						save
					</Button>
				</Box>
			</Box>
		</>
	);
};

export default SystemSettings;
