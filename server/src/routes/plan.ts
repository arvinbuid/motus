import {Router, type Request, type Response} from "express";
import {prisma} from "../lib/prisma.js";

const planRouter = Router();

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

    // TODO: LLM logic for generating plan

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
