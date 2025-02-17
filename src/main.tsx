import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import RootProvider from "./providers/RootProvider.tsx";

createRoot(document.getElementById("root")!).render(
	<RootProvider>
		<App />
	</RootProvider>
);
