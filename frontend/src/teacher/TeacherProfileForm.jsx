import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FaUser, FaBriefcase, FaGraduationCap, FaChalkboardTeacher } from 'react-icons/fa'
import axios from 'axios'

function TeacherProfileForm() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    department: '',
    designation: '',
    specialization: '',
    years_of_experience: 0,
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    const value = e.target.type === 'number' ? Number(e.target.value) : e.target.value
    setFormData({
      ...formData,
      [e.target.name]: value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const teacherData = JSON.parse(localStorage.getItem('teacherUser') || sessionStorage.getItem('teacherUser'))
      const response = await axios.post('http://localhost:8000/api/teachers/submit-profile/', {
        teacher_id: teacherData.id,
        ...formData
      })

      console.log('Profile submitted:', response.data)
      // Redirect to a waiting page or dashboard based on verification status
      if (response.data.verification_status === 'pending') {
        navigate('/mentor-verification-pending')
      } else {
        navigate('/mentor-dashboard')
      }
    } catch (err) {
      console.error('Profile submission error:', err.response?.data || err.message)
      setError(err.response?.data?.message || 'Failed to submit profile')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-gray-900 text-white">
      {/* Header */}
      <div className="bg-black/40 backdrop-blur-sm border-b border-gray-800 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <FaChalkboardTeacher className="h-8 w-8 text-orange-500" />
              <span className="text-xl font-bold">InternHub</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-800 p-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-white mb-2">Create Mentor Account</h2>
            <p className="text-gray-400">Join InternHub as a mentor to guide students</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500 rounded-lg text-red-500">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Personal Information */}
            <div>
              <h3 className="text-lg font-semibold text-orange-500 border-b border-gray-800 pb-2 mb-4">
                Personal Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="first_name" className="block text-sm font-medium text-gray-300 mb-1">
                    First Name
                  </label>
                  <input
                    type="text"
                    name="first_name"
                    id="first_name"
                    required
                    className="block w-full rounded-lg border border-gray-700 bg-gray-800/50 text-white px-4 py-2.5 focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500 transition-colors"
                    value={formData.first_name}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label htmlFor="last_name" className="block text-sm font-medium text-gray-300 mb-1">
                    Last Name
                  </label>
                  <input
                    type="text"
                    name="last_name"
                    id="last_name"
                    required
                    className="block w-full rounded-lg border border-gray-700 bg-gray-800/50 text-white px-4 py-2.5 focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500 transition-colors"
                    value={formData.last_name}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>

            {/* Professional Details */}
            <div>
              <h3 className="text-lg font-semibold text-orange-500 border-b border-gray-800 pb-2 mb-4">
                Professional Details
              </h3>
              <div className="space-y-6">
                <div>
                  <label htmlFor="department" className="block text-sm font-medium text-gray-300 mb-1">
                    Department
                  </label>
                  <input
                    type="text"
                    name="department"
                    id="department"
                    required
                    className="block w-full rounded-lg border border-gray-700 bg-gray-800/50 text-white px-4 py-2.5 focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500 transition-colors"
                    value={formData.department}
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <label htmlFor="designation" className="block text-sm font-medium text-gray-300 mb-1">
                    Designation
                  </label>
                  <input
                    type="text"
                    name="designation"
                    id="designation"
                    required
                    className="block w-full rounded-lg border border-gray-700 bg-gray-800/50 text-white px-4 py-2.5 focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500 transition-colors"
                    value={formData.designation}
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <label htmlFor="specialization" className="block text-sm font-medium text-gray-300 mb-1">
                    Specialization
                  </label>
                  <input
                    type="text"
                    name="specialization"
                    id="specialization"
                    required
                    className="block w-full rounded-lg border border-gray-700 bg-gray-800/50 text-white px-4 py-2.5 focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500 transition-colors"
                    value={formData.specialization}
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <label htmlFor="years_of_experience" className="block text-sm font-medium text-gray-300 mb-1">
                    Years of Experience
                  </label>
                  <input
                    type="number"
                    name="years_of_experience"
                    id="years_of_experience"
                    required
                    min="0"
                    className="block w-full rounded-lg border border-gray-700 bg-gray-800/50 text-white px-4 py-2.5 focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500 transition-colors"
                    value={formData.years_of_experience}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg text-sm font-medium text-white bg-orange-500 hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Submitting Profile...' : 'Submit Profile for Verification'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default TeacherProfileForm 