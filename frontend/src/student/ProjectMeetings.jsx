import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import { Plus, Video, Edit, X } from 'lucide-react';

const ProjectMeetings = () => {
  const [project, setProject] = useState(null);
  const [meetings, setMeetings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { id: projectId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    fetchProjectMeetings();
  }, [projectId]);

  const fetchProjectMeetings = async () => {
    try {
      const response = await axios.get(`/api/projects/${projectId}/meetings/`);
      setProject(response.data.project);
      setMeetings(response.data.meetings);
    } catch (error) {
      setError('Failed to fetch meetings');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCloseAlert = (alertElement) => {
    alertElement.remove();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-50 p-6 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-200 border-t-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-50">
      <div className="bg-elements">
        <div className="bg-gradient"></div>
        <div className="bg-gradient"></div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="header-section bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-xl mb-8">
          <div className="flex justify-between items-center flex-wrap gap-4">
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-indigo-600">
              Meetings for {project?.title}
            </h1>
            <div className="schedule-buttons flex flex-wrap gap-4">
              {project?.collaborators.map(collaborator => (
                collaborator.status === 'accepted' && (
                  <button
                    key={collaborator.id}
                    onClick={() => navigate(`/project/${projectId}/schedule-meeting/${collaborator.id}`)}
                    className="schedule-btn flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:opacity-90 transition"
                  >
                    <Plus size={16} />
                    Schedule with {collaborator.full_name}
                  </button>
                )
              ))}
            </div>
          </div>
        </div>

        {error && (
          <div className="alert alert-error mb-4 flex justify-between items-center">
            <p>{error}</p>
            <button onClick={(e) => handleCloseAlert(e.target.closest('.alert'))} className="text-gray-500 hover:text-gray-700">
              <X size={20} />
            </button>
          </div>
        )}

        {meetings.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {meetings.map(meeting => (
              <motion.div
                key={meeting.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`meeting-card bg-white/80 backdrop-blur-sm rounded-xl shadow-xl status-${meeting.status}`}
              >
                <div className="meeting-content p-6">
                  <div className="meeting-header">
                    <h3 className="meeting-title text-xl font-semibold text-gray-800">
                      {meeting.meeting_title}
                    </h3>
                    <span className={`meeting-status status-badge-${meeting.status}`}>
                      {meeting.status}
                    </span>
                  </div>
                  
                  <p className="meeting-description text-gray-600 mt-4">
                    {meeting.meeting_description}
                  </p>
                  
                  <div className="meeting-meta mt-4">
                    <p className="meta-item">
                      <strong>Date & Time:</strong> {new Date(meeting.scheduled_time).toLocaleString()}
                    </p>
                    <p className="meta-item">
                      <strong>Duration:</strong> {meeting.duration} minutes
                    </p>
                    <p className="meta-item">
                      <strong>Collaborator:</strong> {meeting.collaborator.full_name}
                    </p>
                  </div>
                  
                  {meeting.status === 'scheduled' && (
                    <>
                      <div className="meeting-details mt-4 p-4 bg-blue-50 rounded-lg">
                        <h4 className="text-blue-600 font-semibold mb-2">
                          <i className="fas fa-info-circle mr-2"></i>Meeting Details
                        </h4>
                        <p><strong>Meeting ID:</strong> {meeting.zoom_meeting_id}</p>
                        <p><strong>Password:</strong> {meeting.zoom_password}</p>
                      </div>
                      
                      <div className="action-buttons mt-4 flex gap-4">
                        <a
                          href={meeting.zoom_link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn btn-join flex-1 flex items-center justify-center gap-2"
                        >
                          <Video size={16} />
                          Join Meeting
                        </a>
                        <button
                          onClick={() => navigate(`/meetings/${meeting.id}/update`)}
                          className="btn btn-update flex-1 flex items-center justify-center gap-2"
                        >
                          <Edit size={16} />
                          Update Meeting
                        </button>
                      </div>
                    </>
                  )}
                </div>
                <div className="meeting-footer p-4 bg-gray-50/50 text-gray-500 text-sm border-t border-gray-100">
                  Created: {new Date(meeting.created_at).toLocaleDateString()}
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="empty-state text-center py-12 bg-white/80 backdrop-blur-sm rounded-xl shadow-xl">
            <p className="text-gray-600 mb-2">No meetings scheduled yet.</p>
            <p className="text-gray-500 text-sm">Schedule a meeting with your collaborators using the button above.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectMeetings; 