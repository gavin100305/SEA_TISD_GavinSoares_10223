import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Chart as ChartJS } from 'chart.js/auto';
import { Doughnut, Pie, Bar, Line } from 'react-chartjs-2';
import { ClipboardList, Users, CheckCircle, Clock, GitPullRequest } from 'lucide-react';

const ProjectStatistics = () => {
  const [stats, setStats] = useState({
    total_projects: 0,
    completed_projects: 0,
    in_progress_projects: 0,
    under_review_projects: 0,
    with_mentor: 0,
    without_mentor: 0,
    group_projects: 0,
    individual_projects: 0,
    avg_grade: 0,
    open_for_collab: 0,
    with_collaborator: 0
  });

  const [chartData, setChartData] = useState({
    sdgs: null,
    techStack: null,
    status: null,
    timeline: null
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchStatistics();
    fetchChartData();
  }, []);

  const fetchStatistics = async () => {
    try {
      const response = await axios.get('/api/college/project-statistics/');
      setStats(response.data);
    } catch (error) {
      setError('Failed to fetch statistics');
      console.error('Error:', error);
    }
  };

  const fetchChartData = async () => {
    try {
      const chartTypes = ['sdgs', 'tech_stack', 'status', 'timeline'];
      const chartDataPromises = chartTypes.map(type =>
        axios.get(`/api/college/project-charts-data/?chart_type=${type}`)
      );
      
      const responses = await Promise.all(chartDataPromises);
      const [sdgs, techStack, status, timeline] = responses.map(res => res.data);
      
      setChartData({ sdgs, techStack, status, timeline });
    } catch (error) {
      console.error('Error fetching chart data:', error);
    } finally {
      setLoading(false);
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
            Project Statistics Dashboard
          </h2>
        </motion.div>

        {/* Summary Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
        >
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500">Total Projects</p>
                <h3 className="text-3xl font-bold text-purple-600">{stats.total_projects}</h3>
              </div>
              <ClipboardList className="text-purple-600 h-8 w-8" />
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500">Completed</p>
                <h3 className="text-3xl font-bold text-green-600">{stats.completed_projects}</h3>
              </div>
              <CheckCircle className="text-green-600 h-8 w-8" />
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500">In Progress</p>
                <h3 className="text-3xl font-bold text-blue-600">{stats.in_progress_projects}</h3>
              </div>
              <Clock className="text-blue-600 h-8 w-8" />
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500">Under Review</p>
                <h3 className="text-3xl font-bold text-yellow-600">{stats.under_review_projects}</h3>
              </div>
              <GitPullRequest className="text-yellow-600 h-8 w-8" />
            </div>
          </div>
        </motion.div>

        {/* Charts Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Status Distribution Chart */}
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-xl">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Project Status Distribution</h3>
              {chartData.status && <Doughnut data={chartData.status} />}
            </div>

            {/* SDGs Distribution Chart */}
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-xl">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">SDGs Distribution</h3>
              {chartData.sdgs && <Pie data={chartData.sdgs} />}
            </div>

            {/* Technologies Used Chart */}
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-xl">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Technologies Used</h3>
              {chartData.techStack && <Bar data={chartData.techStack} />}
            </div>

            {/* Timeline Chart */}
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-xl">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Projects Timeline</h3>
              {chartData.timeline && <Line data={chartData.timeline} />}
            </div>
          </div>
        </motion.div>

        {/* Additional Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8"
        >
          {/* Mentorship Stats */}
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-xl">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Mentorship Stats</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">With Mentor</span>
                <span className="font-semibold text-purple-600">{stats.with_mentor}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Without Mentor</span>
                <span className="font-semibold text-purple-600">{stats.without_mentor}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Average Grade</span>
                <span className="font-semibold text-purple-600">{stats.avg_grade.toFixed(1)}</span>
              </div>
            </div>
          </div>

          {/* Project Types */}
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-xl">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Project Types</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Group Projects</span>
                <span className="font-semibold text-purple-600">{stats.group_projects}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Individual Projects</span>
                <span className="font-semibold text-purple-600">{stats.individual_projects}</span>
              </div>
            </div>
          </div>

          {/* Collaboration Stats */}
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-xl">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Collaboration</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Open for Collaboration</span>
                <span className="font-semibold text-purple-600">{stats.open_for_collab}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">With Collaborator</span>
                <span className="font-semibold text-purple-600">{stats.with_collaborator}</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ProjectStatistics; 