import { Navigate } from 'react-router-dom'

export default function DoctorProtectedRoute({ children }) {
  const isMedecin = localStorage.getItem('isMedecin') === 'true'
  return isMedecin ? children : <Navigate to="/login" replace />
}
