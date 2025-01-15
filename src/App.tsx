import { CssBaseline } from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Header from "./components/Header";
import FileUpload from "./components/FileUpload";

function App() {
	const themeMode = "light";

	const defaultTheme = createTheme({ palette: { mode: themeMode }, typography: { fontFamily: "Roboto, sans-serif" } });

	return (
		<>
			<ThemeProvider theme={defaultTheme}>
				<CssBaseline />
				<div>
					<Header />
					<FileUpload />
				</div>
			</ThemeProvider>
		</>
	);
}

export default App;
