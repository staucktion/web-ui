import { CssBaseline } from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import FileUpload from "./components/FileUpload/FileUpload";
import NavBarMiddle from "./components/NavBarMiddle/NavBarMiddle";
import HeroSection from "./components/HeroSection/HeroSection";


function App() {
    const themeMode = "light";

    const defaultTheme = createTheme({
        palette: { mode: themeMode },
        typography: { fontFamily: "Rubik, sans-serif" } // Updated font --sans-serif is in
      });
      
    return (
        <>
            <ThemeProvider theme={defaultTheme}>
                <CssBaseline />
                <div>
                    <HeroSection/>
                    <NavBarMiddle/>
                    <FileUpload />
                </div>
            </ThemeProvider>
		</>
	);
}

export default App;
