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
