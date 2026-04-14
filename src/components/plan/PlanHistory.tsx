import { Clock3, GitBranch, History, Sparkles } from "lucide-react";
import type { PlanHistoryEntry } from "../../types";
import { Card } from "../ui/Card";
import { formatDate, formatSplitType } from "../../lib/utils";

interface PlanHistoryProps {
  entries: PlanHistoryEntry[];
  currentPlanId: string;
  isLoading?: boolean;
  error?: Error | null;
}

export default function PlanHistory({
  entries,
  currentPlanId,
  isLoading = false,
  error = null,
}: PlanHistoryProps) {
  const recentGeneratedPlans = entries.slice(0, 5);

  if (isLoading) {
    return (
      <Card variant="bordered">
        <div className="flex items-center gap-2 mb-2">
          <History className="w-4 h-4 text-accent" />
          <h2 className="text-lg font-semibold">Plan History</h2>
        </div>
        <p className="text-sm text-muted">Loading your plan versions...</p>
      </Card>
    );
  }

  if (error) {
    return (
      <Card variant="bordered">
        <div className="flex items-center gap-2 mb-2">
          <History className="w-4 h-4 text-accent" />
          <h2 className="text-lg font-semibold">Plan History</h2>
        </div>
        <p className="text-sm text-muted">
          {error.message || "Something went wrong while loading your saved plan history."}
        </p>
      </Card>
    );
  }

  return (
    <Card variant="bordered">
      <div className="flex items-center justify-between gap-4 mb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <History className="w-4 h-4 text-accent" />
            <h2 className="text-lg font-semibold">Plan History</h2>
          </div>
          <p className="text-sm text-muted">
            Here are the 5 recent versions of your training plan.
          </p>
        </div>
        <div className="text-right text-sm text-muted">
          {/* Display 5 recent generated plan versions */}
          <span>
            {recentGeneratedPlans.length} saved version{recentGeneratedPlans.length === 1 ? "" : "s"}
          </span>
        </div>
      </div>

      <div className="space-y-3">
        {recentGeneratedPlans.length === 0 ? (
          <div className="rounded-md border border-dashed border-border p-4 text-sm text-muted">
            Your generated plans will appear here once you start creating versions.
          </div>
        ) : null}

        {recentGeneratedPlans.map((plan) => {
          const isCurrentPlan = plan.id === currentPlanId;

          return (
            <div
              key={plan.id}
              className="rounded-md border border-border bg-background/60 p-4"
            >

              <div className="space-y-3">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-sm font-semibold uppercase tracking-wide">
                    Version {plan.version}
                  </span>
                  {isCurrentPlan ? (
                    <span className="rounded-full bg-accent px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wide text-black">
                      Current
                    </span>
                  ) : null}
                </div>

                <div className="flex flex-col md:flex-row md:justify-between">
                  <div className="flex flex-col md:flex-row text-md text-muted">
                    <div>
                      <div className="flex items-center gap-2">
                        <Clock3 className="w-4 h-4 text-accent" />
                        <span>{formatDate(plan.createdAt)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <GitBranch className="w-4 h-4 text-accent" />
                        <span>{formatSplitType(plan.overview?.split)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-accent" />
                        <span>
                          {plan.workoutDays} days • {plan.totalExercises} exercises
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-3 md:mt-0">
                    <p className="font-medium">
                      {plan.overview?.goal || "Personalized training plan"}
                    </p>
                    <p className="text-sm text-muted">
                      {plan.overview?.frequency || "Custom training frequency"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
