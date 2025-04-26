import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Camera, Save } from 'lucide-react';

const StudentProfile = () => {
  const [profile, setProfile] = useState({
    full_name: '',
    phone: '',
    dob: '',
    bio: '',
    roll_number: '',
    branch: '',
    section: '',
    semester: '',
    admission_year: '',
    address: '',
    parent_name: '',
    parent_phone: '',
    profile_picture: null
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await axios.get('/api/student/profile/');
      setProfile(response.data);
      if (response.data.profile_picture) {
        setPreviewImage(response.data.profile_picture);
      }
    } catch (error) {
      setError('Failed to fetch profile data');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfile(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
      setProfile(prev => ({
        ...prev,
        profile_picture: file
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    try {
      const formData = new FormData();
      Object.keys(profile).forEach(key => {
        if (profile[key] !== null) {
          formData.append(key, profile[key]);
        }
      });

      await axios.post('/api/student/profile/update/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      setSuccess(true);
    } catch (error) {
      setError('Failed to update profile');
      console.error('Error:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-50 p-6 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-200 border-t-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-50 py-8">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="form-container bg-white/80 backdrop-blur-sm rounded-xl p-8 shadow-xl max-w-4xl mx-auto"
        >
          <h1 className="text-3xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-indigo-600 mb-8">
            {profile.full_name ? 'Update' : 'Complete'} Your Profile
          </h1>

          {success && (
            <div className="bg-green-100 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-6">
              Profile updated successfully!
            </div>
          )}

          {error && (
            <div className="bg-red-100 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Profile Image Section */}
            <div className="profile-image-section text-center">
              <div className="relative inline-block">
                <img
                  src={previewImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(profile.full_name || '')}&background=9d4edd&color=fff`}
                  alt="Profile"
                  className="w-32 h-32 rounded-full border-4 border-purple-500 object-cover mx-auto"
                />
                <label
                  htmlFor="profile_picture"
                  className="absolute bottom-0 right-0 bg-purple-600 text-white p-2 rounded-full cursor-pointer hover:bg-purple-700 transition"
                >
                  <Camera size={20} />
                </label>
                <input
                  type="file"
                  id="profile_picture"
                  name="profile_picture"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </div>
            </div>

            {/* Basic Information */}
            <div className="form-section">
              <h2 className="text-xl font-semibold text-purple-600 mb-4">Basic Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-gray-700 mb-2">Full Name</label>
                  <input
                    type="text"
                    name="full_name"
                    value={profile.full_name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-200"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-2">Phone Number</label>
                  <input
                    type="tel"
                    name="phone"
                    value={profile.phone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-200"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-2">Date of Birth</label>
                  <input
                    type="date"
                    name="dob"
                    value={profile.dob}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-200"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-2">Bio</label>
                  <textarea
                    name="bio"
                    value={profile.bio}
                    onChange={handleInputChange}
                    rows="3"
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-200"
                  ></textarea>
                </div>
              </div>
            </div>

            {/* Academic Information */}
            <div className="form-section">
              <h2 className="text-xl font-semibold text-purple-600 mb-4">Academic Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div>
                  <label className="block text-gray-700 mb-2">Roll Number</label>
                  <input
                    type="text"
                    name="roll_number"
                    value={profile.roll_number}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-200"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-2">Branch</label>
                  <select
                    name="branch"
                    value={profile.branch}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-200"
                    required
                  >
                    <option value="">Select Branch</option>
                    <option value="CSE">Computer Science</option>
                    <option value="ECE">Electronics</option>
                    <option value="ME">Mechanical</option>
                    <option value="CE">Civil</option>
                  </select>
                </div>
                <div>
                  <label className="block text-gray-700 mb-2">Section</label>
                  <select
                    name="section"
                    value={profile.section}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-200"
                    required
                  >
                    <option value="">Select Section</option>
                    <option value="A">A</option>
                    <option value="B">B</option>
                    <option value="C">C</option>
                  </select>
                </div>
                <div>
                  <label className="block text-gray-700 mb-2">Current Semester</label>
                  <input
                    type="number"
                    name="semester"
                    value={profile.semester}
                    onChange={handleInputChange}
                    min="1"
                    max="8"
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-200"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-2">Admission Year</label>
                  <input
                    type="number"
                    name="admission_year"
                    value={profile.admission_year}
                    onChange={handleInputChange}
                    min="2000"
                    max="2099"
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-200"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Additional Information */}
            <div className="form-section">
              <h2 className="text-xl font-semibold text-purple-600 mb-4">Additional Information</h2>
              <div className="grid grid-cols-1 gap-6">
                <div>
                  <label className="block text-gray-700 mb-2">Address</label>
                  <textarea
                    name="address"
                    value={profile.address}
                    onChange={handleInputChange}
                    rows="3"
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-200"
                  ></textarea>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-gray-700 mb-2">Parent/Guardian Name</label>
                    <input
                      type="text"
                      name="parent_name"
                      value={profile.parent_name}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-200"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 mb-2">Parent/Guardian Phone</label>
                    <input
                      type="tel"
                      name="parent_phone"
                      value={profile.parent_phone}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-200"
                    />
                  </div>
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="w-full md:w-auto px-8 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:opacity-90 transition flex items-center justify-center gap-2"
            >
              <Save size={20} />
              Save Profile
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default StudentProfile; 