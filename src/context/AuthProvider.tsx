import { useEffect, useState, type ReactNode } from "react";
import { authClient } from "../lib/auth";
import type { User } from "../types";
import { AuthContext } from "./AuthContext";

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [neonUser, setNeonUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Load Neon User
    useEffect(() => {
        async function loadUser() {
            try {
                const res = await authClient.getSession();
                const userSession = res?.data?.user;

                if (userSession) {
                    setNeonUser({
                        id: userSession.id,
                        name: userSession.name,
                        email: userSession.email,
                    });
                } else {
                    setNeonUser(null);
                }
            } catch (error) {
                console.error(error)
            } finally {
                setIsLoading(false)
            }
        }
        loadUser();
    }, [])

    return (
        <AuthContext.Provider value={{ user: neonUser, isLoading }}>
            {children}
        </AuthContext.Provider>
    )
}
