import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { MdAdminPanelSettings, MdVerified, MdPending, MdClose } from 'react-icons/md'
import { FaSignOutAlt, FaUserGraduate, FaChalkboardTeacher } from 'react-icons/fa'
import axios from 'axios'

function AdminDashboard() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('pending')
  const [teachers, setTeachers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchTeachers()
  }, [activeTab])

  const fetchTeachers = async () => {
    try {
      const response = await axios.get(`http://localhost:8000/api/management/teachers/${activeTab}/`)
      setTeachers(response.data)
      setError('')
    } catch (err) {
      console.error('Error fetching teachers:', err)
      setError('Failed to load teachers')
    } finally {
      setLoading(false)
    }
  }

  const handleVerification = async (teacherId, status) => {
    try {
      await axios.post(`http://localhost:8000/api/management/verify-teacher/`, {
        teacher_id: teacherId,
        status: status
      })
      fetchTeachers() // Refresh the list
    } catch (err) {
      console.error('Error updating verification:', err)
      setError('Failed to update verification status')
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('managementUser')
    sessionStorage.removeItem('managementUser')
    navigate('/admin-login')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-violet-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-violet-100 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <MdAdminPanelSettings className="h-8 w-8 text-violet-600" />
              <span className="text-xl font-bold text-gray-800">Admin Dashboard</span>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 text-gray-600 hover:text-violet-600 transition-colors"
            >
              <FaSignOutAlt />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>

      {/* Dashboard Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white shadow-sm rounded-xl border border-violet-100 p-6 hover:shadow-md transition-all">
            <div className="flex items-center space-x-3 mb-2">
              <FaUserGraduate className="h-6 w-6 text-blue-600" />
              <h3 className="text-lg font-medium text-gray-800">Total Students</h3>
            </div>
            <p className="text-3xl font-bold text-gray-900">150</p>
          </div>
          
          <div className="bg-white shadow-sm rounded-xl border border-violet-100 p-6 hover:shadow-md transition-all">
            <div className="flex items-center space-x-3 mb-2">
              <FaChalkboardTeacher className="h-6 w-6 text-green-600" />
              <h3 className="text-lg font-medium text-gray-800">Active Teachers</h3>
            </div>
            <p className="text-3xl font-bold text-gray-900">45</p>
          </div>
          
          <div className="bg-white shadow-sm rounded-xl border border-violet-100 p-6 hover:shadow-md transition-all">
            <div className="flex items-center space-x-3 mb-2">
              <MdPending className="h-6 w-6 text-yellow-600" />
              <h3 className="text-lg font-medium text-gray-800">Pending Verifications</h3>
            </div>
            <p className="text-3xl font-bold text-gray-900">12</p>
          </div>
        </div>

        {/* Teacher Verification Section */}
        <div className="bg-white shadow-sm rounded-xl border border-violet-100 p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Teacher Verifications</h2>
          
          {/* Tabs */}
          <div className="flex space-x-4 mb-6 border-b border-violet-100">
            <button
              className={`pb-4 px-4 ${activeTab === 'pending' ? 'text-violet-600 border-b-2 border-violet-600' : 'text-gray-500 hover:text-gray-700'}`}
              onClick={() => setActiveTab('pending')}
            >
              Pending
            </button>
            <button
              className={`pb-4 px-4 ${activeTab === 'approved' ? 'text-violet-600 border-b-2 border-violet-600' : 'text-gray-500 hover:text-gray-700'}`}
              onClick={() => setActiveTab('approved')}
            >
              Approved
            </button>
            <button
              className={`pb-4 px-4 ${activeTab === 'rejected' ? 'text-violet-600 border-b-2 border-violet-600' : 'text-gray-500 hover:text-gray-700'}`}
              onClick={() => setActiveTab('rejected')}
            >
              Rejected
            </button>
          </div>

          {/* Teacher List */}
          {error && (
            <div className="mb-4 p-4 bg-red-500/10 border border-red-500 rounded-lg text-red-500">
              {error}
            </div>
          )}

          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-500 mx-auto"></div>
            </div>
          ) : (
            <div className="space-y-4">
              {teachers.map((teacher) => (
                <div key={teacher.id} className="bg-white shadow-sm rounded-lg border border-violet-100 p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-medium text-gray-800">{teacher.first_name} {teacher.last_name}</h3>
                      <p className="text-gray-600">{teacher.department} • {teacher.designation}</p>
                      <p className="text-sm text-gray-500">Experience: {teacher.years_of_experience} years</p>
                    </div>
                    {activeTab === 'pending' && (
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleVerification(teacher.id, 'approved')}
                          className="p-2 bg-green-100 text-green-600 rounded-lg hover:bg-green-200 transition-colors"
                        >
                          <MdVerified className="h-6 w-6" />
                        </button>
                        <button
                          onClick={() => handleVerification(teacher.id, 'rejected')}
                          className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
                        >
                          <MdClose className="h-6 w-6" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
              
              {teachers.length === 0 && (
                <div className="text-center py-8 text-gray-400">
                  No teachers found in this category
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard 