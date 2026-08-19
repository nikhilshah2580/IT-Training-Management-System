import api from "./apiClient";

export const updateProfile = async (data) => {
  const config =
    data instanceof FormData
      ? { headers: { "Content-Type": "multipart/form-data" } }
      : {};
  return (await api.put("/users/profile", data, config)).data;
};
export const changePassword = async (data) =>
  (await api.put("/users/change-password", data)).data;
