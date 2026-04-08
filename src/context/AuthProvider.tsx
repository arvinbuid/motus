import { useEffect, useState, type ReactNode } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { authClient } from "../lib/auth";
import { AuthContext } from "./AuthContext";
import { currentPlanOptions } from "../hooks/useCurrentPlan";
import { currentProfileOptions } from "../hooks/useCurrentProfile";
import type { UserProfile } from "../types";
import { api } from "../lib/api";
import toast from "react-hot-toast";

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [neonUser, setNeonUser] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isRegeneratingTrainingPlan, setIsRegeneratingTrainingPlan] = useState(false);
    const queryClient = useQueryClient();

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
        await queryClient.invalidateQueries({ queryKey: currentProfileOptions(neonUser.id).queryKey });
    }

    const generateTrainingPlan = async () => {
        if (!neonUser) {
            throw new Error("User must be authenticated to generate training plan");
        }

        setIsRegeneratingTrainingPlan(true);
        try {
            await api.generatePlan(neonUser.id);
            await queryClient.invalidateQueries({ queryKey: currentPlanOptions(neonUser.id).queryKey });
            toast.success("Training plan generated successfully!");
        } catch (error) {
            console.error(error);
            toast.error("Failed to generate training plan.");
        } finally {
            setIsRegeneratingTrainingPlan(false);
        }

    }

    return (
        <AuthContext.Provider value={{ user: neonUser, isLoading, saveProfile, generateTrainingPlan, isRegeneratingTrainingPlan }}>
            {children}
        </AuthContext.Provider>
    )
}
