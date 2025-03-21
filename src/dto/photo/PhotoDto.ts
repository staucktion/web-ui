import CategoryDto from "../category/CategoryDto";
import StatusDto from "../status/StatusDto";

export default interface PhotoDto {
	id: number;
	file_path: string;
	title: string;
	device_info: string;
	vote_count: number;
	user_id: number;
	auction_id: number;
	location_id: number;
	category_id: number;
	status_id: number;
	created_at: Date;
	updated_at: Date;
	category: CategoryDto;
	status: StatusDto;
	is_auctionable: boolean;
	purchase_now_price?: number;
	purchased_at?: Date;
}
