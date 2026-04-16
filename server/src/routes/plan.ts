import {Router, type Request, type Response} from "express";
import {prisma} from "../lib/prisma.js";
import {generateTrainingPlan} from "../lib/ai.js";
import {serializePlanHistoryEntry, serializeTrainingPlan} from "../lib/utils.js";

const planRouter = Router();

planRouter.get("/current", async (req: Request, res: Response) => {
  try {
    const userId = req.auth.userId;

    if (!userId) {
      return res.status(401).json({error: "Unauthorized"});
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
    const userId = req.auth.userId;

    if (!userId) {
      return res.status(401).json({error: "Unauthorized"});
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

planRouter.get("/:planId", async (req: Request, res: Response) => {
  try {
    const userId = req.auth.userId;
    const planIdParam = req.params.planId;
    const planId = Array.isArray(planIdParam) ? planIdParam[0] : planIdParam;

    if (!userId) {
      return res.status(401).json({error: "Unauthorized"});
    }

    if (!planId) {
      return res.status(400).json({error: "Plan ID is required"});
    }

    const plan = await prisma.training_plans.findFirst({
      where: {
        id: planId,
        user_id: userId,
      },
    });

    if (!plan) {
      return res.status(404).json({error: "Plan not found"});
    }

    res.json(serializeTrainingPlan(plan));
  } catch (error) {
    console.error("Error fetching previous plan:", error);
    res.status(500).json({error: "Failed to fetch plan"});
  }
});

planRouter.post("/generate", async (req: Request, res: Response) => {
  try {
    const userId = req.auth.userId;

    if (!userId) {
      return res.status(401).json({error: "Unauthorized"});
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
