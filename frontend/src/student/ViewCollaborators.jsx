import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { User, Briefcase, Star, Mail, Github, Linkedin, Globe, Users, Book, X } from 'lucide-react';

const ViewCollaborators = () => {
  const [collaborators, setCollaborators] = useState([]);
  const [totalCollaborators, setTotalCollaborators] = useState(0);
  const [loading, setLoading] = useState(true);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    fetchCollaborators();
  }, []);

  const fetchCollaborators = async () => {
    try {
      const response = await axios.get('/api/college/view-collaborators/');
      setCollaborators(response.data.collaborator_data);
      setTotalCollaborators(response.data.total_collaborators);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching collaborators:', error);
      setErrorMessage('Failed to load collaborators');
      setLoading(false);
    }
  };

  const handleRemoveCollaborator = async (collaboratorId) => {
    if (!window.confirm('Are you sure you want to remove this collaborator?')) return;

    try {
      await axios.post(`/api/college/remove-collaborator/${collaboratorId}/`);
      setSuccessMessage('Collaborator removed successfully');
      fetchCollaborators();
    } catch (error) {
      setErrorMessage('Failed to remove collaborator');
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
            Registered <span className="text-purple-600">Collaborators</span> ({totalCollaborators})
          </h1>
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

        {/* Collaborators List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {collaborators.map((collaborator, index) => (
            <motion.div
              key={collaborator.profile.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-xl hover:shadow-2xl transition-shadow"
            >
              {/* Profile Section */}
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-start gap-6">
                  <img
                    src={collaborator.profile.profile_picture || `https://ui-avatars.com/api/?name=${collaborator.profile.full_name}&background=9d4edd&color=fff`}
                    alt={collaborator.profile.full_name}
                    className="w-24 h-24 rounded-full border-4 border-purple-600"
                  />
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800">{collaborator.profile.full_name}</h3>
                    <p className="text-gray-600 mt-1">
                      <strong>Expertise:</strong> {collaborator.profile.expertise}
                    </p>
                    <p className="text-gray-600">
                      <strong>Experience:</strong> {collaborator.profile.experience_years} years
                    </p>
                    <p className="text-gray-600">
                      <strong>Email:</strong> {collaborator.profile.email}
                    </p>
                    {collaborator.profile.linkedin && (
                      <a
                        href={collaborator.profile.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-purple-600 hover:text-purple-700 mt-1 inline-flex items-center gap-1"
                      >
                        <Linkedin className="h-4 w-4" />
                        Profile
                      </a>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => handleRemoveCollaborator(collaborator.profile.id)}
                  className="text-red-600 hover:text-red-700 transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Stats Section */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="bg-purple-50 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-purple-600 font-medium">Total Requests</p>
                      <h4 className="text-2xl font-bold text-purple-700">{collaborator.total_requests}</h4>
                    </div>
                    <Book className="text-purple-600 h-8 w-8" />
                  </div>
                </div>
                <div className="bg-purple-50 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-purple-600 font-medium">Accepted Collaborations</p>
                      <h4 className="text-2xl font-bold text-purple-700">{collaborator.accepted_collaborations}</h4>
                    </div>
                    <Star className="text-purple-600 h-8 w-8" />
                  </div>
                </div>
              </div>

              {/* Connected Students */}
              {collaborator.connected_students?.length > 0 && (
                <div className="mb-6">
                  <h4 className="text-lg font-semibold text-gray-800 mb-3">Connected Students</h4>
                  <div className="bg-white/50 rounded-lg overflow-x-auto">
                    <table className="min-w-full">
                      <thead>
                        <tr className="border-b border-gray-200">
                          <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Name</th>
                          <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Roll Number</th>
                          <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Branch</th>
                          <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Semester</th>
                        </tr>
                      </thead>
                      <tbody>
                        {collaborator.connected_students.map((student, i) => (
                          <tr key={i} className="border-b border-gray-100">
                            <td className="px-4 py-3 text-sm text-gray-800">{student.full_name}</td>
                            <td className="px-4 py-3 text-sm text-gray-600">{student.roll_number}</td>
                            <td className="px-4 py-3 text-sm text-gray-600">{student.branch}</td>
                            <td className="px-4 py-3 text-sm text-gray-600">{student.semester}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Connected Groups */}
              {collaborator.connected_groups?.length > 0 && (
                <div className="mb-6">
                  <h4 className="text-lg font-semibold text-gray-800 mb-3">Connected Groups</h4>
                  <div className="bg-white/50 rounded-lg overflow-x-auto">
                    <table className="min-w-full">
                      <thead>
                        <tr className="border-b border-gray-200">
                          <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Group Name</th>
                          <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Leader</th>
                          <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Members</th>
                        </tr>
                      </thead>
                      <tbody>
                        {collaborator.connected_groups.map((group, i) => (
                          <tr key={i} className="border-b border-gray-100">
                            <td className="px-4 py-3 text-sm text-gray-800">{group.name}</td>
                            <td className="px-4 py-3 text-sm text-gray-600">{group.leader.full_name}</td>
                            <td className="px-4 py-3 text-sm text-gray-600">{group.members.count}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Recent Collaborations */}
              {collaborator.recent_collaborations?.length > 0 && (
                <div>
                  <h4 className="text-lg font-semibold text-gray-800 mb-3">Recent Project Collaborations</h4>
                  <div className="bg-white/50 rounded-lg overflow-x-auto">
                    <table className="min-w-full">
                      <thead>
                        <tr className="border-b border-gray-200">
                          <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Project Title</th>
                          <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Owner</th>
                          <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Status</th>
                          <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Tech Stack</th>
                        </tr>
                      </thead>
                      <tbody>
                        {collaborator.recent_collaborations.map((collab, i) => (
                          <tr key={i} className="border-b border-gray-100">
                            <td className="px-4 py-3 text-sm text-gray-800">{collab.project.title}</td>
                            <td className="px-4 py-3 text-sm text-gray-600">
                              {collab.project.student ? collab.project.student.full_name : collab.project.group.name}
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-600">{collab.status}</td>
                            <td className="px-4 py-3 text-sm text-gray-600">{collab.project.tech_stack}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </motion.div>
          ))}

          {collaborators.length === 0 && (
            <div className="text-center py-12 bg-white/80 backdrop-blur-sm rounded-xl shadow-xl">
              <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No collaborators found.</p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default ViewCollaborators; 