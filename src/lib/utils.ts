import {clsx, type ClassValue} from "clsx";
import {twMerge} from "tailwind-merge";
import {getAuthToken} from "./auth";
import type {PlanHistoryEntry, TrainingPlan, UserProfile} from "../types";

type TrainingPlanDetails = Pick<TrainingPlan, "overview" | "weeklySchedule" | "progression">;

type TrainingPlanPayload = Omit<TrainingPlan, keyof TrainingPlanDetails> &
  Partial<TrainingPlanDetails> & {
    planJson?: Partial<TrainingPlanDetails>;
  };

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

export const formatGoalPreview = (goal: string) => {
  const longGoalLength = 120;

  if (goal.length <= longGoalLength) {
    return goal;
  }

  const firstEndOfSentence = goal.indexOf(".");

  if (firstEndOfSentence === -1) {
    return goal;
  }

  return goal.slice(0, firstEndOfSentence + 1);
};

export function mapTrainingPlan(planData: TrainingPlanPayload): TrainingPlan {
  const planDetails = planData.planJson ?? planData;

  if (!hasTrainingPlanDetails(planDetails)) {
    throw new Error("Training plan payload is missing plan details");
  }

  return {
    id: planData.id,
    userId: planData.userId,
    overview: planDetails.overview,
    weeklySchedule: planDetails.weeklySchedule,
    progression: planDetails.progression,
    version: planData.version,
    createdAt: planData.createdAt,
  };
}

function hasTrainingPlanDetails(value: Partial<TrainingPlanDetails>): value is TrainingPlanDetails {
  return Boolean(value.overview && value.weeklySchedule && value.progression);
}

export function mapUserProfile(profileData: UserProfile): UserProfile {
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

export function mapPlanHistoryEntry(planData: PlanHistoryEntry): PlanHistoryEntry {
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
