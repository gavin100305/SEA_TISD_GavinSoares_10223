"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { FaArrowRight, FaSearch, FaLaptopCode, FaChalkboardTeacher } from "react-icons/fa"
import { BsLightningChargeFill, BsStars } from "react-icons/bs"
import { IoRocketSharp } from "react-icons/io5"

// Keep the original icon components for compatibility
const IconComponents = {
  Search: (props) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <circle cx="11" cy="11" r="8"></circle>
      <path d="m21 21-4.3-4.3"></path>
    </svg>
  ),
  Clock: (props) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <circle cx="12" cy="12" r="10"></circle>
      <polyline points="12 6 12 12 16 14"></polyline>
    </svg>
  ),
  Globe: (props) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <circle cx="12" cy="12" r="10"></circle>
      <line x1="2" x2="22" y1="12" y2="12"></line>
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
    </svg>
  ),
  MessageSquare: (props) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
    </svg>
  ),
  ChartBar: (props) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <line x1="12" x2="12" y1="20" y2="10"></line>
      <line x1="18" x2="18" y1="20" y2="4"></line>
      <line x1="6" x2="6" y1="20" y2="16"></line>
    </svg>
  ),
  FileText: (props) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path>
      <polyline points="14 2 14 8 20 8"></polyline>
      <line x1="16" x2="8" y1="13" y2="13"></line>
      <line x1="16" x2="8" y1="17" y2="17"></line>
      <line x1="10" x2="8" y1="9" y2="9"></line>
    </svg>
  ),
  Users: (props) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
      <circle cx="9" cy="7" r="4"></circle>
      <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
      <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
    </svg>
  ),
  CheckCircle: (props) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
      <polyline points="22 4 12 14.01 9 11.01"></polyline>
    </svg>
  ),
  Building2: (props) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z"></path>
      <path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2"></path>
      <path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2"></path>
      <path d="M10 6h4"></path>
      <path d="M10 10h4"></path>
      <path d="M10 14h4"></path>
      <path d="M10 18h4"></path>
    </svg>
  ),
  Mail: (props) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <rect width="20" height="16" x="2" y="4" rx="2"></rect>
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
    </svg>
  ),
  Phone: (props) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
    </svg>
  ),
  MapPin: (props) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path>
      <circle cx="12" cy="10" r="3"></circle>
    </svg>
  ),
  Mountain: (props) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="m8 3 4 8 5-5 5 15H2L8 3z"></path>
    </svg>
  ),
}

function Landing() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState("students")

  return (
    <div className="min-h-screen bg-[#0e0b30] overflow-hidden relative">
      {/* Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
        <div className="absolute top-[10%] right-[5%] w-24 h-24 rounded-full bg-[#ff6b00]/20 blur-xl"></div>
        <div className="absolute bottom-[20%] left-[10%] w-32 h-32 rounded-full bg-[#ff6b00]/10 blur-xl"></div>
        <div className="absolute top-[40%] left-[20%] w-64 h-64 rounded-full bg-[#2a1e66]/20 blur-3xl"></div>
        <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-[#ff6b00]/5 rounded-full blur-3xl"></div>

        {/* Hexagon Grid Pattern */}
        <div className="absolute bottom-0 left-0 w-full h-1/2 opacity-10">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <pattern id="hexagons" width="50" height="43.4" patternUnits="userSpaceOnUse" patternTransform="scale(5)">
              <polygon
                points="24.8,22 37.3,29.2 37.3,43.7 24.8,50.9 12.4,43.7 12.4,29.2"
                fill="none"
                stroke="#6366f1"
                strokeWidth="0.5"
              />
            </pattern>
            <rect width="100%" height="100%" fill="url(#hexagons)" />
          </svg>
        </div>
      </div>

      {/* Navigation */}
      <nav className="relative z-10 bg-[#0e0b30]/80 backdrop-blur-sm border-b border-[#3d2e8a]/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-8">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-[#ff6b00] rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold">T</span>
                </div>
                <span className="text-2xl font-bold text-white">TISD</span>
              </div>

              <div className="hidden md:flex space-x-6">
                <a href="#" className="text-white hover:text-[#ff6b00] transition-colors">
                  Home
                </a>
                <a href="#" className="text-white/70 hover:text-[#ff6b00] transition-colors">
                  Courses
                </a>
                <a href="#" className="text-white/70 hover:text-[#ff6b00] transition-colors">
                  About
                </a>
                <a href="#" className="text-white/70 hover:text-[#ff6b00] transition-colors">
                  Contact
                </a>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <button className="hidden md:flex items-center text-white/70 hover:text-white">
                <FaSearch className="w-4 h-4" />
              </button>
              <a
              // yeh link change kar dena
              href="http://127.0.0.1:8000"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-4 py-2 bg-[#ff6b00] rounded-lg text-sm font-medium text-white hover:bg-[#ff6b00]/90 transition-all duration-200"
            >
              Get Started
            </a>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              A Better <span className="text-[#ff6b00]">Learning Journey</span> Future Start Here
            </h1>
            <p className="text-lg text-gray-300 mb-8">
              Join our community of innovators and learn how to create sustainable solutions through cutting-edge
              technology and programming.
            </p>
            <div className="flex flex-col sm:flex-row items-start gap-4">
              <button
                onClick={() => navigate("/student-signup")}
                className="w-full sm:w-auto px-8 py-4 bg-[#ff6b00] hover:bg-[#ff6b00]/90 text-white font-medium rounded-lg transition-colors duration-200 flex items-center justify-center"
              >
                Start Now <FaArrowRight className="ml-2" />
              </button>
              <button
                onClick={() => navigate("/mentor-signup")}
                className="w-full sm:w-auto px-8 py-4 bg-white/10 hover:bg-white/15 text-white font-medium rounded-lg border border-white/20 transition-all duration-200 flex items-center justify-center"
              >
                Find Your Course <FaArrowRight className="ml-2" />
              </button>
            </div>
          </div>

          <div className="relative">
            <div className="absolute top-0 right-0 w-20 h-20 bg-[#ff6b00]/30 rounded-full blur-xl"></div>
            <div className="absolute -bottom-10 -left-10 w-20 h-20 bg-[#ff6b00]/20 rounded-full blur-xl"></div>

            <div className="relative bg-gradient-to-br from-[#2a1e66] to-[#0e0b30] p-1 rounded-3xl overflow-hidden">
              <div className="absolute top-4 right-4 w-10 h-10 bg-[#ff6b00] rounded-full flex items-center justify-center text-white">
                <BsStars className="w-5 h-5" />
              </div>

              <div className="absolute -top-2 -left-2 w-8 h-8 bg-[#6366f1]/30 rounded-full"></div>
              <div className="absolute bottom-10 right-10 w-6 h-6 bg-[#ff6b00]/50 rounded-full"></div>

              <div className="bg-gradient-to-br from-[#2a1e66]/50 to-[#0e0b30]/50 backdrop-blur-sm rounded-3xl overflow-hidden">
                <div className="relative p-6 rounded-3xl overflow-hidden">
                  <img
                    src="https://wiipa.org/wp-content/uploads/2023/03/photo_2023-03-25_23-12-23.jpg"
                    alt="Students learning together"
                    className="w-full h-auto rounded-2xl"
                  />

                  <div className="absolute bottom-0 right-0 bg-white/10 backdrop-blur-md rounded-tl-2xl p-4">
                    <div className="text-white font-medium">Learn with experts</div>
                    <div className="text-white/70 text-sm">Join 200+ students</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="mt-24">
          <h2 className="text-3xl font-bold text-center text-white mb-12">
            Why Choose <span className="text-[#ff6b00]">TISD</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-[#1a1550]/50 backdrop-blur-sm rounded-xl p-6 border border-[#3d2e8a]/30 group hover:bg-[#1a1550]/70 transition-all duration-300">
              <div className="w-12 h-12 bg-[#ff6b00] rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                <FaLaptopCode className="text-white w-6 h-6" />
              </div>
              <div className="text-white text-lg font-medium mb-3">Learn Programming</div>
              <p className="text-gray-300">Master coding skills with hands-on projects and expert guidance</p>
              <a href="#" className="inline-block mt-4 text-[#ff6b00] hover:text-[#ff6b00]/80 text-sm font-medium">
                Read More
              </a>
            </div>
            <div className="bg-[#1a1550]/50 backdrop-blur-sm rounded-xl p-6 border border-[#3d2e8a]/30 group hover:bg-[#1a1550]/70 transition-all duration-300">
              <div className="w-12 h-12 bg-[#ff6b00] rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                <BsLightningChargeFill className="text-white w-6 h-6" />
              </div>
              <div className="text-white text-lg font-medium mb-3">Develop Logic</div>
              <p className="text-gray-300">Enhance problem-solving abilities through practical challenges</p>
              <a href="#" className="inline-block mt-4 text-[#ff6b00] hover:text-[#ff6b00]/80 text-sm font-medium">
                Read More
              </a>
            </div>
            <div className="bg-[#1a1550]/50 backdrop-blur-sm rounded-xl p-6 border border-[#3d2e8a]/30 group hover:bg-[#1a1550]/70 transition-all duration-300">
              <div className="w-12 h-12 bg-[#ff6b00] rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                <IoRocketSharp className="text-white w-6 h-6" />
              </div>
              <div className="text-white text-lg font-medium mb-3">Innovation Focus</div>
              <p className="text-gray-300">Create sustainable solutions using cutting-edge technology</p>
              <a href="#" className="inline-block mt-4 text-[#ff6b00] hover:text-[#ff6b00]/80 text-sm font-medium">
                Read More
              </a>
            </div>
            <div className="bg-[#1a1550]/50 backdrop-blur-sm rounded-xl p-6 border border-[#3d2e8a]/30 group hover:bg-[#1a1550]/70 transition-all duration-300">
              <div className="w-12 h-12 bg-[#ff6b00] rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                <FaChalkboardTeacher className="text-white w-6 h-6" />
              </div>
              <div className="text-white text-lg font-medium mb-3">Expert Mentorship</div>
              <p className="text-gray-300">Learn from experienced professionals in the field</p>
              <a href="#" className="inline-block mt-4 text-[#ff6b00] hover:text-[#ff6b00]/80 text-sm font-medium">
                Read More
              </a>
            </div>
          </div>
        </div>

        {/* Community Section */}
        <div className="mt-32">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="relative">
              <div className="absolute -top-10 -left-10 w-40 h-40 bg-[#ff6b00]/10 rounded-full blur-xl"></div>
              <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-[#6366f1]/10 rounded-full blur-xl"></div>

              <div className="relative rounded-full overflow-hidden border-8 border-[#1a1550]/70">
                <img
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/EduAct%20-%20Education%20%26%20Courses%20WordPress%20Theme.jpg-pXuRDtJ3ptPApAT5QDKXRbDquqp1Up.jpeg"
                  alt="Learning community"
                  className="w-full h-auto"
                />

                <div className="absolute bottom-6 right-6 bg-[#ff6b00] rounded-full w-16 h-16 flex items-center justify-center">
                  <div className="text-white font-bold text-xl">24/7</div>
                </div>

                <div className="absolute bottom-6 left-6 bg-white rounded-xl p-3">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-[#ff6b00] rounded-full"></div>
                    <div className="text-[#0e0b30] font-medium text-sm">Need to know more?</div>
                  </div>
                  <div className="mt-1 text-[#0e0b30] font-bold">+1 (555) 123-4567</div>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                Creating a Lifelong Learning Best Community
              </h2>
              <p className="text-gray-300 mb-8">
                A place to find your passion and connect with others who share your interests. Our community is built on
                collaboration, innovation, and sustainable development.
              </p>

              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 bg-[#1a1550] rounded-lg flex items-center justify-center flex-shrink-0 border border-[#3d2e8a]/50">
                    <IconComponents.CheckCircle className="w-5 h-5 text-[#ff6b00]" />
                  </div>
                  <div>
                    <div className="text-white font-medium">Flexible Classes</div>
                    <p className="text-gray-400 text-sm">Access course content anytime, anywhere from any device</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 bg-[#1a1550] rounded-lg flex items-center justify-center flex-shrink-0 border border-[#3d2e8a]/50">
                    <IconComponents.Users className="w-5 h-5 text-[#ff6b00]" />
                  </div>
                  <div>
                    <div className="text-white font-medium">Live Class From Anywhere</div>
                    <p className="text-gray-400 text-sm">
                      Join interactive sessions with instructors and peers in real-time
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => navigate("/community")}
                  className="mt-4 px-6 py-3 bg-[#ff6b00] hover:bg-[#ff6b00]/90 text-white font-medium rounded-lg transition-colors duration-200 inline-flex items-center"
                >
                  Discover More <FaArrowRight className="ml-2" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Popular Courses */}
        <div className="mt-32">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">Favorite Topics To Learn</h2>
            <p className="text-gray-300 max-w-2xl mx-auto">
              Explore our most popular courses and start your learning journey today
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-[#1a1550]/50 backdrop-blur-sm rounded-xl overflow-hidden group hover:bg-[#1a1550]/70 transition-all duration-300">
              <div className="relative">
                <img
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/EduAct%20-%20Education%20%26%20Courses%20WordPress%20Theme.jpg-pXuRDtJ3ptPApAT5QDKXRbDquqp1Up.jpeg"
                  alt="Business Strategy"
                  className="w-full h-48 object-cover"
                />
                <div className="absolute top-4 right-4 bg-[#ff6b00] rounded-full w-10 h-10 flex items-center justify-center text-white font-bold">
                  01
                </div>
              </div>
              <div className="p-5">
                <h3 className="text-white font-bold text-lg mb-2">Business Strategy</h3>
                <p className="text-gray-300 text-sm mb-4">Learn how to develop effective business strategies</p>
                <div className="flex justify-between items-center">
                  <span className="text-[#ff6b00] font-medium">$49.99</span>
                  <button className="text-white text-sm">View Details</button>
                </div>
              </div>
            </div>

            <div className="bg-[#1a1550]/50 backdrop-blur-sm rounded-xl overflow-hidden group hover:bg-[#1a1550]/70 transition-all duration-300">
              <div className="relative">
                <img
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/EduAct%20-%20Education%20%26%20Courses%20WordPress%20Theme.jpg-pXuRDtJ3ptPApAT5QDKXRbDquqp1Up.jpeg"
                  alt="Data Science"
                  className="w-full h-48 object-cover"
                />
                <div className="w-full h-48 object-cover" />
                <div className="absolute top-4 right-4 bg-[#ff6b00] rounded-full w-10 h-10 flex items-center justify-center text-white font-bold">
                  02
                </div>
              </div>
              <div className="p-5">
                <h3 className="text-white font-bold text-lg mb-2">Data Science</h3>
                <p className="text-gray-300 text-sm mb-4">Master data analysis and machine learning techniques</p>
                <div className="flex justify-between items-center">
                  <span className="text-[#ff6b00] font-medium">$59.99</span>
                  <button className="text-white text-sm">View Details</button>
                </div>
              </div>
            </div>

            <div className="bg-[#1a1550]/50 backdrop-blur-sm rounded-xl overflow-hidden group hover:bg-[#1a1550]/70 transition-all duration-300">
              <div className="relative">
                <img
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/EduAct%20-%20Education%20%26%20Courses%20WordPress%20Theme.jpg-pXuRDtJ3ptPApAT5QDKXRbDquqp1Up.jpeg"
                  alt="Digital Marketing"
                  className="w-full h-48 object-cover"
                />
                <div className="absolute top-4 right-4 bg-[#ff6b00] rounded-full w-10 h-10 flex items-center justify-center text-white font-bold">
                  03
                </div>
              </div>
              <div className="p-5">
                <h3 className="text-white font-bold text-lg mb-2">Digital Marketing</h3>
                <p className="text-gray-300 text-sm mb-4">Learn modern digital marketing strategies and tools</p>
                <div className="flex justify-between items-center">
                  <span className="text-[#ff6b00] font-medium">$44.99</span>
                  <button className="text-white text-sm">View Details</button>
                </div>
              </div>
            </div>

            <div className="bg-[#1a1550]/50 backdrop-blur-sm rounded-xl overflow-hidden group hover:bg-[#1a1550]/70 transition-all duration-300">
              <div className="relative">
                <img
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/EduAct%20-%20Education%20%26%20Courses%20WordPress%20Theme.jpg-pXuRDtJ3ptPApAT5QDKXRbDquqp1Up.jpeg"
                  alt="Business Model"
                  className="w-full h-48 object-cover"
                />
                <div className="absolute top-4 right-4 bg-[#ff6b00] rounded-full w-10 h-10 flex items-center justify-center text-white font-bold">
                  04
                </div>
              </div>
              <div className="p-5">
                <h3 className="text-white font-bold text-lg mb-2">Business Model</h3>
                <p className="text-gray-300 text-sm mb-4">Develop innovative business models for startups</p>
                <div className="flex justify-between items-center">
                  <span className="text-[#ff6b00] font-medium">$39.99</span>
                  <button className="text-white text-sm">View Details</button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-24 text-center">
          <div className="inline-block bg-[#1a1550]/70 backdrop-blur-sm rounded-xl p-8 border border-[#3d2e8a]/30">
            <h2 className="text-3xl font-bold text-white mb-4">Ready to Start Your Learning Journey?</h2>
            <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
              Join thousands of students already learning with us. Get started today!
            </p>
            <button
              onClick={() => navigate("/auth")}
              className="px-8 py-4 bg-[#ff6b00] hover:bg-[#ff6b00]/90 text-white font-medium rounded-lg transition-colors duration-200"
            >
              Get Started Now
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="relative z-10 bg-[#0a0823] mt-24 pt-16 pb-8 border-t border-[#3d2e8a]/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h3 className="text-xl font-bold text-white mb-2">Categories</h3>
            <div className="flex flex-wrap justify-center gap-4 mt-4">
              <a href="#" className="text-gray-400 hover:text-[#ff6b00]">
                Programming
              </a>
              <a href="#" className="text-gray-400 hover:text-[#ff6b00]">
                Data Science
              </a>
              <a href="#" className="text-gray-400 hover:text-[#ff6b00]">
                Business
              </a>
              <a href="#" className="text-gray-400 hover:text-[#ff6b00]">
                Design
              </a>
              <a href="#" className="text-gray-400 hover:text-[#ff6b00]">
                Marketing
              </a>
            </div>
          </div>

          <div className="border-t border-[#3d2e8a]/30 pt-8 mt-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="flex items-center space-x-2 mb-4 md:mb-0">
                <div className="w-8 h-8 bg-[#ff6b00] rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold">T</span>
                </div>
                <span className="text-xl font-bold text-white">eduAct</span>
              </div>

              <div className="text-gray-400 text-sm">© 2023 TISD. All rights reserved.</div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Landing

