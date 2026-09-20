import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import DashboardLayout from './layouts/DashboardLayout';

// Pages
import Login from './pages/Login';
import Overview from './pages/Overview';
import AddBlog from './pages/AddBlog';
import AddArticle from './pages/AddArticle';
import AddProgramming from './pages/AddProgramming';
import AddRoadmap from './pages/AddRoadmap';
import ManageContent from './pages/ManageContent';
import EditContent from './pages/EditContent';
import Categories from './pages/Categories';
import Users from './pages/Users';
import Profile from './pages/Profile';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3500,
            style: {
              background: '#16162a',
              color: '#f0f0f5',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '10px',
              fontSize: '14px',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
            },
            success: {
              iconTheme: {
                primary: '#10b981',
                secondary: '#16162a',
              },
            },
            error: {
              iconTheme: {
                primary: '#f43f5e',
                secondary: '#16162a',
              },
            },
          }}
        />
        <Routes>
          <Route path="/login" element={<Login />} />

          {/* Protected Dashboard Routes */}
          <Route
            element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route path="/" element={<Overview />} />
            <Route path="/add-blog" element={<AddBlog />} />
            <Route path="/add-article" element={<AddArticle />} />
            <Route path="/add-programming" element={<AddProgramming />} />
            <Route path="/add-roadmap" element={<AddRoadmap />} />
            <Route path="/content" element={<ManageContent />} />
            <Route path="/edit/:id" element={<EditContent />} />
            <Route path="/categories" element={<Categories />} />
            <Route
              path="/users"
              element={
                <ProtectedRoute adminOnly>
                  <Users />
                </ProtectedRoute>
              }
            />
            <Route path="/profile" element={<Profile />} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
