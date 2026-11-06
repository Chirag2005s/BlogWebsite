import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import Home from './pages/Home';
import BlogList from './pages/BlogList';
import ArticlesList from './pages/ArticlesList';
import ArticleView from './pages/ArticleView';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import ProtectedRoute from './components/ProtectedRoute';
import ProjectDetail from './pages/projecthub/ProjectDetail';

// Lazy-loaded Public & Protected Pages for fast initial bundle load
const TechNews = lazy(() => import('./pages/TechNews'));
const Roadmaps = lazy(() => import('./pages/Roadmaps'));
const InterviewQuestions = lazy(() => import('./pages/InterviewQuestions'));
const About = lazy(() => import('./pages/About'));
const Contact = lazy(() => import('./pages/Contact'));
const TermsAndConditions = lazy(() => import('./pages/TermsAndConditions'));
const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy'));
const NotFound = lazy(() => import('./pages/NotFound'));
const Programming = lazy(() => import('./pages/Programming'));

// ProblemHub Lazy Imports
const ProblemHub = lazy(() => import('./pages/problemhub/ProblemHub'));
const CreateProblem = lazy(() => import('./pages/problemhub/CreateProblem'));
const ProblemDetail = lazy(() => import('./pages/problemhub/ProblemDetail'));
const Leaderboard = lazy(() => import('./pages/problemhub/Leaderboard'));
const MyProblemHub = lazy(() => import('./pages/problemhub/MyProblemHub'));

// ProjectHub Lazy Imports
const ProjectHub = lazy(() => import('./pages/projecthub/ProjectHub'));
const CreateProject = lazy(() => import('./pages/projecthub/CreateProject'));
const MyProjectHub = lazy(() => import('./pages/projecthub/MyProjectHub'));

// Admin Studio Lazy Imports
const AdminLayout = lazy(() => import('./layouts/AdminLayout'));
const AddBlog = lazy(() => import('./pages/admin/AddBlog'));
const ManageArticles = lazy(() => import('./pages/admin/ManageArticles'));
const ArticleEditor = lazy(() => import('./pages/admin/ArticleEditor'));
const AddRoadmap = lazy(() => import('./pages/admin/AddRoadmap'));
const ManageInterviews = lazy(() => import('./pages/admin/ManageInterviews'));
const AddInterview = lazy(() => import('./pages/admin/AddInterview'));
const ManageInterviewRepos = lazy(() => import('./pages/admin/ManageInterviewRepos'));
const ManageAdvertisement = lazy(() => import('./pages/admin/ManageAdvertisement'));
const ManageSettings = lazy(() => import('./pages/admin/ManageSettings'));

const PageLoader = () => (
  <div className="min-h-[60vh] flex items-center justify-center">
    <div className="w-9 h-9 rounded-full border-2 border-[#0F6B4F]/20 border-t-[#0F6B4F] animate-spin" />
  </div>
);

function App() {
  return (
    <Router>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/" element={<MainLayout />}>
            <Route index element={<Home />} />
            <Route path="blog" element={<BlogList />} />
            <Route path="blog/:slug" element={<ArticleView />} />
            <Route path="articles" element={<ArticlesList />} />
            <Route path="article/:slug" element={<ArticleView />} />
            <Route path="articles/:slug" element={<ArticleView />} />
            <Route path="roadmaps" element={<ProtectedRoute><Roadmaps /></ProtectedRoute>} />
            <Route path="roadmap" element={<ProtectedRoute><Roadmaps /></ProtectedRoute>} />
            <Route path="roadmap/:slug" element={<ProtectedRoute><Roadmaps /></ProtectedRoute>} />
            <Route path="news" element={<TechNews />} />
            <Route path="interview-questions" element={<ProtectedRoute><InterviewQuestions /></ProtectedRoute>} />
            <Route path="interviews" element={<ProtectedRoute><InterviewQuestions /></ProtectedRoute>} />
            <Route path="about" element={<About />} />
            <Route path="contact" element={<Contact />} />
            <Route path="terms" element={<TermsAndConditions />} />
            <Route path="privacy" element={<PrivacyPolicy />} />
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
            <Route path="programming" element={<Programming />} />
            <Route path="profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
            <Route path="profile/:id" element={<Profile />} />

            {/* ProblemHub Routes - Protected for Logged In Users Only */}
            <Route path="problemhub" element={<ProtectedRoute><ProblemHub /></ProtectedRoute>} />
            <Route path="problemhub/create" element={<ProtectedRoute><CreateProblem /></ProtectedRoute>} />
            <Route path="problemhub/problem/:id" element={<ProtectedRoute><ProblemDetail /></ProtectedRoute>} />
            <Route path="problemhub/leaderboard" element={<ProtectedRoute><Leaderboard /></ProtectedRoute>} />
            <Route path="problemhub/my-problems" element={<ProtectedRoute><MyProblemHub activeTab="problems" /></ProtectedRoute>} />
            <Route path="problemhub/my-solutions" element={<ProtectedRoute><MyProblemHub activeTab="solutions" /></ProtectedRoute>} />

            {/* ProjectHub Routes - Protected for Logged In Users Only */}
            <Route path="projecthub" element={<ProtectedRoute><ProjectHub /></ProtectedRoute>} />
            <Route path="projecthub/create" element={<ProtectedRoute><CreateProject /></ProtectedRoute>} />
            <Route path="projecthub/edit/:id" element={<ProtectedRoute><CreateProject /></ProtectedRoute>} />
            <Route path="projecthub/project/:id" element={<ProtectedRoute><ProjectDetail /></ProtectedRoute>} />
            <Route path="projecthub/my-projects" element={<ProtectedRoute><MyProjectHub /></ProtectedRoute>} />
            
            <Route path="*" element={<NotFound />} />
          </Route>

          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AddBlog />} />
            <Route path="edit-blog/:id" element={<AddBlog />} />
            <Route path="add-article" element={<ArticleEditor />} />
            <Route path="edit-article/:id" element={<ArticleEditor />} />
            <Route path="add-roadmap" element={<AddRoadmap />} />
            <Route path="interviews" element={<ManageInterviews />} />
            <Route path="interview-repos" element={<ManageInterviewRepos />} />
            <Route path="add-interview" element={<AddInterview />} />
            <Route path="edit-interview/:id" element={<AddInterview />} />
            <Route path="articles" element={<ManageArticles />} />
            <Route path="advertisement" element={<ManageAdvertisement />} />
            <Route path="settings" element={<ManageSettings />} />
          </Route>
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;
