import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { UserCheck, Award, Clock, X } from 'lucide-react';

const MentorRequests = () => {
  const [stats, setStats] = useState({
    pending_count: 0,
    verified_mentors: 0,
    rejected_mentors: 0
  });
  const [pendingMentors, setPendingMentors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchMentorRequests();
  }, []);

  const fetchMentorRequests = async () => {
    try {
      const response = await axios.get('/api/college/mentor-requests/');
      const data = response.data;
      setStats({
        pending_count: data.pending_count,
        verified_mentors: data.verified_mentors,
        rejected_mentors: data.rejected_mentors
      });
      setPendingMentors(data.pending_mentors);
    } catch (error) {
      setError('Failed to fetch mentor requests');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMentorAction = async (mentorId, action) => {
    try {
      await axios.post(`/api/college/verify-mentor/${mentorId}/`, {
        action: action
      });
      fetchMentorRequests(); // Refresh data after action
    } catch (error) {
      setError('Failed to process mentor request');
      console.error('Error:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-200 border-t-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-50">
      {/* Background Elements */}
      <div className="fixed inset-0 z-0 overflow-hidden">
        <div className="absolute top-0 right-0 w-[35rem] h-[35rem] bg-purple-300/30 rounded-full filter blur-[8rem] animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-[35rem] h-[35rem] bg-indigo-300/20 rounded-full filter blur-[8rem] animate-pulse delay-[5s]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(#a855f7_1px,transparent_1px)] bg-[size:40px_40px] opacity-[0.1]"></div>
      </div>

      <div className="container mx-auto px-4 py-8 relative z-10">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-xl mb-8"
        >
          <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-indigo-600">
            Mentor Verification Requests
          </h2>
          <p className="text-gray-600">Review and approve mentor applications from your institution</p>
        </motion.div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
        >
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500">Pending Requests</p>
                <h3 className="text-3xl font-bold text-purple-600">{stats.pending_count}</h3>
              </div>
              <Clock className="text-purple-600 h-8 w-8" />
            </div>
          </div>
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500">Verified Mentors</p>
                <h3 className="text-3xl font-bold text-green-600">{stats.verified_mentors}</h3>
              </div>
              <UserCheck className="text-green-600 h-8 w-8" />
            </div>
          </div>
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500">Rejected Applications</p>
                <h3 className="text-3xl font-bold text-red-600">{stats.rejected_mentors}</h3>
              </div>
              <X className="text-red-600 h-8 w-8" />
            </div>
          </div>
        </motion.div>

        {/* Pending Requests Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-xl"
        >
          <div className="flex items-center gap-2 mb-6">
            <Award className="text-purple-600 h-6 w-6" />
            <h3 className="text-xl font-semibold text-gray-800">Pending Verification Requests</h3>
          </div>

          {pendingMentors.length > 0 ? (
            <div className="space-y-4">
              {pendingMentors.map((mentor) => (
                <div key={mentor.id} className="bg-white rounded-lg p-6 shadow-md border border-gray-100">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h4 className="text-lg font-semibold text-gray-800">{mentor.full_name}</h4>
                      <span className="inline-block px-3 py-1 text-xs font-medium text-yellow-800 bg-yellow-100 rounded-full">
                        Pending Verification
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-gray-500">Email</p>
                      <p className="text-gray-700">{mentor.user.email}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Username</p>
                      <p className="text-gray-700">{mentor.user.username}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Join Date</p>
                      <p className="text-gray-700">
                        {new Date(mentor.user.date_joined).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <div className="flex justify-end gap-3">
                    <button
                      onClick={() => handleMentorAction(mentor.id, 'approve')}
                      className="px-4 py-2 text-sm font-medium text-green-700 bg-green-50 rounded-lg hover:bg-green-100"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleMentorAction(mentor.id, 'reject')}
                      className="px-4 py-2 text-sm font-medium text-red-700 bg-red-50 rounded-lg hover:bg-red-100"
                    >
                      Reject
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <UserCheck className="mx-auto h-12 w-12 text-gray-400 mb-3" />
              <p className="text-gray-500">No pending mentor verification requests at this time.</p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default MentorRequests; 