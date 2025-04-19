export const RoleEnum = {
	ADMIN: 1,
	PHOTOGRAPHER: 2,
	COMPANY: 3,
	VALIDATOR: 4,
	USER: null,
} as const;

export type RoleEnum = (typeof RoleEnum)[keyof typeof RoleEnum];
