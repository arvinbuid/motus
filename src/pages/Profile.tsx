import { Navigate } from "react-router";
import { useAuth } from "../context/AuthContext";
import { Button } from "../components/ui/Button";
import { Calendar, DownloadIcon, Dumbbell, RefreshCcw, Target, TrendingUp } from "lucide-react";
import { Card } from "../components/ui/Card";
import PlanDisplay from "../components/plan/PlanDisplay";
import { Page, Text, View, Document, StyleSheet, PDFDownloadLink, Font } from '@react-pdf/renderer';
import type { TrainingPlan } from "../types";

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
    const { user, isLoading, plan, generateTrainingPlan, isRegeneratingTrainingPlan } = useAuth();

    if (!user && !isLoading) {
        return <Navigate to='/auth/sign-in' replace />;
    }

    if (!plan) {
        return <Navigate to='/onboarding' replace />
    }

    function formatDate(dateString: string) {
        return new Date(dateString).toLocaleDateString('en-PH', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    return (
        <div className="min-h-screen pt-24 pb-12 px-6">
            <div className="max-w-4xl mx-auto">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-3xl font-bold mb-1">Your Training Plan</h1>
                        <p className="text-muted">
                            Version {plan.version} • Created {formatDate(plan.createdAt)}
                        </p>
                    </div>

                    <div className="flex flex-col md:flex-row gap-3 mt-2 md:mt-0">
                        {/* Download PDF Button */}
                        <PDFDownloadLink
                            document={<TrainingPlanPDF plan={plan} />}
                            fileName={`Training Plan v${plan.version}.pdf`}
                        >
                            {({ loading }) => (
                                <Button
                                    className="gap-2 w-full"
                                    variant="secondary"
                                >
                                    <DownloadIcon className="w-4 h-4" />
                                    {loading ? 'Preparing PDF...' : 'Download PDF'}
                                </Button>
                            )}
                        </PDFDownloadLink>
                        <Button
                            className="gap-2"
                            onClick={async () => await generateTrainingPlan()}
                            disabled={isRegeneratingTrainingPlan}
                        >
                            <RefreshCcw className={`w-4 h-4 ${isRegeneratingTrainingPlan ? 'animate-spin' : ''}`} />
                            {isRegeneratingTrainingPlan ? 'Regenerating...' : 'Regenerate Plan'}
                        </Button>
                    </div>
                </div>

                {/* Plan Overview Cards */}
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    <Card variant="bordered" className="flex items-center gap-3">
                        <div className="w-10 h-10 flex items-center justify-center">
                            <Target className="w-5 h-5 text-accent" />
                        </div>
                        <div className="space-y-1">
                            <p className="text-xs text-accent">Goal</p>
                            <p className="font-medium text-sm">{plan.overview.goal}</p>
                        </div>
                    </Card>
                    <Card variant="bordered" className="flex items-center gap-3">
                        <div className="w-10 h-10 flex items-center justify-center">
                            <Calendar className="w-5 h-5 text-accent" />
                        </div>
                        <div>
                            <p className="text-xs text-muted">Frequency</p>
                            <p className="font-medium text-sm">{plan.overview.frequency}</p>
                        </div>
                    </Card>
                    <Card variant="bordered" className="flex items-center gap-3">
                        <div className="w-10 h-10 flex items-center justify-center">
                            <Dumbbell className="w-5 h-5 text-accent" />
                        </div>
                        <div>
                            <p className="text-xs text-muted">Split</p>
                            <p className="font-medium text-sm">{plan.overview.split}</p>
                        </div>
                    </Card>
                    <Card variant="bordered" className="flex items-center gap-3">
                        <div className="w-10 h-10 flex items-center justify-center">
                            <TrendingUp className="w-5 h-5 text-accent" />
                        </div>
                        <div>
                            <p className="text-xs text-muted">Version</p>
                            <p className="font-medium text-sm">{plan.version}</p>
                        </div>
                    </Card>
                </div>

                {/* Plan Notes */}
                <Card variant="bordered" className="mb-8">
                    <h2 className="font-semibold text-lg mb-2">Program Notes</h2>
                    <p className="text-muted text-sm leading-relaxed">
                        {plan.overview.notes}
                    </p>
                </Card>

                {/* Weekly Schedule */}
                <h2 className="font-semibold text-xl mb-4">Weekly Schedule</h2>

                {/* Plan Display */}
                <PlanDisplay weeklySchedule={plan.weeklySchedule} />

                {/* Progression Strategy */}
                <Card variant="bordered" className="mb-8">
                    <h2 className="font-semibold text-lg mb-2">Progression Strategy</h2>
                    <p className="text-muted text-sm leading-relaxed">
                        {plan.progression}
                    </p>
                </Card>
            </div>
        </div>
    );
}

export default Profile;