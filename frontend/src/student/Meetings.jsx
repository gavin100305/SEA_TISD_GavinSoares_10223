import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  Calendar, Clock, Video, Users, 
  ExternalLink, CheckCircle, XCircle,
  AlertCircle, Edit, Trash2
} from 'lucide-react';

const Meetings = () => {
  const [meetings, setMeetings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchMeetings();
  }, []);

  const fetchMeetings = async () => {
    try {
      const response = await axios.get('/api/student/meetings/');
      setMeetings(response.data);
    } catch (error) {
      setError('Failed to fetch meetings');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateMeeting = async (meetingId, status) => {
    try {
      await axios.post(`/api/student/meeting/${meetingId}/update/`, { status });
      setMeetings(prev => prev.map(meeting => 
        meeting.id === meetingId ? { ...meeting, status } : meeting
      ));
    } catch (error) {
      console.error('Error updating meeting:', error);
    }
  };

  const handleDeleteMeeting = async (meetingId) => {
    if (!window.confirm('Are you sure you want to delete this meeting?')) return;

    try {
      await axios.delete(`/api/student/meeting/${meetingId}/`);
      setMeetings(prev => prev.filter(meeting => meeting.id !== meetingId));
    } catch (error) {
      console.error('Error deleting meeting:', error);
    }
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'scheduled':
        return 'bg-blue-500';
      case 'completed':
        return 'bg-green-500';
      case 'cancelled':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
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
            Your Meetings
          </h2>
        </motion.div>

        {/* Meetings Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {meetings.map(meeting => (
            <motion.div
              key={meeting.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-xl hover:shadow-2xl transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Calendar className="text-purple-600" size={20} />
                  <h3 className="font-semibold text-gray-800">{meeting.title}</h3>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs text-white ${getStatusColor(meeting.status)}`}>
                  {meeting.status}
                </span>
              </div>

              <div className="space-y-3 mb-4">
                <div className="flex items-center gap-2 text-gray-600">
                  <Clock size={16} />
                  <span>{new Date(meeting.scheduled_time).toLocaleString()}</span>
                </div>

                <div className="flex items-center gap-2 text-gray-600">
                  <Video size={16} />
                  <span>{meeting.platform}</span>
                </div>

                {meeting.participants && (
                  <div className="flex items-center gap-2 text-gray-600">
                    <Users size={16} />
                    <span>{meeting.participants.join(', ')}</span>
                  </div>
                )}
              </div>

              <p className="text-gray-600 mb-4">{meeting.description}</p>

              <div className="flex flex-wrap gap-2">
                {meeting.zoom_link && (
                  <a
                    href={meeting.zoom_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-purple-600 hover:text-purple-700"
                  >
                    <ExternalLink size={16} />
                    Join Meeting
                  </a>
                )}

                {meeting.status === 'scheduled' && (
                  <>
                    <button
                      onClick={() => handleUpdateMeeting(meeting.id, 'completed')}
                      className="flex items-center gap-1 text-green-600 hover:text-green-700"
                    >
                      <CheckCircle size={16} />
                      Mark Complete
                    </button>

                    <button
                      onClick={() => handleUpdateMeeting(meeting.id, 'cancelled')}
                      className="flex items-center gap-1 text-red-600 hover:text-red-700"
                    >
                      <XCircle size={16} />
                      Cancel
                    </button>
                  </>
                )}

                <button
                  onClick={() => navigate(`/meeting/${meeting.id}/edit`)}
                  className="flex items-center gap-1 text-blue-600 hover:text-blue-700"
                >
                  <Edit size={16} />
                  Edit
                </button>

                <button
                  onClick={() => handleDeleteMeeting(meeting.id)}
                  className="flex items-center gap-1 text-red-600 hover:text-red-700"
                >
                  <Trash2 size={16} />
                  Delete
                </button>
              </div>
            </motion.div>
          ))}

          {meetings.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="lg:col-span-3 text-center py-12"
            >
              <Calendar size={48} className="mx-auto text-gray-400 mb-4" />
              <h3 className="text-xl font-semibold text-gray-800 mb-2">No Meetings Scheduled</h3>
              <p className="text-gray-600">You don't have any meetings scheduled at the moment.</p>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Meetings; 