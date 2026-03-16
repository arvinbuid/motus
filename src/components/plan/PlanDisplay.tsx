import { Dumbbell, Info } from "lucide-react";
import type { DaySchedule, Exercise } from "../../types";
import { Card } from "../ui/Card";

interface PlanDisplayProps {
    weeklySchedule: Array<DaySchedule>
}

const PlanDisplay = ({ weeklySchedule }: PlanDisplayProps) => {
    return (
        <div className="space-y-6 mb-8">
            {weeklySchedule.map((schedule, key) => (
                <DayCard key={key} schedule={schedule} />
            ))}
        </div>
    );
}

function DayCard({ schedule }: { schedule: DaySchedule }) {
    return (
        <Card variant="bordered" className="overflow-hidden">
            <div className="flex items-center justify-between mb-4">
                <div>
                    <h3 className="font-semibold text-lg uppercase tracking-wider">{schedule.day}</h3>
                    <p className="text-sm text-accent">{schedule.focus}</p>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted">
                    <Dumbbell className="w-4 h-4" />
                    <span>{schedule.exercises.length} exercises</span>
                </div>
            </div>

            <div className="overflow-x-auto -mx-6 px-6">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="text-muted text-xs uppercase tracking-wider">
                            <th className="text-left py-2 pr-4 font-medium">Excercise</th>
                            <th className="py-2 px-4 font-medium">Sets x Reps</th>
                            <th className="py-2 px-4 font-medium">Rest</th>
                            <th className="py-2 px-4 font-medium">RPE</th>
                        </tr>
                    </thead>

                    <tbody>
                        {schedule.exercises.map((exercise, key) => (
                            <ExerciseRow key={key} exercise={exercise} index={key} />
                        ))}
                    </tbody>
                </table>
            </div>
        </Card>
    )
}

function ExerciseRow({ exercise, index }: { exercise: Exercise, index: number }) {
    return (
        <tr className="border-b border-border last:border-0">
            {/* Exercise */}
            <td className="py-3 pr-2 md:pr-0">
                <div className="flex items-start gap-3">
                    <span className="text-xs text-muted w-5">
                        {index + 1}.
                    </span>
                    <div className="w-50">
                        <p className="font-medium">{exercise.name}</p>
                        {exercise.notes && (
                            <p className="text-xs text-muted mt-0.5 flex items-center gap-1">
                                <Info className="w-3 h-3" />
                                {exercise.notes}
                            </p>
                        )}
                    </div>
                </div>
            </td>

            {/* Sets x Reps */}
            <td className="py-3 px-4 text-center whitespace-nowrap">
                <span className="text-accent font-medium">
                    {exercise.sets}
                </span>
                <span className="text-muted"> x </span>
                <span>{exercise.reps}</span>
            </td>

            {/* Rest */}
            <td className="py-3 px-4 text-center whitespace-nowrap">
                <span className="text-muted">{exercise.rest}</span>
            </td>

            {/* RPE */}
            <td className="py-3 px-4 text-center">
                <span
                    className={`inline-flex items-center justify-center w-8 h-8 rounded-lg text-sm font-medium ${exercise.rpe >= 8 ? `bg-red-500/10 text-red-400`
                        : exercise.rpe >= 7 ? "bg-yellow-500/10 text-yellow-400"
                            : "bg-green-500/10 text-green-400"
                        }`}
                >
                    {exercise.rpe}
                </span>
            </td>
        </tr>
    )
}

export default PlanDisplay;