import { useEffect } from "react";
import { useDispatch } from "react-redux";

import { getCurrentUser } from "../../api/auth.services";

import { setAuth, clearAuth } from "../../redux/authSlice";

const AuthInitializer = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        const initializeAuth = async () => {
            try {
                const data = await getCurrentUser();

                const user = data?.user;

                if (user) {
                    dispatch(setAuth(user));
                } else {
                    dispatch(clearAuth());
                }
            } catch (error) {
                dispatch(clearAuth());
            }
        };

        initializeAuth();
    }, [dispatch]);

    return null;
};

export default AuthInitializer;
