interface CategoryDto {
	id: number;
	location_id: number | null;
	status_id: number | null;
	is_deleted: boolean;
	created_at: Date;
	updated_at: Date;
	name: string;
	address: string;
	valid_radius: number;
}

export default CategoryDto;
