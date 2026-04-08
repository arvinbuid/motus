import { Route, Routes } from "react-router"
import { NeonAuthUIProvider } from '@neondatabase/neon-js/auth/react';
import { authClient } from './lib/auth';
import Home from "./pages/Home"
import Account from "./pages/Account"
import Auth from "./pages/Auth"
import Onboarding from "./pages/Onboarding"
import Profile from "./pages/Profile"
import Navbar from "./components/layout/Navbar"
import { AuthProvider } from "./context/AuthProvider";
import { Toaster } from "react-hot-toast";

function App() {
  return (
    <AuthProvider>
      <main className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1">
          <Toaster />
          <Routes>
            <Route index element={<Home />} />
            <Route path='/account/:pathname' element={<Account />} />
            <Route path='/auth/:pathname' element={<Auth />} />
            <Route path='/onboarding' element={<Onboarding />} />
            <Route path='/profile' element={<Profile />} />
          </Routes>
        </div>
      </main>
    </AuthProvider>
  )
}

export default App
