import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import Home from './pages/Home';
import BlogList from './pages/BlogList';
import ArticlesList from './pages/ArticlesList';
import ArticleView from './pages/ArticleView';
import Login from './pages/Login';
import Register from './pages/Register';
import TechNews from './pages/TechNews';
import Programming from './pages/Programming';
import AdminLayout from './layouts/AdminLayout';
import AddBlog from './pages/admin/AddBlog';
import ManageArticles from './pages/admin/ManageArticles';
import ArticleEditor from './pages/admin/ArticleEditor';

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
          <Route path="programming" element={<Programming />} />
          <Route path="news" element={<TechNews />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
        </Route>

        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AddBlog />} />
          <Route path="add-article" element={<ArticleEditor />} />
          <Route path="articles" element={<ManageArticles />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
