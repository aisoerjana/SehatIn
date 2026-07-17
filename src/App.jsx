import { Routes, Route, Navigate } from 'react-router-dom'
import Splash from './components/Splash'
import Login from './components/Login'
import Register from './components/Register'
import Dashboard from './components/Dashboard'
import Asesmen from './components/Asesmenn'
import MuscleScan from './components/MuscleScan'
import Profile from './components/Profile'
import History from './components/History'
import Ask from './components/Ask'
import Result from './components/Result'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Splash />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/asesmen" element={<Asesmen />} />
      <Route path="/muscle-scan" element={<MuscleScan />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/history" element={<History />} />
      <Route path="/ask" element={<Ask />} />
      <Route path="/result" element={<Result />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}