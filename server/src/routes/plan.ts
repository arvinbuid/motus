import {Router, type Request, type Response} from "express";
import {prisma} from "../lib/prisma.js";
import {generateTrainingPlan} from "../lib/ai.js";

const planRouter = Router();

function serializeTrainingPlan(plan: {
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

function serializePlanHistoryEntry(plan: {
  id: string;
  user_id: string;
  plan_json: any;
  version: number;
  created_at: Date;
}) {
  const weeklySchedule = Array.isArray(plan.plan_json?.weeklySchedule) ? plan.plan_json.weeklySchedule : [];

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

planRouter.get("/current", async (req: Request, res: Response) => {
  try {
    const userId = req.query.userId as string;

    if (!userId) {
      return res.status(400).json({error: "User ID is required"});
    }

    const plan = await prisma.training_plans.findFirst({
      where: {user_id: userId},
      orderBy: {created_at: "desc"},
    });

    if (!plan) {
      return res.status(404).json({error: "Plan not found"});
    }

    res.json(serializeTrainingPlan(plan));
  } catch (error) {
    console.error("Error saving plan:", error);
    res.status(500).json({error: "Failed to fetch plan"});
  }
});

planRouter.get("/history", async (req: Request, res: Response) => {
  try {
    const userId = req.query.userId as string;

    if (!userId) {
      return res.status(400).json({error: "User ID is required"});
    }

    const plans = await prisma.training_plans.findMany({
      where: {user_id: userId},
      orderBy: [{version: "desc"}, {created_at: "desc"}],
    });

    res.json(plans.map(serializePlanHistoryEntry));
  } catch (error) {
    console.error("Error fetching plan history:", error);
    res.status(500).json({error: "Failed to fetch plan history"});
  }
});

planRouter.post("/generate", async (req: Request, res: Response) => {
  try {
    const {userId} = req.body;

    if (!userId) {
      return res.status(400).json({error: "User ID is required"});
    }

    const profile = await prisma.user_profiles.findUnique({
      where: {user_id: userId},
    });

    if (!profile) {
      return res.status(400).json({error: "User profile not found. Complete onboarding first"});
    }

    // Get the latest plan
    const latestPlan = await prisma.training_plans.findFirst({
      where: {user_id: userId},
      orderBy: {created_at: "desc"},
      select: {version: true},
    });

    const nextVersion = latestPlan ? latestPlan.version + 1 : 1;

    let planJson;

    try {
      planJson = await generateTrainingPlan(profile);
    } catch (error) {
      console.error("AI generation failed:", error);
      return res.status(500).json({
        error: "Failed to generate training plan. Please try again.",
        details: error instanceof Error ? error.message : "Unknown error",
      });
    }

    const planText = JSON.stringify(planJson, null, 2);

    const newPlan = await prisma.training_plans.create({
      data: {
        user_id: userId,
        plan_json: planJson,
        plan_text: planText,
        version: nextVersion,
      },
    });

    res.json({
      id: newPlan.id,
      version: newPlan.version,
      createdAt: newPlan.created_at,
    });
  } catch (error) {
    console.error("Error saving plan:", error);
    res.status(500).json({error: "Failed to save plan"});
  }
});

export default planRouter;
