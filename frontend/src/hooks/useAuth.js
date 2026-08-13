import { useSelector } from "react-redux";

const useAuth = () => {
    const { user, isAuthenticated, loading } = useSelector((state) => state.auth);

    return {
        user,
        isAuthenticated,
        loading,
    };
};

export default useAuth;
