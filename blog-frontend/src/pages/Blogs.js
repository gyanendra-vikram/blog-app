import { useEffect, useState, useCallback } from "react";
import API from "../utils/api";

export default function Blogs() {
  const [blogs, setBlogs] = useState([]);
  const [filters, setFilters] = useState({ category: "", author: "" });
  const [selectedBlog, setSelectedBlog] = useState(null);

  const fetchBlogs = useCallback(async () => {
    try {
      let query = "?";
      if (filters.category) query += `category=${filters.category}&`;
      if (filters.author) query += `author=${filters.author}`;
      const res = await API.get(`/blogs${query}`);
      setBlogs(res.data);
    } catch (err) {
      console.error(err);
    }
  }, [filters]);

  useEffect(() => {
    fetchBlogs();
  }, [fetchBlogs]);

  return (
    <div className="p-4">
      <div className="flex flex-wrap gap-2 mb-4">
        <input
          placeholder="Category"
          onChange={(e) => setFilters({ ...filters, category: e.target.value })}
          className="border p-2 flex-1 min-w-[150px]"
        />
        <input
          placeholder="Author"
          onChange={(e) => setFilters({ ...filters, author: e.target.value })}
          className="border p-2 flex-1 min-w-[150px]"
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {blogs.map((b) => (
          // <div key={b._id} className="p-4 border rounded space-y-2">
          <div
            key={b._id}
            onClick={() => setSelectedBlog(b)}
            // className="p-4 border rounded space-y-2 cursor-pointer transition hover:shadow-lg hover:border-indigo-500 "
            className="p-4 border rounded space-y-2 cursor-pointer transition-transform duration-200 transform hover:-translate-y-1 hover:shadow-lg hover:border-gray-500"
          >
            <div>
              <h2 className="text-xl font-bold mb-2">{b.title}</h2>
              <p className="text-sm text-gray-500 mb-2">
                By {b.author} | {b.category}
              </p>
              {b.image && (
                <img
                  src={b.image}
                  alt="Blog"
                  className="grid grid-cols-2 px-auto py-auto mr-auto my-auto max-h-64 object-cover rounded mb-2"
                />
              )}
              <p>{b.content.slice(0, 50)}...</p>
            </div>
          </div>
        ))}
        {/* popupcode */}
        {selectedBlog && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="relative bg-white p-6 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-lg">
              <button
                onClick={() => setSelectedBlog(null)}
                className="absolute top-2 right-3 text-gray-500 hover:text-black text-xl font-bold"
              >
                &times;
              </button>

              <h2 className="text-2xl font-bold mb-2">{selectedBlog.title}</h2>
              <p className="text-sm text-gray-500 mb-4">
                By {selectedBlog.author} | {selectedBlog.category}
              </p>
              {selectedBlog.image && (
                <img
                  src={selectedBlog.image}
                  alt="Blog"
                  className="grid grid-cols-2 px-auto py-auto mr-auto my-auto max-h-64 object-cover rounded mb-2"
                />
              )}
              <p className="whitespace-pre-wrap">{selectedBlog.content}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
