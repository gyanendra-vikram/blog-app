import { useEffect, useState, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
// import {jwtDecode} from 'jwt-decode';
import API from "../utils/api";
import logo from "./logo3.png";

export default function Navbar({ onLogout }) {
  const [isOpen, setIsOpen] = useState(false);
  const [username, setUsername] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const menuRef = useRef();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        // const decoded = jwtDecode(token);
        // const userId = decoded.id;

        const res = await API.get("/auth/me");
        setUsername(res.data.name);
      } catch (err) {
        console.error("Failed to fetch user info:", err.message);
      }
    };

    fetchUser();
  }, []);
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        isOpen &&
        menuRef.current &&
        !menuRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    toast.info("Logged out!");
    onLogout();
    navigate("/login");
  };
  // hover:bg-cyan-500

  // hover:bg-emerald-500

  // hover:bg-rose-500

  // hover:bg-amber-500
  const linkClass = (path) =>
    `text-sm px-3 py-2 rounded-md transition ${
      location.pathname === path
        ? "text-emerald-300 font-semibold"
        : "text-white hover:text-white font-semibold"
    }`;

  return (
    <nav className="bg-[#0F1636] shadow sticky top-0 z-50">
      <div className="max-w-10xl mx-auto px-2 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          <Link
            to="/"
            className="flex items-center text-xl font-semibold text-white"
          >
            <img
              src={logo}
              alt="BlogsMind"
              className="h-15 w-14"
            />
            <span className="leading-none h-6">B L O G S M I N D</span>
          </Link>

          <div className="md:hidden">
            {username && (
              <span className="text-l text-white">
                <strong>{username} </strong>
              </span>
            )}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-400 focus:outline-none text-2xl"
            >
              ☰
            </button>
          </div>

          <div className="hidden md:flex gap-4 items-center">
            <Link to="/" className={linkClass("/")}>
              ALL BLOGS
            </Link>
            <Link to="/create" className={linkClass("/create")}>
              CREATE
            </Link>
            <Link to="/my-blogs" className={linkClass("/my-blogs")}>
              MY BLOGS
            </Link>
            {/* {username && <span className="text-sm" style={{ color: '#1f1346' }}><strong>{username}</strong></span>} */}
            {username && (
              <div className="flex items-center gap-2 pr-2">
                <div className="w-8 h-8 rounded-full bg-indigo-400 text-white flex items-center justify-center font-bold uppercase text-sm">
                  {username.charAt(0)}
                </div>
                <span className="text-sm text-white">
                  <strong>{username}</strong>
                </span>
              </div>
            )}
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white text-sm px-3 py-1 rounded hover:bg-red-600"
            >
              LOGOUT
            </button>
          </div>
        </div>

        {isOpen && (
          <div ref={menuRef} className="md:hidden flex flex-col gap-2 pb-4">
            <Link
              to="/"
              className={linkClass("/")}
              onClick={() => setIsOpen(false)}
            >
              ALL BLOGS
            </Link>
            <Link
              to="/create"
              className={linkClass("/create")}
              onClick={() => setIsOpen(false)}
            >
              CREATE
            </Link>
            <Link
              to="/my-blogs"
              className={linkClass("/my-blogs")}
              onClick={() => setIsOpen(false)}
            >
              MY BLOGS
            </Link>
            <button
              onClick={() => {
                setIsOpen(false);
                handleLogout();
              }}
              className="bg-red-500 text-white text-sm px-3 py-1 rounded w-max self-start ml-3"
            >
              LOGOUT
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}
