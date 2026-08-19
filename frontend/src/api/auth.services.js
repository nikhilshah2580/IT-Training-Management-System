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


// GOOGLE LOGIN
export const googleLogin = async (data) => {
    const response = await api.post("/users/google-login", data);
    return response.data;
};

// FORGOT PASSWORD
export const forgotPassword = async (emailInput) => {
    const email = typeof emailInput === 'object' && emailInput !== null ? emailInput.email : emailInput;
    const response = await api.post("/users/forgot-password", { email });
    return response.data;
};

// VERIFY OTP
export const verifyOtp = async (data) => {
    const response = await api.post("/users/verify-otp", data);
    return response.data;
};
 
// RESET PASSWORD
export const resetPassword = async (data) => {
    const response = await api.post("/users/reset-password", data);
    return response.data;
};

// REFRESH TOKEN
export const refreshToken = async () => {
    const response = await api.post("/users/refresh-token");
    return response.data;
};
