import { Navigate } from "react-router";
import { useAuth } from "../context/AuthContext";

const Profile = () => {
    const { user, isLoading, plan } = useAuth();

    if (!user && !isLoading) {
        return <Navigate to='/auth/sign-in' replace />;
    }

    if (!plan) {
        return <Navigate to='/onboarding' replace />
    }

    return (<>Profile</>);
}

export default Profile;