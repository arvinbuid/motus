import { useEffect, useRef, useState } from "react";
import { Navigate } from "react-router";
import { useAuth } from "../context/AuthContext";
import { useCurrentPlan } from "../hooks/useCurrentPlan";
import { usePlanHistory } from "../hooks/usePlanHistory";
import { useTrainingPlan } from "../hooks/useTrainingPlan";
import { useGenerateTrainingPlan } from "../hooks/useMutations";
import { Button } from "../components/ui/Button";
import { ArrowLeftCircle, Calendar, DownloadIcon, Dumbbell, EyeIcon, Loader2, RefreshCcw, Target, TrendingUp } from "lucide-react";
import { Card } from "../components/ui/Card";
import PlanDisplay from "../components/plan/PlanDisplay";
import PlanHistory from "../components/plan/PlanHistory";
import { Page, Text, View, Document, StyleSheet, PDFDownloadLink, Font } from '@react-pdf/renderer';
import type { TrainingPlan } from "../types";
import { formatDate, formatSplitType } from "../lib/utils";

// Register fonts
Font.register({
    family: 'Roboto', fonts: [
        { src: '/fonts/DMSans-Light.ttf' },
        { src: '/fonts/DMSans-Regular.ttf' },
        { src: '/fonts/DMSans-SemiBold.ttf' },
    ]
})

// PDF styles
const styles = StyleSheet.create({
    page: { padding: 30, marginLeft: 20, fontFamily: "Roboto" },
    title: { fontSize: 24, fontWeight: "bold", marginBottom: 4 },
    subtitle: { fontSize: 12, color: "#555555", marginBottom: 16 },
    section: { marginBottom: 14 },
    dayHeader: { fontSize: 16, fontWeight: "bold", marginBottom: 6 },
    exercise: { fontSize: 12, marginBottom: 4, paddingLeft: 10 },
})

const TrainingPlanPDF = ({ plan }: { plan: TrainingPlan }) => (
    <Document>
        <Page style={styles.page}>
            <Text style={styles.title}>Motus - Your Training Plan</Text>
            <Text style={styles.subtitle}>Version {plan.version} • {plan.overview.frequency}</Text>

            {plan.weeklySchedule.map((day) => (
                <View key={day.day} style={styles.section}>
                    <Text style={styles.dayHeader}>{day.day} — {day.focus}</Text>
                    {day.exercises.map((ex) => (
                        <Text key={ex.name} style={styles.exercise}>
                            • {ex.name}  {ex.sets}x{ex.reps}  Rest: {ex.rest}  RPE: {ex.rpe}
                        </Text>
                    ))}
                </View>
            ))}

            <View style={{ fontSize: 12, marginTop: 12, width: "90%" }}>
                <Text style={styles.dayHeader}>Progression Strategy: </Text>
                <Text>{plan.progression}</Text>
            </View>
        </Page>
    </Document>
);

const Profile = () => {
    const { user, isLoading } = useAuth();
    const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);
    const { data: plan, isLoading: isPlanLoading, error: planError } = useCurrentPlan();
    const { data: planHistory = [], isLoading: isPlanHistoryLoading, error: planHistoryError } = usePlanHistory();
    const {
        data: selectedPlan,
        isLoading: isSelectedPlanLoading,
        error: selectedPlanError,
    } = useTrainingPlan(selectedPlanId);
    const generateTrainingPlan = useGenerateTrainingPlan();
    const profileDivRef = useRef<HTMLDivElement>(null);

    // Scroll to top of page when selecting older plan version
    useEffect(() => {
        if (!plan || !selectedPlanId || isSelectedPlanLoading || !selectedPlan) {
            return;
        }

        profileDivRef.current?.scrollIntoView({
            behavior: "smooth",
            block: "start",
        });
    }, [plan, selectedPlanId, isSelectedPlanLoading, selectedPlan]);

    if (!user && !isLoading) {
        return <Navigate to='/auth/sign-in' replace />;
    }

    if (!plan) {
        return <Navigate to='/onboarding' replace />
    }


    if (isLoading || (user && isPlanLoading)) {
        return (
            <div className="min-h-screen pt-24 pb-12 px-6">
                <div className="max-w-4xl mx-auto">
                    <Card variant="bordered" className="py-16 text-center">
                        <Loader2 className="w-10 h-10 text-accent animate-spin mx-auto mb-4" />
                        <h1 className="text-2xl font-bold mb-2">Loading your training plan...</h1>
                        <p className="text-muted">Fetching your latest personalized program.</p>
                    </Card>
                </div>
            </div>
        );
    }

    if (planError) {
        return (
            <div className="min-h-screen pt-24 pb-12 px-6">
                <div className="max-w-4xl mx-auto">
                    <Card variant="bordered" className="py-16 text-center">
                        <h1 className="text-2xl font-bold mb-2">Unable to load your plan</h1>
                        <p className="text-muted">
                            {planError instanceof Error ? planError.message : "Something went wrong while loading your training plan."}
                        </p>
                    </Card>
                </div>
            </div>
        );
    }

    const displayPlan = selectedPlan ?? plan;
    const isViewingPastVersion = !!selectedPlanId && displayPlan.id !== plan.id;

    const handleSelectPlan = (planId: string) => {
        if (planId === plan.id) {
            setSelectedPlanId(null);
            return;
        }
        setSelectedPlanId(planId);
    };

    return (
        <div className="min-h-screen scroll-mt-24 pt-24 pb-12 px-6" ref={profileDivRef}>
            <div className="max-w-4xl mx-auto">
                <div className="flex flex-col justify-between gap-4 mb-8">
                    <div>
                        <h1 className='text-3xl font-bold mb-1'>
                            {isViewingPastVersion ? "Viewing Saved Plan Version" : "Your Current Training Plan"}
                        </h1>
                        <p className="text-muted flex items-center gap-2">
                            Version {displayPlan.version} • Created {formatDate(displayPlan.createdAt)}
                            {isViewingPastVersion && <EyeIcon className="w-5 h-5" />}
                        </p>
                    </div>

                    <div className="flex flex-col md:flex-row gap-3 mt-2 md:mt-0">
                        {/* Download PDF Button */}
                        <PDFDownloadLink
                            document={<TrainingPlanPDF plan={displayPlan} />}
                            fileName={`Training Plan v${displayPlan.version}.pdf`}
                        >
                            {({ loading }) => (
                                <Button
                                    className="gap-2 w-full text-sm"
                                    variant="secondary"
                                    disabled={isViewingPastVersion}
                                >
                                    <DownloadIcon className="w-4 h-4" />
                                    {loading ? 'Preparing PDF...' : 'Download PDF'}
                                </Button>
                            )}
                        </PDFDownloadLink>

                        {/* Regenerate New Training Plan Button */}
                        <Button
                            className="gap-2 text-sm"
                            onClick={async () => await generateTrainingPlan.mutateAsync()}
                            disabled={generateTrainingPlan.isPending || isViewingPastVersion}
                        >
                            <RefreshCcw className={`w-4 h-4 ${generateTrainingPlan.isPending ? 'animate-spin' : ''}`} />
                            {generateTrainingPlan.isPending ? 'Regenerating...' : 'Regenerate Plan'}
                        </Button>

                        {/* Back to Latest Plan Button */}
                        {isViewingPastVersion && (
                            <Button
                                className="gap-2 text-sm"
                                variant="ghost"
                                onClick={() => setSelectedPlanId(null)}
                            >
                                <ArrowLeftCircle />
                                Back to Latest Plan
                            </Button>
                        )}
                    </div>
                </div>

                {selectedPlanId && isSelectedPlanLoading ? (
                    <Card variant="bordered" className="mb-8 py-6">
                        <div className="flex items-center gap-3">
                            <Loader2 className="w-5 h-5 text-accent animate-spin" />
                            <p className="text-sm text-muted">Loading selected plan version...</p>
                        </div>
                    </Card>
                ) : null}

                {selectedPlanId && selectedPlanError ? (
                    <Card variant="bordered" className="mb-8">
                        <h2 className="font-semibold text-lg mb-2">Unable to load selected version</h2>
                        <p className="text-muted text-sm mb-4">
                            {selectedPlanError instanceof Error ? selectedPlanError.message : "Something went wrong while loading that saved plan."}
                        </p>
                        <Button type="button" variant="secondary" onClick={() => setSelectedPlanId(null)}>
                            Back to Latest Plan
                        </Button>
                    </Card>
                ) : null}

                {/* Plan Overview Cards */}
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    <Card variant="bordered" className="flex items-center gap-3">
                        <div className="w-10 h-10 flex items-center justify-center">
                            <Target className="w-5 h-5 text-accent" />
                        </div>
                        <div className="space-y-1">
                            <p className="text-xs text-accent">Goal</p>
                            <p className="font-medium text-sm">{displayPlan.overview.goal}</p>
                        </div>
                    </Card>
                    <Card variant="bordered" className="flex items-center gap-3">
                        <div className="w-10 h-10 flex items-center justify-center">
                            <Calendar className="w-5 h-5 text-accent" />
                        </div>
                        <div>
                            <p className="text-xs text-muted">Frequency</p>
                            <p className="font-medium text-sm">{displayPlan.overview.frequency}</p>
                        </div>
                    </Card>
                    <Card variant="bordered" className="flex items-center gap-3">
                        <div className="w-10 h-10 flex items-center justify-center">
                            <Dumbbell className="w-5 h-5 text-accent" />
                        </div>
                        <div>
                            <p className="text-xs text-muted">Split</p>
                            <p className="font-medium text-sm">{formatSplitType(displayPlan.overview.split)}</p>
                        </div>
                    </Card>
                    <Card variant="bordered" className="flex items-center gap-3">
                        <div className="w-10 h-10 flex items-center justify-center">
                            <TrendingUp className="w-5 h-5 text-accent" />
                        </div>
                        <div>
                            <p className="text-xs text-muted">{isViewingPastVersion ? "Viewing" : "Version"}</p>
                            <p className="font-medium text-sm">{displayPlan.version}</p>
                        </div>
                    </Card>
                </div>

                {/* Plan Notes */}
                <Card variant="bordered" className="mb-8">
                    <h2 className="font-semibold text-lg mb-2">Program Notes</h2>
                    <p className="text-muted text-sm leading-relaxed">
                        {displayPlan.overview.notes}
                    </p>
                </Card>

                {/* Weekly Schedule */}
                <h2 className="font-semibold text-xl mb-4">Weekly Schedule</h2>

                {/* Plan Display */}
                <PlanDisplay weeklySchedule={displayPlan.weeklySchedule} />

                {/* Progression Strategy */}
                <Card variant="bordered" className="mb-8">
                    <h2 className="font-semibold text-lg mb-2">Progression Strategy</h2>
                    <p className="text-muted text-sm leading-relaxed">
                        {displayPlan.progression}
                    </p>
                </Card>

                <PlanHistory
                    entries={planHistory}
                    currentPlanId={plan.id}
                    selectedPlanId={selectedPlanId}
                    onSelectPlan={handleSelectPlan}
                    isLoading={isPlanHistoryLoading}
                    error={planHistoryError instanceof Error ? planHistoryError : null}
                />
            </div>
        </div>
    );
}

export default Profile;
