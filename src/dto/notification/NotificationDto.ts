export default interface NotificationDto {
	type: "success" | "warning" | "info";
	message: string;
}
