import { Navigate, Outlet } from "react-router-dom";
import useAdminCheck from "../context/useAdminCheck";

const ProtectedLayout = () => {
    const { isAdmin, loading } = useAdminCheck()
    
    if (loading) {
        return <h2>Loading...</h2>; // or spinner
    }
    if (!isAdmin) {
        return <Navigate to="/" replace />;
    }
    return <Outlet />;
};

export default ProtectedLayout;