import api from "./apiClient";

// Get all users
export const getUsers = async () => {
    const response = await api.get("/users");

    return response.data;
};

// Get single user
export const getUserById = async (id) => {
    const response = await api.get(`/users/${id}`);

    return response.data;
};

// Update user
export const updateUser = async (id, data) => {
    const response = await api.put(`/users/${id}`, data);

    return response.data;
};

// Delete user
export const deleteUser = async (id) => {
    const response = await api.delete(`/users/${id}`);

    return response.data;
};

// ADMIN - CREATE USER
export const createUserByAdmin = async (data) => {
    const response = await api.post("/users/admin/create", data);
    return response.data;
};

// AUTHENTICATED USER - UPDATE PROFILE
export const updateProfile = async (data) => {
    const response = await api.put("/users/profile", data);
    return response.data;
};

// AUTHENTICATED USER - CHANGE PASSWORD
export const changePassword = async (data) => {
    const response = await api.put("/users/change-password", data);
    return response.data;
};
