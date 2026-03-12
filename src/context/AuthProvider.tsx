import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { authClient } from "../lib/auth";
import { AuthContext } from "./AuthContext";
import type { TrainingPlan, UserProfile } from "../types";
import { api } from "../lib/api";

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [neonUser, setNeonUser] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [plan, setPlan] = useState<TrainingPlan | null>(null);
    const isRefreshingRef = useRef(false);

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

    // Refresh data memoized function
    const refreshData = useCallback(async () => {
        if (!neonUser || isRefreshingRef.current) return;
        isRefreshingRef.current = true;

        try {
            // Fetch current plan
            const planData = await api.getCurrentPlan(neonUser.id).catch(() => null);
            if (planData) {
                setPlan({
                    id: planData.id,
                    userId: planData.userId,
                    overview: planData.planJson.overview,
                    weeklySchedule: planData.planJson.weeklySchedule,
                    progression: planData.planJson.progression,
                    version: planData.version,
                    createdAt: planData.createdAt,
                })
            }
        } catch (error) {
            console.error('Error refreshing data:', error);
        } finally {
            isRefreshingRef.current = false;
        }
    }, [neonUser]);

    useEffect(() => {
        if (!isLoading) {
            if (neonUser?.id) {
                refreshData();
            } else {
                setPlan(null);
            }
            setIsLoading(false);
        }
    }, [neonUser?.id, isLoading, refreshData]);


    const saveProfile = async (profileData: Omit<UserProfile, 'userId' | 'updatedAt'>) => {
        if (!neonUser) {
            throw new Error("User must be authenticated to save profile");
        }

        await api.saveProfile(neonUser.id, profileData);
        await refreshData();
    }

    const generateTrainingPlan = async () => {
        if (!neonUser) {
            throw new Error("User must be authenticated to generate training plan");
        }

        await api.generatePlan(neonUser.id);
        await refreshData();
    }

    return (
        <AuthContext.Provider value={{ user: neonUser, plan, isLoading, saveProfile, generateTrainingPlan, refreshData }}>
            {children}
        </AuthContext.Provider>
    )
}
