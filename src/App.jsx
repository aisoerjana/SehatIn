import { Routes, Route, Navigate } from 'react-router-dom'
import Splash from './components/Splash'
import Login from './components/Login'
import Register from './components/Register'
import Dashboard from './components/Dashboard'
import AsesmenPage from './components/AsesmenPage'
import MuscleScan from './components/MuscleScan'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Splash />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/asesmen" element={<AsesmenPage />} />
      <Route path="/muscle-scan" element={<MuscleScan />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}