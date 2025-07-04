import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Plus, X, Upload } from 'lucide-react';

const AddProject = () => {
  const [formData, setFormData] = useState({
    mentor: '',
    title: '',
    description: '',
    sdgs: '',
    tech_stack: '',
    github_link: '',
    project_file: null,
    project_images: Array(5).fill(null),
  });

  const [connectedMentors, setConnectedMentors] = useState([]);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchConnectedMentors();
  }, []);

  const fetchConnectedMentors = async () => {
    try {
      const response = await axios.get('/api/mentors/connected/');
      setConnectedMentors(response.data);
    } catch (error) {
      console.error('Error fetching connected mentors:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, files } = e.target;
    
    if (type === 'file') {
      if (name === 'project_file') {
        setFormData(prev => ({ ...prev, project_file: files[0] }));
      } else {
        const imageIndex = parseInt(name.replace('project_image', '')) - 1;
        const newImages = [...formData.project_images];
        newImages[imageIndex] = files[0];
        setFormData(prev => ({ ...prev, project_images: newImages }));
      }
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formDataToSend = new FormData();
      Object.keys(formData).forEach(key => {
        if (key === 'project_images') {
          formData.project_images.forEach((image, index) => {
            if (image) {
              formDataToSend.append(`project_image${index + 1}`, image);
            }
          });
        } else if (formData[key] !== null) {
          formDataToSend.append(key, formData[key]);
        }
      });

      await axios.post('/api/projects/', formDataToSend, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      setMessages([{ type: 'success', text: 'Project added successfully!' }]);
      // Redirect or clear form
    } catch (error) {
      setMessages([{ type: 'error', text: 'Error adding project. Please try again.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-50 p-6">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-indigo-600">
            Add New Project
          </h1>
          <p className="text-gray-600 mt-2">
            Share your project with mentors and track your progress
          </p>
        </motion.div>

        {messages.map((msg, index) => (
          <div
            key={index}
            className={`mb-4 p-4 rounded-lg ${
              msg.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
            }`}
          >
            {msg.text}
          </div>
        ))}

        <div className="bg-white/80 backdrop-blur-sm rounded-xl p-8 shadow-xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-gray-700 font-semibold mb-2">Share with Mentor</label>
              <select
                name="mentor"
                value={formData.mentor}
                onChange={handleInputChange}
                className="w-full px-4 py-3 rounded-lg bg-white border border-purple-100 focus:border-purple-300 focus:ring-2 focus:ring-purple-200 outline-none transition"
                required
              >
                <option value="">Select a mentor</option>
                {connectedMentors.map(connection => (
                  <option key={connection.mentor.id} value={connection.mentor.id}>
                    {connection.mentor.full_name}
                  </option>
                ))}
              </select>
            </div>

            {/* Add all other form fields similarly */}

            <div className="flex gap-4">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:opacity-90 transition flex items-center justify-center gap-2"
              >
                {loading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
                ) : (
                  <>
                    <Plus size={20} />
                    Add Project
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={() => window.history.back()}
                className="px-6 py-3 bg-gray-500 text-white rounded-lg hover:opacity-90 transition flex items-center gap-2"
              >
                <X size={20} />
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddProject; 