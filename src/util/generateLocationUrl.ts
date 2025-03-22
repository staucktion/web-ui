import LocationDto from "../dto/location/LocationDto";

export const generateLocationUrl = (location: LocationDto) => {
	return `https://www.google.com/maps/search/?api=1&query=${location.latitude},${location.longitude}`;
};
