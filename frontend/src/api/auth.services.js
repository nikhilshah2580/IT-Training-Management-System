import api from "./apiClient";

// SIGNUP
export const signupUser = async (data) => {
    const response = await api.post("/users/signup", data);

    return response.data;
};


// LOGIN
export const loginUser = async (data) => {
    const response = await api.post("/users/login", data);

    return response.data;
};


// CURRENT USER
export const getCurrentUser = async () => {
    const response = await api.get("/users/me");

    return response.data;
};


// LOGOUT
export const logoutUser = async () => {
    const response = await api.post("/users/logout");

    return response.data;
};
