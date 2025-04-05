import UserDto from "../dto/user/UserDto";

export const checkUserRole = (user: UserDto | null | undefined, role: "validator" | "admin", strict: boolean = false): boolean => {
	if (!user || !user.user_role) return false;

	if (strict) {
		return user.user_role.role === role;
	}

	if (role === "validator") {
		return user.user_role.role === "validator" || user.user_role.role === "admin";
	} else if (role === "admin") {
		return user.user_role.role === "admin";
	}

	return false;
};
