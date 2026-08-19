import { toast } from "react-toastify";

export const getErrorMessage = (error, fallback = "Something went wrong") => {
  return error?.response?.data?.message || error?.message || fallback;
};

export const showSuccess = (message) => {
  toast.success(message);
};

export const showError = (error, fallback) => {
  toast.error(getErrorMessage(error, fallback));
};
