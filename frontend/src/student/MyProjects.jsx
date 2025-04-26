import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Plus, Edit, MessageSquare, Lock, LockOpen, Trash2 } from 'lucide-react';

const MyProjects = () => {
  const [projects, setProjects] = useState([]);
  const [pendingRequests, setPendingRequests] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await axios.get('/api/my-projects/');
      setProjects(response.data.projects);
      setPendingRequests(response.data.pending_requests);
    } catch (error) {
      setError('Failed to fetch projects');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleCollaboration = async (projectId) => {
    try {
      await axios.post(`/api/projects/${projectId}/toggle-collaboration/`);
      fetchProjects(); // Refresh data
    } catch (error) {
      console.error('Error toggling collaboration:', error);
    }
  };

  const handleDeleteProject = async (projectId, groupId = null) => {
    if (!window.confirm('Are you sure you want to delete this project?')) return;
    
    try {
      if (groupId) {
        await axios.delete(`/api/groups/${groupId}/projects/${projectId}/`);
      } else {
        await axios.delete(`/api/projects/${projectId}/`);
      }
      fetchProjects(); // Refresh data
    } catch (error) {
      console.error('Error deleting project:', error);
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
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-50">
      <div className="bg-elements">
        <div className="bg-gradient"></div>
        <div className="bg-gradient"></div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="header-section">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-indigo-600">
                My Projects
              </h1>
              {pendingRequests > 0 && (
                <a
                  href="/collaboration-requests?status=pending"
                  className="text-purple-600 hover:text-purple-700 transition"
                >
                  {pendingRequests} pending collaboration request{pendingRequests !== 1 && 's'}
                </a>
              )}
            </div>
            <button
              onClick={() => navigate('/add-project')}
              className="create-btn flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:opacity-90 transition"
            >
              <Plus size={20} />
              Add New Project
            </button>
          </div>
        </div>

        {error && (
          <div className="alert alert-error mb-4">
            {error}
          </div>
        )}

        {projects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map(project => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="project-card bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-xl"
              >
                <div className="project-header">
                  <div>
                    <h3 className="project-title text-xl font-semibold text-gray-800">
                      {project.title}
                    </h3>
                    <p className="project-type text-gray-600">
                      {project.student ? 'Individual Project' : `Group: ${project.group?.name}`}
                    </p>
                  </div>
                  <span className={`project-status ${project.status === 'completed' ? 'status-completed' : project.status === 'under_review' ? 'status-under_review' : 'status-in_progress'}`}>
                    {project.status}
                  </span>
                </div>

                <p className="project-description text-gray-600 mt-4">
                  {project.description}
                </p>

                <div className="project-meta mt-4">
                  <p className="meta-item"><strong>Tech Stack:</strong> {project.tech_stack}</p>
                  <p className="meta-item"><strong>SDGs:</strong> {project.sdgs}</p>
                  
                  <span className={`collaboration-status ${project.is_open_for_collaboration ? 'status-open' : 'status-closed'}`}>
                    {project.is_open_for_collaboration ? 'Open for Collaboration' : 'Closed'}
                  </span>
                </div>

                <div className="action-buttons mt-6 flex flex-wrap gap-2">
                  {(project.student || (project.group && project.is_group_leader)) && (
                    <button
                      onClick={() => navigate(project.student ? `/edit-project/${project.id}` : `/group/${project.group.id}/project/${project.id}/edit`)}
                      className="btn btn-edit flex items-center gap-2"
                    >
                      <Edit size={16} />
                      Edit
                    </button>
                  )}
                  
                  <button
                    onClick={() => navigate(`/project/${project.id}/comments`)}
                    className="btn btn-comments flex items-center gap-2"
                  >
                    <MessageSquare size={16} />
                    Comments
                  </button>
                  
                  {(project.student || (project.group && project.is_group_leader)) && (
                    <>
                      <button
                        onClick={() => handleToggleCollaboration(project.id)}
                        className="btn btn-toggle flex items-center gap-2"
                      >
                        {project.is_open_for_collaboration ? <Lock size={16} /> : <LockOpen size={16} />}
                        {project.is_open_for_collaboration ? 'Close' : 'Open'} Collaboration
                      </button>
                      
                      <button
                        onClick={() => handleDeleteProject(project.id, project.group?.id)}
                        className="btn btn-delete flex items-center gap-2"
                      >
                        <Trash2 size={16} />
                        Delete
                      </button>
                    </>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="empty-state text-center py-12">
            <p className="text-gray-600 mb-4">No projects found. Create your first project!</p>
            <button
              onClick={() => navigate('/add-project')}
              className="create-btn flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:opacity-90 transition"
            >
              <Plus size={20} />
              Add New Project
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyProjects; 