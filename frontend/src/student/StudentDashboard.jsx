"use client"

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  Book, Users, Calendar, Award, 
  FileText, UserCheck, Bell, Settings,
  ChevronRight, ExternalLink, Star
} from 'lucide-react';
import {
  FiSearch,
  FiBookmark,
  FiBriefcase,
  FiBell,
  FiPieChart,
  FiStar,
  FiCalendar,
  FiFilter,
  FiArrowRight,
  FiMapPin,
  FiHome,
  FiMessageSquare,
  FiSettings,
  FiLogOut,
  FiMenu,
  FiX,
  FiChevronRight,
} from "react-icons/fi"

const StudentDashboard = () => {
  const [dashboardData, setDashboardData] = useState({
    student: {},
    projects: [],
    groups: [],
    meetings: [],
    assessments: [],
    notifications: [],
    mentorConnections: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await axios.get('/api/student/dashboard/');
      setDashboardData(response.data);
    } catch (error) {
      setError('Failed to fetch dashboard data');
      console.error('Error:', error);
    } finally {
      setLoading(false);
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
      <div className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="welcome-section bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-xl mb-8">
          <h1 className="text-3xl font-bold text-gray-800">
            Welcome back, {dashboardData.student.full_name}!
          </h1>
          <p className="text-gray-600 mt-2">
            {dashboardData.student.roll_number} | {dashboardData.student.branch} - {dashboardData.student.semester}th Semester
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="stat-card bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-xl"
          >
            <div className="flex items-center gap-4">
              <div className="p-3 bg-purple-100 rounded-lg">
                <Book className="text-purple-600" size={24} />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-800">{dashboardData.projects.length}</h3>
                <p className="text-gray-600">Active Projects</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            delay={0.1}
            className="stat-card bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-xl"
          >
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Users className="text-blue-600" size={24} />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-800">{dashboardData.groups.length}</h3>
                <p className="text-gray-600">Active Groups</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            delay={0.2}
            className="stat-card bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-xl"
          >
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-100 rounded-lg">
                <Calendar className="text-green-600" size={24} />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-800">{dashboardData.meetings.length}</h3>
                <p className="text-gray-600">Upcoming Meetings</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            delay={0.3}
            className="stat-card bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-xl"
          >
            <div className="flex items-center gap-4">
              <div className="p-3 bg-yellow-100 rounded-lg">
                <Award className="text-yellow-600" size={24} />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-800">{dashboardData.assessments.length}</h3>
                <p className="text-gray-600">Assessments</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Recent Projects */}
            <div className="dashboard-card bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-xl">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-800">Recent Projects</h2>
                <button
                  onClick={() => navigate('/my-projects')}
                  className="text-purple-600 hover:text-purple-700 flex items-center gap-2"
                >
                  View All <ChevronRight size={16} />
                </button>
              </div>
              
              <div className="space-y-4">
                {dashboardData.projects.slice(0, 3).map(project => (
                  <div key={project.id} className="project-item flex items-center justify-between p-4 bg-purple-50/50 rounded-lg">
                    <div>
                      <h3 className="font-medium text-gray-800">{project.title}</h3>
                      <p className="text-sm text-gray-600">{project.description}</p>
                    </div>
                    <button
                      onClick={() => navigate(`/project/${project.id}`)}
                      className="text-purple-600 hover:text-purple-700"
                    >
                      <ExternalLink size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Upcoming Meetings */}
            <div className="dashboard-card bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-xl">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-800">Upcoming Meetings</h2>
                <button
                  onClick={() => navigate('/meetings')}
                  className="text-purple-600 hover:text-purple-700 flex items-center gap-2"
                >
                  View All <ChevronRight size={16} />
                </button>
              </div>
              
              <div className="space-y-4">
                {dashboardData.meetings.slice(0, 3).map(meeting => (
                  <div key={meeting.id} className="meeting-item flex items-center justify-between p-4 bg-purple-50/50 rounded-lg">
                    <div>
                      <h3 className="font-medium text-gray-800">{meeting.title}</h3>
                      <p className="text-sm text-gray-600">
                        {new Date(meeting.scheduled_time).toLocaleString()}
                      </p>
                    </div>
                    {meeting.zoom_link && (
                      <a
                        href={meeting.zoom_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-purple-600 hover:text-purple-700"
                      >
                        Join <ExternalLink size={16} className="inline" />
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-8">
            {/* Mentor Connections */}
            <div className="dashboard-card bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-xl">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-800">Mentor Connections</h2>
                <button
                  onClick={() => navigate('/mentors')}
                  className="text-purple-600 hover:text-purple-700 flex items-center gap-2"
                >
                  Find Mentors <ChevronRight size={16} />
                </button>
              </div>
              
              <div className="space-y-4">
                {dashboardData.mentorConnections.map(connection => (
                  <div key={connection.id} className="mentor-item flex items-center gap-4 p-4 bg-purple-50/50 rounded-lg">
                    <img
                      src={connection.mentor.profile_picture || `https://ui-avatars.com/api/?name=${encodeURIComponent(connection.mentor.full_name)}&background=9d4edd&color=fff`}
                      alt={connection.mentor.full_name}
                      className="w-10 h-10 rounded-full"
                    />
                    <div>
                      <h3 className="font-medium text-gray-800">{connection.mentor.full_name}</h3>
                      <p className="text-sm text-gray-600">{connection.mentor.expertise}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Notifications */}
            <div className="dashboard-card bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-xl">
              <h2 className="text-xl font-semibold text-gray-800 mb-6">Notifications</h2>
              <div className="space-y-4">
                {dashboardData.notifications.map(notification => (
                  <div key={notification.id} className="notification-item flex items-start gap-4 p-4 bg-purple-50/50 rounded-lg">
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <Bell className="text-purple-600" size={16} />
                    </div>
                    <div>
                      <p className="text-gray-800">{notification.message}</p>
                      <p className="text-sm text-gray-600">
                        {new Date(notification.created_at).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;

