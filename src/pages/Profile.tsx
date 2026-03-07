import { Navigate } from "react-router";
import { useAuth } from "../context/AuthContext";

const Profile = () => {
    const { user, isLoading } = useAuth();
    const plan = false;

    if (!user && !isLoading) {
        return <Navigate to='/auth/sign-in' />;
    }

    if (!plan) {
        return <Navigate to='/onboarding' />
    }

    return (<>Profile</>);
}

export default Profile;