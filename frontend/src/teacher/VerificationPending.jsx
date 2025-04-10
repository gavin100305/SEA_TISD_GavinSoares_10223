import { FaChalkboardTeacher } from 'react-icons/fa'
import { MdPending } from 'react-icons/md'

function VerificationPending() {
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

      <div className="max-w-lg mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
        <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-800 p-8">
          <div className="bg-orange-500/10 rounded-full p-3 w-16 h-16 mx-auto mb-6">
            <MdPending className="w-full h-full text-orange-500" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-4">Verification Pending</h2>
          <p className="text-gray-400 mb-6">
            Your profile has been submitted and is pending verification by our management team. 
            We'll notify you once your account has been approved.
          </p>
          <div className="animate-pulse flex justify-center">
            <div className="h-2 w-24 bg-orange-500/50 rounded"></div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default VerificationPending 