import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Users, Calendar, MessageSquare, Plus, Edit, Trash2, User } from 'lucide-react';

const GroupDetail = () => {
  const [group, setGroup] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    fetchGroupDetails();
  }, [id]);

  const fetchGroupDetails = async () => {
    try {
      const response = await axios.get(`/api/groups/${id}/`);
      setGroup(response.data);
    } catch (error) {
      setError('Failed to fetch group details');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveMember = async (memberId) => {
    try {
      await axios.post(`/api/groups/${id}/remove-member/${memberId}/`);
      fetchGroupDetails(); // Refresh group data
    } catch (error) {
      console.error('Error removing member:', error);
    }
  };

  const handleInviteMember = async (email) => {
    try {
      await axios.post(`/api/groups/${id}/invite/`, { email });
      // Show success message
    } catch (error) {
      console.error('Error inviting member:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-50 p-6 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-200 border-t-purple-600"></div>
      </div>
    );
  }

  if (error || !group) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-50 p-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-gray-800">Error loading group details</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-50 p-6">
      <div className="max-w-7xl mx-auto">
        <button
          onClick={() => navigate('/my-groups')}
          className="flex items-center gap-2 text-gray-600 hover:text-purple-600 transition mb-6"
        >
          <ArrowLeft size={20} />
          Back to Groups
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Group Info Section */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-xl"
            >
              <h1 className="text-2xl font-bold text-gray-800 mb-4">{group.name}</h1>
              <div className="space-y-4">
                <div className="flex items-center gap-3 text-gray-600">
                  <Users size={20} />
                  <span>{group.members.length} Members</span>
                </div>
                <div className="flex items-center gap-3 text-gray-600">
                  <Calendar size={20} />
                  <span>Created {new Date(group.created_at).toLocaleDateString()}</span>
                </div>
              </div>

              {group.is_leader && (
                <button
                  onClick={() => navigate(`/group/${id}/add-project`)}
                  className="mt-6 w-full px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:opacity-90 transition flex items-center justify-center gap-2"
                >
                  <Plus size={20} />
                  Add New Project
                </button>
              )}
            </motion.div>
          </div>

          {/* Main Content Section */}
          <div className="lg:col-span-2 space-y-6">
            {/* Members Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-xl"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-800">Group Members</h2>
                {group.is_leader && (
                  <button
                    onClick={() => {/* Show invite modal */}}
                    className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition flex items-center gap-2"
                  >
                    <Plus size={16} />
                    Invite Member
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {group.members.map(member => (
                  <div key={member.id} className="bg-purple-50/50 rounded-lg p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-purple-200 flex items-center justify-center">
                        <User size={20} className="text-purple-600" />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-800">{member.full_name}</h3>
                        <p className="text-sm text-gray-600">{member.email}</p>
                      </div>
                    </div>
                    {group.is_leader && member.id !== group.leader.id && (
                      <button
                        onClick={() => handleRemoveMember(member.id)}
                        className="text-red-500 hover:text-red-600 transition"
                      >
                        <Trash2 size={18} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Projects Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-xl"
            >
              <h2 className="text-xl font-semibold text-gray-800 mb-6">Group Projects</h2>
              
              {group.projects.length > 0 ? (
                <div className="space-y-4">
                  {group.projects.map(project => (
                    <div key={project.id} className="bg-purple-50/50 rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium text-gray-800">{project.title}</h3>
                          <p className="text-sm text-gray-600 mt-1">{project.description}</p>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => navigate(`/group/${id}/project/${project.id}`)}
                            className="text-purple-600 hover:text-purple-700 transition"
                          >
                            <Edit size={18} />
                          </button>
                          {group.is_leader && (
                            <button
                              onClick={() => {/* Handle delete */}}
                              className="text-red-500 hover:text-red-600 transition"
                            >
                              <Trash2 size={18} />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <p>No projects yet</p>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GroupDetail; 