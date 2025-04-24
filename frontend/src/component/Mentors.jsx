import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Navbar from "./Navbar";
import Footer from './Footer';
import { motion } from 'framer-motion';

const Mentors = () => {
  const [mentors, setMentors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMentors = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/students/mentors/');
        setMentors(response.data.results);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMentors();
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
          <strong className="font-bold">Error loading mentors!</strong>
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
        
        {/* Animated background elements */}
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
            Our <span className="text-purple-500 glow-text animate-pulse-slow">Mentors</span>
          </h1>
          <motion.p 
            className="text-gray-300 max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            Experienced professionals guiding students in their academic journey
          </motion.p>
        </motion.div>

        {mentors.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="text-center py-20"
          >
            <p className="text-gray-400">No mentors found.</p>
          </motion.div>
        ) : (
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {mentors.map((mentor, index) => (
              <motion.div 
                key={mentor.id} 
                variants={itemVariants}
                whileHover={{ 
                  y: -8,
                  transition: { duration: 0.3 }
                }}
                className="h-full"
              >
                <motion.div 
                  className="bg-gradient-to-br from-purple-900/10 to-black/30 backdrop-blur-sm rounded-xl overflow-hidden border border-purple-900/20 hover:border-purple-600/30 transition-all duration-500 h-full"
                  whileHover={{ boxShadow: "0 0 20px rgba(168, 85, 247, 0.2)" }}
                >
                  {/* Mentor Image */}
                  <div className="h-64 overflow-hidden relative">
                    {mentor.profile_picture ? (
                      <motion.img 
                        src={mentor.profile_picture} 
                        alt={mentor.full_name}
                        className="w-full h-full object-cover"
                        whileHover={{ scale: 1.05 }}
                        transition={{ duration: 0.5 }}
                      />
                    ) : (
                      <motion.div 
                        className="w-full h-full bg-purple-900/20 flex items-center justify-center"
                        whileHover={{ backgroundColor: "rgba(168, 85, 247, 0.3)" }}
                        transition={{ duration: 0.3 }}
                      >
                        <span className="text-4xl text-purple-300">
                          {mentor.full_name.charAt(0)}
                        </span>
                      </motion.div>
                    )}
                  </div>

                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <motion.h2 
                        className="text-xl font-semibold text-white"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 + index * 0.1 }}
                      >
                        {mentor.full_name}
                      </motion.h2>
                      <motion.span 
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.3 + index * 0.1 }}
                        className={`px-2 py-1 text-xs rounded-full ${
                          mentor.verification_status === 'approved' ? 'bg-green-900/30 text-green-300 border border-green-700/30' :
                          mentor.verification_status === 'pending' ? 'bg-yellow-900/30 text-yellow-300 border border-yellow-700/30' :
                          'bg-red-900/30 text-red-300 border border-red-700/30'
                        }`}
                      >
                        {mentor.verification_status}
                      </motion.span>
                    </div>

                    <motion.div 
                      className="mb-4"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.4 + index * 0.1 }}
                    >
                      <p className="text-purple-300 font-medium">{mentor.current_role}</p>
                      <p className="text-gray-300 text-sm">{mentor.college.college_name}</p>
                    </motion.div>

                    <motion.div 
                      className="mb-4"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.5 + index * 0.1 }}
                    >
                      <div className="flex items-center mb-2">
                        <span className="text-sm font-medium text-purple-300 mr-2">Expertise:</span>
                        <span className="text-sm text-gray-300">{mentor.expertise_areas}</span>
                      </div>
                      <div className="flex items-center">
                        <span className="text-sm font-medium text-purple-300 mr-2">Experience:</span>
                        <span className="text-sm text-gray-300">{mentor.experience_years} years</span>
                      </div>
                      <div className="flex items-center mt-2">
                        <span className="text-sm font-medium text-purple-300 mr-2">Specialization:</span>
                        <span className="text-sm text-gray-300">{mentor.specialization}</span>
                      </div>
                    </motion.div>

                    {/* Bio with animation */}
                    {mentor.bio && (
                      <motion.p 
                        className="text-gray-300 text-sm mb-4 line-clamp-3"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.6 + index * 0.1 }}
                      >
                        {mentor.bio}
                      </motion.p>
                    )}

                    {/* Links with animation */}
                    <motion.div 
                      className="flex space-x-4"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.7 + index * 0.1 }}
                    >
                      {mentor.linkedin && (
                        <motion.a 
                          href={mentor.linkedin} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-purple-400 hover:text-purple-300 text-sm transition-colors"
                          whileHover={{ x: 3 }}
                        >
                          <span className="flex items-center">
                            <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                            </svg>
                            LinkedIn
                          </span>
                        </motion.a>
                      )}
                      {mentor.website && (
                        <motion.a 
                          href={mentor.website} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-purple-400 hover:text-purple-300 text-sm transition-colors"
                          whileHover={{ x: 3 }}
                        >
                          <span className="flex items-center">
                            <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm1 16.057v-3.057h2.994c-.059 1.143-.212 2.24-.456 3.279-.823-.12-1.674-.188-2.538-.222zm1.957 2.162c-.499 1.33-1.159 2.497-1.957 3.456v-3.62c.666.028 1.319.081 1.957.164zm-1.957-7.219v-3.015c.868-.034 1.721-.103 2.548-.224.238 1.027.389 2.111.446 3.239h-2.994zm0-5.014v-3.661c.806.969 1.471 2.15 1.971 3.496-.642.084-1.3.137-1.971.165zm2.703-3.267c1.237.496 2.354 1.228 3.29 2.146-.642.234-1.311.442-2.019.607-.344-.992-.775-1.91-1.271-2.753zm-7.241 13.56c-.244-1.039-.398-2.136-.456-3.279h2.994v3.057c-.865.034-1.714.102-2.538.222zm2.538 1.776v3.62c-.798-.959-1.458-2.126-1.957-3.456.638-.083 1.291-.136 1.957-.164zm-2.994-7.055c.057-1.128.207-2.212.446-3.239.827.121 1.68.19 2.548.224v3.015h-2.994zm1.024-5.179c.5-1.346 1.165-2.527 1.97-3.496v3.661c-.671-.028-1.329-.081-1.97-.165zm-2.005-.35c-.708-.165-1.377-.373-2.018-.607.937-.918 2.053-1.65 3.29-2.146-.496.844-.927 1.762-1.272 2.753zm-.549 1.918c-.264 1.151-.434 2.36-.492 3.611h-3.933c.165-1.658.739-3.197 1.617-4.518.88.361 1.816.67 2.808.907zm.009 9.262c-.988.236-1.92.542-2.797.9-.89-1.328-1.471-2.879-1.637-4.551h3.934c.058 1.265.231 2.488.5 3.651zm.553 1.917c.342.976.768 1.881 1.257 2.712-1.223-.49-2.326-1.211-3.256-2.115.636-.229 1.299-.435 1.999-.597zm9.924 0c.7.163 1.362.367 1.999.597-.931.903-2.034 1.625-3.257 2.116.489-.832.915-1.737 1.258-2.713zm.553-1.917c.27-1.163.442-2.386.501-3.651h3.934c-.167 1.672-.748 3.223-1.638 4.551-.877-.358-1.81-.664-2.797-.9zm.501-5.651c-.058-1.251-.229-2.46-.492-3.611.992-.237 1.929-.546 2.809-.907.877 1.321 1.451 2.86 1.616 4.518h-3.933z"/>
                            </svg>
                            Website
                          </span>
                        </motion.a>
                      )}
                    </motion.div>
                  </div>
                </motion.div>
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

export default Mentors;