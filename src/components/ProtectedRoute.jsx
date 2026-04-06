import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

function ProtectedRoute() {
    const { isAuthenticated } = useSelector((state) => state.auth)

    // if not authenticated then navigate to login page 
    if (!isAuthenticated) {
        return <Navigate to="/auth/login" replace />
    }

    // if authenticated then move to requested page 
    return <Outlet />

}

export default ProtectedRoute