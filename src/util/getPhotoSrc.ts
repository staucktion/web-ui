import PhotoDto from "../dto/photo/PhotoDto";
import { webApiUrl } from "../env/envVars";

export default function getPhotoSrc(photo: PhotoDto): string {
	return `${webApiUrl}/photos/${photo.id}`;
}
