import {queryOptions, useQuery} from "@tanstack/react-query";
import {useAuth} from "../context/AuthContext";
import {api} from "../lib/api";

export function planHistoryOptions(userId?: string) {
  return queryOptions({
    queryKey: ["plan-history", userId ?? "guest"],
    enabled: !!userId,
    queryFn: async () => {
      if (!userId) {
        return [];
      }

      return api.getPlanHistory(userId);
    },
    staleTime: 2 * 60 * 1000,
    gcTime: 2 * 60 * 1000,
  });
}

export function usePlanHistory() {
  const {user} = useAuth();

  return useQuery(planHistoryOptions(user?.id));
}
