import { Link, Navigate } from "react-router";
import { useAuth } from "../context/AuthContext";
import DarkVeil from "../components/ui/DarkVeil";
import { Button } from "../components/ui/Button";

const Home = () => {
    const { user, isLoading } = useAuth();

    if (user && !isLoading) {
        return <Navigate to='/profile' replace />
    }

    return (
        <div className="min-h-screen">
            <div>
                <div className="w-full h-screen relative">
                    <DarkVeil
                        hueShift={0}
                        noiseIntensity={0}
                        scanlineIntensity={0}
                        speed={1}
                        scanlineFrequency={0}
                        warpAmount={0}
                    />
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
                        <div className="space-y-2">
                            <h1 className="uppercase text-8xl font-bold font-bebas">
                                <span className="text-accent">Fuel up</span> and light up your spirit.
                            </h1>
                            <p className="text-muted text-lg tracking-tight">Motus provides personalized training plan, modern equipment, and smart AI to help you lose fat, build muscle, and stay consistent.</p>
                            <Link to="/auth/sign-in">
                                <Button className="mt-4" size="lg">Get Started</Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Home;