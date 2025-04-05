import React, { useState, useEffect, ReactNode } from "react";
import { Socket, io } from "socket.io-client";
import UserDto from "../dto/user/UserDto";
import { webApiUrl } from "../env/envVars";
import { toastError, toastSuccess, toastWarning, toastInfo } from "../util/toastUtil";
import NotificationDto from "../dto/notification/NotificationDto";
import { markNotificationSeen } from "../util/markNotificationSeen";
import { AuthContext } from "./AuthHook";

// AuthProvider component with props type
interface AuthProviderProps {
	children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
	const [user, setUser] = useState<UserDto | null | undefined>(undefined);
	const [socket, setSocket] = useState<Socket | null>(null);

	useEffect(() => {
		const hostname = new URL(webApiUrl).hostname;

		// Initialize socket
		const socketInstance = io(hostname, {
			path: "/socket.io",
			withCredentials: true,
			transports: ["websocket", "polling"],
		});

		// Set up socket event listeners
		socketInstance.on("connect", () => {
			console.log("Socket connected");
		});

		socketInstance.on("connect_error", (error) => {
			console.error("Socket connection error:", error);
			//toastError("Failed to connect to real-time services");
		});

		// socketInstance.onAny((event, ...args) => {
		// 	console.log(`Received event: ${event}`, args);
		// });

		socketInstance.on("notification", (notification: NotificationDto) => {
			switch (notification.type) {
				case "success":
					toastSuccess(notification.message);
					break;
				case "warning":
					toastWarning(notification.message);
					break;
				case "info":
					toastInfo(notification.message);
					break;
			}

			void markNotificationSeen(notification.id);
		});

		setSocket(socketInstance);

		// Cleanup function
		return () => {
			if (socketInstance) {
				socketInstance.disconnect();
			}
		};
	}, []); // Empty dependency array means this runs once on mount

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

	return <AuthContext.Provider value={{ user, setUser, socket }}>{children}</AuthContext.Provider>;
};
