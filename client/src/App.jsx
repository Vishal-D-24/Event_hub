import { Route, Routes } from 'react-router-dom'
import Navbar from './shared/Navbar.jsx'
import Footer from './shared/Footer.jsx'
import Landing from './pages/Landing.jsx'
import OrganizationLogin from './pages/OrganizationLogin.jsx'
import OrganizationSignup from './pages/OrganizationSignup.jsx'
import EventManagerLogin from './pages/EventManagerLogin.jsx'
import Dashboard from './pages/Dashboard.jsx'
import Events from './pages/Events.jsx'
import EventManagers from './pages/EventManagers.jsx'
import Participants from './pages/Participants.jsx'
import Register from './pages/Register.jsx'
import Designer from './pages/Designer.jsx'
import ProtectedRoute from './shared/ProtectedRoute.jsx'

export default function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Landing />} />
        
        {/* Organization Routes */}
        <Route path="/organization/login" element={<OrganizationLogin />} />
        <Route path="/organization/signup" element={<OrganizationSignup />} />
        
        {/* Event Manager Routes */}
        <Route path="/event-manager/login" element={<EventManagerLogin />} />
        
        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/events" element={<Events />} />
          <Route path="/event-managers" element={<EventManagers />} />
          <Route path="/events/:id/participants" element={<Participants />} />
          <Route path="/designer" element={<Designer />} />
        </Route>

        {/* Public Registration */}
        <Route path="/register/:shareId" element={<Register />} />

        {/* Fallback for unknown routes */}
        <Route path="*" element={<Landing />} />
      </Routes>
      <Footer />
    </>
  )
}
