import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { ToastContainer } from 'react-toastify'
import { AppProvider } from './context/AppContext'
import ScrollToTop          from './components/ui/ScrollToTop'
import ProtectedRoute       from './components/ProtectedRoute'
import DoctorProtectedRoute from './components/DoctorProtectedRoute'
import Home             from './pages/Home'
import Appointment      from './pages/Appointment'
import Doctors          from './pages/Doctors'
import DoctorProfile    from './pages/DoctorProfile'
import Login            from './pages/Login'
import NotFound         from './pages/NotFound'
import AdminLayout      from './pages/admin/AdminLayout'
import Dashboard        from './pages/admin/Dashboard'
import AdminAppointments from './pages/admin/AdminAppointments'
import AdminDoctors     from './pages/admin/AdminDoctors'
import DoctorLayout     from './pages/medecin/DoctorLayout'
import MonAgenda        from './pages/medecin/MonAgenda'
import MesDisponibilites from './pages/medecin/MesDisponibilites'

function AnimatedRoutes() {
  const location = useLocation()
  return (
    <AnimatePresence mode="wait" initial={false}>
      <Routes location={location} key={location.pathname}>
        <Route path="/"              element={<Home />} />
        <Route path="/rendez-vous"   element={<Appointment />} />
        <Route path="/medecins"      element={<Doctors />} />
        <Route path="/medecins/:id"  element={<DoctorProfile />} />
        <Route path="/login"         element={<Login />} />
        <Route
          path="/admin"
          element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}
        >
          <Route index               element={<Dashboard />} />
          <Route path="rendez-vous"  element={<AdminAppointments />} />
          <Route path="medecins"     element={<AdminDoctors />} />
        </Route>
        <Route
          path="/medecin"
          element={<DoctorProtectedRoute><DoctorLayout /></DoctorProtectedRoute>}
        >
          <Route index                  element={<MonAgenda />} />
          <Route path="disponibilites"  element={<MesDisponibilites />} />
        </Route>
        <Route path="*"              element={<NotFound />} />
      </Routes>
    </AnimatePresence>
  )
}

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <ScrollToTop />
        <AnimatedRoutes />
        <ToastContainer
          position="top-right"
          autoClose={4000}
          hideProgressBar={false}
          newestOnTop
          theme="colored"
        />
      </BrowserRouter>
    </AppProvider>
  )
}
