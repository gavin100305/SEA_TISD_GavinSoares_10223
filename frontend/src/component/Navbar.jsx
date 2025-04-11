import React, { useState } from "react";
import { Menu, X, Search, Globe, User } from "lucide-react";

function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // Removed scroll effect handling since we'll have a consistent blur
  
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/70 backdrop-blur-md">
      <div className="max-w-7xl mx-auto">
        <div className="px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-600 to-purple-800 flex items-center justify-center">
                  <span className="text-white font-bold text-lg">T</span>
                </div>
                <span className="text-2xl font-bold text-white tracking-tight">TISD</span>
              </div>
            </div>
            
            {/* Desktop Navigation - Center aligned */}
            <div className="hidden lg:flex items-center justify-center flex-1 ml-10">
              <div className="flex space-x-1">
                <a href="#" className="text-white px-4 py-2 rounded-md hover:bg-purple-900/20 transition-all">
                  Home
                </a>
                
                <a href="#" className="text-white/80 px-4 py-2 rounded-md hover:bg-purple-900/20 transition-all">
                  Projects
                </a>
                
                <a href="#" className="text-white/80 px-4 py-2 rounded-md hover:bg-purple-900/20 transition-all">
                  SDGs
                </a>
                
                <a href="#" className="text-white/80 px-4 py-2 rounded-md hover:bg-purple-900/20 transition-all">
                  Faculty
                </a>
                
                <a href="#" className="text-white/80 px-4 py-2 rounded-md hover:bg-purple-900/20 transition-all">
                  About
                </a>
              </div>
            </div>
            
            {/* Right side buttons */}
            <div className="flex items-center space-x-1">
              <button className="p-2 text-white/70 hover:text-white rounded-full hover:bg-purple-900/20 transition-all">
                <Search className="w-5 h-5" />
              </button>
              
              <button className="p-2 text-white/70 hover:text-white rounded-full hover:bg-purple-900/20 transition-all">
                <Globe className="w-5 h-5" />
              </button>
              
              <a
                href="http://127.0.0.1:8000/"
                className="hidden md:flex items-center px-4 py-2 bg-gradient-to-r from-purple-600 to-purple-700 rounded-lg text-sm font-medium text-white hover:from-purple-700 hover:to-purple-800 transition-all duration-200 ml-2"
              >
                <User className="w-4 h-4 mr-2" />
                Sign In
              </a>
              
              {/* Mobile menu button */}
              <button 
                className="lg:hidden p-2 text-white/90 hover:text-white rounded-full hover:bg-purple-900/20"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-black/95 backdrop-blur-md border-b border-purple-900/30">
            <div className="px-4 py-2 space-y-1 divide-y divide-purple-900/20">
              <a href="#" className="block py-3 text-white hover:text-purple-400 transition-colors">
                Home
              </a>
              
              <a href="#" className="block py-3 text-white hover:text-purple-400 transition-colors">
                Projects
              </a>
              
              <a href="#" className="block py-3 text-white hover:text-purple-400 transition-colors">
                SDGs
              </a>
              
              <a href="#" className="block py-3 text-white hover:text-purple-400 transition-colors">
                Faculty
              </a>
              
              <a href="#" className="block py-3 text-white hover:text-purple-400 transition-colors">
                About
              </a>
              
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