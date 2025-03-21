import PhotoDto from "../dto/photo/PhotoDto";

export const generateLocationUrl = (photo: PhotoDto) => {
	return `https://www.google.com/maps/search/?api=1&query=${photo.category.location.latitude},${photo.category.location.longitude}`;
};
