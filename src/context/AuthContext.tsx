import { createContext, useContext } from "react";
import type { User, UserProfile } from "../types";

type AuthContextType = {
    user: User | null;
    isLoading: boolean;
    isRegeneratingTrainingPlan: boolean;
    saveProfile: (profile: Omit<UserProfile, 'userId' | 'updatedAt'>) => Promise<void>;
    generateTrainingPlan: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within a AuthProvider");
    }
    return context;
}
