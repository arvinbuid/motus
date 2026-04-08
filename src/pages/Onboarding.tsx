import { RedirectToSignIn, SignedIn } from "@neondatabase/neon-js/auth/react";
import { useAuth } from "../context/AuthContext";
import { useCurrentPlan } from "../hooks/useCurrentPlan";
import { useCurrentProfile } from "../hooks/useCurrentProfile";
import { useGenerateTrainingPlan, useSaveProfile } from "../hooks/useMutations";
import { Card } from "../components/ui/Card";
import { Select } from "../components/ui/Select";
import { useState } from "react";
import { Textarea } from "../components/ui/TextArea";
import { Button } from "../components/ui/Button";
import { ArrowRight, Loader2 } from "lucide-react";
import type { UserProfile } from "../types";
import { Navigate, useNavigate } from "react-router";

const goalOptions = [
    { value: "bulk", label: "Build Muscle (Bulk)" },
    { value: "cut", label: "Lose Fat (Cut)" },
    { value: "recomp", label: "Body Recomposition" },
    { value: "strength", label: "Build Strength" },
    { value: "endurance", label: "Improve Endurance" },
];

const experienceOptions = [
    { value: "beginner", label: "Beginner (0-1 years)" },
    { value: "intermediate", label: "Intermediate (1-3 years)" },
    { value: "advanced", label: "Advanced (3+ years)" },
];

const daysOptions = [
    { value: "2", label: "2 days per week" },
    { value: "3", label: "3 days per week" },
    { value: "4", label: "4 days per week" },
    { value: "5", label: "5 days per week" },
    { value: "6", label: "6 days per week" },
];

const sessionOptions = [
    { value: "30", label: "30 minutes" },
    { value: "45", label: "45 minutes" },
    { value: "60", label: "60 minutes" },
    { value: "90", label: "90 minutes" },
    { value: "120", label: "120 minutes" },
];

const equipmentOptions = [
    { value: "full_gym", label: "Full Gym Access" },
    { value: "home", label: "Home Gym" },
    { value: "dumbbells", label: "Dumbbells Only" },
    { value: "barbell", label: "Barbell & Plates" },
    { value: "resistance_bands", label: "Resistance Bands" },
];

const splitOptions = [
    { value: "full_body", label: "Full Body" },
    { value: "upper_lower", label: "Upper/Lower Split" },
    { value: "ppl", label: "Push/Pull/Legs" },
    { value: "bro_split", label: "Bro Split (One Muscle/Day)" },
    { value: "custom", label: "Let AI Decide" },
];

const defaultFormData = {
    goal: "bulk",
    experience: "beginner",
    daysPerWeek: "2",
    sessionLength: "30",
    equipment: "full_gym",
    injuries: "",
    preferredSplit: "full_body",
};

type OnboardingFormData = typeof defaultFormData;

function toFormData(profile: UserProfile | null | undefined): OnboardingFormData {
    if (!profile) {
        return defaultFormData;
    }

    return {
        goal: profile.goal,
        experience: profile.experience,
        daysPerWeek: String(profile.daysPerWeek),
        sessionLength: String(profile.sessionLength),
        equipment: profile.equipment,
        injuries: profile.injuries ?? "",
        preferredSplit: profile.preferredSplit,
    };
}

function OnboardingForm({
    initialFormData,
    hasExistingProfile,
}: {
    initialFormData: OnboardingFormData;
    hasExistingProfile: boolean;
}) {
    const saveProfile = useSaveProfile();
    const generateTrainingPlan = useGenerateTrainingPlan();
    const [formData, setFormData] = useState(initialFormData);
    const navigate = useNavigate();
    const isGenerating = saveProfile.isPending || generateTrainingPlan.isPending;

    const updateForm = (field: string, value: string) => {
        setFormData((prev) => ({ ...prev, [field]: value }))
    }

    const handleSubmitQuestionnaire = async (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();

        const profile: Omit<UserProfile, "userId" | "updatedAt"> = {
            goal: formData.goal as UserProfile["goal"],
            experience: formData.experience as UserProfile["experience"],
            daysPerWeek: parseInt(formData.daysPerWeek),
            sessionLength: parseInt(formData.sessionLength),
            equipment: formData.equipment as UserProfile["equipment"],
            injuries: formData.injuries || undefined,
            preferredSplit: formData.preferredSplit as UserProfile["preferredSplit"],
        }

        try {
            await saveProfile.mutateAsync(profile)
            await generateTrainingPlan.mutateAsync();
            navigate("/profile");
        } catch {
            return;
        }
    }

    return (
        <div className="max-w-lg mx-auto">
            {!isGenerating ? (<Card variant="bordered">
                <h1 className="text-2xl font-bold mb-2">Tell Us About Yourself</h1>
                <p className="text-muted mb-6">Help us create a perfect plan for you.</p>
                <form onSubmit={handleSubmitQuestionnaire} className="space-y-5">
                    <Select
                        id="goal"
                        label="What's your primary goal?"
                        options={goalOptions}
                        value={formData.goal}
                        onChange={(e) => updateForm("goal", e.target.value)}
                    />
                    <Select
                        id="experience"
                        label="Training experience"
                        options={experienceOptions}
                        value={formData.experience}
                        onChange={(e) => updateForm("experience", e.target.value)}
                    />
                    <div className="grid grid-cols-2 gap-4">
                        <Select
                            id="daysPerWeek"
                            label="Days per week"
                            options={daysOptions}
                            value={formData.daysPerWeek}
                            onChange={(e) => updateForm("daysPerWeek", e.target.value)}
                        />
                        <Select
                            id="sessionLength"
                            label="Session length"
                            options={sessionOptions}
                            value={formData.sessionLength}
                            onChange={(e) => updateForm("sessionLength", e.target.value)}
                        />
                    </div>
                    <Select
                        id="equipment"
                        label="Equipment access"
                        options={equipmentOptions}
                        value={formData.equipment}
                        onChange={(e) => updateForm("equipment", e.target.value)}
                    />
                    <Select
                        id="preferredSplit"
                        label="Preferred training split"
                        options={splitOptions}
                        value={formData.preferredSplit}
                        onChange={(e) => updateForm("preferredSplit", e.target.value)}
                    />

                    <Textarea
                        id="injuries"
                        label="Any injuries or limitations? (optional)"
                        placeholder="E.g., lower back issues, shoulder impingement..."
                        rows={3}
                        value={formData.injuries}
                        onChange={(e) => updateForm("injuries", e.target.value)}
                    />

                    <div className="flex pt-1">
                        <Button className="flex-1 gap-2" type="submit" disabled={isGenerating}>
                            {hasExistingProfile ? "Update Profile & Generate Plan" : "Generate My Plan"} <ArrowRight className="w-4 h-4" />
                        </Button>
                    </div>
                </form>
            </Card>) : (
                <Card variant="bordered" className="py-16 text-center">
                    <Loader2 className="w-14 h-14 text-accent animate-spin mx-auto mb-4" />
                    <h2 className="text-2xl font-bold mb-2">Generating your plan...</h2>
                    <p className="text-muted">Our AI is building your personalized training program.</p>
                </Card>
            )}
        </div>
    );
}

const Onboarding = () => {
    const { user } = useAuth();
    const { data: existingPlan, isLoading: isPlanLoading, error: planError } = useCurrentPlan();
    const { data: existingProfile, isLoading: isProfileLoading, error: profileError } = useCurrentProfile();

    if (!user) {
        return <RedirectToSignIn />
    }

    if (existingPlan) {
        return <Navigate to='/profile' replace />
    }

    if (isPlanLoading || isProfileLoading) {
        return (
            <SignedIn>
                <div className="min-h-screen pt-24 pb-12 px-6">
                    <div className="max-w-lg mx-auto">
                        <Card variant="bordered" className="py-16 text-center">
                            <Loader2 className="w-14 h-14 text-accent animate-spin mx-auto mb-4" />
                            <h2 className="text-2xl font-bold mb-2">Loading your profile...</h2>
                            <p className="text-muted">Preparing your saved preferences.</p>
                        </Card>
                    </div>
                </div>
            </SignedIn>
        );
    }

    if (planError) {
        return (
            <SignedIn>
                <div className="min-h-screen pt-24 pb-12 px-6">
                    <div className="max-w-lg mx-auto">
                        <Card variant="bordered" className="py-16 text-center">
                            <h2 className="text-2xl font-bold mb-2">Unable to load your plan</h2>
                            <p className="text-muted">
                                {planError instanceof Error ? planError.message : "Something went wrong while loading your training plan."}
                            </p>
                        </Card>
                    </div>
                </div>
            </SignedIn>
        );
    }

    if (profileError) {
        return (
            <SignedIn>
                <div className="min-h-screen pt-24 pb-12 px-6">
                    <div className="max-w-lg mx-auto">
                        <Card variant="bordered" className="py-16 text-center">
                            <h2 className="text-2xl font-bold mb-2">Unable to load your profile</h2>
                            <p className="text-muted">
                                {profileError instanceof Error ? profileError.message : "Something went wrong while loading your saved preferences."}
                            </p>
                        </Card>
                    </div>
                </div>
            </SignedIn>
        );
    }

    return (
        <SignedIn>
            <div className="min-h-screen pt-24 pb-12 px-6">
                <OnboardingForm
                    key={user.id}
                    initialFormData={toFormData(existingProfile)}
                    hasExistingProfile={!!existingProfile}
                />
            </div>
        </SignedIn>
    );
}

export default Onboarding;
