import { Link } from "react-router";
import { Button } from "../ui/Button";
import { useAuth } from "../../context/AuthContext";
import { UserButton } from "@neondatabase/neon-js/auth/react";

const Navbar = () => {
    const { user } = useAuth()
    return (
        <header className="fixed top-0 left-0 right-0 z-100 border-b border-border bg-background/80 backdrop-blur-md">
            <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
                <Link
                    to='/'
                    className="flex items-center gap-3 text-[(--color-foreground)]"
                >
                    <span className="uppercase font-semibold text-lg tracking-wide">Motus.</span>
                </Link>

                <nav>
                    {user ? (
                        <div className="flex items-center gap-2">
                            <Link to="/profile">
                                <Button variant="ghost" size="sm">My Plan</Button>
                            </Link>
                            <UserButton className="bg-accent" size="icon" />
                        </div>
                    ) : (
                        <div className="flex items-center gap-3">
                            <Link to="/auth/sign-in">
                                <Button variant="ghost" size="sm">Sign In</Button>
                            </Link>
                            <Link to="/auth/sign-up">
                                <Button size="sm">Sign Up</Button>
                            </Link>
                        </div>
                    )}
                </nav>
            </div>
        </header>
    );
}

export default Navbar;