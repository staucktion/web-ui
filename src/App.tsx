import { CssBaseline } from "@mui/material";
import Header from "./components/Header/Header";
import FileUpload from "./components/FileUpload/FileUpload";

function App() {
	return (
		<>
			<CssBaseline />
			<div>
				<Header />
				<FileUpload />
			</div>
		</>
	);
}

export default App;
