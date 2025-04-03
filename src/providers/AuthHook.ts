import { createContext, useContext } from "react";
import { Socket } from "socket.io-client";
import UserDto from "../dto/user/UserDto";

// Define AuthContext type
interface AuthContextType {
	/** If user has not fetched yet, it will be undefined
	 * However, if fetched, it will be UserDto (if user is logged in) or null (if user is not logged in)
	 */
	user: UserDto | null | undefined;
	setUser: (user: UserDto | null) => void;
	socket: Socket | null;
}

// Create the AuthContext
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Custom hook to use AuthContext
export const useAuth = (): AuthContextType => {
	const context = useContext(AuthContext);
	if (!context) {
		throw new Error("useAuth must be used within an AuthProvider");
	}
	return context;
};
