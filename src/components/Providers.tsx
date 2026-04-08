import { Link, useNavigate } from "react-router";
import { authClient } from "../lib/auth";
import { NeonAuthUIProvider } from "@neondatabase/neon-js/auth/react";

const Providers = ({ children }: { children: React.ReactNode }) => {
    const navigate = useNavigate();
    return (
        <NeonAuthUIProvider
            authClient={authClient}
            defaultTheme="dark"
            redirectTo="/profile"
            navigate={navigate}
            Link={({ children, href }) => <Link to={href}>{children}</Link>}
        >
            {children}
        </NeonAuthUIProvider>
    );
}

export default Providers;