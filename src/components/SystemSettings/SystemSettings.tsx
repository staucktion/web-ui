import { Box, Button, FormControl, FormControlLabel, InputLabel, MenuItem, Select, SelectChangeEvent, Switch, TextField, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import CronDto from "../../dto/cron/CronDto";
import CronUpdateDto from "../../dto/cron/CronUpdateDto";
import DbConfigDto from "../../dto/dbConfig/DbConfigDto";
import { cronEnum } from "../../enum/cronEnum";
import { webApiUrl } from "../../env/envVars";
import { toastError, toastSuccess } from "../../util/toastUtil";

type UnitType = "day" | "hour" | "minute" | "second" | null;

const SystemSettings: React.FC = () => {
	const [voterCommission, setVoterCommission] = useState<number | null>(null);
	const [photographerCommission, setPhotographerCommission] = useState<number | null>(null);
	const [timerActive, setTimerActive] = useState<boolean>(false);

	const [durationStarter, setDurationStarter] = useState<number | null>(null);
	const [durationVote, setDurationVote] = useState<number | null>(null);
	const [durationAuction, setDurationAuction] = useState<number | null>(null);
	const [durationPurchase, setDurationPurchase] = useState<number | null>(null);

	const [unitStarter, setUnitStarter] = useState<UnitType>(null);
	const [unitVote, setUnitVote] = useState<UnitType>(null);
	const [unitAuction, setUnitAuction] = useState<UnitType>(null);
	const [unitPurchase, setUnitPurchase] = useState<UnitType>(null);

	const fetchConfigs = async () => {
		try {
			const response = await fetch(`${webApiUrl}/admin/config`);
			if (!response.ok) {
				toastError("Failed to fetch configurations");
				return;
			}
			const responseData: DbConfigDto = await response.json();
			setTimerActive(responseData.is_timer_job_active);
			setVoterCommission(responseData.voter_comission_percentage);
			setPhotographerCommission(responseData.photographer_comission_percentage);
		} catch (err) {
			console.error(err);
		}
	};

	const initDurationAndUnit = (cronDto: CronDto) => {
		let setterUnit: React.Dispatch<React.SetStateAction<UnitType | null>> | undefined = undefined;
		let setterDuration: React.Dispatch<React.SetStateAction<number | null>> | undefined = undefined;

		if (cronDto.id === cronEnum.STARTER) {
			setterUnit = setUnitStarter;
			setterDuration = setDurationStarter;
		} else if (cronDto.id === cronEnum.VOTE) {
			setterUnit = setUnitVote;
			setterDuration = setDurationVote;
		} else if (cronDto.id === cronEnum.AUCTION) {
			setterUnit = setUnitAuction;
			setterDuration = setDurationAuction;
		} else if (cronDto.id === cronEnum.PURCHASE_AFTER_AUCTION) {
			setterUnit = setUnitPurchase;
			setterDuration = setDurationPurchase;
		}

		if (cronDto.interval !== undefined && cronDto.unit !== undefined && setterDuration !== undefined && setterUnit !== undefined) {
			setterDuration(cronDto.interval);
			switch (cronDto.unit) {
				case "s":
					setterUnit("second");
					break;
				case "m":
					setterUnit("minute");
					break;
				case "d":
					setterUnit("day");
					break;
				case "h":
					setterUnit("hour");
					break;
				default:
					break;
			}
		}
	};

	const fetchDurations = async () => {
		try {
			const response = await fetch(`${webApiUrl}/crons`);
			if (!response.ok) {
				toastError("Failed to fetch cron data");
				return;
			}
			const responseData: CronDto[] = await response.json();

			for (const cronDto of responseData) if (cronDto.interval !== undefined && cronDto.unit !== undefined) initDurationAndUnit(cronDto);
		} catch (err) {
			console.error(err);
		}
	};

	useEffect(() => {
		fetchConfigs();
		fetchDurations();
		// eslint-disable-next-line react-hooks/exhaustive-deps -- FC equivalent of componentDidMount
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

	const handleTimerToggle = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.target.checked;
		setTimerActive(value);
	};

	const handeUnitChange = (e: SelectChangeEvent, setter: React.Dispatch<React.SetStateAction<UnitType>>) => {
		const value = e.target.value as UnitType;
		setter(value);
	};

	const handleDurationChange = (e: React.ChangeEvent<{ value: unknown }>, setter: React.Dispatch<React.SetStateAction<number | null>>) => {
		const value = e.target.value;
		setter(value === "" ? null : Number(value));
	};

	const handleSaveConfigs = async () => {
		if (voterCommission === null || photographerCommission === null || timerActive === undefined) {
			toastError("Please provide valid configuration data.");
			return;
		}

		const configData: Omit<DbConfigDto, "id"> = {
			voter_comission_percentage: voterCommission,
			photographer_comission_percentage: photographerCommission,
			is_timer_job_active: timerActive,
		};

		try {
			const response = await fetch(`${webApiUrl}/admin/config`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(configData) });

			if (response.ok) {
				if (response.status === 204) toastSuccess("Configurations saved successfully");
			} else {
				const resultData = await response.json();
				toastError(resultData.message);
			}
		} catch (error) {
			console.error("Error saving configurations:", error);
			toastError("Error saving configurations");
		}
	};

	const handleSaveCron = async () => {
		let cronUpdateDtoList: CronUpdateDto[] | null = null;
		if (durationStarter && durationVote && durationAuction && durationPurchase && unitStarter && unitVote && unitAuction && unitPurchase) {
			cronUpdateDtoList = [
				{
					id: cronEnum.STARTER,
					unit: unitStarter?.toLocaleLowerCase().charAt(0),
					interval: durationStarter,
				},
				{
					id: cronEnum.VOTE,
					unit: unitVote?.toLocaleLowerCase().charAt(0),
					interval: durationVote,
				},
				{
					id: cronEnum.AUCTION,
					unit: unitAuction?.toLocaleLowerCase().charAt(0),
					interval: durationAuction,
				},
				{
					id: cronEnum.PURCHASE_AFTER_AUCTION,
					unit: unitPurchase?.toLocaleLowerCase().charAt(0),
					interval: durationPurchase,
				},
			];
		}

		try {
			const response = await fetch(`${webApiUrl}/admin/crons`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(cronUpdateDtoList) });

			if (response.ok) {
				if (response.status === 200) toastSuccess("Configurations saved successfully");
			} else {
				const resultData = await response.json();
				toastError(resultData.message);
			}
		} catch (error) {
			console.error("Error saving configurations:", error);
			toastError("Error saving configurations");
		}
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
							value={voterCommission ?? ""}
							onChange={(e) => handleVoterCommissionChange(e.target.value)}
							sx={{ input: { color: "#fff" }, label: { color: "#aaa" } }}
							fullWidth
						/>
						<TextField
							label="Photographer Commission (%)"
							type="number"
							value={photographerCommission ?? ""}
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
							label="Global Timer Job Activation"
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
								label: "Starter Duration",
								value: durationStarter,
								unit: unitStarter,
								setValue: setDurationStarter,
								setUnit: setUnitStarter,
							},
							{
								label: "Vote Duration",
								value: durationVote,
								unit: unitVote,
								setValue: setDurationVote,
								setUnit: setUnitVote,
							},
							{
								label: "Auction Duration",
								value: durationAuction,
								unit: unitAuction,
								setValue: setDurationAuction,
								setUnit: setUnitAuction,
							},
							{
								label: "Purchase Duration",
								value: durationPurchase,
								unit: unitPurchase,
								setValue: setDurationPurchase,
								setUnit: setUnitPurchase,
							},
						].map((item, i) => (
							<Box key={i} display="flex" gap={2} flexDirection="row" alignItems="center">
								<TextField
									label={item.label}
									type="number"
									value={item.value ?? ""}
									onChange={(e) => handleDurationChange(e, item.setValue)}
									sx={{ input: { color: "#fff" }, label: { color: "#aaa" }, width: 150 }}
								/>
								<FormControl sx={{ minWidth: 120 }}>
									<InputLabel sx={{ color: "#fff" }}>Unit</InputLabel>
									<Select value={item.unit ?? ""} label="Unit" onChange={(e) => handeUnitChange(e, item.setUnit)} sx={{ color: "#fff", borderColor: "#555" }}>
										<MenuItem value="day">Day</MenuItem>
										<MenuItem value="hour">Hour</MenuItem>
										<MenuItem value="minute">Minute</MenuItem>
										<MenuItem value="second">Second</MenuItem>
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
