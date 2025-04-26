import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Edit, Github, PaperPlane, 
  UserShield, MessageSquare, Users, Calendar 
} from 'lucide-react';

const ProjectDetail = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [comments, setComments] = useState([]);
  const [mentors, setMentors] = useState([]);
  const [collaborators, setCollaborators] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newComment, setNewComment] = useState('');
  const [replyContent, setReplyContent] = useState({});

  useEffect(() => {
    fetchProjectData();
  }, [projectId]);

  const fetchProjectData = async () => {
    try {
      const [projectRes, commentsRes, mentorsRes, collabsRes] = await Promise.all([
        axios.get(`/api/student/project/${projectId}/`),
        axios.get(`/api/student/project/${projectId}/comments/`),
        axios.get(`/api/student/project/${projectId}/mentors/`),
        axios.get(`/api/student/project/${projectId}/collaborators/`)
      ]);

      setProject(projectRes.data);
      setComments(commentsRes.data);
      setMentors(mentorsRes.data);
      setCollaborators(collabsRes.data);
    } catch (error) {
      setError('Failed to fetch project data');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`/api/student/project/${projectId}/comments/`, {
        content: newComment
      });
      setComments(prev => [...prev, response.data]);
      setNewComment('');
    } catch (error) {
      console.error('Error posting comment:', error);
    }
  };

  const handleReplySubmit = async (commentId) => {
    try {
      const response = await axios.post(`/api/student/project/${projectId}/comments/`, {
        content: replyContent[commentId],
        parent_comment: commentId
      });
      setComments(prev => {
        const parentComment = prev.find(c => c.id === commentId);
        if (parentComment) {
          parentComment.replies = [...(parentComment.replies || []), response.data];
        }
        return [...prev];
      });
      setReplyContent(prev => ({ ...prev, [commentId]: '' }));
    } catch (error) {
      console.error('Error posting reply:', error);
    }
  };

  const toggleCollaboration = async () => {
    try {
      await axios.post(`/api/student/project/${projectId}/toggle-collaboration/`);
      setProject(prev => ({
        ...prev,
        is_open_for_collaboration: !prev.is_open_for_collaboration
      }));
    } catch (error) {
      console.error('Error toggling collaboration:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-50 p-6 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-200 border-t-purple-600"></div>
      </div>
    );
  }

  if (!project) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-50 py-8">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <button
            onClick={() => navigate('/my-projects')}
            className="text-gray-600 hover:text-gray-800 flex items-center gap-2"
          >
            <ArrowLeft size={20} />
            Back to My Projects
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Project Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-xl"
            >
              <div className="flex justify-between items-start mb-4">
                <h1 className="text-2xl font-bold text-gray-800">{project.title}</h1>
                <button
                  onClick={() => navigate(`/edit-project/${project.id}`)}
                  className="text-purple-600 hover:text-purple-700"
                >
                  <Edit size={20} />
                </button>
              </div>

              <div className="flex flex-wrap gap-2 mb-4">
                {project.tech_stack && (
                  <span className="bg-purple-100 text-purple-600 text-sm px-3 py-1 rounded-full">
                    {project.tech_stack}
                  </span>
                )}
                {project.sdgs && (
                  <span className="bg-purple-100 text-purple-600 text-sm px-3 py-1 rounded-full">
                    SDGs: {project.sdgs}
                  </span>
                )}
                <span className="bg-purple-100 text-purple-600 text-sm px-3 py-1 rounded-full">
                  {project.status}
                </span>
              </div>

              <p className="text-gray-600 mb-6">{project.description}</p>

              {project.github_link && (
                <a
                  href={project.github_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-purple-600 hover:text-purple-700 flex items-center gap-2"
                >
                  <Github size={20} />
                  View on GitHub
                </a>
              )}

              {/* Project Images */}
              {(project.project_images?.length > 0) && (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-6">
                  {project.project_images.map((image, index) => (
                    <img
                      key={index}
                      src={image.url}
                      alt={`Project Image ${index + 1}`}
                      className="rounded-lg h-40 w-full object-cover"
                    />
                  ))}
                </div>
              )}
            </motion.div>

            {/* Comments Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-xl"
            >
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Discussion</h2>

              {/* Comment Form */}
              <form onSubmit={handleCommentSubmit} className="mb-6">
                <div className="mb-3">
                  <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    rows="3"
                    className="w-full bg-black bg-opacity-5 border border-gray-200 text-gray-800 rounded-lg px-4 py-3 focus:outline-none focus:border-purple-500"
                    placeholder="Add a comment..."
                  />
                </div>
                <button
                  type="submit"
                  className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
                >
                  <PaperPlane size={16} />
                  Post Comment
                </button>
              </form>

              {/* Comments List */}
              <div className="space-y-6">
                {comments.map(comment => (
                  <div key={comment.id} className="border-b border-gray-200 pb-6 last:border-0 last:pb-0">
                    <div className="flex items-start gap-3 mb-3">
                      <img
                        src={comment.author.profile_picture || `https://ui-avatars.com/api/?name=${encodeURIComponent(comment.author.name)}`}
                        alt={comment.author.name}
                        className="w-10 h-10 rounded-full"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium text-gray-800">{comment.author.name}</h4>
                          <span className="text-xs text-gray-500">{comment.created_at}</span>
                        </div>
                        <p className="text-gray-600 mt-1">{comment.content}</p>

                        {/* Reply Form */}
                        <button
                          onClick={() => setReplyContent(prev => ({ ...prev, [comment.id]: '' }))}
                          className="text-sm text-purple-600 hover:text-purple-700 mt-2"
                        >
                          <MessageSquare size={16} className="inline mr-1" /> Reply
                        </button>

                        {replyContent[comment.id] !== undefined && (
                          <div className="mt-3">
                            <textarea
                              value={replyContent[comment.id]}
                              onChange={(e) => setReplyContent(prev => ({
                                ...prev,
                                [comment.id]: e.target.value
                              }))}
                              rows="2"
                              className="w-full bg-black bg-opacity-5 border border-gray-200 text-gray-800 rounded-lg px-4 py-2 focus:outline-none focus:border-purple-500"
                              placeholder="Write a reply..."
                            />
                            <div className="flex justify-end gap-2 mt-2">
                              <button
                                onClick={() => setReplyContent(prev => {
                                  const newState = { ...prev };
                                  delete newState[comment.id];
                                  return newState;
                                })}
                                className="text-gray-600 hover:text-gray-800"
                              >
                                Cancel
                              </button>
                              <button
                                onClick={() => handleReplySubmit(comment.id)}
                                className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-1 rounded-lg"
                              >
                                Reply
                              </button>
                            </div>
                          </div>
                        )}

                        {/* Replies */}
                        {comment.replies?.length > 0 && (
                          <div className="ml-12 mt-4 space-y-4 border-l-2 border-gray-200 pl-4">
                            {comment.replies.map(reply => (
                              <div key={reply.id} className="flex items-start gap-3">
                                <img
                                  src={reply.author.profile_picture || `https://ui-avatars.com/api/?name=${encodeURIComponent(reply.author.name)}`}
                                  alt={reply.author.name}
                                  className="w-8 h-8 rounded-full"
                                />
                                <div>
                                  <div className="flex items-center gap-2">
                                    <h4 className="text-sm font-medium text-gray-800">{reply.author.name}</h4>
                                    <span className="text-xs text-gray-500">{reply.created_at}</span>
                                  </div>
                                  <p className="text-sm text-gray-600 mt-1">{reply.content}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}

                {comments.length === 0 && (
                  <div className="text-center py-8">
                    <div className="text-6xl mb-4 text-gray-400">
                      <MessageSquare className="mx-auto" size={48} />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">No Comments Yet</h3>
                    <p className="text-gray-600">Start the discussion by adding the first comment.</p>
                  </div>
                )}
              </div>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Project Status */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-xl"
            >
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Project Status</h2>
              <div className="space-y-3">
                <div>
                  <p className="text-gray-500 text-sm">Current Phase</p>
                  <p className="text-gray-800 font-medium">{project.status}</p>
                </div>
                {project.mentor && (
                  <div>
                    <p className="text-gray-500 text-sm">Mentor</p>
                    <p className="text-gray-800 font-medium">{project.mentor.name}</p>
                  </div>
                )}
                {project.mentor_feedback && (
                  <div>
                    <p className="text-gray-500 text-sm">Mentor Feedback</p>
                    <p className="text-gray-800">{project.mentor_feedback}</p>
                  </div>
                )}
                {project.mentor_grade && (
                  <div>
                    <p className="text-gray-500 text-sm">Grade</p>
                    <p className="text-gray-800 font-medium">{project.mentor_grade}/100</p>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Mentors */}
            {mentors.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-xl"
              >
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Your Mentors</h2>
                <div className="space-y-4">
                  {mentors.map(mentor => (
                    <div key={mentor.id} className="flex items-center gap-3">
                      <img
                        src={mentor.profile_picture || `https://ui-avatars.com/api/?name=${encodeURIComponent(mentor.name)}`}
                        alt={mentor.name}
                        className="w-10 h-10 rounded-full"
                      />
                      <div>
                        <p className="text-gray-800 font-medium">{mentor.name}</p>
                        <p className="text-gray-500 text-sm">Mentor</p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Collaborators */}
            {collaborators.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-xl"
              >
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Collaborators</h2>
                <div className="space-y-4">
                  {collaborators.map(collab => (
                    <div key={collab.id} className="flex items-center gap-3">
                      <img
                        src={collab.profile_picture || `https://ui-avatars.com/api/?name=${encodeURIComponent(collab.name)}`}
                        alt={collab.name}
                        className="w-10 h-10 rounded-full"
                      />
                      <div>
                        <p className="text-gray-800 font-medium">{collab.name}</p>
                        <p className="text-gray-500 text-sm">Collaborator</p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Collaboration Status */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-xl"
            >
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Collaboration</h2>
              <div className="flex items-center justify-between mb-3">
                <span className="text-gray-500">Status</span>
                <span className={`px-3 py-1 rounded-full text-sm ${
                  project.is_open_for_collaboration
                    ? 'bg-green-500 text-white'
                    : 'bg-red-500 text-white'
                }`}>
                  {project.is_open_for_collaboration ? 'Open' : 'Closed'}
                </span>
              </div>
              <button
                onClick={toggleCollaboration}
                className={`w-full text-center ${
                  project.is_open_for_collaboration
                    ? 'bg-yellow-500 hover:bg-yellow-600'
                    : 'bg-green-500 hover:bg-green-600'
                } text-white px-4 py-2 rounded-lg transition-colors`}
              >
                {project.is_open_for_collaboration ? 'Close Collaboration' : 'Open for Collaboration'}
              </button>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetail;