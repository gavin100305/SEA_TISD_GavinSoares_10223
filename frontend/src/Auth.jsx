import { FaUser, FaChalkboardTeacher } from 'react-icons/fa'
import { MdAdminPanelSettings } from 'react-icons/md'
import { useNavigate } from 'react-router-dom'

function Auth() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0e0b30] via-[#1a1550] to-[#0e0b30] text-white py-12 px-4 sm:px-6 lg:px-8">
      {/* Header with Logo */}
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <div className="mb-8">
            <div className="inline-block p-4 rounded-full bg-violet-500/10 mb-4">
              <FaUser className="h-16 w-16 text-violet-400" />
            </div>
            <h2 className="text-5xl font-bold text-white mb-4 tracking-tight">
              Welcome to <span className="text-violet-400">TISD</span>
            </h2>
            <p className="text-xl text-gray-300">Choose your role to get started</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {/* Student Section */}
          <div className="group relative space-y-6 p-6 rounded-2xl bg-[#1a1550]/50 backdrop-blur-sm border border-[#3d2e8a]/30 hover:bg-[#1a1550]/70 transition-all duration-300">
            <div className="text-center">
              <div className="inline-block p-4 rounded-full bg-violet-500/10 mb-4 group-hover:bg-violet-500/20 transition-all duration-300">
                <FaUser className="h-12 w-12 text-violet-400" />
              </div>
              <h3 className="text-2xl font-bold mb-2">Student</h3>
              <p className="text-gray-300 text-sm mb-6">
                Explore technology and innovation projects
              </p>
            </div>
            <div className="space-y-3">
              <button 
                onClick={() => navigate('/student-login')} 
                className="w-full bg-violet-600 hover:bg-violet-700 text-white py-3 px-4 rounded-lg transition-all duration-300 transform hover:scale-105"
              >
                Login as Student
              </button>
              <button 
                onClick={() => navigate('/student-signup')} 
                className="w-full border border-violet-500/30 hover:bg-violet-500/10 text-white py-3 px-4 rounded-lg transition-all duration-300"
              >
                Sign Up as Student
              </button>
            </div>
          </div>

          {/* Mentor Section */}
          <div className="group relative space-y-6 p-6 rounded-2xl bg-[#1a1550]/50 backdrop-blur-sm border border-[#3d2e8a]/30 hover:bg-[#1a1550]/70 transition-all duration-300">
            <div className="text-center">
              <div className="inline-block p-4 rounded-full bg-violet-500/10 mb-4 group-hover:bg-violet-500/20 transition-all duration-300">
                <FaChalkboardTeacher className="h-12 w-12 text-violet-400" />
              </div>
              <h3 className="text-2xl font-bold mb-2">Mentor</h3>
              <p className="text-gray-300 text-sm mb-6">
                Guide students in sustainable development
              </p>
            </div>
            <div className="space-y-3">
              <button 
                onClick={() => navigate('/mentor-login')}
                className="w-full bg-violet-600 hover:bg-violet-700 text-white py-3 px-4 rounded-lg transition-all duration-300 transform hover:scale-105"
              >
                Login as Mentor
              </button>
              <button 
                onClick={() => navigate('/mentor-signup')}
                className="w-full border border-violet-500/30 hover:bg-violet-500/10 text-white py-3 px-4 rounded-lg transition-all duration-300"
              >
                Sign Up as Mentor
              </button>
            </div>
          </div>

          {/* Admin Section */}
          <div className="group relative space-y-6 p-6 rounded-2xl bg-[#1a1550]/50 backdrop-blur-sm border border-[#3d2e8a]/30 hover:bg-[#1a1550]/70 transition-all duration-300">
            <div className="text-center">
              <div className="inline-block p-4 rounded-full bg-violet-500/10 mb-4 group-hover:bg-violet-500/20 transition-all duration-300">
                <MdAdminPanelSettings className="h-12 w-12 text-violet-400" />
              </div>
              <h3 className="text-2xl font-bold mb-2">Admin</h3>
              <p className="text-gray-300 text-sm mb-6">
                Manage TISD platform
              </p>
            </div>
            <div className="space-y-3">
              <button 
                onClick={() => navigate('/admin-login')}
                className="w-full bg-violet-600 hover:bg-violet-700 text-white py-3 px-4 rounded-lg transition-all duration-300 transform hover:scale-105"
              >
                Login as Admin
              </button>
              <button 
                onClick={() => navigate('/admin-signup')}
                className="w-full border border-violet-500/30 hover:bg-violet-500/10 text-white py-3 px-4 rounded-lg transition-all duration-300"
              >
                Sign Up as Admin
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center">
          <a 
            href="/" 
            className="inline-flex items-center text-violet-400 hover:text-violet-300 transition-colors group"
          >
            <svg 
              className="w-4 h-4 mr-2 transform group-hover:-translate-x-1 transition-transform" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M15 19l-7-7 7-7" 
              />
            </svg>
            Back to Home
          </a>
        </div>
      </div>
    </div>
  )
}

export default Auth 