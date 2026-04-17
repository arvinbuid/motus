import {Prisma} from "../../generated/prisma/client.js";
import {PlanJSON} from "../../types/index.js";

export function serializeTrainingPlan(plan: {
  id: string;
  user_id: string;
  plan_json: Prisma.JsonValue;
  plan_text: string;
  version: number;
  created_at: Date;
}) {
  const planJson = plan.plan_json as unknown as PlanJSON; // cast as custom PlanJSON type

  return {
    id: plan.id,
    userId: plan.user_id,
    overview: planJson.overview,
    weeklySchedule: planJson.weeklySchedule,
    planText: plan.plan_text,
    version: plan.version,
    createdAt: plan.created_at,
  };
}

export function serializePlanHistoryEntry(plan: {
  id: string;
  user_id: string;
  plan_json: Prisma.JsonValue;
  version: number;
  created_at: Date;
}) {
  const planJson = plan.plan_json as unknown as PlanJSON;
  const weeklySchedule = Array.isArray(planJson?.weeklySchedule) ? planJson.weeklySchedule : [];

  return {
    id: plan.id,
    userId: plan.user_id,
    version: plan.version,
    createdAt: plan.created_at,
    overview: planJson?.overview ?? null,
    workoutDays: weeklySchedule.length,
    totalExercises: weeklySchedule.reduce((total, day) => {
      const exercises = Array.isArray(day?.exercises) ? day.exercises.length : 0;
      return total + exercises;
    }, 0),
  };
}
