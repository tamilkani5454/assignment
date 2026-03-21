import { Navigate, Outlet } from "react-router-dom";

const ProtectedLayout = () => {
    const isAuth = localStorage.getItem("token");

    if (!isAuth) {
        return <Navigate to="/" replace />;
    }

    return <Outlet />;
};

export default ProtectedLayout;