import type {PlanHistoryEntry, TrainingPlan, UserProfile} from "../types";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

// Reusable helper functions
export async function get(path: string) {
  const res = await fetch(`${BASE_URL}/api${path}`);
  if (!res.ok) {
    throw new ApiError((await res.json().catch(() => ({}))).error || "Request failed", res.status);
  }
  return res.json();
}

async function post(path: string, body: object) {
  const res = await fetch(`${BASE_URL}/api${path}`, {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify(body),
  });

  if (!res.ok)
    throw new ApiError((await res.json().catch(() => ({}))).error || "Request failed", res.status);

  return res.json();
}

function mapTrainingPlan(planData: any): TrainingPlan {
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

function mapUserProfile(profileData: any): UserProfile {
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

function mapPlanHistoryEntry(planData: any): PlanHistoryEntry {
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

export const api = {
  async getProfile(userId: string): Promise<UserProfile> {
    const profileData = await get(`/profile?userId=${userId}`);
    return mapUserProfile(profileData);
  },
  saveProfile: (userId: string, profileData: Omit<UserProfile, "userId" | "updatedAt">) => {
    return post("/profile", {userId, ...profileData});
  },
  generatePlan: (userId: string) => {
    return post("/plan/generate", {userId});
  },
  async getCurrentPlan(userId: string): Promise<TrainingPlan> {
    const planData = await get(`/plan/current?userId=${userId}`);
    return mapTrainingPlan(planData);
  },
  async getPlanHistory(userId: string): Promise<PlanHistoryEntry[]> {
    const planHistoryData = await get(`/plan/history?userId=${userId}`);
    return Array.isArray(planHistoryData) ? planHistoryData.map(mapPlanHistoryEntry) : [];
  },
};
