import type {PlanHistoryEntry, TrainingPlan, UserProfile} from "../types";
import {buildRequestHeaders, mapPlanHistoryEntry, mapTrainingPlan, mapUserProfile} from "./utils";

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
  const res = await fetch(`${BASE_URL}/api${path}`, {
    headers: await buildRequestHeaders(),
  });
  if (!res.ok) {
    throw new ApiError((await res.json().catch(() => ({}))).error || "Request failed", res.status);
  }
  return res.json();
}

async function post(path: string, body: object) {
  const res = await fetch(`${BASE_URL}/api${path}`, {
    method: "POST",
    headers: await buildRequestHeaders({"Content-Type": "application/json"}),
    body: JSON.stringify(body),
  });

  if (!res.ok)
    throw new ApiError((await res.json().catch(() => ({}))).error || "Request failed", res.status);

  return res.json();
}

export const api = {
  async getProfile(): Promise<UserProfile> {
    const profileData = await get("/profile");
    return mapUserProfile(profileData);
  },
  saveProfile: (profileData: Omit<UserProfile, "userId" | "updatedAt">) => {
    return post("/profile", profileData);
  },
  generatePlan: () => {
    return post("/plan/generate", {});
  },
  async getCurrentPlan(): Promise<TrainingPlan> {
    const planData = await get("/plan/current");
    return mapTrainingPlan(planData);
  },
  async getTrainingPlan(planId: string): Promise<TrainingPlan> {
    const planData = await get(`/plan/${planId}`);
    return mapTrainingPlan(planData);
  },
  async getPlanHistory(): Promise<PlanHistoryEntry[]> {
    const planHistoryData = await get("/plan/history");
    return Array.isArray(planHistoryData) ? planHistoryData.map(mapPlanHistoryEntry) : [];
  },
};
