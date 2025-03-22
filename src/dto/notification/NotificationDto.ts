export default interface NotificationDto {
	id: number;
	type: "success" | "warning" | "info";
	message: string;
}
