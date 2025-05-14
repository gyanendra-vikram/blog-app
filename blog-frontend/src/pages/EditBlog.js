import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../utils/api';
import { toast } from 'react-toastify';
import ImageUploading from 'react-images-uploading';

export default function EditBlog() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [blog, setBlog] = useState({ title: '', category: '', content: '', image: '' });
  const [images, setImages] = useState([]);
  const [existingImage, setExistingImage] = useState('');

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const res = await API.get('/blogs');
        const found = res.data.find((b) => b._id === id);
        if (found) {
          setBlog(found);
          setExistingImage(found.image || '');
        } else {
          navigate('/');
        }
      } catch (err) {
        toast.error('Failed to load blog');
      }
    };
    fetchBlog();
  }, [id, navigate]);

  const handleChange = (e) => {
    setBlog({ ...blog, [e.target.name]: e.target.value });
  };

  const uploadImageToBackend = async (file) => {
    const formData = new FormData();
    formData.append('image', file);
    const res = await API.post('/blogs/upload-image', formData);
    return res.data.imageUrl;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!blog.title.trim()) {
      toast.error('Title is required');
      return;
    }

    try {
      let updatedImage = blog.image;

      if (images.length > 0) {
        updatedImage = await uploadImageToBackend(images[0].file);
      }

      await API.put(`/blogs/${id}`, {
        ...blog,
        image: updatedImage,
      });

      toast.success('Blog updated!');
      navigate('/my-blogs');
    } catch (err) {
      toast.error(err.response?.data?.msg || 'Update failed');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-xl mx-auto p-4 space-y-4">
      <h2 className="text-2xl font-bold mb-4">Edit Blog</h2>

      <input
        name="title"
        value={blog.title}
        onChange={handleChange}
        placeholder="Title"
        className="w-full border p-2"
        required
      />
      <input
        name="category"
        value={blog.category}
        onChange={handleChange}
        placeholder="Category"
        className="w-full border p-2"
      />
      <textarea
        name="content"
        value={blog.content}
        onChange={handleChange}
        rows={6}
        placeholder="Content"
        className="w-full border p-2"
      />

      <ImageUploading
        value={images}
        onChange={(imageList) => setImages(imageList)}
        maxNumber={1}
        dataURLKey="data_url"
        acceptType={['jpg', 'jpeg', 'png']}
      >
        {({ imageList, onImageUpload, onImageRemoveAll }) => (
          <div className="space-y-2">
            <button
              type="button"
              onClick={onImageUpload}
              className="w-full bg-gray-100 border border-dashed border-gray-400 text-gray-600 p-4 text-center rounded"
            >
              Click or Drop Image Here
            </button>

            {imageList.length > 0 ? (
              <div className="flex items-center gap-4">
                <img src={imageList[0].data_url} alt="Preview" className="w-32 h-32 object-cover rounded" />
                <button onClick={onImageRemoveAll} className="text-sm text-red-500">Remove</button>
              </div>
            ) : (
              existingImage && (
                <img
                  src={`http://localhost:5000${existingImage}`}
                  alt="Current"
                  className="w-full max-h-64 object-cover rounded"
                />
              )
            )}
          </div>
        )}
      </ImageUploading>

      <button className="bg-yellow-500 text-white px-4 py-2 w-full">Update Blog</button>
    </form>
  );
}
