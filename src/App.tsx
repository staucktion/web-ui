import { CssBaseline, CircularProgress } from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./providers/AuthHook";
import LandingPage from "./pages/LandingPage/LandingPage";
import ProfilePage from "./pages/ProfilePage/ProfilePage";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import HomePage from "./pages/HomePage/HomePage";
import EditProfilePage from "./pages/EditProfilePage/EditProfilePage";
import ValidatorPanel from "./pages/ValidatorPanel/ValidatorPanel";
import CategoriesPage from "./pages/Categories/Categories";
import { checkUserRole } from "./util/checkUserRole";
import AdminPanel from "./pages/AdminPanel/AdminPanel";
import PaymentAuction from "./pages/PaymentAuction/PaymentAuction";
import { toastError, toastSuccess } from "./util/toastUtil";
import RegisterPage from "./pages/RegisterPage/RegisterPage";
import LoginPage from "./pages/LoginPage/LoginPage";
import LicensePage from "./pages/LicensePage/LicensePage";

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

	const urlParams = new URLSearchParams(window.location.search);
	const error = urlParams.get("error");
	const success = urlParams.get("success");

	if (error) {
		toastError(error);
		window.history.replaceState({}, "", window.location.pathname);
	}

	if (success) {
		toastSuccess(success);
		window.history.replaceState({}, "", window.location.pathname);
	}

	if (user === undefined) {
		return <CircularProgress />;
	}

	return (
		<Routes>
			{/* If the user is Validator */}
			<Route path="/" element={user ? <Navigate to="/home" /> : <LandingPage />} />

			{/* Normal Users */}
			<Route path="/home" element={user ? <HomePage /> : <Navigate to="/" />} />
			<Route path="/profile" element={user ? <ProfilePage /> : <Navigate to="/" />} />
			<Route path="/editprofile" element={user ? <EditProfilePage /> : <Navigate to="/" />} />
			<Route path="/categories" element={<CategoriesPage categorySearch={null} />} />
			<Route path="/payment-auction/:photoId" element={<PaymentAuction />} />
			<Route path="/register" element={<RegisterPage />} />
			<Route path="/login" element={<LoginPage />} />
			<Route path="/license" element={<LicensePage />} />

			{/* Only for Validator's access*/}
			<Route path="/validator" element={checkUserRole(user, "validator") ? <ValidatorPanel /> : <Navigate to="/" />} />

			{/* Only for Admin's access*/}
			<Route path="/admin" element={checkUserRole(user, "admin") ? <AdminPanel /> : <Navigate to="/" />} />
		</Routes>
	);
};

export default App;
