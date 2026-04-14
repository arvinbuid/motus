import {mutationOptions, useMutation, useQueryClient} from "@tanstack/react-query";
import toast from "react-hot-toast";
import {useAuth} from "../context/AuthContext";
import {api} from "../lib/api";
import {currentPlanOptions} from "./useCurrentPlan";
import {planHistoryOptions} from "./usePlanHistory";
import {currentProfileOptions} from "./useCurrentProfile";
import type {UserProfile} from "../types";

export function saveProfileMutationOptions(
  userId: string,
  queryClient: ReturnType<typeof useQueryClient>,
) {
  return mutationOptions({
    mutationKey: ["save-profile", userId],
    mutationFn: async (profileData: Omit<UserProfile, "userId" | "updatedAt">) => {
      return api.saveProfile(userId, profileData);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({queryKey: currentProfileOptions(userId).queryKey});
    },
  });
}

export function generateTrainingPlanMutationOptions(
  userId: string,
  queryClient: ReturnType<typeof useQueryClient>,
) {
  return mutationOptions({
    mutationKey: ["generate-training-plan", userId],
    mutationFn: async () => {
      return api.generatePlan(userId);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({queryKey: currentPlanOptions(userId).queryKey});
      await queryClient.invalidateQueries({queryKey: planHistoryOptions(userId).queryKey});
      toast.success("Training plan generated successfully!");
    },
    onError: (error) => {
      console.error(error);
      toast.error(error instanceof Error ? error.message : "Failed to generate training plan.");
    },
  });
}

export function useSaveProfile() {
  const {user} = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    ...saveProfileMutationOptions(user?.id ?? "guest", queryClient),
    mutationFn: async (profileData: Omit<UserProfile, "userId" | "updatedAt">) => {
      if (!user?.id) {
        throw new Error("User must be authenticated to save profile");
      }

      return api.saveProfile(user.id, profileData);
    },
    onError: (error) => {
      console.error(error);
      toast.error(error instanceof Error ? error.message : "Failed to save profile.");
    },
  });
}

export function useGenerateTrainingPlan() {
  const {user} = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    ...generateTrainingPlanMutationOptions(user?.id ?? "guest", queryClient),
    mutationFn: async () => {
      if (!user?.id) {
        throw new Error("User must be authenticated to generate training plan");
      }

      return api.generatePlan(user.id);
    },
  });
}
