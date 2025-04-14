import { RoleEnum } from "../enum/roleEnum";

export const roleEnumToRoleName = (role: RoleEnum | string) => {
	switch (role) {
		case RoleEnum.ADMIN:
			return "ADMIN";
		case RoleEnum.PHOTOGRAPHER:
			return "PHOTOGRAPHER";
		case RoleEnum.COMPANY:
			return "COMPANY";
		case RoleEnum.VALIDATOR:
			return "VALIDATOR";
		case "":
		case RoleEnum.USER:
			return "USER";
		default:
			return "UNKNOWN_ROLE";
	}
};
