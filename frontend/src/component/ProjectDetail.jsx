import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ArrowRight, Github, Users, BookOpen, Code, Award, MessageSquare, X, ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from './Navbar';
import Footer from './Footer';

const ProjectDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedImage, setSelectedImage] = useState(null);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 100,
        damping: 10
      }
    }
  };

  const tabContentVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.3, ease: 'easeInOut' }
    },
    exit: { opacity: 0, y: -10 }
  };

  // Improved page transition to completely eliminate white flash
  const pageTransition = {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: { 
      duration: 0.4, 
      ease: [0.25, 0.1, 0.25, 1.0], // Cubic bezier for smoother feeling
      when: "beforeChildren" // Ensures parent animates before children
    }
  };

  useEffect(() => {
    // Add a class to body to prevent background color flashing
    document.body.classList.add('bg-black');
    
    const fetchProject = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:8000/api/students/projects/${id}/`);
        setProject(response.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
    
    // Cleanup function to remove the class when component unmounts
    return () => {
      document.body.classList.remove('bg-black');
    };
  }, [id]);

  // Custom loader component with gradient animation
  const LoaderComponent = () => (
    <div className="flex justify-center items-center h-screen">
      <motion.div 
        className="relative w-16 h-16"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <motion.div
          className="absolute inset-0 rounded-full border-2 border-t-purple-500 border-r-purple-400 border-b-purple-300 border-l-transparent"
          animate={{ rotate: 360 }}
          transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }}
        />
        <motion.div
          className="absolute inset-2 rounded-full border-2 border-t-transparent border-r-purple-300 border-b-purple-200 border-l-purple-100"
          animate={{ rotate: -180 }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "linear" }}
        />
      </motion.div>
    </div>
  );

  if (loading) {
    return (
      <motion.div 
        {...pageTransition}
        className="min-h-screen bg-black text-white"
      >
        <Navbar />
        <LoaderComponent />
      </motion.div>
    );
  }

  if (error) {
    return (
      <motion.div 
        {...pageTransition}
        className="min-h-screen bg-black text-white"
      >
        <Navbar />
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 100 }}
          className="bg-red-900/20 border border-red-700/30 text-red-300 px-4 py-3 rounded max-w-md mx-auto mt-8 backdrop-blur-sm"
        >
          <strong className="font-bold">Error loading project!</strong>
          <span className="block sm:inline"> {error}</span>
        </motion.div>
      </motion.div>
    );
  }

  if (!project) {
    return (
      <motion.div 
        {...pageTransition}
        className="min-h-screen bg-black text-white"
      >
        <Navbar />
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center py-20"
        >
          <p className="text-gray-400">Project not found.</p>
          <Link 
            to="/projects" 
            className="text-purple-400 hover:text-purple-300 mt-4 inline-block"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Back to Projects
          </Link>
        </motion.div>
      </motion.div>
    );
  }

  // Format created date
  const createdDate = new Date(project.created_at).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  // Get all non-null project images
  const projectImages = [
    project.project_image1,
    project.project_image2,
    project.project_image3,
    project.project_image4,
    project.project_image5
  ].filter(img => img !== null);

  return (
    <motion.div
      {...pageTransition}
      className="min-h-screen bg-black text-white relative overflow-hidden"
      layoutId={`project-${id}`}
    >
      {/* Background elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute w-full h-full">
          <svg className="opacity-10" width="100%" height="100%">
            <defs>
              <pattern id="smallGrid" width="8" height="8" patternUnits="userSpaceOnUse">
                <path d="M 8 0 L 0 0 0 8" fill="none" stroke="rgba(128, 90, 213, 0.2)" strokeWidth="0.5" />
              </pattern>
              <pattern id="grid" width="80" height="80" patternUnits="userSpaceOnUse">
                <rect width="80" height="80" fill="url(#smallGrid)" />
                <path d="M 80 0 L 0 0 0 80" fill="none" stroke="rgba(128, 90, 213, 0.3)" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>
        <motion.div
          animate={{
            y: [0, -10, 0],
            opacity: [0.8, 1, 0.8]
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-[50%] right-[5%] w-32 h-32 rounded-full bg-purple-600/20 blur-xl"
        ></motion.div>
        <motion.div
          animate={{
            y: [0, 10, 0],
            opacity: [0.8, 1, 0.8]
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2
          }}
          className="absolute bottom-[20%] left-[10%] w-40 h-40 rounded-full bg-purple-500/10 blur-xl"
        ></motion.div>
      </div>

      <Navbar />

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20"
      >
        {/* Back Button */}
        <motion.button 
          onClick={() => navigate(-1)}
          className="flex items-center text-purple-400 hover:text-purple-300 mb-6 transition-colors"
          whileHover={{ x: -5 }}
          variants={itemVariants}
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Projects
        </motion.button>

        {/* Project Header */}
        <motion.div className="mb-12" variants={itemVariants}>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-8">
            <div>
              <motion.h1 
                className="text-3xl md:text-4xl font-bold text-white mb-2"
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                {project.title}
              </motion.h1>
              <div className="flex items-center space-x-4 text-gray-300">
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  Created on {createdDate}
                </motion.span>
                <span>•</span>
                <motion.span 
                  className={`px-2 py-1 text-xs rounded-full ${
                    project.status === 'completed' ? 'bg-green-900/30 text-green-300 border border-green-700/30' :
                    project.status === 'in_progress' ? 'bg-blue-900/30 text-blue-300 border border-blue-700/30' :
                    'bg-yellow-900/30 text-yellow-300 border border-yellow-700/30'
                  }`}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  {project.status.replace('_', ' ')}
                </motion.span>
              </div>
            </div>
            
            {project.github_link && (
              <motion.a 
                href={project.github_link} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-white transition-colors"
                whileHover={{ y: -2 }}
                whileTap={{ y: 0 }}
                variants={itemVariants}
              >
                <Github className="w-5 h-5 mr-2" />
                View on GitHub
              </motion.a>
            )}
          </div>
        </motion.div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Left Column - Project Details */}
          <div className="lg:col-span-3">
            {/* Navigation Tabs */}
            <motion.div 
              className="border-b border-gray-700 mb-8"
              variants={itemVariants}
            >
              <nav className="flex space-x-8">
                {['overview', 'team', 'gallery'].map((tab) => (
                  <motion.button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`py-4 px-1 border-b-2 font-medium text-sm capitalize ${
                      activeTab === tab ? 'border-purple-500 text-purple-400' : 'border-transparent text-gray-400 hover:text-gray-300'
                    }`}
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {tab}
                  </motion.button>
                ))}
              </nav>
            </motion.div>

            {/* Tab Content */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                variants={tabContentVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="space-y-8"
              >
                {activeTab === 'overview' && (
                  <>
                    {/* Project Description */}
                    <motion.div 
                      className="bg-gradient-to-br from-purple-900/10 to-black/30 backdrop-blur-sm rounded-xl p-6 border border-purple-900/20"
                      whileHover={{ scale: 1.005 }}
                    >
                      <h2 className="text-2xl font-bold text-white mb-4">Project Description</h2>
                      <p className="text-gray-300 whitespace-pre-line">{project.description}</p>
                    </motion.div>

                    {/* SDGs and Impact */}
                    <motion.div 
                      className="bg-gradient-to-br from-purple-900/10 to-black/30 backdrop-blur-sm rounded-xl p-6 border border-purple-900/20"
                      whileHover={{ scale: 1.005 }}
                    >
                      <h2 className="text-2xl font-bold text-white mb-4">Sustainable Development Goals</h2>
                      <div className="flex items-center mb-4">
                        <span className="text-lg font-medium text-purple-300 mr-2">SDGs Addressed:</span>
                        <span className="text-lg text-gray-300">{project.sdgs}</span>
                      </div>
                      <p className="text-gray-300">
                        This project contributes to the United Nations Sustainable Development Goals by addressing key challenges in the specified areas.
                      </p>
                    </motion.div>

                    {/* Technical Implementation */}
                    <motion.div 
                      className="bg-gradient-to-br from-purple-900/10 to-black/30 backdrop-blur-sm rounded-xl p-6 border border-purple-900/20"
                      whileHover={{ scale: 1.005 }}
                    >
                      <h2 className="text-2xl font-bold text-white mb-4">Technical Implementation</h2>
                      <div className="flex items-center mb-4">
                        <span className="text-lg font-medium text-purple-300 mr-2">Tech Stack:</span>
                        <span className="text-lg text-gray-300">{project.tech_stack}</span>
                      </div>
                      {project.github_link && (
                        <motion.a 
                          href={project.github_link} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="inline-flex items-center text-purple-400 hover:text-purple-300 text-sm transition-colors"
                          whileHover={{ x: 5 }}
                        >
                          <Code className="w-4 h-4 mr-1" />
                          View Source Code
                        </motion.a>
                      )}
                    </motion.div>
                  </>
                )}

                {activeTab === 'team' && (
                  <motion.div 
                    className="bg-gradient-to-br from-purple-900/10 to-black/30 backdrop-blur-sm rounded-xl p-6 border border-purple-900/20"
                    whileHover={{ scale: 1.005 }}
                  >
                    <h2 className="text-2xl font-bold text-white mb-6">Project Team</h2>
                    
                    {/* Student/Group */}
                    <div className="mb-8">
                      <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                        <Users className="w-5 h-5 mr-2 text-purple-400" />
                        {project.group ? 'Project Group' : 'Student'}
                      </h3>
                      {project.group ? (
                        <motion.div 
                          className="flex items-center space-x-4"
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.2 }}
                        >
                          <div className="w-16 h-16 rounded-full bg-purple-900/30 border border-purple-500/30 flex items-center justify-center">
                            <span className="text-purple-300 text-xl">
                              {project.group.name.charAt(0)}
                            </span>
                          </div>
                          <div>
                            <p className="text-lg font-medium text-white">{project.group.name}</p>
                            <p className="text-gray-400">Group Project</p>
                          </div>
                        </motion.div>
                      ) : (
                        <motion.div 
                          className="flex items-center space-x-4"
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.2 }}
                        >
                          <div className="w-16 h-16 rounded-full bg-purple-900/30 border border-purple-500/30 flex items-center justify-center">
                            <span className="text-purple-300 text-xl">
                              {project.student?.full_name?.charAt(0) || 'S'}
                            </span>
                          </div>
                          <div>
                            <p className="text-lg font-medium text-white">{project.student?.full_name || 'Student'}</p>
                            <p className="text-gray-400">Individual Project</p>
                          </div>
                        </motion.div>
                      )}
                    </div>

                    {/* Mentor */}
                    {project.mentor && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4 }}
                      >
                        <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                          <Award className="w-5 h-5 mr-2 text-purple-400" />
                          Mentor
                        </h3>
                        <div className="flex items-center space-x-4">
                          {project.mentor.profile_picture ? (
                            <motion.img 
                              src={project.mentor.profile_picture} 
                              alt={project.mentor.full_name}
                              className="w-16 h-16 rounded-full object-cover border border-purple-500/30"
                              whileHover={{ scale: 1.05 }}
                            />
                          ) : (
                            <div className="w-16 h-16 rounded-full bg-purple-900/30 border border-purple-500/30 flex items-center justify-center">
                              <span className="text-purple-300 text-xl">
                                {project.mentor.full_name.charAt(0)}
                              </span>
                            </div>
                          )}
                          <div>
                            <p className="text-lg font-medium text-white">{project.mentor.full_name}</p>
                            <p className="text-gray-400">{project.mentor.current_role || 'Mentor'}</p>
                            <p className="text-sm text-gray-400">{project.mentor.college?.college_name || ''}</p>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </motion.div>
                )}

                {activeTab === 'gallery' && (
                  <motion.div 
                    className="bg-gradient-to-br from-purple-900/10 to-black/30 backdrop-blur-sm rounded-xl p-6 border border-purple-900/20"
                    whileHover={{ scale: 1.005 }}
                  >
                    <h2 className="text-2xl font-bold text-white mb-6">Project Gallery</h2>
                    
                    {projectImages.length > 0 ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                        {projectImages.map((image, index) => (
                          <motion.div 
                            key={index} 
                            className="rounded-lg overflow-hidden border border-purple-900/30 cursor-pointer hover:border-purple-500 transition-colors"
                            onClick={() => setSelectedImage(image)}
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.98 }}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                          >
                            <img 
                              src={image} 
                              alt={`Project Image ${index + 1}`}
                              className="w-full h-48 object-cover"
                            />
                          </motion.div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-400">No project images available.</p>
                    )}
                  </motion.div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Right Column - Project Metadata */}
          <div className="space-y-6">
            {/* College Info */}
            <motion.div 
              className="bg-gradient-to-br from-purple-900/10 to-black/30 backdrop-blur-sm rounded-xl p-6 border border-purple-900/20"
              variants={itemVariants}
              whileHover={{ y: -5 }}
            >
              <h3 className="text-xl font-bold text-white mb-4">College</h3>
              {project.college ? (
                <div>
                  <p className="text-lg text-purple-300">{project.college.college_name}</p>
                  {project.college.website && (
                    <a 
                      href={project.college.website} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-gray-300 hover:text-purple-300 text-sm block mt-2"
                    >
                      {project.college.website.replace(/^https?:\/\//, '')}
                    </a>
                  )}
                </div>
              ) : (
                <p className="text-gray-400">No college information available</p>
              )}
            </motion.div>

            {/* Project Status */}
            <motion.div 
              className="bg-gradient-to-br from-purple-900/10 to-black/30 backdrop-blur-sm rounded-xl p-6 border border-purple-900/20"
              variants={itemVariants}
              whileHover={{ y: -5 }}
            >
              <h3 className="text-xl font-bold text-white mb-4">Project Status</h3>
              <div className="flex items-center">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  project.status === 'completed' ? 'bg-green-900/30 text-green-300 border border-green-700/30' :
                  project.status === 'in_progress' ? 'bg-blue-900/30 text-blue-300 border border-blue-700/30' :
                  'bg-yellow-900/30 text-yellow-300 border border-yellow-700/30'
                }`}>
                  {project.status.replace('_', ' ')}
                </span>
                <span className="ml-3 text-gray-300">
                  {project.status === 'completed' ? 'Project completed' : 
                   project.status === 'in_progress' ? 'Currently in progress' : 'Under review'}
                </span>
              </div>
              {project.mentor_feedback && (
                <motion.div 
                  className="mt-4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  <h4 className="text-sm font-medium text-purple-300 mb-1">Mentor Feedback</h4>
                  <p className="text-gray-300 text-sm">{project.mentor_feedback}</p>
                </motion.div>
              )}
              {project.mentor_grade && (
                <motion.div 
                  className="mt-4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  <h4 className="text-sm font-medium text-purple-300 mb-1">Mentor Grade</h4>
                  <div className="w-full bg-gray-700 rounded-full h-2.5">
                    <motion.div 
                      className="bg-purple-600 h-2.5 rounded-full" 
                      initial={{ width: 0 }}
                      animate={{ width: `${project.mentor_grade}%` }}
                      transition={{ duration: 1, delay: 0.6 }}
                    ></motion.div>
                  </div>
                  <span className="text-gray-300 text-sm">{project.mentor_grade}/100</span>
                </motion.div>
              )}
            </motion.div>

            {/* Created At */}
            <motion.div 
              className="bg-gradient-to-br from-purple-900/10 to-black/30 backdrop-blur-sm rounded-xl p-6 border border-purple-900/20"
              variants={itemVariants}
              whileHover={{ y: -5 }}
            >
              <h3 className="text-xl font-bold text-white mb-4">Project Timeline</h3>
              <div className="space-y-2">
                <div>
                  <p className="text-sm text-purple-300">Created:</p>
                  <p className="text-gray-300">{createdDate}</p>
                </div>
                <div>
                  <p className="text-sm text-purple-300">Last Updated:</p>
                  <p className="text-gray-300">
                    {new Date(project.updated_at).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Image Modal */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div 
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="relative max-w-4xl w-full">
              <motion.button 
                onClick={() => setSelectedImage(null)}
                className="absolute -top-10 right-0 text-white hover:text-purple-300"
                whileHover={{ scale: 1.1 }}
              >
                <X className="w-6 h-6" />
              </motion.button>
              <motion.img 
                src={selectedImage} 
                alt="Project Preview" 
                className="w-full max-h-[80vh] object-contain"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                transition={{ type: 'spring', stiffness: 100 }}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
    </motion.div>
  );
};

export default ProjectDetail;