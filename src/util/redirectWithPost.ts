import { webApiUrl } from "../env/envVars.tsx";

export default function redirectWithPost(path: string, params?: Record<string, string>): void {
	const url = `${webApiUrl}${path}`;
	const form = document.createElement("form");
	form.setAttribute("method", "post");
	form.setAttribute("action", url);
	form.setAttribute("target", "_self");

	for (const i in params) {
		if (Object.prototype.hasOwnProperty.call(params, i)) {
			const input = document.createElement("input");
			input.type = "hidden";
			input.name = i;
			input.value = params[i];
			form.appendChild(input);
		}
	}

	document.body.appendChild(form);

	form.submit();

	document.body.removeChild(form);
}
