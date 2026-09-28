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
import NotFound from './pages/NotFound';
import AdminLayout from './layouts/AdminLayout';
import AddBlog from './pages/admin/AddBlog';
import ManageArticles from './pages/admin/ManageArticles';
import ArticleEditor from './pages/admin/ArticleEditor';
import AddRoadmap from './pages/admin/AddRoadmap';

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
          <Route path="roadmaps" element={<Roadmaps />} />
          <Route path="roadmap" element={<Roadmaps />} />
          <Route path="roadmap/:slug" element={<Roadmaps />} />
          <Route path="news" element={<TechNews />} />
          <Route path="interview-questions" element={<InterviewQuestions />} />
          <Route path="interviews" element={<InterviewQuestions />} />
          <Route path="about" element={<About />} />
          <Route path="contact" element={<Contact />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="*" element={<NotFound />} />
        </Route>

        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AddBlog />} />
          <Route path="edit-blog/:id" element={<AddBlog />} />
          <Route path="add-article" element={<ArticleEditor />} />
          <Route path="edit-article/:id" element={<ArticleEditor />} />
          <Route path="add-roadmap" element={<AddRoadmap />} />
          <Route path="articles" element={<ManageArticles />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
