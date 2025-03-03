import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import UserDto from "../dto/user/UserDto";
import { webApiUrl } from "../env/envVars";
import { toastError } from "../util/toastUtil";
// Define AuthContext type
interface AuthContextType {
	user: UserDto | null;
	setUser: (user: UserDto | null) => void;
}

// Create the AuthContext
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// AuthProvider component with props type
interface AuthProviderProps {
	children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
	const [user, setUser] = useState<UserDto | null>(null);

	useEffect(() => {
		const fetchUser = async () => {
			try {
				const response = await fetch(`${webApiUrl}/auth/info`, {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({}),
					credentials: "include",
				});
				if (!response.ok) throw new Error("Failed to fetch user");

				const data: { user: UserDto | null } = await response.json();
				setUser(data.user);
			} catch (error) {
				console.error("Couldn't fetch user", error);
				setUser(null);
				toastError("Failed to fetch user details. Check console for details.");
			}
		};

		fetchUser();
	}, []);

	return <AuthContext.Provider value={{ user, setUser }}>{children}</AuthContext.Provider>;
};

// Custom hook to use AuthContext
export const useAuth = (): AuthContextType => {
	const context = useContext(AuthContext);
	if (!context) {
		throw new Error("useAuth must be used within an AuthProvider");
	}
	return context;
};
