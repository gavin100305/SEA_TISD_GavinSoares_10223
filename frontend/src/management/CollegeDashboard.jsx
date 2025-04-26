import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  UserPlus, ChalkboardTeacher, UserGraduate, Building,
  CheckCircle, XCircle, Clock, Mail, Phone, Globe, MapPin
} from 'lucide-react';

const CollegeDashboard = () => {
  const [collegeData, setCollegeData] = useState({
    college_name: '',
    college_code: '',
    principal_name: '',
    contact_number: '',
    website: '',
    established_year: '',
    address: '',
    principal_email: ''
  });
  const [mentorStats, setMentorStats] = useState({
    pending_count: 0,
    verified_mentors: 0,
    rejected_mentors: 0
  });
  const [pendingMentors, setPendingMentors] = useState([]);
  const [totalStats, setTotalStats] = useState({
    total_students: 0,
    total_mentors: 0
  });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await axios.get('/api/college/dashboard/');
      const data = response.data;
      setCollegeData(data.profile);
      setMentorStats({
        pending_count: data.pending_count,
        verified_mentors: data.verified_mentors,
        rejected_mentors: data.rejected_mentors
      });
      setPendingMentors(data.pending_mentors);
      setTotalStats({
        total_students: data.total_students,
        total_mentors: data.total_mentors
      });
      setLoading(false);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setLoading(false);
    }
  };

  const handleMentorAction = async (mentorId, action) => {
    try {
      await axios.post(`/api/college/verify-mentor/${mentorId}/`, { action });
      fetchDashboardData(); // Refresh data after action
    } catch (error) {
      console.error('Error handling mentor action:', error);
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
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-50 p-8">
      {/* Background Elements */}
      <div className="fixed inset-0 z-0 overflow-hidden">
        <div className="absolute top-0 right-0 w-[35rem] h-[35rem] bg-purple-300/30 rounded-full filter blur-[8rem] animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-[35rem] h-[35rem] bg-indigo-300/20 rounded-full filter blur-[8rem] animate-pulse delay-[5s]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(#a855f7_1px,transparent_1px)] bg-[size:40px_40px] opacity-[0.1]"></div>
      </div>

      <div className="relative z-10">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-black/80 backdrop-blur-sm rounded-xl p-8 text-center mb-8"
        >
          <h1 className="text-4xl font-bold text-white mb-2">
            Welcome, <span className="text-purple-500">{collegeData.college_name}</span>
          </h1>
          <p className="text-gray-400">College Code: {collegeData.college_code}</p>
        </motion.div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[
            {
              icon: UserPlus,
              title: "Mentor Requests",
              description: "Review and verify mentor applications",
              path: "/mentor-requests"
            },
            {
              icon: ChalkboardTeacher,
              title: "Registered Mentors",
              description: "Manage registered mentors",
              path: "/registered-mentors"
            },
            {
              icon: UserGraduate,
              title: "Registered Students",
              description: "Track student activities",
              path: "/registered-students"
            },
            {
              icon: Building,
              title: "College Profile",
              description: "Update college information",
              path: "/college-profile"
            }
          ].map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-black/80 backdrop-blur-sm rounded-xl p-6 cursor-pointer hover:transform hover:-translate-y-2 transition-all"
              onClick={() => navigate(feature.path)}
            >
              <feature.icon className="text-purple-500 w-12 h-12 mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
              <p className="text-gray-400">{feature.description}</p>
            </motion.div>
          ))}
        </div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h2 className="text-2xl font-bold text-white mb-6">Mentor Management</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-black/80 backdrop-blur-sm rounded-xl p-6 text-center">
              <Clock className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
              <div className="text-3xl font-bold text-white">{mentorStats.pending_count}</div>
              <div className="text-gray-400">Pending Requests</div>
            </div>
            <div className="bg-black/80 backdrop-blur-sm rounded-xl p-6 text-center">
              <CheckCircle className="w-8 h-8 text-green-500 mx-auto mb-2" />
              <div className="text-3xl font-bold text-white">{mentorStats.verified_mentors}</div>
              <div className="text-gray-400">Verified Mentors</div>
            </div>
            <div className="bg-black/80 backdrop-blur-sm rounded-xl p-6 text-center">
              <XCircle className="w-8 h-8 text-red-500 mx-auto mb-2" />
              <div className="text-3xl font-bold text-white">{mentorStats.rejected_mentors}</div>
              <div className="text-gray-400">Rejected Applications</div>
            </div>
          </div>
        </motion.div>

        {/* Pending Mentors Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h2 className="text-2xl font-bold text-white mb-6">Recent Mentor Requests</h2>
          <div className="space-y-4">
            {pendingMentors.slice(0, 3).map((mentor, index) => (
              <motion.div
                key={mentor.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-black/80 backdrop-blur-sm rounded-xl p-6"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-semibold text-white">New Mentor Request</h3>
                    <span className="inline-block px-3 py-1 bg-yellow-900/50 text-yellow-500 rounded-full text-sm mt-2">
                      Pending Verification
                    </span>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <div className="text-purple-500 text-sm">Email</div>
                    <div className="text-white">{mentor.user.email}</div>
                  </div>
                  <div>
                    <div className="text-purple-500 text-sm">Username</div>
                    <div className="text-white">{mentor.user.username}</div>
                  </div>
                  <div>
                    <div className="text-purple-500 text-sm">Join Date</div>
                    <div className="text-white">{new Date(mentor.user.date_joined).toLocaleDateString()}</div>
                  </div>
                </div>
                <div className="flex justify-end gap-3">
                  <button
                    onClick={() => handleMentorAction(mentor.id, 'approve')}
                    className="px-4 py-2 bg-green-900/50 text-green-500 rounded-lg hover:bg-green-900/70 transition-colors"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => handleMentorAction(mentor.id, 'reject')}
                    className="px-4 py-2 bg-red-900/50 text-red-500 rounded-lg hover:bg-red-900/70 transition-colors"
                  >
                    Reject
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
          {pendingMentors.length > 3 && (
            <div className="text-center mt-6">
              <button
                onClick={() => navigate('/mentor-requests')}
                className="px-6 py-2 border border-purple-500 text-purple-500 rounded-lg hover:bg-purple-500/10 transition-colors"
              >
                View All Requests
              </button>
            </div>
          )}
        </motion.div>

        {/* College Info Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-black/80 backdrop-blur-sm rounded-xl p-6"
          >
            <h2 className="text-xl font-semibold text-white mb-4">College Information</h2>
            <div className="space-y-3">
              <div>
                <div className="text-purple-500 text-sm">Principal</div>
                <div className="text-white">{collegeData.principal_name}</div>
              </div>
              <div>
                <div className="text-purple-500 text-sm">Contact Number</div>
                <div className="text-white">{collegeData.contact_number}</div>
              </div>
              <div>
                <div className="text-purple-500 text-sm">Website</div>
                <a href={collegeData.website} target="_blank" rel="noopener noreferrer" className="text-purple-500 hover:text-purple-400">
                  {collegeData.website}
                </a>
              </div>
              <div>
                <div className="text-purple-500 text-sm">Established</div>
                <div className="text-white">{collegeData.established_year}</div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-black/80 backdrop-blur-sm rounded-xl p-6"
          >
            <h2 className="text-xl font-semibold text-white mb-4">Contact Information</h2>
            <div className="space-y-3">
              <div>
                <div className="text-purple-500 text-sm">Address</div>
                <div className="text-white">{collegeData.address}</div>
              </div>
              <div>
                <div className="text-purple-500 text-sm">Principal Email</div>
                <div className="text-white">{collegeData.principal_email}</div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-black/80 backdrop-blur-sm rounded-xl p-6"
          >
            <h2 className="text-xl font-semibold text-white mb-4">Quick Stats</h2>
            <div className="space-y-6">
              <div>
                <div className="text-3xl font-bold text-white">{totalStats.total_students}</div>
                <div className="text-purple-500">Total Students</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-white">{totalStats.total_mentors}</div>
                <div className="text-purple-500">Total Mentors</div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default CollegeDashboard; 