import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Navbar from './components/Navbar';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Blogs from './pages/Blogs';
import CreateBlog from './pages/CreateBlog';
import MyBlogs from './pages/MyBlogs';
import EditBlog from './pages/EditBlog';

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" replace />;
};

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token'));

  useEffect(() => {
    const handleStorageChange = () => {
      setIsLoggedIn(!!localStorage.getItem('token'));
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  return (
    <Router>
      {isLoggedIn && <Navbar onLogout={() => setIsLoggedIn(false)} />}

      <Routes>
        <Route
          path="/"
          element={
            isLoggedIn ? <Navigate to="/blogs" replace /> : <Navigate to="/login" replace />
          }
        />

        <Route path="/login" element={<Login onLogin={() => setIsLoggedIn(true)} />} />
        <Route path="/signup" element={<Signup onSignup={() => setIsLoggedIn(true)} />} />

        <Route path="/blogs" element={<PrivateRoute><Blogs /></PrivateRoute>} />
        <Route path="/create" element={<PrivateRoute><CreateBlog /></PrivateRoute>} />
        <Route path="/my-blogs" element={<PrivateRoute><MyBlogs /></PrivateRoute>} />
        <Route path="/edit/:id" element={<PrivateRoute><EditBlog /></PrivateRoute>} />
      </Routes>

      <ToastContainer position="top-right" autoClose={3000} />
    </Router>
  );
}

export default App;
