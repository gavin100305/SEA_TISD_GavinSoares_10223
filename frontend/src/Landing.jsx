"use client"
import { useState } from "react"
import { ArrowRight, FileText, MessageSquare, Globe, Menu, X } from "lucide-react"
import React from "react"
import { motion, useScroll, useTransform, useSpring } from "framer-motion"
import Footer from "./component/Footer"
import Spline from '@splinetool/react-spline'
import Navbar from "./component/Navbar"

// SDG Product data for parallax
const sdgProducts = [
  {
    title: "SDG 1: No Poverty",
    thumbnail: "/images/Sustainable_Development_Goal_1.png", 
  },
  {
    title: "SDG 2: Zero Hunger",
    thumbnail: "/images/download.png",
  },
  {
    title: "SDG 3: Good Health & Well-being",
    thumbnail: "/images/sdg3.png",
  },
  {
    title: "SDG 4: Quality Education",
    thumbnail: "/images/sdg4.png",
  },
  {
    title: "SDG 5: Gender Equality",
    thumbnail: "/images/sdg5.png",
  },
  {
    title: "SDG 6: Clean Water & Sanitation",
    thumbnail: "/images/sdg6.png",
  },
  {
    title: "SDG 7: Affordable & Clean Energy",
    thumbnail: "/images/sdg7.png",
  },
  {
    title: "SDG 8: Decent Work & Economic Growth",
    thumbnail: "/images/sdg8.png",
  },
  {
    title: "SDG 9: Industry, Innovation & Infrastructure",
    thumbnail: "/images/sdg9.png",
  },
  {
    title: "SDG 10: Reduced Inequalities",
    thumbnail: "/images/sdg10.png",
  },
  {
    title: "SDG 11: Sustainable Cities & Communities",
    thumbnail: "/images/sdg11.png",
  },
  {
    title: "SDG 12: Responsible Consumption & Production",
    thumbnail: "/images/sdg12.png",
  },
  {
    title: "SDG 13: Climate Action",
    thumbnail: "/images/sdg13.png",
  },
  {
    title: "SDG 14: Life Below Water",
    thumbnail: "/images/sdg14.png",
  },
  {
    title: "SDG 15: Life on Land",
    thumbnail: "/images/sdg15.png",
  },
  {
    title: "SDG 16: Peace & Justice Strong Institutions",
    thumbnail: "/images/sdg16.png",
  },
  {
    title: "SDG 17: Partnerships for the Goals",
    thumbnail: "/images/sdg17.png",
  },
];

const HeroParallax = ({ products, title, description }) => {
  const firstRow = products.slice(0, 6)      
  const secondRow = products.slice(6, 12)     
  const thirdRow = products.slice(12)         
  const ref = React.useRef(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  })
  
  const springConfig = { stiffness: 300, damping: 30, bounce: 100 }
  const translateX = useSpring(useTransform(scrollYProgress, [0, 1], [0, 1000]), springConfig)
  const translateXReverse = useSpring(useTransform(scrollYProgress, [0, 1], [0, -1000]), springConfig)
  const rotateX = useSpring(useTransform(scrollYProgress, [0, 0.2], [15, 0]), springConfig)
  const opacity = useSpring(useTransform(scrollYProgress, [0, 0.2], [0.2, 1]), springConfig)
  const rotateZ = useSpring(useTransform(scrollYProgress, [0, 0.2], [20, 0]), springConfig)
  const translateY = useSpring(useTransform(scrollYProgress, [0, 0.2], [-700, 0]), springConfig)

  return (
    <div
      ref={ref}
      className="h-[200vh] py-20 overflow-hidden antialiased relative flex flex-col self-auto [perspective:1000px] [transform-style:preserve-3d]"
    >
      <ParallaxHeader title={title} description={description} />
      <motion.div
        style={{
          rotateX,
          rotateZ,
          translateY,
          opacity,
        }}
        className=""
      >
        <motion.div className="flex flex-row-reverse space-x-reverse space-x-20 mb-20">
          {firstRow.map((product) => (
            <ProductCard product={product} translate={translateX} key={product.title} />
          ))}
        </motion.div>
        <motion.div className="flex flex-row mb-20 space-x-20">
          {secondRow.map((product) => (
            <ProductCard product={product} translate={translateXReverse} key={product.title} />
          ))}
        </motion.div>
        <motion.div className="flex flex-row-reverse space-x-reverse space-x-20">
          {thirdRow.map((product) => (
            <ProductCard product={product} translate={translateX} key={product.title} />
          ))}
        </motion.div>
      </motion.div>
    </div>
  )
}

const ParallaxHeader = ({ title, description }) => {
  return (
    <div className="max-w-7xl relative mx-auto py-20 px-4 w-full left-0 top-0">
      <h1 className="text-3xl md:text-5xl font-bold text-white">
        {title} <span className="text-purple-500">Goals</span>
      </h1>
      <p className="max-w-2xl text-base md:text-lg mt-4 text-gray-300">{description}</p>
    </div>
  )
}

const ProductCard = ({ product, translate }) => {
  return (
    <motion.div
      style={{ x: translate }}
      whileHover={{ y: -20, transition: { duration: 0.3 } }}
      key={product.title}
      className="group/product h-80 w-64 relative shrink-0"
    >
      <div className="h-full w-full overflow-hidden rounded-xl border border-purple-500/20">
        <img
          src={product.thumbnail}
          alt={product.title}
          className="h-full w-full object-contain rounded-xl transition-transform duration-300"
        />
      </div>

      <div className="absolute inset-0 h-full w-full opacity-0 group-hover/product:opacity-80 bg-gradient-to-t from-black via-purple-900/40 to-black rounded-xl pointer-events-none transition-opacity duration-300"></div>

      <h2 className="absolute bottom-4 left-4 opacity-0 group-hover/product:opacity-100 text-white font-medium text-sm transition-opacity duration-300">
        {product.title}
      </h2>
    </motion.div>
  );
};

// Main Landing Page Component
function LandingPage() {
  const [activeTab, setActiveTab] = useState("students")
  
  // Function to handle when Spline is loaded
  const onSplineLoad = (spline) => {
    // Access the DOM element containing Spline
    if (spline && spline.canvas) {
      // Target the Spline watermark which is typically added as a child element to the canvas container
      const splineWatermark = spline.canvas.parentElement.querySelector('a[href*="spline"]');
      if (splineWatermark) {
        splineWatermark.style.display = 'none';
      }
      
      // Apply general brightness adjustments to the canvas
      if (spline.canvas) {
        spline.canvas.style.filter = 'brightness(1.5) contrast(1.2)';
      }
    }
  }

  return (
    <div className="min-h-screen bg-black overflow-hidden relative">
      {/* Navbar */}
      <Navbar />

      {/* Subtle particles effect */}
      <div className="absolute inset-0 z-0">
        <div className="absolute w-full h-full">
          <svg className="opacity-30" width="100%" height="100%">
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
      </div>

      {/* Spline 3D Background with better visibility */}
      <div className="absolute top-0 left-0 w-full h-screen overflow-hidden z-0">
        {/* Colorful ambient light to make the globe pop more */}
        <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-96 h-96 bg-purple-600/30 rounded-full blur-3xl"></div>
        <div className="absolute right-1/4 top-1/3 transform -translate-y-1/2 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl"></div>
        
        {/* Modified globe position and sizing */}
        <div className="absolute right-0 md:right-0 top-1/2 transform -translate-y-1/2 w-full md:w-3/5 h-screen z-5 opacity-100">
          <Spline 
            scene="https://prod.spline.design/DHUdPWbhCQ5Iwjv1/scene.splinecode" 
            onLoad={onSplineLoad}
            style={{ filter: "brightness(1.5) contrast(1.2)" }} // Enhance brightness and contrast
          />
        </div>
        
        {/* Reduced opacity on the dark gradient overlay for better globe visibility */}
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent z-10"></div>
        
        {/* Additional highlight on the globe area */}
        <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-1/2 h-1/2 bg-purple-500/5 rounded-full blur-3xl animate-pulse z-5"></div>
      </div>

      {/* Background Elements - Only visible below the hero section */}
      <div className="absolute top-screen left-0 w-full h-full overflow-hidden z-0">
        <div className="absolute top-[50%] right-[5%] w-32 h-32 rounded-full bg-purple-600/20 blur-xl animate-pulse"></div>
        <div className="absolute bottom-[20%] left-[10%] w-40 h-40 rounded-full bg-purple-500/10 blur-xl animate-pulse" style={{animationDelay: "2s"}}></div>
        <div className="absolute top-[60%] left-[20%] w-64 h-64 rounded-full bg-purple-800/20 blur-3xl animate-pulse" style={{animationDelay: "1s"}}></div>
        <div className="absolute -bottom-20 -right-20 w-96 h-96 bg-purple-600/5 rounded-full blur-3xl"></div>

        {/* Hexagon Grid Pattern */}
        <div className="absolute bottom-0 left-0 w-full h-1/2 opacity-10">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <pattern id="hexagons" width="50" height="43.4" patternUnits="userSpaceOnUse" patternTransform="scale(5)">
              <polygon
                points="24.8,22 37.3,29.2 37.3,43.7 24.8,50.9 12.4,43.7 12.4,29.2"
                fill="none"
                stroke="#a855f7"
                strokeWidth="0.5"
              />
            </pattern>
            <rect width="100%" height="100%" fill="url(#hexagons)" />
          </svg>
        </div>
      </div>

      {/* Hero Section with left-aligned text and right-positioned globe */}
      <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-40 md:pt-52 min-h-screen">
        <div className="flex flex-col md:flex-row items-center">
          {/* Left side text content */}
          <div className="text-left max-w-xl md:w-1/2">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight drop-shadow-lg">
              Track <span className="text-purple-500 glow-text">Innovation</span>
              <span className="block mt-2">& Sustainable Development</span>
            </h1>
            <p className="text-lg text-gray-300 mb-8 drop-shadow-md leading-relaxed">
              A platform to systematically document and monitor academic projects, map them to Sustainable Development
              Goals, and manage collaborations with NGOs and industry experts.
            </p>
            <div className="flex flex-col sm:flex-row items-start gap-4">
              <button className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-medium rounded-lg transition-all duration-300 flex items-center justify-center shadow-lg shadow-purple-500/30 group">
                <span>Start Now</span> 
                <ArrowRight className="ml-2 w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
              </button>
              <button className="w-full sm:w-auto px-8 py-4 bg-white/5 hover:bg-white/10 text-white font-medium rounded-lg border border-white/10 backdrop-blur-sm transition-all duration-300 flex items-center justify-center group">
                <span>Explore Projects</span> 
                <ArrowRight className="ml-2 w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
              </button>
            </div>
          </div>
          
          {/* Right side 3D globe space with indicator for visibility */}
          <div className="md:w-1/2 relative h-96 md:h-auto">
          </div>
        </div>
      </div>
        
      {/* Key Features Section - Below the hero section with the 3D globe */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 md:mt-0 pt-20">
        <div className="text-center mb-12">
          <span className="inline-block px-3 py-1 text-xs font-medium bg-purple-600/20 text-purple-300 rounded-full border border-purple-500/30 mb-4">
            Platform Features
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Key <span className="text-purple-500">Functional</span> Requirements
          </h2>
          <p className="text-gray-300 max-w-2xl mx-auto">
            Our platform offers comprehensive tools to track, manage, and collaborate on projects
            aligned with sustainable development objectives
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-gradient-to-br from-purple-900/10 to-black/30 backdrop-blur-sm rounded-xl p-8 border border-purple-900/20 hover:border-purple-600/30 transition-all duration-500 hover:transform hover:-translate-y-2 group">
            <div className="w-14 h-14 bg-gradient-to-br from-purple-600 to-purple-800 rounded-xl flex items-center justify-center mb-6 shadow-lg shadow-purple-500/20 group-hover:shadow-purple-500/40 transition-all duration-500">
              <FileText className="text-white w-6 h-6" />
            </div>
            <h3 className="text-white text-xl font-semibold mb-3">Project Tracking & Management</h3>
            <p className="text-gray-300">
              Add, edit, and categorize projects by academic year, department, and SDGs with comprehensive analytics and reporting tools.
            </p>
          </div>

          <div className="bg-gradient-to-br from-purple-900/10 to-black/30 backdrop-blur-sm rounded-xl p-8 border border-purple-900/20 hover:border-purple-600/30 transition-all duration-500 hover:transform hover:-translate-y-2 group">
            <div className="w-14 h-14 bg-gradient-to-br from-purple-600 to-purple-800 rounded-xl flex items-center justify-center mb-6 shadow-lg shadow-purple-500/20 group-hover:shadow-purple-500/40 transition-all duration-500">
              <Globe className="text-white w-6 h-6" />
            </div>
            <h3 className="text-white text-xl font-semibold mb-3">SDG Mapping & Impact Analysis</h3>
            <p className="text-gray-300">
              Select relevant SDGs for each project and generate insights on SDG contributions institution-wide with visual dashboards.
            </p>
          </div>

          <div className="bg-gradient-to-br from-purple-900/10 to-black/30 backdrop-blur-sm rounded-xl p-8 border border-purple-900/20 hover:border-purple-600/30 transition-all duration-500 hover:transform hover:-translate-y-2 group">
            <div className="w-14 h-14 bg-gradient-to-br from-purple-600 to-purple-800 rounded-xl flex items-center justify-center mb-6 shadow-lg shadow-purple-500/20 group-hover:shadow-purple-500/40 transition-all duration-500">
              <MessageSquare className="text-white w-6 h-6" />
            </div>
            <h3 className="text-white text-xl font-semibold mb-3">Collaboration & Networking</h3>
            <p className="text-gray-300">
              Allow NGOs and industry experts to express interest in projects and facilitate mentor-student interactions through dedicated communication channels.
            </p>
          </div>
        </div>

        {/* SDG Parallax Section */}
        <div className="mt-32 relative z-10">
          <div className="text-center">
            <span className="inline-block px-3 py-1 text-xs font-medium bg-purple-600/20 text-purple-300 rounded-full border border-purple-500/30 mb-4">
              United Nations Goals
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Sustainable <span className="text-purple-500">Development</span> Goals
            </h2>
            <p className="text-gray-300 max-w-2xl mx-auto mb-12">
              Explore how our projects contribute to the United Nations' Sustainable Development Goals
              and drive meaningful change across multiple dimensions
            </p>
          </div>
        </div>
      </div>

      {/* SDG Parallax Section - Outside the normal container for full width */}
      <div className="relative z-10 w-full">
        <HeroParallax
          products={sdgProducts}
          title="Sustainable Development"
          description="Our platform maps academic projects to the UN's 17 Sustainable Development Goals, helping track institutional impact toward global priorities."
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Testimonials section */}
        <div className="mt-20 mb-20">
          <div className="text-center mb-12">
            <span className="inline-block px-3 py-1 text-xs font-medium bg-purple-600/20 text-purple-300 rounded-full border border-purple-500/30 mb-4">
              Success Stories
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              What Our <span className="text-purple-500">Partners</span> Say
            </h2>
            <p className="text-gray-300 max-w-2xl mx-auto">
              Hear from organizations and academic institutions using our platform
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-gradient-to-br from-purple-900/10 to-black/30 backdrop-blur-sm rounded-xl p-8 border border-purple-900/20">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 rounded-full bg-purple-600 flex items-center justify-center">
                  <span className="text-white font-bold">UN</span>
                </div>
                <div className="ml-4">
                  <p className="text-white font-semibold">Sarah Johnson</p>
                  <p className="text-gray-400 text-sm">UN Sustainability Lead</p>
                </div>
              </div>
              <p className="text-gray-300">
                "This platform has revolutionized how we track academic contributions to SDGs. The visualization tools help us identify impact areas and foster meaningful partnerships."
              </p>
            </div>
            
            <div className="bg-gradient-to-br from-purple-900/10 to-black/30 backdrop-blur-sm rounded-xl p-8 border border-purple-900/20">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 rounded-full bg-purple-600 flex items-center justify-center">
                  <span className="text-white font-bold">EU</span>
                </div>
                <div className="ml-4">
                  <p className="text-white font-semibold">Marco Benetti</p>
                  <p className="text-gray-400 text-sm">EU Innovation Director</p>
                </div>
              </div>
              <p className="text-gray-300">
                "The collaboration features have enabled us to connect with promising academic projects that align with our sustainability initiatives. An invaluable resource."
              </p>
            </div>
          </div>
        </div>
      
        {/* CTA Section */}
        <div className="mt-32 mb-32 text-center">
          <div className="bg-gradient-to-br from-purple-900/20 to-black/30 backdrop-blur-sm rounded-2xl p-12 border border-purple-900/30 hover:border-purple-700/50 transition-all duration-500 transform hover:scale-[1.02]">
            <span className="inline-block px-3 py-1 text-xs font-medium bg-purple-600/20 text-purple-300 rounded-full border border-purple-500/30 mb-4">
              Join Today
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Ready to Start Your Innovation Journey?</h2>
            <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
              Join our community of innovators and contribute to sustainable development through your projects. Track impact, connect with partners, and make a difference.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-6">
              <button className="px-8 py-4 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-medium rounded-lg transition-all duration-300 shadow-lg shadow-purple-500/20 flex items-center justify-center group">
                <span>Register Now</span>
                <ArrowRight className="ml-2 w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
              </button>
              <button className="px-8 py-4 bg-white/5 hover:bg-white/10 text-white font-medium rounded-lg border border-white/10 transition-all duration-300 flex items-center justify-center group">
                <span>Learn More</span>
                <ArrowRight className="ml-2 w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Custom CSS for global styles - Fixed attributes */}
      <style>
        {`
          .glow-text {
            text-shadow: 0 0 20px rgba(168, 85, 247, 0.7);
          }
          
          /* Hide Spline watermark */
          a[href*="spline.design"] {
            display: none !important;
            opacity: 0 !important;
            visibility: hidden !important;
          }
          
          /* Animation keyframes */
          @keyframes pulse {
            0% { opacity: 0.4; }
            50% { opacity: 0.7; }
            100% { opacity: 0.4; }
          }
          
          .animate-pulse {
            animation: pulse 4s infinite ease-in-out;
          }
          
          /* Enhanced glow for the globe */
          .spline-canvas {
            filter: brightness(1.5) contrast(1.2) !important;
          }
        `}
      </style>

      {/* Footer */}
      <Footer/>
    </div>
  )
}

export default LandingPage