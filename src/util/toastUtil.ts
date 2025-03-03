import { toast, ToastOptions } from "react-toastify";

// Default toast configuration
const defaultToastOptions: ToastOptions = {
	position: "top-right",
	autoClose: 5000,
	hideProgressBar: false,
	closeOnClick: true,
	pauseOnHover: true,
	draggable: true,
};

/**
 * Display a success toast notification
 * @param message Message to display
 * @param options Optional configuration to override defaults
 */
export const toastSuccess = (message: string, options?: ToastOptions) => {
	toast.success(message, { ...defaultToastOptions, ...options });
};

/**
 * Display an error toast notification
 * @param message Message to display
 * @param options Optional configuration to override defaults
 */
export const toastError = (message: string, options?: ToastOptions) => {
	toast.error(message, { ...defaultToastOptions, ...options });
};

/**
 * Display a warning toast notification
 * @param message Message to display
 * @param options Optional configuration to override defaults
 */
export const toastWarning = (message: string, options?: ToastOptions) => {
	toast.warning(message, { ...defaultToastOptions, ...options });
};

/**
 * Display an info toast notification
 * @param message Message to display
 * @param options Optional configuration to override defaults
 */
export const toastInfo = (message: string, options?: ToastOptions) => {
	toast.info(message, { ...defaultToastOptions, ...options });
};
