import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { ArrowLeft, Calendar, Award, Clock, FileText, Download } from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';

const AssessmentDetail = () => {
  const [assessment, setAssessment] = useState(null);
  const [loading, setLoading] = useState(true);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    fetchAssessmentDetails();
  }, [id]);

  const fetchAssessmentDetails = async () => {
    try {
      const response = await axios.get(`/api/assessments/${id}/`);
      setAssessment(response.data);
    } catch (error) {
      console.error('Error fetching assessment details:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-50 p-6 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-200 border-t-purple-600"></div>
      </div>
    );
  }

  if (!assessment) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-50 p-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-gray-800">Assessment not found</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-50 p-6">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => navigate('/assessments')}
          className="flex items-center gap-2 text-gray-600 hover:text-purple-600 transition mb-6"
        >
          <ArrowLeft size={20} />
          Back to Assessments
        </button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/80 backdrop-blur-sm rounded-xl overflow-hidden shadow-xl"
        >
          <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-6 flex justify-between items-center">
            <h1 className="text-2xl font-bold text-white">{assessment.title}</h1>
            <span className="px-4 py-2 bg-white/20 rounded-full text-white text-sm font-medium">
              {assessment.status}
            </span>
          </div>

          <div className="p-6 space-y-8">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-purple-50/50 rounded-xl p-6 space-y-4">
                <h3 className="text-lg font-semibold text-purple-600 flex items-center gap-2">
                  <Calendar size={20} />
                  Basic Information
                </h3>
                <div className="space-y-2">
                  <p className="flex justify-between text-gray-600">
                    <span>Start Date:</span>
                    <span className="font-medium">{new Date(assessment.start_date).toLocaleDateString()}</span>
                  </p>
                  <p className="flex justify-between text-gray-600">
                    <span>End Date:</span>
                    <span className="font-medium">{new Date(assessment.end_date).toLocaleDateString()}</span>
                  </p>
                  <p className="flex justify-between text-gray-600">
                    <span>Maximum Marks:</span>
                    <span className="font-medium">{assessment.max_marks}</span>
                  </p>
                </div>
              </div>

              <div className="bg-purple-50/50 rounded-xl p-6 space-y-4">
                <h3 className="text-lg font-semibold text-purple-600 flex items-center gap-2">
                  <Award size={20} />
                  Submission Details
                </h3>
                <div className="space-y-2">
                  <p className="flex justify-between text-gray-600">
                    <span>Submission Required:</span>
                    <span className={`font-medium ${assessment.submission_required ? 'text-green-600' : 'text-red-600'}`}>
                      {assessment.submission_required ? 'Yes' : 'No'}
                    </span>
                  </p>
                  {assessment.submission_required && (
                    <p className="flex justify-between text-gray-600">
                      <span>Time Remaining:</span>
                      <span className="font-medium">
                        {assessment.status === 'upcoming' ? 'Not started yet' :
                         assessment.status === 'ongoing' ? 'Due soon' : 'Deadline passed'}
                      </span>
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="bg-purple-50/50 rounded-xl p-6 space-y-4">
              <h3 className="text-lg font-semibold text-purple-600 flex items-center gap-2">
                <FileText size={20} />
                Description
              </h3>
              <p className="text-gray-600 whitespace-pre-line">{assessment.description}</p>
            </div>

            {/* Assessment Criteria */}
            <div className="bg-purple-50/50 rounded-xl p-6 space-y-4">
              <h3 className="text-lg font-semibold text-purple-600 flex items-center gap-2">
                <Clock size={20} />
                Assessment Criteria
              </h3>
              <p className="text-gray-600 whitespace-pre-line">{assessment.assessment_criteria}</p>
            </div>

            {/* Resources */}
            {assessment.resources && (
              <div className="bg-purple-50/50 rounded-xl p-6 space-y-4">
                <h3 className="text-lg font-semibold text-purple-600 flex items-center gap-2">
                  <Download size={20} />
                  Resources
                </h3>
                <a
                  href={assessment.resources}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
                >
                  <Download size={16} />
                  Download Resources
                </a>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AssessmentDetail; 