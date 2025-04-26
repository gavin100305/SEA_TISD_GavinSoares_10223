import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Users, Calendar, MessageSquare, Video, Edit, Trash2, Plus, Link as LinkIcon } from 'lucide-react';

const GroupProjectDetail = () => {
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { groupId, projectId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    fetchProjectDetails();
  }, [projectId]);

  const fetchProjectDetails = async () => {
    try {
      const response = await axios.get(`/api/groups/${groupId}/projects/${projectId}/`);
      setProject(response.data);
    } catch (error) {
      setError('Failed to fetch project details');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteMeeting = async (meetingId) => {
    try {
      await axios.delete(`/api/meetings/${meetingId}/`);
      fetchProjectDetails(); // Refresh data
    } catch (error) {
      console.error('Error deleting meeting:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-50 p-6 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-200 border-t-purple-600"></div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-50 p-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-gray-800">Error loading project details</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-50 p-6">
      <div className="max-w-7xl mx-auto">
        <button
          onClick={() => navigate(`/group/${groupId}`)}
          className="flex items-center gap-2 text-gray-600 hover:text-purple-600 transition mb-6"
        >
          <ArrowLeft size={20} />
          Back to Group
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Project Info Section */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-xl"
            >
              <h1 className="text-2xl font-bold text-gray-800 mb-4">{project.title}</h1>
              <div className="space-y-4">
                <p className="text-gray-600">{project.description}</p>
                <div className="flex items-center gap-3 text-gray-600">
                  <Calendar size={20} />
                  <span>Due: {new Date(project.due_date).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-3 text-gray-600">
                  <Users size={20} />
                  <span>{project.collaborators.length} Collaborators</span>
                </div>
              </div>

              {project.is_leader && (
                <div className="mt-6 space-y-3">
                  <button
                    onClick={() => navigate(`/group/${groupId}/project/${projectId}/edit`)}
                    className="w-full px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:opacity-90 transition flex items-center justify-center gap-2"
                  >
                    <Edit size={20} />
                    Edit Project
                  </button>
                  <button
                    onClick={() => navigate(`/group/${groupId}/project/${projectId}/collaborators`)}
                    className="w-full px-4 py-2 border border-purple-600 text-purple-600 rounded-lg hover:bg-purple-50 transition flex items-center justify-center gap-2"
                  >
                    <Users size={20} />
                    Manage Collaborators
                  </button>
                </div>
              )}
            </motion.div>
          </div>

          {/* Main Content Section */}
          <div className="lg:col-span-2 space-y-6">
            {/* Meetings Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-xl"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-800">Project Meetings</h2>
                {project.is_leader && (
                  <button
                    onClick={() => navigate(`/project/${projectId}/meetings/add`)}
                    className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition flex items-center gap-2"
                  >
                    <Plus size={16} />
                    Schedule Meeting
                  </button>
                )}
              </div>

              {project.meetings.length > 0 ? (
                <div className="space-y-4">
                  {project.meetings.map(meeting => (
                    <div key={meeting.id} className="bg-purple-50/50 rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium text-gray-800">{meeting.title}</h3>
                          <p className="text-sm text-gray-600 mt-1">
                            {new Date(meeting.date).toLocaleDateString()} at {meeting.time}
                          </p>
                          {meeting.zoom_link && (
                            <a
                              href={meeting.zoom_link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="mt-2 inline-flex items-center gap-2 text-purple-600 hover:text-purple-700"
                            >
                              <Video size={16} />
                              Join Zoom Meeting
                            </a>
                          )}
                        </div>
                        {project.is_leader && (
                          <button
                            onClick={() => handleDeleteMeeting(meeting.id)}
                            className="text-red-500 hover:text-red-600 transition"
                          >
                            <Trash2 size={18} />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <p>No meetings scheduled</p>
                </div>
              )}
            </motion.div>

            {/* Resources Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-xl"
            >
              <h2 className="text-xl font-semibold text-gray-800 mb-6">Project Resources</h2>
              
              {project.resources.length > 0 ? (
                <div className="space-y-4">
                  {project.resources.map(resource => (
                    <div key={resource.id} className="bg-purple-50/50 rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium text-gray-800">{resource.title}</h3>
                          <a
                            href={resource.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-2 inline-flex items-center gap-2 text-purple-600 hover:text-purple-700"
                          >
                            <LinkIcon size={16} />
                            View Resource
                          </a>
                        </div>
                        {project.is_leader && (
                          <button
                            onClick={() => {/* Handle delete */}}
                            className="text-red-500 hover:text-red-600 transition"
                          >
                            <Trash2 size={18} />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <p>No resources added yet</p>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GroupProjectDetail; 