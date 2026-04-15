export function serializeTrainingPlan(plan: {
  id: string;
  user_id: string;
  plan_json: any;
  plan_text: string;
  version: number;
  created_at: Date;
}) {
  return {
    id: plan.id,
    userId: plan.user_id,
    planJson: plan.plan_json,
    planText: plan.plan_text,
    version: plan.version,
    createdAt: plan.created_at,
  };
}

export function serializePlanHistoryEntry(plan: {
  id: string;
  user_id: string;
  plan_json: any;
  version: number;
  created_at: Date;
}) {
  const weeklySchedule = Array.isArray(plan.plan_json?.weeklySchedule)
    ? plan.plan_json.weeklySchedule
    : [];

  return {
    id: plan.id,
    userId: plan.user_id,
    version: plan.version,
    createdAt: plan.created_at,
    overview: plan.plan_json?.overview ?? null,
    workoutDays: weeklySchedule.length,
    totalExercises: weeklySchedule.reduce((total: number, day: any) => {
      const exercises = Array.isArray(day?.exercises) ? day.exercises.length : 0;
      return total + exercises;
    }, 0),
  };
}
