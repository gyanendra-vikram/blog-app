import { useEffect, useState, useCallback } from 'react';
import API from '../utils/api';

export default function Blogs() {
  const [blogs, setBlogs] = useState([]);
  const [filters, setFilters] = useState({ category: '', author: '' });

  const fetchBlogs = useCallback(async () => {
    try {
      let query = '?';
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
          <div key={b._id} className="p-4 border rounded space-y-2">
            <div>
              <h2 className="text-xl font-bold mb-2">{b.title}</h2>
              <p className="text-sm text-gray-500 mb-2">By {b.author} | {b.category}</p>
                {b.image && (
                  <img
                    src={b.image}
                    alt="Blog"
                    className="grid grid-cols-2 px-auto py-auto mr-auto my-auto max-h-64 object-cover rounded mb-2"
                  />   
                )}
               <p>{b.content.slice(0, 150)}...</p>
            </div>

          </div>
        ))}
      </div>
    </div>
  );
}
