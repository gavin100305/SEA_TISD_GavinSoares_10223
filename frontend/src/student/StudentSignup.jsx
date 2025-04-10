import { useState } from 'react'
import { FaUser, FaEnvelope, FaLock, FaGraduationCap } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

function StudentSignup() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Basic validation
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      return
    }
    
    setLoading(true)
    setError('')
    
    try {
      // Send only username, email and password to the backend
      const response = await axios.post('http://localhost:8000/api/students/signup/', {
        username: formData.username,
        email: formData.email,
        password: formData.password
      })
      
      console.log('Signup successful:', response.data)
      
      // Redirect to login page after successful signup
      navigate('/student-login')
    } catch (err) {
      console.error('Signup error:', err.response?.data || err.message)
      setError(err.response?.data?.errors?.username || 
               err.response?.data?.errors?.email || 
               err.response?.data?.errors?.password || 
               err.response?.data?.message || 
               'An error occurred during signup')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-violet-950 via-violet-900 to-violet-950 text-white">
      {/* Header */}
      <div className="bg-violet-950/40 backdrop-blur-sm border-b border-violet-800/30 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <FaGraduationCap className="h-8 w-8 text-violet-400" />
              <span className="text-xl font-bold">TISD</span>
            </div>
            <button
              onClick={() => navigate('/auth')}
              className="text-gray-300 hover:text-violet-400 transition-colors"
            >
              ← Back to Auth
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-violet-900/30 backdrop-blur-sm rounded-2xl shadow-xl border border-violet-800/30 p-8">
          <div className="text-center mb-8">
            <div className="bg-violet-500/10 rounded-full p-3 w-16 h-16 mx-auto mb-4">
              <FaUser className="w-full h-full text-violet-400" />
            </div>
            <h2 className="text-3xl font-bold text-white mb-2">Create Student Account</h2>
            <p className="text-gray-400">Join InternHub to start your internship journey</p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-500/20 border border-red-500 rounded-lg text-red-200">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Username */}
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-300 mb-1">
                Username
              </label>
              <div className="relative">
                <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  name="username"
                  id="username"
                  required
                  className="block w-full pl-10 rounded-lg border border-violet-700 bg-violet-900/30 text-white px-4 py-2.5 focus:border-violet-400 focus:outline-none focus:ring-1 focus:ring-violet-400 transition-colors"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="johndoe"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
                Email Address
              </label>
              <div className="relative">
                <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  name="email"
                  id="email"
                  required
                  className="block w-full pl-10 rounded-lg border border-violet-700 bg-violet-900/30 text-white px-4 py-2.5 focus:border-violet-400 focus:outline-none focus:ring-1 focus:ring-violet-400 transition-colors"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="john.doe@example.com"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-1">
                Password
              </label>
              <div className="relative">
                <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="password"
                  name="password"
                  id="password"
                  required
                  className="block w-full pl-10 rounded-lg border border-violet-700 bg-violet-900/30 text-white px-4 py-2.5 focus:border-violet-400 focus:outline-none focus:ring-1 focus:ring-violet-400 transition-colors"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                />
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300 mb-1">
                Confirm Password
              </label>
              <div className="relative">
                <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="password"
                  name="confirmPassword"
                  id="confirmPassword"
                  required
                  className="block w-full pl-10 rounded-lg border border-violet-700 bg-violet-900/30 text-white px-4 py-2.5 focus:border-violet-400 focus:outline-none focus:ring-1 focus:ring-violet-400 transition-colors"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="••••••••"
                />
              </div>
            </div>

            {/* Terms and Conditions */}
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="terms"
                required
                className="rounded border-violet-700 bg-violet-900/30 text-violet-500 focus:ring-violet-500"
              />
              <label htmlFor="terms" className="text-sm text-gray-300">
                I agree to the <a href="#" className="text-violet-500 hover:text-violet-400">Terms of Service</a> and{' '}
                <a href="#" className="text-violet-500 hover:text-violet-400">Privacy Policy</a>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-violet-600 hover:bg-violet-700 text-white py-3 rounded-lg transition-colors"
            >
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>

          {/* Sign In Link */}
          <div className="mt-6 text-center">
            <p className="text-gray-400">
              Already have an account?{' '}
              <button 
                onClick={() => navigate('/student-login')}
                className="text-violet-500 hover:text-violet-400 transition-colors"
              >
                Sign in
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default StudentSignup 