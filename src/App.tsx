import { CssBaseline } from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom"; 
import { useAuth } from "./providers/AuthContext";
import { Navigate } from "react-router-dom";
import LandingPage from "./pages/LandingPage/LandingPage";
import ProfilePage from "./pages/ProfilePage/ProfilePage";
import HomePage from "./pages/HomePage/HomePage";
import EditProfilePage from "./pages/EditProfilePage/EditProfilePage";
import PaymentPage from "./pages/PaymentPage/PaymentPage";
import ValidatorPanel from "./pages/ValidatorPanel/ValidatorPanel"

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
                <MainLayout />
            </Router>
        </ThemeProvider>
    );
}

const MainLayout: React.FC = () => {
    const { user } = useAuth(); 

    return (
        <Routes>
            {/* Kullanıcı giriş yapmamışsa LandingPage, yapmışsa HomePage */}
            <Route path="/" element={user ? <Navigate to="/home" /> : <LandingPage />} />
            <Route path="/home" element={user ? <HomePage /> : <Navigate to="/" />} />
            <Route path="/profile" element={user ? <ProfilePage /> : <Navigate to="/" />} />
            <Route path="/editprofile" element={user ? <EditProfilePage /> : <Navigate to="/" />} /> 
            <Route path="/payment" element={user ? <PaymentPage /> : <Navigate to="/" />} />
            <Route path="/validator" element={<ValidatorPanel />} />
        </Routes>
    );
};

export default App;
