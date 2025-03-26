export default interface NotificationDto {
	id: number;
	sent_by_user_id: number;
	sent_to_user_id: number;
	type: "success" | "warning" | "info";
	message: string;
	seen_at: Date | null;
	created_at: Date;
	updated_at: Date;
}
