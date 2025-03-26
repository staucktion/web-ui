import { webApiUrl } from "../env/envVars";

export const markNotificationSeen = async (notification_id: number) => {
	await fetch(`${webApiUrl}/notifications/seen`, {
		method: "POST",
		body: JSON.stringify({ notification_id }),
		headers: {
			"Content-Type": "application/json",
		},
		credentials: "include",
	});
};
