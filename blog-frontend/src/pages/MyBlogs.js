import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../utils/api';
import { toast } from 'react-toastify';

export default function MyBlogs() {
  const [blogs, setBlogs] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await API.get('/blogs');
        const token = JSON.parse(atob(localStorage.getItem('token').split('.')[1]));
        const myBlogs = res.data.filter((b) => b.userId === token.id);
        setBlogs(myBlogs);
      } catch (err) {
        toast.error('Failed to load blogs');
      }
    };

    fetchBlogs();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this blog?')) return;

    const updatedBlogs = blogs.filter((b) => b._id !== id);
    setBlogs(updatedBlogs);

    try {
      await API.delete(`/blogs/${id}`);
      toast.success('Blog deleted and image removed');
    } catch (err) {
      toast.error('Delete failed');
      setBlogs(blogs);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">My Blogs</h2>

      {blogs.length === 0 ? (
        <p className="text-gray-500">You haven't created any blogs yet.</p>
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          {blogs.map((b) => (
            // <div key={b._id} className="p-4 border rounded space-y-2">
            <div className="p-4 border rounded space-y-2 cursor-pointer transition-transform duration-200 transform hover:-translate-y-1 hover:shadow-lg hover:border-gray-500">
              <div>
              <h3 className="text-xl font-bold mb-2">{b.title}</h3>
              <p className="text-sm text-gray-500 mb-2">{b.category}</p>

              {b.image && (
                <img
                  src={b.image}
                  alt="Blog"
                  className="grid grid-cols-2 px-auto py-auto mr-auto my-auto max-h-64 object-cover rounded mb-2"
                />
              )}

              <p className="mb-2">{b.content.slice(0, 50)}...</p>
              <div className="flex gap-2">
                <button
                  onClick={() => navigate(`/edit/${b._id}`)}
                  className="bg-blue-500 text-white px-3 py-1 rounded"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(b._id)}
                  className="bg-red-500 text-white px-3 py-1 rounded"
                >
                  Delete
                </button>
              </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
