import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { useParams } from 'react-router-dom';
import { MessageSquare, PaperPlane, Trash2, Reply } from 'lucide-react';

const ProjectComments = () => {
  const { projectId } = useParams();
  const [project, setProject] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newComment, setNewComment] = useState('');
  const [replyForms, setReplyForms] = useState({});

  useEffect(() => {
    fetchData();
  }, [projectId]);

  const fetchData = async () => {
    try {
      const [projectRes, commentsRes] = await Promise.all([
        axios.get(`/api/student/project/${projectId}/`),
        axios.get(`/api/student/project/${projectId}/comments/`)
      ]);
      setProject(projectRes.data);
      setComments(commentsRes.data);
    } catch (error) {
      setError('Failed to fetch data');
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

  const handleReplySubmit = async (commentId, content) => {
    try {
      const response = await axios.post(`/api/student/project/${projectId}/comments/`, {
        content,
        parent_comment: commentId
      });
      
      setComments(prev => {
        const updatedComments = [...prev];
        const parentComment = updatedComments.find(c => c.id === commentId);
        if (parentComment) {
          parentComment.replies = [...(parentComment.replies || []), response.data];
        }
        return updatedComments;
      });
      
      setReplyForms(prev => ({
        ...prev,
        [commentId]: { show: false, content: '' }
      }));
    } catch (error) {
      console.error('Error posting reply:', error);
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm('Are you sure you want to delete this comment?')) return;
    
    try {
      await axios.delete(`/api/student/project/comment/${commentId}/`);
      setComments(prev => prev.filter(c => c.id !== commentId));
    } catch (error) {
      console.error('Error deleting comment:', error);
    }
  };

  const toggleReplyForm = (commentId) => {
    setReplyForms(prev => ({
      ...prev,
      [commentId]: {
        show: !prev[commentId]?.show,
        content: prev[commentId]?.content || ''
      }
    }));
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
      {/* Background Elements */}
      <div className="fixed inset-0 z-0 overflow-hidden">
        <div className="absolute top-0 right-0 w-[35rem] h-[35rem] bg-purple-300/30 rounded-full filter blur-[8rem] animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-[35rem] h-[35rem] bg-indigo-300/20 rounded-full filter blur-[8rem] animate-pulse delay-[5s]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(#a855f7_1px,transparent_1px)] bg-[size:40px_40px] opacity-[0.1]"></div>
      </div>

      <div className="container mx-auto px-4 py-8 relative z-10">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-xl mb-8"
        >
          <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-indigo-600">
            Comments on {project?.title}
          </h2>
        </motion.div>

        {/* Comment Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-xl mb-8"
        >
          <form onSubmit={handleCommentSubmit}>
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              rows="2"
              className="w-full bg-black/5 border border-gray-200 rounded-lg p-4 focus:outline-none focus:border-purple-500 transition-colors"
              placeholder="Add a comment..."
            ></textarea>
            <div className="flex justify-end mt-3">
              <button
                type="submit"
                className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:opacity-90 transition-opacity"
              >
                <PaperPlane size={16} />
                Post Comment
              </button>
            </div>
          </form>
        </motion.div>

        {/* Comments List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-xl"
        >
          {comments.length > 0 ? (
            <div className="space-y-6">
              {comments.map(comment => (
                <div key={comment.id} className="bg-black/5 rounded-lg p-4 transition-transform hover:-translate-y-1">
                  <div className="flex items-start gap-4">
                    <img
                      src={comment.author.profile_picture || `https://ui-avatars.com/api/?name=${encodeURIComponent(comment.author.name)}`}
                      alt={comment.author.name}
                      className="w-10 h-10 rounded-full"
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium text-gray-800">{comment.author.name}</h4>
                          <p className="text-sm text-gray-500">{comment.created_at}</p>
                        </div>
                        {comment.can_delete && (
                          <button
                            onClick={() => handleDeleteComment(comment.id)}
                            className="text-red-500 hover:text-red-600"
                          >
                            <Trash2 size={16} />
                          </button>
                        )}
                      </div>
                      <p className="mt-2 text-gray-700">{comment.content}</p>
                      
                      <button
                        onClick={() => toggleReplyForm(comment.id)}
                        className="mt-2 text-purple-600 hover:text-purple-700 flex items-center gap-1 text-sm"
                      >
                        <Reply size={14} />
                        Reply
                      </button>

                      {replyForms[comment.id]?.show && (
                        <div className="mt-3 pl-4 border-l-2 border-purple-200">
                          <textarea
                            value={replyForms[comment.id].content}
                            onChange={(e) => setReplyForms(prev => ({
                              ...prev,
                              [comment.id]: { ...prev[comment.id], content: e.target.value }
                            }))}
                            rows="2"
                            className="w-full bg-white border border-gray-200 rounded-lg p-3 focus:outline-none focus:border-purple-500 text-sm"
                            placeholder="Write a reply..."
                          ></textarea>
                          <div className="flex justify-end gap-2 mt-2">
                            <button
                              onClick={() => toggleReplyForm(comment.id)}
                              className="text-gray-500 hover:text-gray-700 text-sm"
                            >
                              Cancel
                            </button>
                            <button
                              onClick={() => handleReplySubmit(comment.id, replyForms[comment.id].content)}
                              className="bg-purple-600 text-white px-3 py-1 rounded-lg text-sm hover:bg-purple-700"
                            >
                              Reply
                            </button>
                          </div>
                        </div>
                      )}

                      {/* Replies */}
                      {comment.replies?.length > 0 && (
                        <div className="mt-4 pl-4 border-l-2 border-purple-200 space-y-4">
                          {comment.replies.map(reply => (
                            <div key={reply.id} className="bg-white/50 rounded-lg p-3">
                              <div className="flex items-start gap-3">
                                <img
                                  src={reply.author.profile_picture || `https://ui-avatars.com/api/?name=${encodeURIComponent(reply.author.name)}`}
                                  alt={reply.author.name}
                                  className="w-8 h-8 rounded-full"
                                />
                                <div className="flex-1">
                                  <div className="flex items-center justify-between">
                                    <div>
                                      <h5 className="font-medium text-gray-800 text-sm">{reply.author.name}</h5>
                                      <p className="text-xs text-gray-500">{reply.created_at}</p>
                                    </div>
                                    {reply.can_delete && (
                                      <button
                                        onClick={() => handleDeleteComment(reply.id)}
                                        className="text-red-500 hover:text-red-600"
                                      >
                                        <Trash2 size={14} />
                                      </button>
                                    )}
                                  </div>
                                  <p className="mt-1 text-gray-700 text-sm">{reply.content}</p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <MessageSquare size={48} className="mx-auto text-gray-400 mb-4" />
              <h3 className="text-xl font-semibold text-gray-800 mb-2">No Comments Yet</h3>
              <p className="text-gray-600">Start the discussion by adding the first comment.</p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default ProjectComments; 