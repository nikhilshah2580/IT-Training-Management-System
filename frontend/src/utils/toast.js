import { toast } from "react-toastify";

const getValidationErrorMessage = (errors) => {
  if (!errors) return "";

  if (Array.isArray(errors)) {
    return errors.filter(Boolean).join(", ");
  }

  if (typeof errors === "object") {
    return Object.values(errors).filter(Boolean).join(", ");
  }

  return String(errors);
};

export const getErrorMessage = (error, fallback = "Something went wrong") => {
  const data = error?.response?.data;
  const validationMessage = getValidationErrorMessage(data?.errors);

  if (validationMessage) return validationMessage;

  return data?.message || error?.message || fallback;
};

export const showSuccess = (message) => {
  toast.success(message);
};

export const showError = (error, fallback) => {
  toast.error(getErrorMessage(error, fallback));
};
