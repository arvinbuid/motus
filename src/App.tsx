import { BrowserRouter, Route, Routes } from "react-router"
import Home from "./pages/Home"
import Account from "./pages/Account"
import Auth from "./pages/Auth"
import Onboarding from "./pages/Onboarding"
import Profile from "./pages/Profile"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route index element={<Home />} />
        <Route path='/account/:pathname' element={<Account />} />
        <Route path='/auth/:pathname' element={<Auth />} />
        <Route path='/onboarding' element={<Onboarding />} />
        <Route path='/profile' element={<Profile />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
