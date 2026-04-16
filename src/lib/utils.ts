import {clsx, type ClassValue} from "clsx";
import {twMerge} from "tailwind-merge";
import {getAuthToken} from "./auth";
import type {PlanHistoryEntry, TrainingPlan, UserProfile} from "../types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("en-PH", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function formatSplitType(splitType?: string): string {
  if (!splitType) return "Custom Split";

  return splitType
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export async function buildRequestHeaders(headers: HeadersInit = {}) {
  const token = await getAuthToken();

  return {
    ...headers,
    ...(token ? {Authorization: `Bearer ${token}`} : {}),
  };
}

export function mapTrainingPlan(planData: any): TrainingPlan {
  return {
    id: planData.id,
    userId: planData.userId,
    overview: planData.planJson.overview,
    weeklySchedule: planData.planJson.weeklySchedule,
    progression: planData.planJson.progression,
    version: planData.version,
    createdAt: planData.createdAt,
  };
}

export function mapUserProfile(profileData: any): UserProfile {
  return {
    userId: profileData.userId,
    goal: profileData.goal,
    experience: profileData.experience,
    daysPerWeek: profileData.daysPerWeek,
    sessionLength: profileData.sessionLength,
    equipment: profileData.equipment,
    injuries: profileData.injuries ?? undefined,
    preferredSplit: profileData.preferredSplit,
    updatedAt: profileData.updatedAt,
  };
}

export function mapPlanHistoryEntry(planData: any): PlanHistoryEntry {
  return {
    id: planData.id,
    userId: planData.userId,
    version: planData.version,
    createdAt: planData.createdAt,
    overview: planData.overview ?? null,
    workoutDays: planData.workoutDays ?? 0,
    totalExercises: planData.totalExercises ?? 0,
  };
}
