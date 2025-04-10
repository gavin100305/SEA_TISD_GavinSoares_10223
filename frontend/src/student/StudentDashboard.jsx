"use client"

import { useState } from "react"
import {
  FiSearch,
  FiBookmark,
  FiBriefcase,
  FiBell,
  FiPieChart,
  FiStar,
  FiCalendar,
  FiFilter,
  FiArrowRight,
  FiMapPin,
  FiHome,
  FiMessageSquare,
  FiSettings,
  FiLogOut,
  FiMenu,
  FiX,
  FiChevronRight,
  FiFileText,
  FiHeart,
} from "react-icons/fi"

const StudentDashboard = () => {
  const [searchQuery, setSearchQuery] = useState("")
  const [notifications, setNotifications] = useState([
    { id: 1, message: "Your application for Google internship has been viewed", time: "2 hours ago", isNew: true },
    { id: 2, message: "New internship matches your profile", time: "Yesterday", isNew: true },
    { id: 3, message: "Microsoft internship application deadline tomorrow", time: "Yesterday", isNew: false },
  ])

  const [showNotifications, setShowNotifications] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [activePage, setActivePage] = useState("dashboard")
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const stats = {
    applications: 12,
    saved: 24,
    interviews: 3,
    profileCompletion: 85,
  }

  const recentInternships = [
    {
      id: 1,
      title: "Frontend Developer Intern",
      company: "Google",
      location: "Remote",
      posted: "2 days ago",
      isSaved: true,
    },
    {
      id: 2,
      title: "UX Design Intern",
      company: "Microsoft",
      location: "Seattle, WA",
      posted: "3 days ago",
      isSaved: false,
    },
    {
      id: 3,
      title: "Data Science Intern",
      company: "Amazon",
      location: "New York, NY",
      posted: "1 week ago",
      isSaved: true,
    },
    {
      id: 4,
      title: "Software Engineering Intern",
      company: "Facebook",
      location: "Menlo Park, CA",
      posted: "1 week ago",
      isSaved: false,
    },
  ]

  const toggleSave = (id) => {
    // Implementation would go here
    console.log(`Toggle save for internship ${id}`)
  }

  const toggleNotifications = () => {
    setShowNotifications(!showNotifications)
  }

  const markAllNotificationsAsRead = () => {
    setNotifications(notifications.map((notif) => ({ ...notif, isNew: false })))
  }

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen)
  }

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen)
  }

  const navigateTo = (page) => {
    setActivePage(page)
    if (window.innerWidth < 1024) {
      setMobileMenuOpen(false)
    }
  }

  // Sidebar navigation items
  const sidebarItems = [
    { id: "dashboard", label: "Dashboard", icon: FiHome },
    { id: "internships", label: "Internships", icon: FiBriefcase },
    { id: "applications", label: "Applications", icon: FiFileText },
    { id: "saved", label: "Saved", icon: FiHeart },
    { id: "messages", label: "Messages", icon: FiMessageSquare, badge: 3 },
    // { id: 'profile', label: 'Profile', icon: FiUser },
    { id: "settings", label: "Settings", icon: FiSettings },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-violet-50">
      {/* Mobile Sidebar Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden" onClick={toggleMobileMenu}></div>
      )}

      {/* Mobile Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out z-30 lg:hidden ${mobileMenuOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="flex items-center justify-between p-4 border-b border-violet-100">
          <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-violet-600 to-purple-600">
            TISD
          </h1>
          <button onClick={toggleMobileMenu} className="p-2 rounded-full hover:bg-violet-50">
            <FiX className="h-6 w-6 text-gray-600" />
          </button>
        </div>
        <div className="flex flex-col p-4 space-y-2">
          {sidebarItems.map((item) => (
            <button
              key={item.id}
              onClick={() => navigateTo(item.id)}
              className={`flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all ${
                activePage === item.id
                  ? "bg-violet-100 text-violet-700"
                  : "text-gray-600 hover:bg-violet-50 hover:text-violet-700"
              }`}
            >
              <item.icon className={`mr-3 ${activePage === item.id ? "text-violet-700" : "text-gray-400"}`} />
              <span className="flex-1">{item.label}</span>
              {item.badge && (
                <span className="bg-violet-600 text-white px-2 py-0.5 rounded-full text-xs">{item.badge}</span>
              )}
            </button>
          ))}
          <div className="pt-4 mt-4 border-t border-violet-100">
            <button className="flex items-center w-full px-4 py-3 text-sm font-medium rounded-xl text-gray-600 hover:bg-violet-50 hover:text-violet-700 transition-all">
              <FiLogOut className="mr-3 text-gray-400" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>

      {/* Header */}
      <div className="bg-white/90 backdrop-blur-md border-b border-violet-100 sticky top-0 z-10 shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            {/* Left side - Logo and menu toggle */}
            <div className="flex items-center">
              <button
                onClick={toggleMobileMenu}
                className="lg:hidden p-2 rounded-full text-gray-600 hover:text-violet-600 hover:bg-violet-50 focus:outline-none"
              >
                <FiMenu className="h-6 w-6" />
              </button>

              <button
                onClick={toggleSidebar}
                className="hidden lg:flex p-2 rounded-full text-gray-600 hover:text-violet-600 hover:bg-violet-50 focus:outline-none mr-2"
              >
                <FiMenu className="h-6 w-6" />
              </button>

              <div className="flex items-center">
                <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-violet-600 to-purple-600">
                  TISD
                </h1>
              </div>
            </div>

            {/* Right side - Search, notifications, profile */}
            <div className="flex items-center space-x-4">
              <div className="relative hidden md:block">
                <input
                  type="text"
                  placeholder="Search..."
                  className="w-64 bg-white/80 border border-violet-200 rounded-full py-2 px-4 pl-10 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <FiSearch className="absolute left-3 top-2.5 text-gray-400" />
              </div>

              {/* Notifications */}
              <div className="relative">
                <button
                  onClick={toggleNotifications}
                  className="p-2 rounded-full hover:bg-violet-50 relative transition-all"
                >
                  <FiBell className="text-xl text-gray-600" />
                  {notifications.some((n) => n.isNew) && (
                    <span className="absolute top-1 right-1 w-2 h-2 bg-violet-600 rounded-full ring-2 ring-white"></span>
                  )}
                </button>

                {/* Notification dropdown */}
                {showNotifications && (
                  <div className="absolute right-0 mt-2 w-80 bg-white border border-violet-100 rounded-xl shadow-lg z-10 overflow-hidden">
                    <div className="p-3 border-b border-violet-100 flex justify-between items-center bg-gradient-to-r from-violet-50 to-purple-50">
                      <h3 className="font-semibold text-gray-800">Notifications</h3>
                      <button
                        onClick={markAllNotificationsAsRead}
                        className="text-xs text-violet-600 hover:text-violet-700 font-medium"
                      >
                        Mark all as read
                      </button>
                    </div>
                    <div className="max-h-80 overflow-y-auto">
                      {notifications.length > 0 ? (
                        notifications.map((notification) => (
                          <div
                            key={notification.id}
                            className={`p-3 border-b border-violet-100 hover:bg-violet-50 transition-colors ${notification.isNew ? "bg-violet-50/50" : ""}`}
                          >
                            <div className="flex items-start">
                              <div className="flex-1">
                                <p className="text-sm">{notification.message}</p>
                                <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                              </div>
                              {notification.isNew && <span className="w-2 h-2 bg-violet-600 rounded-full mt-1"></span>}
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="p-4 text-center text-gray-500">No notifications</div>
                      )}
                    </div>
                    <div className="p-2 text-center border-t border-violet-100 bg-gradient-to-r from-violet-50 to-purple-50">
                      <button className="text-sm text-violet-600 hover:text-violet-700 font-medium">
                        View all notifications
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Profile */}
              <div className="relative">
                <button className="flex items-center space-x-2 focus:outline-none">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-r from-violet-500 to-purple-600 flex items-center justify-center text-white shadow-md">
                    <span className="font-medium text-sm">AJ</span>
                  </div>
                  <span className="hidden md:block text-sm font-medium text-gray-700">Alex Johnson</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Desktop Sidebar */}
        <div
          className={`hidden lg:flex lg:flex-shrink-0 transition-all duration-300 ease-in-out ${sidebarOpen ? "w-64" : "w-20"}`}
        >
          <div className="flex flex-col w-full bg-white border-r border-violet-100 h-screen sticky top-16">
            <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
              <div className="flex-1 px-3 space-y-1">
                {sidebarItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => navigateTo(item.id)}
                    className={`group flex items-center px-3 py-3 text-sm font-medium rounded-xl transition-all ${
                      activePage === item.id
                        ? "bg-gradient-to-r from-violet-100 to-purple-100 text-violet-700"
                        : "text-gray-600 hover:bg-violet-50 hover:text-violet-700"
                    } ${!sidebarOpen ? "justify-center" : "justify-start"}`}
                  >
                    <item.icon
                      className={`${!sidebarOpen ? "text-xl" : "mr-3"} ${activePage === item.id ? "text-violet-700" : "text-gray-400 group-hover:text-violet-700"}`}
                    />
                    {sidebarOpen && <span className="flex-1">{item.label}</span>}
                    {sidebarOpen && item.badge && (
                      <span className="bg-violet-600 text-white px-2 py-0.5 rounded-full text-xs">{item.badge}</span>
                    )}
                  </button>
                ))}
              </div>
            </div>
            <div className="p-3 border-t border-violet-100">
              <button
                className={`group flex items-center px-3 py-3 text-sm font-medium rounded-xl text-gray-600 hover:bg-violet-50 hover:text-violet-700 transition-all ${!sidebarOpen ? "justify-center" : "justify-start"}`}
              >
                <FiLogOut
                  className={`${!sidebarOpen ? "text-xl" : "mr-3"} text-gray-400 group-hover:text-violet-700`}
                />
                {sidebarOpen && <span>Logout</span>}
              </button>
            </div>
          </div>
        </div>

        {/* Dashboard Content */}
        <main className="flex-1 overflow-auto">
          <div className="container mx-auto py-8 px-4">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
              <div>
                <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
                <p className="text-gray-500">Welcome back, Alex Johnson</p>
              </div>
              <div className="mt-4 md:mt-0">
                <button className="bg-violet-600 hover:bg-violet-700 text-white px-4 py-2 rounded-lg shadow-sm transition-all flex items-center">
                  <FiFilter className="mr-2" /> Filter Results
                </button>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-white shadow-sm rounded-xl border border-violet-100 p-6 hover:shadow-md transition-all group hover:border-violet-300">
                <div className="flex items-center space-x-4 mb-3">
                  <div className="p-3 bg-blue-100 rounded-xl group-hover:bg-blue-200 transition-all">
                    <FiFileText className="h-6 w-6 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-800">Applications</h3>
                </div>
                <p className="text-3xl font-bold text-gray-900">{stats.applications}</p>
                <div className="mt-2 text-sm text-blue-600">
                  <span className="flex items-center">
                    <FiArrowRight className="mr-1" /> View all applications
                  </span>
                </div>
              </div>
              <div className="bg-white shadow-sm rounded-xl border border-violet-100 p-6 hover:shadow-md transition-all group hover:border-violet-300">
                <div className="flex items-center space-x-4 mb-3">
                  <div className="p-3 bg-green-100 rounded-xl group-hover:bg-green-200 transition-all">
                    <FiBookmark className="h-6 w-6 text-green-600" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-800">Saved</h3>
                </div>
                <p className="text-3xl font-bold text-gray-900">{stats.saved}</p>
                <div className="mt-2 text-sm text-green-600">
                  <span className="flex items-center">
                    <FiArrowRight className="mr-1" /> View saved internships
                  </span>
                </div>
              </div>
              <div className="bg-white shadow-sm rounded-xl border border-violet-100 p-6 hover:shadow-md transition-all group hover:border-violet-300">
                <div className="flex items-center space-x-4 mb-3">
                  <div className="p-3 bg-yellow-100 rounded-xl group-hover:bg-yellow-200 transition-all">
                    <FiStar className="h-6 w-6 text-yellow-600" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-800">Interviews</h3>
                </div>
                <p className="text-3xl font-bold text-gray-900">{stats.interviews}</p>
                <div className="mt-2 text-sm text-yellow-600">
                  <span className="flex items-center">
                    <FiArrowRight className="mr-1" /> View upcoming interviews
                  </span>
                </div>
              </div>
              <div className="bg-white shadow-sm rounded-xl border border-violet-100 p-6 hover:shadow-md transition-all group hover:border-violet-300">
                <div className="flex items-center space-x-4 mb-3">
                  <div className="p-3 bg-violet-100 rounded-xl group-hover:bg-violet-200 transition-all">
                    <FiPieChart className="h-6 w-6 text-violet-600" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-800">Profile</h3>
                </div>
                <div className="relative pt-1">
                  <div className="flex mb-2 items-center justify-between">
                    <div>
                      <span className="text-xs font-semibold inline-block text-violet-600">
                        {stats.profileCompletion}% Complete
                      </span>
                    </div>
                  </div>
                  <div className="overflow-hidden h-2 mb-4 text-xs flex rounded-full bg-violet-200">
                    <div
                      style={{ width: `${stats.profileCompletion}%` }}
                      className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-gradient-to-r from-violet-500 to-purple-600 rounded-full transition-all"
                    ></div>
                  </div>
                </div>
                <div className="mt-2 text-sm text-violet-600">
                  <span className="flex items-center">
                    <FiArrowRight className="mr-1" /> Complete your profile
                  </span>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white shadow-sm rounded-xl border border-violet-100 p-6 mb-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-800">Recent Internships</h2>
                <button className="text-violet-600 hover:text-violet-700 text-sm font-medium flex items-center">
                  View All <FiChevronRight className="ml-1" />
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {recentInternships.map((internship) => (
                  <div
                    key={internship.id}
                    className="bg-gradient-to-r from-violet-50 to-purple-50 rounded-xl p-5 hover:shadow-md transition-all border border-violet-100 hover:border-violet-300 group"
                  >
                    <div className="flex justify-between">
                      <div>
                        <h3 className="font-semibold text-gray-800 group-hover:text-violet-700 transition-colors">
                          {internship.title}
                        </h3>
                        <p className="text-sm text-gray-600 font-medium">{internship.company}</p>
                        <div className="flex items-center mt-2 text-xs text-gray-500">
                          <div className="flex items-center mr-3">
                            <FiMapPin className="mr-1" /> {internship.location}
                          </div>
                          <div className="flex items-center">
                            <FiCalendar className="mr-1" /> {internship.posted}
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => toggleSave(internship.id)}
                        className={`p-2 rounded-full hover:bg-white/50 transition-all ${internship.isSaved ? "text-violet-600" : "text-gray-400"}`}
                      >
                        <FiBookmark className="text-lg" />
                      </button>
                    </div>
                    <div className="mt-4 flex gap-2">
                      <button className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white text-sm px-4 py-2 rounded-lg transition-all shadow-sm flex-1">
                        Apply Now
                      </button>
                      <button className="bg-white hover:bg-gray-100 text-gray-700 text-sm px-4 py-2 rounded-lg transition-all border border-gray-200 flex-1">
                        View Details
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recommended Section */}
            <div className="bg-gradient-to-r from-violet-600 to-purple-600 rounded-xl p-6 shadow-md">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <div className="text-white mb-4 md:mb-0">
                  <h2 className="text-xl font-bold mb-2">Ready to boost your career?</h2>
                  <p className="opacity-90">Complete your profile to get personalized internship recommendations</p>
                </div>
                <button className="bg-white text-violet-700 hover:bg-gray-100 px-6 py-3 rounded-lg shadow-sm font-medium transition-all">
                  Update Profile
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

export default StudentDashboard

