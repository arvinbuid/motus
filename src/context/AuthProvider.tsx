import { useEffect, useState, type ReactNode } from "react";
import { authClient } from "../lib/auth";
import { AuthContext } from "./AuthContext";
import type { UserProfile } from "../types";
import { api } from "../lib/api";

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [neonUser, setNeonUser] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);

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
            } finally {
                setIsLoading(false)
            }
        }
        loadUser();
    }, [])

    const saveProfile = async (profileData: Omit<UserProfile, 'userId' | 'updatedAt'>) => {
        if (!neonUser) {
            throw new Error("User must be authenticated to save profile");
        }

        await api.saveProfile(neonUser.id, profileData);
    }

    const generateTrainingPlan = async () => {
        if (!neonUser) {
            throw new Error("User must be authenticated to generate training plan");
        }

        await api.generatePlan(neonUser.id)
    }

    return (
        <AuthContext.Provider value={{ user: neonUser, isLoading, saveProfile, generateTrainingPlan }}>
            {children}
        </AuthContext.Provider>
    )
}
