import UserDto from "../dto/user/UserDto";
import { webApiUrl } from "../env/envVars";

export default function getProfilePictureSrc(user: UserDto): string | null {
	if (!user.profile_picture) return null;

	return user.profile_picture.startsWith("http") ? user.profile_picture : `${webApiUrl}/profile-pictures/${user.profile_picture}`;
}
