import { CssBaseline } from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom"; 
import LandingPage from "./pages/LandingPage/LandingPage";
import ProfilePage from "./pages/ProfilePage/ProfilePage";
import NavBar from "./components/NavBar/NavBar"; 
import NavBarProfile from "./components/NavBarProfile/NavBarProfile"; 

function App() {
    const themeMode = "light";

    const defaultTheme = createTheme({
        palette: { mode: themeMode },
        typography: { fontFamily: "Rubik, sans-serif" }
    });

    return (
        <ThemeProvider theme={defaultTheme}>
            <CssBaseline />
            <Router>
                <MainLayout /> {/*  Navbar'ın dinamik olarak değişmesi için özel bileşen */}
            </Router>
        </ThemeProvider>
    );
}

// Navbar'ın anında değişmesi için özel bileşen
const MainLayout: React.FC = () => {
    const location = useLocation(); //Mevcut sayfanın URL'sini alıyoruz.

    return (
        <>
            {/* Sayfaya göre Navbar değiştir */}
            {location.pathname === "/profile" ? <NavBarProfile /> : <NavBar />}
            <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/profile" element={<ProfilePage />} />
            </Routes>
        </>
    );
};

export default App;
