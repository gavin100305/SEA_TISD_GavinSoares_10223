import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Landing from './Landing';
import Auth from './Auth';
import StudentSignup from './student/StudentSignup';
import StudentLogin from './student/StudentLogin';
import StudentDashboard from './student/StudentDashboard';
import MentorSignup from './teacher/MentorSignup';
import MentorLogin from './teacher/MentorLogin';
import AdminSignup from './management/AdminSignup';
import AdminLogin from './management/AdminLogin';
import TeacherProfileForm from './teacher/TeacherProfileForm';
import VerificationPending from './teacher/VerificationPending';
import AdminDashboard from './management/AdminDashboard';
import TeacherDashboard from './teacher/TeacherDashboard';
import Projects from './component/Projects';
import ProjectDetail from './component/ProjectDetail';
import Mentors from './component/Mentors';
import AddGroupProject from './student/AddGroupProject';
import AddProject from './student/AddProject';
import AssessmentDetail from './student/AssessmentDetail';
import ListMentors from './student/ListMentors';
import ViewCollaborators from './student/ViewCollaborators';
import GroupDetail from './student/GroupDetail';
import GroupProjectDetail from './student/GroupProjectDetail';
import MyProjects from './student/MyProjects';
import ProjectMeetings from './student/ProjectMeetings';
import NGOs from './component/NGOs';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/student-signup" element={<StudentSignup />} />
        <Route path="/student-login" element={<StudentLogin />} />
        <Route path="/student-dashboard" element={<StudentDashboard />} />
        <Route path="/mentor-signup" element={<MentorSignup />} />
        <Route path="/mentor-login" element={<MentorLogin />} />
        <Route path="/admin-signup" element={<AdminSignup />} />
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/mentor-profile-form" element={<TeacherProfileForm />} />
        <Route path="/mentor-verification-pending" element={<VerificationPending />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/mentor-dashboard" element={<TeacherDashboard />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/ngos" element={<NGOs />} />
        <Route path="/projects/:id" element={<ProjectDetail />} />
        <Route path="/mentors" element={<Mentors />} />
        <Route path="/add-group-project" element={<AddGroupProject />} />
        <Route path="/add-project" element={<AddProject />} />
        <Route path="/assessment/:id" element={<AssessmentDetail />} />
        <Route path="/list-mentors" element={<ListMentors />} />
        <Route path="/collaborators" element={<ViewCollaborators />} />
        <Route path="/group/:id" element={<GroupDetail />} />
        <Route path="/group/:groupId/project/:projectId" element={<GroupProjectDetail />} />
        <Route path="/my-projects" element={<MyProjects />} />
        <Route path="/project/:id/meetings" element={<ProjectMeetings />} />
      </Routes>
    </Router>
  );
};

export default App;
