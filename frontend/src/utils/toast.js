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

const formatMessage = (message) => {
  if (!message) return "";
  if (typeof message === "string") return message;
  if (Array.isArray(message)) return message.filter(Boolean).join(", ");
  if (typeof message === "object") {
    return Object.values(message).filter(Boolean).join(", ");
  }
  return String(message);
};

export const getErrorMessage = (error, fallback = "Something went wrong") => {
  const data = error?.response?.data;
  const validationMessage = getValidationErrorMessage(data?.errors);

  if (validationMessage) return validationMessage;

  return (
    formatMessage(data?.message) || formatMessage(error?.message) || fallback
  );
};

export const showSuccess = (message) => {
  toast.success(message);
};

export const showError = (error, fallback) => {
  toast.error(getErrorMessage(error, fallback));
};
