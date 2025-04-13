"use client"
import { useState } from "react"
import {ArrowRight, GraduationCap, FileText, MessageSquare, Globe, Menu, X } from "lucide-react"
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
      whileHover={{ y: -20 }}
      key={product.title}
      className="group/product h-80 w-64 relative shrink-0"
    >
      <div className="h-full w-full overflow-hidden rounded-xl">
        <img
          src={product.thumbnail}
          alt={product.title}
          className="h-full w-full object-contain rounded-xl transition-transform duration-300"
        />
      </div>

      <div className="absolute inset-0 h-full w-full opacity-0 group-hover/product:opacity-80 bg-black rounded-xl pointer-events-none"></div>

      <h2 className="absolute bottom-4 left-4 opacity-0 group-hover/product:opacity-100 text-white font-medium text-sm">
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
    }
  }

  return (
    <div className="min-h-screen bg-black overflow-hidden relative">
      {/* Add the navbar component */}
      <Navbar />

      {/* Spline 3D Background - Modified positioning for globe on right */}
      <div className="absolute top-0 left-0 w-full h-screen overflow-hidden z-0">
        <div className="absolute right-0 md:right-0 top-1/2 transform -translate-y-1/2 w-full md:w-3/5 h-screen">
          <Spline 
            scene="https://prod.spline.design/DHUdPWbhCQ5Iwjv1/scene.splinecode" 
            onLoad={onSplineLoad}
          />
        </div>
        
        {/* Dark gradient overlay for better text visibility */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/20 z-10"></div>
      </div>

      {/* Background Elements - Only visible below the hero section */}
      <div className="absolute top-screen left-0 w-full h-full overflow-hidden z-0">
        <div className="absolute top-[50%] right-[5%] w-24 h-24 rounded-full bg-purple-600/20 blur-xl"></div>
        <div className="absolute bottom-[20%] left-[10%] w-32 h-32 rounded-full bg-purple-500/10 blur-xl"></div>
        <div className="absolute top-[60%] left-[20%] w-64 h-64 rounded-full bg-purple-800/20 blur-3xl"></div>
        <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-purple-600/5 rounded-full blur-3xl"></div>

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

      {/* Hero Section with left-aligned text and right-positioned globe - adjusted for navbar */}
      <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-40 md:pt-52 min-h-screen">
        <div className="flex flex-col md:flex-row items-center">
          {/* Left side text content */}
          <div className="text-left max-w-xl md:w-1/2">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight drop-shadow-lg">
              Track <span className="text-purple-500 glow-text">Innovation</span>
              <span className="block mt-2">& Sustainable Development</span>
            </h1>
            <p className="text-lg text-gray-200 mb-8 drop-shadow-md">
              A platform to systematically document and monitor academic projects, map them to Sustainable Development
              Goals, and manage collaborations with NGOs and industry experts.
            </p>
            <div className="flex flex-col sm:flex-row items-start gap-4">
              <button className="w-full sm:w-auto px-8 py-4 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg transition-colors duration-200 flex items-center justify-center shadow-lg shadow-purple-500/30">
                Start Now <ArrowRight className="ml-2 w-4 h-4" />
              </button>
              <button className="w-full sm:w-auto px-8 py-4 bg-white/10 hover:bg-white/15 text-white font-medium rounded-lg border border-white/20 backdrop-blur-sm transition-all duration-200 flex items-center justify-center">
                Explore Projects <ArrowRight className="ml-2 w-4 h-4" />
              </button>
            </div>
          </div>
          
          {/* Right side 3D globe space */}
          <div className="md:w-1/2 relative h-96 md:h-auto">
            {/* The actual globe is in the background Spline element */}
          </div>
        </div>
      </div>
        
      {/* Key Features Section - Below the hero section with the 3D globe */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 md:mt-0">
        <h2 className="text-3xl font-bold text-center text-white mb-4">
          Key <span className="text-purple-500">Functional</span> Requirements
        </h2>
        <p className="text-gray-300 text-center max-w-2xl mx-auto mb-12">
          Our platform offers comprehensive tools to track, manage, and collaborate on projects
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-gradient-to-br from-purple-900/20 to-black/20 backdrop-blur-sm rounded-xl p-6 border border-purple-900/30 hover:bg-purple-900/30 transition-all duration-300 hover:transform hover:scale-105">
            <div className="w-12 h-12 bg-purple-600 rounded-xl flex items-center justify-center mb-4">
              <FileText className="text-white w-6 h-6" />
            </div>
            <h3 className="text-white text-xl font-medium mb-3">Project Tracking & Management</h3>
            <p className="text-gray-300 mb-4">
              Add, edit, and categorize projects by academic year, department, and SDGs.
            </p>
          </div>

          <div className="bg-gradient-to-br from-purple-900/20 to-black/20 backdrop-blur-sm rounded-xl p-6 border border-purple-900/30 hover:bg-purple-900/30 transition-all duration-300 hover:transform hover:scale-105">
            <div className="w-12 h-12 bg-purple-600 rounded-xl flex items-center justify-center mb-4">
              <Globe className="text-white w-6 h-6" />
            </div>
            <h3 className="text-white text-xl font-medium mb-3">SDG Mapping & Impact Analysis</h3>
            <p className="text-gray-300 mb-4">
              Select relevant SDGs for each project and generate insights on SDG contributions institution-wide.
            </p>
          </div>

          <div className="bg-gradient-to-br from-purple-900/20 to-black/20 backdrop-blur-sm rounded-xl p-6 border border-purple-900/30 hover:bg-purple-900/30 transition-all duration-300 hover:transform hover:scale-105">
            <div className="w-12 h-12 bg-purple-600 rounded-xl flex items-center justify-center mb-4">
              <MessageSquare className="text-white w-6 h-6" />
            </div>
            <h3 className="text-white text-xl font-medium mb-3">Collaboration & Networking</h3>
            <p className="text-gray-300 mb-4">
              Allow NGOs and industry experts to express interest in projects and facilitate mentor-student
              interactions.
            </p>
          </div>
        </div>

        {/* SDG Parallax Section */}
        <div className="mt-32 relative z-10">
          <h2 className="text-3xl font-bold text-center text-white mb-4">
            Sustainable <span className="text-purple-500">Development</span> Goals
          </h2>
          <p className="text-gray-300 text-center max-w-2xl mx-auto mb-12">
            Explore how our projects contribute to the United Nations' Sustainable Development Goals
          </p>
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
        {/* CTA Section */}
        <div className="mt-32 text-center">
          <div className="inline-block bg-gradient-to-br from-purple-900/30 to-black/30 backdrop-blur-sm rounded-xl p-8 border border-purple-900/30 hover:border-purple-700/50 transition-all duration-300 transform hover:scale-[1.02]">
            <h2 className="text-3xl font-bold text-white mb-4">Ready to Start Your Innovation Journey?</h2>
            <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
              Join our community of innovators and contribute to sustainable development through your projects.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <button className="px-8 py-4 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg transition-colors duration-200 shadow-lg shadow-purple-500/20">
                Register Now
              </button>
              <button className="px-8 py-4 bg-white/10 hover:bg-white/15 text-white font-medium rounded-lg border border-white/20 transition-all duration-200">
                Learn More
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Custom CSS for text glow effect */}
      <style jsx global>{`
        .glow-text {
          text-shadow: 0 0 15px rgba(168, 85, 247, 0.7);
        }
        
        /* Hide Spline watermark */
        a[href*="spline.design"] {
          display: none !important;
          opacity: 0 !important;
          visibility: hidden !important;
        }
      `}</style>

      {/* Footer */}
      <Footer/>
    </div>
  )
}

export default LandingPage