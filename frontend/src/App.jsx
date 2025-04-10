import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import './App.css'
import Landing from './Landing'
import Auth from './Auth'
import StudentSignup from './student/StudentSignup'
import StudentLogin from './student/StudentLogin'
import StudentDashboard from './student/StudentDashboard'
import MentorSignup from './teacher/MentorSignup'
import MentorLogin from './teacher/MentorLogin'
import AdminSignup from './management/AdminSignup'
import AdminLogin from './management/AdminLogin'
import TeacherProfileForm from './teacher/TeacherProfileForm'
import VerificationPending from './teacher/VerificationPending'
import AdminDashboard from './management/AdminDashboard'
import TeacherDashboard from './teacher/TeacherDashboard'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/student-signup" element={<StudentSignup />} />
        <Route path="/student-login" element={<StudentLogin />} />
        <Route path="/student-dashboard" element={<StudentDashboard />} />
        <Route path="/mentor-signup" element={<MentorSignup />} />
        <Route path="/mentor-login" element={<MentorLogin />} />
        <Route path="/admin-signup" element={<AdminSignup />} />
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/mentor-profile-form" element={<TeacherProfileForm />} />
        <Route path="/mentor-verification-pending" element={<VerificationPending />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/mentor-dashboard" element={<TeacherDashboard />} />
      </Routes>
    </Router>
  )
}

export default App
