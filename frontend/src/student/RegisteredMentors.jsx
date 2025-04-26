import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Search, Briefcase, Star, Info, Mail, Github, Linkedin, Globe, User } from 'lucide-react';

const RegisteredMentors = () => {
  const [mentors, setMentors] = useState([]);
  const [stats, setStats] = useState({
    total_mentors: 0,
    active_mentors: 0,
    pending_mentors: 0
  });
  const [filters, setFilters] = useState({
    status: '',
    specialization: ''
  });
  const [loading, setLoading] = useState(true);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    fetchMentors();
  }, [filters]);

  const fetchMentors = async () => {
    try {
      const response = await axios.get('/api/college/registered-mentors/', {
        params: filters
      });
      setMentors(response.data.mentors);
      setStats({
        total_mentors: response.data.total_mentors,
        active_mentors: response.data.active_mentors,
        pending_mentors: response.data.pending_mentors
      });
      setLoading(false);
    } catch (error) {
      console.error('Error fetching mentors:', error);
      setErrorMessage('Failed to load mentors');
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleRemoveMentor = async (mentorId) => {
    if (!window.confirm('Are you sure you want to remove this mentor?')) return;

    try {
      await axios.post(`/api/college/remove-mentor/${mentorId}/`);
      setSuccessMessage('Mentor removed successfully');
      fetchMentors();
    } catch (error) {
      setErrorMessage('Failed to remove mentor');
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
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Registered <span className="text-purple-600">Mentors</span>
          </h1>
          <p className="text-gray-600">View and manage all registered mentors from your institution</p>
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
                <p className="text-gray-500">Total Mentors</p>
                <h3 className="text-3xl font-bold text-purple-600">{stats.total_mentors}</h3>
              </div>
              <User className="text-purple-600 h-8 w-8" />
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500">Active Mentors</p>
                <h3 className="text-3xl font-bold text-green-600">{stats.active_mentors}</h3>
              </div>
              <Star className="text-green-600 h-8 w-8" />
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500">Pending Approvals</p>
                <h3 className="text-3xl font-bold text-yellow-600">{stats.pending_mentors}</h3>
              </div>
              <Info className="text-yellow-600 h-8 w-8" />
            </div>
          </div>
        </motion.div>

        {/* Messages */}
        {successMessage && (
          <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-6">
            {successMessage}
          </div>
        )}
        {errorMessage && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6">
            {errorMessage}
          </div>
        )}

        {/* Filters Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-xl mb-8"
        >
          <div className="flex items-center gap-4 flex-wrap">
            <select
              name="status"
              value={filters.status}
              onChange={handleFilterChange}
              className="bg-white/50 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="">All Status</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>

            <select
              name="specialization"
              value={filters.specialization}
              onChange={handleFilterChange}
              className="bg-white/50 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="">All Specializations</option>
              <option value="Web Development">Web Development</option>
              <option value="Machine Learning">Machine Learning</option>
              <option value="Mobile Development">Mobile Development</option>
              <option value="Cloud Computing">Cloud Computing</option>
            </select>

            <button
              onClick={fetchMentors}
              className="flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
            >
              <Search className="h-4 w-4" />
              Apply Filter
            </button>
          </div>
        </motion.div>

        {/* Mentors Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {mentors.map((mentor, index) => (
            <motion.div
              key={mentor.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-xl hover:shadow-2xl transition-shadow"
            >
              <div className="flex items-start gap-4">
                <img
                  src={mentor.profile_picture || `https://ui-avatars.com/api/?name=${mentor.full_name}&background=9d4edd&color=fff`}
                  alt={mentor.full_name}
                  className="w-24 h-24 rounded-full border-4 border-purple-600"
                />
                <div>
                  <h3 className="text-xl font-semibold text-gray-800">{mentor.full_name}</h3>
                  <p className="text-gray-600">{mentor.current_role}</p>
                  <span className={`inline-block px-3 py-1 rounded-full text-sm mt-2 ${
                    mentor.verification_status === 'approved' ? 'bg-green-100 text-green-600' :
                    mentor.verification_status === 'pending' ? 'bg-yellow-100 text-yellow-600' :
                    'bg-red-100 text-red-600'
                  }`}>
                    {mentor.verification_status}
                  </span>
                </div>
              </div>

              <div className="mt-6 space-y-4">
                <div className="flex items-center gap-2 text-gray-600">
                  <Briefcase className="h-4 w-4" />
                  <span>{mentor.highest_qualification} - {mentor.university}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Star className="h-4 w-4" />
                  <span>{mentor.experience_years} years experience</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Mail className="h-4 w-4" />
                  <span>{mentor.email}</span>
                </div>
              </div>

              <div className="mt-6 flex flex-wrap gap-2">
                {mentor.expertise_areas?.split(',').map((expertise, i) => (
                  <span
                    key={i}
                    className="bg-purple-50 text-purple-600 px-3 py-1 rounded-full text-sm"
                  >
                    {expertise.trim()}
                  </span>
                ))}
              </div>

              <div className="mt-6 flex justify-between items-center">
                <div className="flex gap-3">
                  {mentor.linkedin && (
                    <a
                      href={mentor.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-600 hover:text-purple-600 transition-colors"
                    >
                      <Linkedin className="h-5 w-5" />
                    </a>
                  )}
                  {mentor.github && (
                    <a
                      href={mentor.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-600 hover:text-purple-600 transition-colors"
                    >
                      <Github className="h-5 w-5" />
                    </a>
                  )}
                  {mentor.website && (
                    <a
                      href={mentor.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-600 hover:text-purple-600 transition-colors"
                    >
                      <Globe className="h-5 w-5" />
                    </a>
                  )}
                </div>
                <button
                  onClick={() => handleRemoveMentor(mentor.id)}
                  className="text-red-600 hover:text-red-700 transition-colors"
                >
                  Remove
                </button>
              </div>
            </motion.div>
          ))}

          {mentors.length === 0 && (
            <div className="col-span-full text-center py-12">
              <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No mentors found matching the criteria.</p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default RegisteredMentors; 