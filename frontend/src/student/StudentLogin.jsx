import { useState } from 'react'
import { FaUser, FaLock, FaGraduationCap } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

function StudentLogin() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    rememberMe: false
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value
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
      const response = await axios.post('http://localhost:8000/api/students/login/', {
        username: formData.username,
        password: formData.password
      })
      
      console.log('Login successful:', response.data)
      
      // Store user data in localStorage or context
      if (formData.rememberMe) {
        localStorage.setItem('studentUser', JSON.stringify(response.data.data))
      } else {
        sessionStorage.setItem('studentUser', JSON.stringify(response.data.data))
      }
      
      // Navigate to dashboard
      navigate('/student-dashboard')
    } catch (err) {
      console.error('Login error:', err.response?.data || err.message)
      setError(err.response?.data?.message || 'Invalid username or password')
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
              <FaGraduationCap className="w-full h-full text-violet-400" />
            </div>
            <h2 className="text-3xl font-bold text-white mb-2">Welcome Back!</h2>
            <p className="text-gray-300">Sign in to your TISD account</p>
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

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="rememberMe"
                  id="rememberMe"
                  className="rounded border-gray-700 bg-gray-800/50 text-orange-500 focus:ring-orange-500"
                  checked={formData.rememberMe}
                  onChange={handleChange}
                />
                <label htmlFor="rememberMe" className="ml-2 text-sm text-gray-300">
                  Remember me
                </label>
              </div>
              <a href="#" className="text-sm text-orange-500 hover:text-orange-400 transition-colors">
                Forgot password?
              </a>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg text-sm font-medium text-white bg-violet-600 hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Signing In...' : 'Sign In'}
            </button>
          </form>

          {/* Sign Up Link */}
          <div className="mt-6 text-center">
            <p className="text-gray-400">
              Don't have an account?{' '}
              <button 
                onClick={() => navigate('/student-signup')}
                className="text-orange-500 hover:text-orange-400 transition-colors"
              >
                Sign up
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default StudentLogin 