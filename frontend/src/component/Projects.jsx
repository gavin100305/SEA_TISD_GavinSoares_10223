import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Navbar from "./Navbar";
import Footer from './Footer';
import { motion } from 'framer-motion';

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/students/projects/');
        
        if (response.data && Array.isArray(response.data.results)) {
          setProjects(response.data.results);
        } else {
          setProjects([]);
          console.error('Unexpected API response format:', response.data);
        }
      } catch (err) {
        setError(err.message);
        console.error('Error fetching projects:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15
      }
    }
  };

  const titleVariants = {
    hidden: { y: -50, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 120,
        damping: 20,
        delay: 0.2
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white">
        <Navbar />
        <div className="flex justify-center items-center h-screen">
          <motion.div 
            initial={{ rotate: 0 }}
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"
          />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black text-white">
        <Navbar />
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-red-900/20 border border-red-700/30 text-red-300 px-4 py-3 rounded max-w-md mx-auto mt-8 backdrop-blur-sm"
        >
          <strong className="font-bold">Error loading projects!</strong>
          <span className="block sm:inline"> {error}</span>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
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
            scale: [1, 1.2, 1],
            opacity: [0.2, 0.3, 0.2]
          }}
          transition={{ 
            duration: 8, 
            repeat: Infinity,
            repeatType: "reverse"
          }}
          className="absolute top-[50%] right-[5%] w-32 h-32 rounded-full bg-purple-600/20 blur-xl"
        />
        <motion.div 
          animate={{ 
            scale: [1, 1.3, 1],
            opacity: [0.1, 0.2, 0.1]
          }}
          transition={{ 
            duration: 10, 
            repeat: Infinity,
            repeatType: "reverse",
            delay: 2
          }}
          className="absolute bottom-[20%] left-[10%] w-40 h-40 rounded-full bg-purple-500/10 blur-xl"
        />
        
        {/* Additional floating elements */}
        <motion.div 
          initial={{ x: "10%", y: "30%" }}
          animate={{ 
            x: ["10%", "15%", "10%"],
            y: ["30%", "35%", "30%"]
          }}
          transition={{ 
            duration: 15, 
            repeat: Infinity,
            repeatType: "reverse"
          }}
          className="absolute w-24 h-24 rounded-full bg-indigo-600/10 blur-xl"
        />
        <motion.div 
          initial={{ x: "80%", y: "70%" }}
          animate={{ 
            x: ["80%", "75%", "80%"],
            y: ["70%", "75%", "70%"]
          }}
          transition={{ 
            duration: 12, 
            repeat: Infinity,
            repeatType: "reverse"
          }}
          className="absolute w-36 h-36 rounded-full bg-purple-700/10 blur-xl"
        />
      </div>

      <Navbar />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20">
        <motion.div 
          className="text-center mb-12"
          initial="hidden"
          animate="visible"
          variants={titleVariants}
        >
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Student <span className="text-purple-500 glow-text animate-pulse-slow">Projects</span>
          </h1>
          <motion.p 
            className="text-gray-300 max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            Explore academic projects contributing to sustainable development goals
          </motion.p>
        </motion.div>

        {projects.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="text-center py-20"
          >
            <p className="text-gray-400">No projects found.</p>
          </motion.div>
        ) : (
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {projects.map((project, index) => (
              <motion.div 
                key={project.id}
                variants={itemVariants}
                whileHover={{ 
                  y: -8,
                  transition: { duration: 0.3 }
                }}
                className="h-full"
              >
                <Link 
                  to={`/projects/${project.id}`}
                  className="block hover:no-underline h-full"
                >
                  <motion.div 
                    className="bg-gradient-to-br from-purple-900/10 to-black/30 backdrop-blur-sm rounded-xl overflow-hidden border border-purple-900/20 hover:border-purple-600/30 transition-all duration-500 h-full"
                    whileHover={{ boxShadow: "0 0 20px rgba(168, 85, 247, 0.2)" }}
                  >
                    {/* Project Image */}
                    {project.project_image1 && (
                      <div className="h-48 overflow-hidden">
                        <motion.img 
                          src={project.project_image1} 
                          alt={project.title}
                          className="w-full h-full object-cover"
                          whileHover={{ scale: 1.05 }}
                          transition={{ duration: 0.5 }}
                        />
                      </div>
                    )}

                    <div className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <motion.h2 
                          className="text-xl font-semibold text-white"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.2 + index * 0.1 }}
                        >
                          {project.title}
                        </motion.h2>
                        <motion.span 
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.3 + index * 0.1 }}
                          className={`px-2 py-1 text-xs rounded-full ${
                            project.status === 'completed' ? 'bg-green-900/30 text-green-300 border border-green-700/30' :
                            project.status === 'in_progress' ? 'bg-blue-900/30 text-blue-300 border border-blue-700/30' :
                            'bg-yellow-900/30 text-yellow-300 border border-yellow-700/30'
                          }`}
                        >
                          {project.status.replace('_', ' ')}
                        </motion.span>
                      </div>

                      <motion.p 
                        className="text-gray-300 mb-4 line-clamp-3"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4 + index * 0.1 }}
                      >
                        {project.description}
                      </motion.p>

                      {/* SDGs and Tech Stack */}
                      <motion.div 
                        className="mb-4"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 + index * 0.1 }}
                      >
                        <div className="flex items-center mb-2">
                          <span className="text-sm font-medium text-purple-300 mr-2">SDGs:</span>
                          <span className="text-sm text-gray-300">{project.sdgs}</span>
                        </div>
                        <div className="flex items-center">
                          <span className="text-sm font-medium text-purple-300 mr-2">Tech:</span>
                          <span className="text-sm text-gray-300">{project.tech_stack}</span>
                        </div>
                      </motion.div>

                      {/* Mentor Info */}
                      {project.mentor && (
                        <motion.div 
                          className="flex items-center mb-4"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.6 + index * 0.1 }}
                        >
                          <div className="flex-shrink-0 mr-3">
                            {project.mentor.profile_picture ? (
                              <motion.img 
                                src={project.mentor.profile_picture} 
                                alt={project.mentor.full_name}
                                className="w-10 h-10 rounded-full object-cover border border-purple-500/30"
                                whileHover={{ scale: 1.1 }}
                              />
                            ) : (
                              <motion.div 
                                className="w-10 h-10 rounded-full bg-purple-900/30 border border-purple-500/30 flex items-center justify-center"
                                whileHover={{ scale: 1.1 }}
                              >
                                <span className="text-purple-300 text-sm">
                                  {project.mentor.full_name.charAt(0)}
                                </span>
                              </motion.div>
                            )}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-purple-300">Mentor</p>
                            <p className="text-sm text-gray-300">{project.mentor.full_name}</p>
                          </div>
                        </motion.div>
                      )}

                      {/* GitHub Link - Prevent click from bubbling up to the Link */}
                      {project.github_link && (
                        <motion.div 
                          onClick={(e) => e.stopPropagation()}
                          className="mt-4"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.7 + index * 0.1 }}
                        >
                          <motion.a 
                            href={project.github_link} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="inline-flex items-center text-purple-400 hover:text-purple-300 text-sm transition-colors"
                            whileHover={{ x: 3 }}
                          >
                            <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                            </svg>
                            View on GitHub
                          </motion.a>
                        </motion.div>
                      )}

                      {/* College Info */}
                      {project.college && (
                        <motion.div 
                          className="mt-4 pt-4 border-t border-purple-900/30"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.8 + index * 0.1 }}
                        >
                          <p className="text-xs text-purple-300">College: {project.college.college_name}</p>
                        </motion.div>
                      )}
                    </div>
                  </motion.div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>

      {/* Custom styles */}
      <style>
        {`
          .glow-text {
            text-shadow: 0 0 20px rgba(168, 85, 247, 0.7);
          }
          .line-clamp-3 {
            display: -webkit-box;
            -webkit-line-clamp: 3;
            -webkit-box-orient: vertical;
            overflow: hidden;
          }
          .animate-pulse-slow {
            animation: pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite;
          }
          @keyframes pulse {
            0%, 100% {
              opacity: 1;
              text-shadow: 0 0 20px rgba(168, 85, 247, 0.7);
            }
            50% {
              opacity: .7;
              text-shadow: 0 0 30px rgba(168, 85, 247, 1);
            }
          }
          @keyframes floating {
            0% { transform: translateY(0px); }
            50% { transform: translateY(-15px); }
            100% { transform: translateY(0px); }
          }
          .floating {
            animation: floating 6s ease-in-out infinite;
          }
        `}
      </style>
      <Footer />
    </div>
  );
};

export default Projects;