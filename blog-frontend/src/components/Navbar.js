import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

export default function Navbar({ onLogout }) {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem('token');
    toast.info('Logged out!');
    onLogout();
    navigate('/login');
  };

  const linkClass = (path) =>
  `text-sm px-3 py-2 rounded-md transition ${
    location.pathname === path
      ? 'text-indigo-950 font-semibold'
      : 'text-gray-600 hover:text-indigo-950 hover:bg-gray-200'
  }`;

  // const linkClass = (path) =>
  //   `text-sm px-3 py-2 rounded-md transition ${
  //     location.pathname === path
  //       ? 'bg-blue-100 text-blue-700 font-semibold'
  //       : 'text-gray-600 hover:bg-gray-200'
  //   }`;

  return (
    <nav className="bg-white shadow sticky top-0 z-50">
      <div className="max-w-10xl mx-auto px-2 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          <Link to="/" className="text-xl font-bold" style={{ color: '#1f1346' }}>
            BlogApp
          </Link>


          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-700 focus:outline-none text-2xl"
            >
              ☰
            </button>
          </div>

          <div className="hidden md:flex gap-4 items-center">
            <Link to="/" className={linkClass('/')}>All Blogs</Link>
            <Link to="/create" className={linkClass('/create')}>Create</Link>
            <Link to="/my-blogs" className={linkClass('/my-blogs')}>My Blogs</Link>
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white text-sm px-3 py-1 rounded hover:bg-red-600"
            >
              Logout
            </button>
          </div>
        </div>

        {isOpen && (
          <div className="md:hidden flex flex-col gap-2 pb-4">
            <Link to="/" className={linkClass('/')} onClick={() => setIsOpen(false)}>All Blogs</Link>
            <Link to="/create" className={linkClass('/create')} onClick={() => setIsOpen(false)}>Create</Link>
            <Link to="/my-blogs" className={linkClass('/my-blogs')} onClick={() => setIsOpen(false)}>My Blogs</Link>
            <button
              onClick={() => {
                setIsOpen(false);
                handleLogout();
              }}
              className="bg-red-500 text-white text-sm px-3 py-1 rounded w-max self-start ml-3"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}
