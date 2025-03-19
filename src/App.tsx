import { CssBaseline } from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./providers/AuthContext";
import LandingPage from "./pages/LandingPage/LandingPage";
import ProfilePage from "./pages/ProfilePage/ProfilePage";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import HomePage from "./pages/HomePage/HomePage";
import EditProfilePage from "./pages/EditProfilePage/EditProfilePage";
import PaymentPage from "./pages/PaymentPage/PaymentPage";
import ValidatorPanel from "./pages/ValidatorPanel/ValidatorPanel";

function App() {
  const themeMode = "light";

  const defaultTheme = createTheme({
    palette: { mode: themeMode },
    typography: { fontFamily: "Rubik, sans-serif" },
  });

  return (
    <ThemeProvider theme={defaultTheme}>
      <CssBaseline />
      <Router>
        <MainLayout /> {/* Navbar'ın dinamik olarak değişmesi için özel bileşen */}
        <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} newestOnTop closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
      </Router>
    </ThemeProvider>
  );
}

const MainLayout: React.FC = () => {
  const { user } = useAuth();

  return (
    <Routes>
      {/* If the user is Validator */}
      <Route path="/" element={user ? (user.role_id === "4" ? <Navigate to="/validator" /> : <Navigate to="/home" />) : <LandingPage />} />
      
      {/* Normal Users */}
      <Route path="/home" element={user ? <HomePage /> : <Navigate to="/" />} />
      <Route path="/profile" element={user ? <ProfilePage /> : <Navigate to="/" />} />
      <Route path="/editprofile" element={user ? <EditProfilePage /> : <Navigate to="/" />} />
      <Route path="/payment" element={user ? <PaymentPage /> : <Navigate to="/" />} />

      {/* Only for Validator's access*/}
      <Route path="/validator" element={user?.role_id === "4" ? <ValidatorPanel /> : <Navigate to="/" />} />
    </Routes>
  );
};

export default App;
