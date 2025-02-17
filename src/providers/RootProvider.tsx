import React, { ReactNode } from "react";
import { AuthProvider } from "./AuthContext";
import { createTheme, ThemeProvider } from "@mui/material/styles";

// RootProvider props type
interface RootProviderProps {
	children: ReactNode;
}

const RootProvider: React.FC<RootProviderProps> = ({ children }) => {
	const themeMode = "light";
	const defaultTheme = createTheme({ palette: { mode: themeMode }, typography: { fontFamily: "Roboto, sans-serif" } });

	return (
		<AuthProvider>
			<ThemeProvider theme={defaultTheme}>{children}</ThemeProvider>
		</AuthProvider>
	);
};

export default RootProvider;
