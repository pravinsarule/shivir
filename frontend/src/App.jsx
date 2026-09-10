import { BrowserRouter } from 'react-router-dom'
import Home from './pages/Home.jsx'
import Login from './pages/Login.jsx'
import VidyaMandirDashboard from './dashboards/vidya-mandir/VidyaMandirDashboard.jsx'
import ParamMitraDashboard from './dashboards/param-mitra/ParamMitraDashboard.jsx'
import SetupPassword from './pages/SetupPassword.jsx'
import InvitationCard from './pages/InvitationCard.jsx'
import PaymentDemo from './pages/PaymentDemo.jsx'
import { useAuth } from './context/AuthContext.jsx'

function MainContent() {
  const { user } = useAuth()

  // Check current URL path for setup-password page
  if (window.location.pathname.startsWith('/setup-password')) {
    return <SetupPassword />
  }

  if (window.location.pathname.startsWith('/invitation/')) {
    return <InvitationCard />
  }

  if (window.location.pathname.startsWith('/payment-demo/')) {
    return <PaymentDemo />
  }

  if (!user) {
    return <Login />
  }

  const roleLower = (user.role || '').toLowerCase()

  // Render specialized Vidya Mandir Head Office Dashboard if role matches Vidya Mandir / Head Office
  if (roleLower.includes('vidya') || roleLower.includes('head office') || roleLower.includes('admin')) {
    return <VidyaMandirDashboard />
  }

  // Render Param Mitra Module for Param Mitra / Field Volunteer roles
  if (roleLower.includes('param') || roleLower.includes('mitra') || roleLower.includes('volunteer') || roleLower.includes('crew')) {
    return <ParamMitraDashboard />
  }

  return <Home />
}

export default function App() {
  return (
    <BrowserRouter>
      <MainContent />
    </BrowserRouter>
  )
}
