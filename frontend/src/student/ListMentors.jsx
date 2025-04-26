import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';

const ListMentors = () => {
  const [mentors, setMentors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchMentors();
  }, []);

  const fetchMentors = async () => {
    try {
      const response = await axios.get('/api/mentors/');
      setMentors(response.data);
    } catch (error) {
      setError('Failed to fetch mentors');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSendRequest = async (mentorId, message) => {
    try {
      await axios.post(`/api/mentors/${mentorId}/connect/`, { message });
      // Refresh mentor list to update connection status
      fetchMentors();
    } catch (error) {
      console.error('Error sending connection request:', error);
    }
  };

  const toggleConnectionForm = (mentorId) => {
    const form = document.getElementById(`form-${mentorId}`);
    form.classList.toggle('active');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-50 p-6 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-200 border-t-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-50">
      <div className="bg-elements">
        <div className="bg-gradient"></div>
        <div className="bg-gradient"></div>
      </div>

      <div className="mentors-container max-w-7xl mx-auto px-4 py-8">
        <div className="header-section text-center bg-white/80 backdrop-blur-sm rounded-xl p-8 shadow-xl mb-8">
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-indigo-600">
            Available Mentors
          </h1>
          <p className="text-purple-600 mt-2">
            Connect with experienced mentors to guide you on your learning journey
          </p>
        </div>

        {error && (
          <div className="alert alert-danger mb-6">
            {error}
          </div>
        )}

        <div className="mentor-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mentors.map(item => (
            <motion.div
              key={item.mentor.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mentor-card bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-xl"
            >
              <div className="mentor-header flex items-start gap-4">
                <img
                  src={item.mentor.profile_picture || `https://ui-avatars.com/api/?name=${encodeURIComponent(item.mentor.full_name)}&background=9d4edd&color=fff`}
                  alt={item.mentor.full_name}
                  className="mentor-image w-16 h-16 rounded-lg object-cover"
                />
                <div className="mentor-info flex-1">
                  <h3 className="text-xl font-semibold text-gray-800">{item.mentor.full_name}</h3>
                  <p className="text-purple-600">{item.mentor.current_role}</p>
                  <p className="text-gray-600">{item.mentor.college.college_name}</p>
                  {item.connection_status && (
                    <span className={`status-badge status-${item.connection_status.toLowerCase()}`}>
                      {item.connection_status}
                    </span>
                  )}
                </div>
              </div>

              <div className="mentor-details mt-6 bg-purple-50/50 rounded-lg p-4">
                <p><strong>Qualification:</strong> {item.mentor.highest_qualification}</p>
                <p><strong>Specialization:</strong> {item.mentor.specialization}</p>
                <p><strong>Experience:</strong> {item.mentor.experience_years} years</p>
                {item.mentor.expertise_areas && (
                  <p><strong>Expertise:</strong> {item.mentor.expertise_areas}</p>
                )}
              </div>

              {!item.connection_status && (
                <>
                  <button
                    onClick={() => toggleConnectionForm(item.mentor.id)}
                    className="connect-btn w-full mt-6 px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:opacity-90 transition"
                  >
                    Connect with Mentor
                  </button>
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      const message = e.target.message.value;
                      handleSendRequest(item.mentor.id, message);
                    }}
                    className="connection-form mt-4"
                    id={`form-${item.mentor.id}`}
                  >
                    <textarea
                      name="message"
                      rows="3"
                      placeholder="Write a message to the mentor..."
                      className="w-full p-3 bg-purple-50/50 rounded-lg border border-purple-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200"
                      required
                    ></textarea>
                    <button
                      type="submit"
                      className="connect-btn w-full mt-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:opacity-90 transition"
                    >
                      Send Request
                    </button>
                  </form>
                </>
              )}
            </motion.div>
          ))}

          {mentors.length === 0 && (
            <div className="col-span-full text-center py-12">
              <p className="text-gray-600 text-lg">No mentors available at the moment.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ListMentors;