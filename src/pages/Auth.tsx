import { AuthView } from "@neondatabase/neon-js/auth/react";
import { useParams } from "react-router";

const Auth = () => {
    const { pathname } = useParams();
    return (
        <div className="min-h-screen flex px-6 pt-24 pb-12 justify-center items-center">
            <div className="max-w-md w-full">
                <AuthView pathname={pathname} />
            </div>
        </div>
    );
}

export default Auth;