import { authClient } from "../lib/auth";
import { NeonAuthUIProvider } from "@neondatabase/neon-js/auth/react";

const Providers = ({ children }: { children: React.ReactNode }) => {
    return (
        <NeonAuthUIProvider
            authClient={authClient}
            defaultTheme="dark"
            redirectTo="/profile"
        >
            {children}
        </NeonAuthUIProvider>
    );
}

export default Providers;