import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import Home from './pages/Home';
import BlogList from './pages/BlogList';
import ArticlesList from './pages/ArticlesList';
import ArticleView from './pages/ArticleView';
import Login from './pages/Login';
import Register from './pages/Register';
import TechNews from './pages/TechNews';
import Roadmaps from './pages/Roadmaps';
import InterviewQuestions from './pages/InterviewQuestions';
import About from './pages/About';
import Contact from './pages/Contact';
import TermsAndConditions from './pages/TermsAndConditions';
import PrivacyPolicy from './pages/PrivacyPolicy';
import NotFound from './pages/NotFound';
import AdminLayout from './layouts/AdminLayout';
import ProtectedRoute from './components/ProtectedRoute';
import AddBlog from './pages/admin/AddBlog';
import ManageArticles from './pages/admin/ManageArticles';
import ArticleEditor from './pages/admin/ArticleEditor';
import AddRoadmap from './pages/admin/AddRoadmap';
import ManageInterviews from './pages/admin/ManageInterviews';
import AddInterview from './pages/admin/AddInterview';
import ManageInterviewRepos from './pages/admin/ManageInterviewRepos';
import ManageAdvertisement from './pages/admin/ManageAdvertisement';
import ManageSettings from './pages/admin/ManageSettings';
import Programming from './pages/Programming';
import Profile from './pages/Profile';

// ProblemHub Imports
import ProblemHub from './pages/problemhub/ProblemHub';
import CreateProblem from './pages/problemhub/CreateProblem';
import ProblemDetail from './pages/problemhub/ProblemDetail';
import Leaderboard from './pages/problemhub/Leaderboard';
import MyProblemHub from './pages/problemhub/MyProblemHub';

function App() {
  return (
    <Router>
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
    </Router>
  );
}

export default App;
