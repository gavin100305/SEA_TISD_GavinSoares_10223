import React, { useState } from "react";
import { Menu, X, User } from "lucide-react";
import { Link } from "react-router-dom";

function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 py-4">
      <div className="max-w-7xl mx-auto px-4">
        <div className="backdrop-blur-md bg-black/30 border border-white/10 rounded-full py-3 px-6 flex justify-between items-center shadow-lg">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <span className="font-bold text-xl text-white cursor-pointer hover:scale-105 transition-transform duration-200">TISD</span>
            </Link>
          </div>
          
          {/* Desktop Navigation - Center aligned */}
          <div className="hidden lg:flex items-center justify-center flex-1 mx-6">
            <div className="flex space-x-1">
              <Link to="/" className="text-white px-4 py-2 rounded-full hover:bg-white/10 transition-all">
                Home
              </Link>
              
              <Link to="/projects" className="text-white/80 px-4 py-2 rounded-full hover:bg-white/10 transition-all">
                Projects
              </Link>
              
              <Link to="/mentors" className="text-white/80 px-4 py-2 rounded-full hover:bg-white/10 transition-all">
                Mentors
              </Link>
              
              <Link to="/about" className="text-white/80 px-4 py-2 rounded-full hover:bg-white/10 transition-all">
                About
              </Link>
            </div>
          </div>
          
          {/* Right side buttons */}
          <div className="flex items-center space-x-2">
            <a
                  href="http://127.0.0.1:8000/"
                  className="hidden md:flex items-center px-5 py-2 bg-white/90 text-black rounded-full text-sm font-bold hover:bg-white transition-all"
                >
                  <User className="w-4 h-4 mr-2" />
                  Sign In
                </a>
            
            {/* Mobile menu button */}
            <button 
              className="lg:hidden p-2 text-white/90 hover:text-white rounded-full hover:bg-white/10"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden mt-2 backdrop-blur-md bg-black/70 border border-white/10 rounded-2xl overflow-hidden shadow-lg">
            <div className="px-4 py-2 space-y-1 divide-y divide-white/10">
              <Link to="/" className="block py-3 text-white hover:text-purple-300 transition-colors">
                Home
              </Link>
              
              <Link to="/projects" className="block py-3 text-white hover:text-purple-300 transition-colors">
                Projects
              </Link>
              
              <Link to="/mentors" className="block py-3 text-white hover:text-purple-300 transition-colors">
                Mentors
              </Link>
              
              <Link to="/about" className="block py-3 text-white hover:text-purple-300 transition-colors">
                About
              </Link>
              
              <div className="pt-4 pb-3">
              <a
                  href="http://127.0.0.1:8000/"
                  className="flex items-center justify-center w-full px-4 py-3 bg-gradient-to-r from-purple-600 to-purple-700 rounded-lg text-white font-medium hover:from-purple-700 hover:to-purple-800 transition-all"
                >
                  <User className="w-4 h-4 mr-2" />
                  Sign In
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;