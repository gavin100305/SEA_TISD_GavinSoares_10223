import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { FaChalkboardTeacher, FaUserGraduate, FaSignOutAlt, FaUser } from 'react-icons/fa'
import { MdAssignment, MdDashboard } from 'react-icons/md'
import axios from 'axios'

function TeacherDashboard() {
  const navigate = useNavigate()
  const [teacherData, setTeacherData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const checkAuth = async () => {
      const storedData = JSON.parse(localStorage.getItem('teacherUser') || sessionStorage.getItem('teacherUser'))
      
      if (!storedData) {
        navigate('/mentor-login')
        return
      }

      try {
        // Verify teacher's status
        const response = await axios.get(`http://localhost:8000/api/teachers/profile/${storedData.id}/`)
        
        if (response.data.verification_status !== 'approved') {
          navigate('/mentor-verification-pending')
          return
        }

        setTeacherData(response.data)
      } catch (err) {
        console.error('Error fetching teacher data:', err)
        setError('Failed to load dashboard')
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [navigate])

  const handleLogout = () => {
    localStorage.removeItem('teacherUser')
    sessionStorage.removeItem('teacherUser')
    navigate('/mentor-login')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-black to-gray-900 text-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-violet-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-violet-100 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <FaChalkboardTeacher className="h-8 w-8 text-violet-600" />
              <span className="text-xl font-bold text-gray-800">TISD Dashboard</span>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 text-gray-300 hover:text-orange-500 transition-colors"
            >
              <FaSignOutAlt />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>

      {/* Dashboard Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500 rounded-lg text-red-500">
            {error}
          </div>
        )}

        {/* Teacher Profile Card */}
        <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl border border-gray-800 p-6 mb-8">
          <div className="flex items-start space-x-4">
            <div className="bg-orange-500/10 rounded-full p-3">
              <FaUser className="h-8 w-8 text-orange-500" />
            </div>
            <div>
              <h2 className="text-xl font-bold">{teacherData?.first_name} {teacherData?.last_name}</h2>
              <p className="text-gray-400">{teacherData?.department}</p>
              <p className="text-sm text-gray-500">{teacherData?.designation}</p>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white/70 backdrop-blur-sm rounded-xl shadow-lg border border-violet-100 p-6 hover:shadow-xl transition-all">
            <div className="flex items-center space-x-3 mb-2">
              <div className="p-2 bg-blue-100 rounded-lg">
                <FaUserGraduate className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-medium text-gray-800">My Students</h3>
            </div>
            <p className="text-3xl font-bold text-gray-900">0</p>
          </div>

          <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl border border-gray-800 p-6">
            <div className="flex items-center space-x-3 mb-2">
              <MdAssignment className="h-6 w-6 text-green-500" />
              <h3 className="text-lg font-medium">Active Projects</h3>
            </div>
            <p className="text-3xl font-bold">0</p>
          </div>

          <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl border border-gray-800 p-6">
            <div className="flex items-center space-x-3 mb-2">
              <MdDashboard className="h-6 w-6 text-purple-500" />
              <h3 className="text-lg font-medium">Completed Projects</h3>
            </div>
            <p className="text-3xl font-bold">0</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white/70 backdrop-blur-sm rounded-xl shadow-lg border border-violet-100 p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <button className="p-4 bg-violet-50 rounded-lg text-left hover:bg-violet-100 transition-colors">
              <h3 className="font-medium text-gray-800 mb-1">View Student Applications</h3>
              <p className="text-sm text-gray-600">Review and accept student requests</p>
            </button>
            
            <button className="p-4 bg-gray-800/50 rounded-lg text-left hover:bg-gray-800 transition-colors">
              <h3 className="font-medium mb-1">Create New Project</h3>
              <p className="text-sm text-gray-400">Post a new internship opportunity</p>
            </button>

            <button className="p-4 bg-gray-800/50 rounded-lg text-left hover:bg-gray-800 transition-colors">
              <h3 className="font-medium mb-1">Update Profile</h3>
              <p className="text-sm text-gray-400">Modify your professional details</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TeacherDashboard 