import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    user: null,
    isAuthenticated: false,
    loading: true,
};

const authSlice = createSlice({
    name: "auth",

    initialState,

    reducers: {
        setAuth: (state, action) => {
            state.user = action.payload;
            state.isAuthenticated = !!action.payload;
            state.loading = false;
        },

        clearAuth: (state) => {
            state.user = null;
            state.isAuthenticated = false;
            state.loading = false;
        },

        setAuthLoading: (state, action) => {
            state.loading = action.payload;
        },
    },
});

export const { setAuth, clearAuth, setAuthLoading } = authSlice.actions;

export default authSlice.reducer;
