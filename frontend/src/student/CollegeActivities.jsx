import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Calendar, Clock, MapPin, Award, FileText, Download, Edit, Trash2, Filter, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';

const CollegeActivities = () => {
  const [activities, setActivities] = useState([]);
  const [filters, setFilters] = useState({
    status: '',
    activity_type: '',
    semester: ''
  });
  const [loading, setLoading] = useState(true);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    fetchActivities();
  }, [filters]);

  const fetchActivities = async () => {
    try {
      const response = await axios.get('/api/college/activities/', {
        params: filters
      });
      setActivities(response.data.activities);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching activities:', error);
      setErrorMessage('Failed to load activities');
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

  const handleDeleteActivity = async (activityId) => {
    if (!window.confirm('Are you sure you want to delete this activity?')) return;

    try {
      await axios.delete(`/api/college/activities/${activityId}/`);
      setSuccessMessage('Activity deleted successfully');
      fetchActivities();
    } catch (error) {
      setErrorMessage('Failed to delete activity');
    }
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'upcoming':
        return 'bg-blue-100 text-blue-600 border-blue-200';
      case 'ongoing':
        return 'bg-green-100 text-green-600 border-green-200';
      case 'completed':
        return 'bg-gray-100 text-gray-600 border-gray-200';
      default:
        return 'bg-red-100 text-red-600 border-red-200';
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
            College <span className="text-purple-600">Activities</span>
          </h1>
          <Link
            to="/add-activity"
            className="inline-flex items-center gap-2 bg-transparent border border-purple-600 text-purple-600 px-4 py-2 rounded-lg hover:bg-purple-50 transition-colors"
          >
            <Plus className="h-4 w-4" />
            Add New Activity
          </Link>
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
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Filters</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <select
              name="status"
              value={filters.status}
              onChange={handleFilterChange}
              className="bg-white/50 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="">All Status</option>
              <option value="upcoming">Upcoming</option>
              <option value="ongoing">Ongoing</option>
              <option value="completed">Completed</option>
            </select>

            <select
              name="activity_type"
              value={filters.activity_type}
              onChange={handleFilterChange}
              className="bg-white/50 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="">All Types</option>
              <option value="workshop">Workshop</option>
              <option value="seminar">Seminar</option>
              <option value="competition">Competition</option>
            </select>

            <select
              name="semester"
              value={filters.semester}
              onChange={handleFilterChange}
              className="bg-white/50 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="">All Semesters</option>
              {[1, 2, 3, 4, 5, 6, 7, 8].map(sem => (
                <option key={sem} value={sem}>Semester {sem}</option>
              ))}
            </select>

            <button
              onClick={fetchActivities}
              className="flex items-center justify-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
            >
              <Filter className="h-4 w-4" />
              Apply Filters
            </button>
          </div>
        </motion.div>

        {/* Activities List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {activities.map((activity, index) => (
            <motion.div
              key={activity.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-xl hover:shadow-2xl transition-shadow"
            >
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-semibold text-gray-800">{activity.title}</h3>
                <div className="flex gap-2">
                  <Link
                    to={`/edit-activity/${activity.id}`}
                    className="p-2 text-gray-600 hover:text-purple-600 transition-colors"
                  >
                    <Edit className="h-5 w-5" />
                  </Link>
                  <button
                    onClick={() => handleDeleteActivity(activity.id)}
                    className="p-2 text-gray-600 hover:text-red-600 transition-colors"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </div>

              <div className="flex flex-wrap gap-3 mb-4">
                <span className={`px-3 py-1 rounded-full text-sm border ${getStatusBadgeClass(activity.status)}`}>
                  {activity.status}
                </span>
                <span className="text-gray-600 text-sm">{activity.activity_type}</span>
                <span className="text-gray-600 text-sm">{activity.target_branch} - Semester {activity.target_semester}</span>
              </div>

              <p className="text-gray-700 mb-6">{activity.description}</p>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <h5 className="text-purple-600 font-medium">Schedule</h5>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Calendar className="h-4 w-4" />
                    <span>Start: {new Date(activity.start_date).toLocaleString()}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Clock className="h-4 w-4" />
                    <span>End: {new Date(activity.end_date).toLocaleString()}</span>
                  </div>
                </div>

                {(activity.venue || activity.online_meeting_link) && (
                  <div className="space-y-2">
                    <h5 className="text-purple-600 font-medium">Location</h5>
                    {activity.venue && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <MapPin className="h-4 w-4" />
                        <span>{activity.venue}</span>
                      </div>
                    )}
                    {activity.online_meeting_link && (
                      <a
                        href={activity.online_meeting_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-sm text-purple-600 hover:text-purple-700"
                      >
                        <Globe className="h-4 w-4" />
                        Join Meeting
                      </a>
                    )}
                  </div>
                )}

                {(activity.assessment_criteria || activity.max_marks) && (
                  <div className="space-y-2">
                    <h5 className="text-purple-600 font-medium">Assessment Details</h5>
                    {activity.assessment_criteria && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <FileText className="h-4 w-4" />
                        <span>{activity.assessment_criteria}</span>
                      </div>
                    )}
                    {activity.max_marks && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Award className="h-4 w-4" />
                        <span>Maximum Marks: {activity.max_marks}</span>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {activity.attachments && (
                <a
                  href={activity.attachments}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 mt-6 bg-purple-50 text-purple-600 px-4 py-2 rounded-lg hover:bg-purple-100 transition-colors"
                >
                  <Download className="h-4 w-4" />
                  Download Attachment
                </a>
              )}
            </motion.div>
          ))}

          {activities.length === 0 && (
            <div className="text-center py-12 bg-white/80 backdrop-blur-sm rounded-xl shadow-xl">
              <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No activities found. Click "Add New Activity" to create one.</p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default CollegeActivities; 