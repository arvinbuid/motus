import {queryOptions, useQuery} from "@tanstack/react-query";
import {useAuth} from "../context/AuthContext";
import {api, ApiError} from "../lib/api";

export function trainingPlanOptions(userId?: string, planId?: string | null) {
  return queryOptions({
    queryKey: ["training-plan", userId ?? "guest", planId ?? "current"],
    enabled: !!userId && !!planId,
    queryFn: async () => {
      if (!userId || !planId) {
        return null;
      }

      return api.getTrainingPlan(planId);
    },
    retry: (failureCount: number, error: Error) => {
      if (error instanceof ApiError && error.status === 404) {
        return false;
      }

      return failureCount < 2;
    },
    staleTime: 2 * 60 * 1000,
    gcTime: 2 * 60 * 1000,
  });
}

export function useTrainingPlan(planId?: string | null) {
  const {user} = useAuth();

  return useQuery(trainingPlanOptions(user?.id, planId));
}
