import PhotoDto from "../dto/photo/PhotoDto";

const getPhotoDetails = async (photo: PhotoDto): Promise<{ resolution: string; file_size_mb: number; file_format: string }> => {
	const response = await fetch(photo.file_path);
	const blob = await response.blob();
	return new Promise((resolve) => {
		const img = new Image();
		img.onload = function () {
			resolve({
				resolution: img.width + "x" + img.height,
				file_size_mb: blob.size / 1024 / 1024,
				file_format: response.headers.get("Content-Type")?.split("/")[1].toUpperCase() || "unknown",
			});
		};
		img.src = URL.createObjectURL(blob);
	});
};

export default getPhotoDetails;
