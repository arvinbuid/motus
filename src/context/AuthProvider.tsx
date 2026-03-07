import { useEffect, useState, type ReactNode } from "react";
import { authClient } from "../lib/auth";
import { AuthContext } from "./AuthContext";

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [neonUser, setNeonUser] = useState<any>(null);

    // Load Neon User
    useEffect(() => {
        async function loadUser() {
            try {
                const res = await authClient.getSession();
                if (res && res.data?.user) {
                    setNeonUser(res.data.user);
                } else {
                    setNeonUser(null);
                }
            } catch (error) {
                console.error(error)
            }
        }
        loadUser();
    }, [])

    return (
        <AuthContext.Provider value={{ user: neonUser }}>
            {children}
        </AuthContext.Provider>
    )
}
