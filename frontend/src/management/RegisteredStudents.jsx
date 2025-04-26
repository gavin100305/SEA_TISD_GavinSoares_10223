import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { User, Book, Users, Star, Filter } from 'lucide-react';

const RegisteredStudents = () => {
  const [students, setStudents] = useState([]);
  const [stats, setStats] = useState({
    total_students: 0,
    active_projects: 0,
    mentor_connections: 0,
    avg_projects: 0
  });
  const [filters, setFilters] = useState({
    branch: '',
    semester: ''
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStudents();
  }, [filters]);

  const fetchStudents = async () => {
    try {
      const response = await axios.get('/api/college/registered-students/', {
        params: filters
      });
      setStudents(response.data.students);
      setStats(response.data.stats);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching students:', error);
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
            Registered <span className="text-purple-600">Students</span>
          </h1>
          <p className="text-gray-600">View and manage all students registered from your institution</p>
        </motion.div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
        >
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500">Total Students</p>
                <h3 className="text-3xl font-bold text-purple-600">{stats.total_students}</h3>
              </div>
              <Users className="text-purple-600 h-8 w-8" />
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500">Active Projects</p>
                <h3 className="text-3xl font-bold text-blue-600">{stats.active_projects}</h3>
              </div>
              <Book className="text-blue-600 h-8 w-8" />
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500">Mentor Connections</p>
                <h3 className="text-3xl font-bold text-green-600">{stats.mentor_connections}</h3>
              </div>
              <User className="text-green-600 h-8 w-8" />
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500">Average Projects</p>
                <h3 className="text-3xl font-bold text-yellow-600">{stats.avg_projects.toFixed(1)}</h3>
              </div>
              <Star className="text-yellow-600 h-8 w-8" />
            </div>
          </div>
        </motion.div>

        {/* Filters Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-xl mb-8"
        >
          <div className="flex items-center gap-4 flex-wrap">
            <select
              name="branch"
              value={filters.branch}
              onChange={handleFilterChange}
              className="bg-white/50 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="">All Branches</option>
              <option value="CSE">Computer Science</option>
              <option value="ECE">Electronics</option>
              <option value="ME">Mechanical</option>
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
              onClick={fetchStudents}
              className="flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
            >
              <Filter className="h-4 w-4" />
              Apply Filter
            </button>
          </div>
        </motion.div>

        {/* Students Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {students.map((student, index) => (
            <motion.div
              key={student.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-xl hover:shadow-2xl transition-shadow"
            >
              <div className="flex items-start gap-4">
                <img
                  src={student.profile_picture || `https://ui-avatars.com/api/?name=${student.full_name}&background=9d4edd&color=fff`}
                  alt={student.full_name}
                  className="w-20 h-20 rounded-full border-4 border-purple-600"
                />
                <div>
                  <h3 className="text-xl font-semibold text-gray-800">{student.full_name}</h3>
                  <p className="text-gray-600">Roll Number: {student.roll_number}</p>
                  <span className="inline-flex items-center gap-1 bg-purple-100 text-purple-600 px-3 py-1 rounded-full text-sm mt-2">
                    <Book className="h-4 w-4" />
                    {student.projects.length} Projects
                  </span>
                </div>
              </div>

              <div className="mt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Branch:</span>
                  <span className="text-gray-700">{student.branch}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Semester:</span>
                  <span className="text-gray-700">{student.semester}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Email:</span>
                  <span className="text-gray-700">{student.email}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Mentors:</span>
                  <span className="text-gray-700">{student.mentor_connections} Connected</span>
                </div>
              </div>
            </motion.div>
          ))}

          {students.length === 0 && (
            <div className="col-span-full text-center py-12">
              <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No students found matching the criteria.</p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default RegisteredStudents; 