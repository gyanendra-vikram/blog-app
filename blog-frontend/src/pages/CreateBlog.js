import { useState } from 'react';
import API from '../utils/api';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import ImageUploading from 'react-images-uploading';

export default function CreateBlog() {
  const [blog, setBlog] = useState({ title: '', category: '', content: '' });
  const [images, setImages] = useState([]);
  const maxNumber = 1;
  const navigate = useNavigate();

  const handleChange = (e) => {
    setBlog({ ...blog, [e.target.name]: e.target.value });
  };

  const uploadImageToBackend = async (imageFile) => {
    const formData = new FormData();
    formData.append('image', imageFile);

    try {
      const res = await API.post('/blogs/upload-image', formData);
      return res.data.imageUrl;
    } catch (err) {
      toast.error('Image upload failed');
      return null;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!blog.title.trim()) {
      toast.error('Title is required');
      return;
    }

    try {
      let imageUrl = '';
      if (images.length > 0) {
        imageUrl = await uploadImageToBackend(images[0].file);
        if (!imageUrl) return;
      }

      await API.post('/blogs', { ...blog, image: imageUrl });
      toast.success('Blog created!');
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.msg || 'Failed to create blog');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-xl mx-auto p-4 space-y-4">
      <h2 className="text-2xl font-bold mb-4">Create Blog</h2>
      <input
        name="title"
        placeholder="Title *"
        value={blog.title}
        onChange={handleChange}
        className="w-full border p-2"
        required
      />
      <input
        name="category"
        placeholder="Category"
        value={blog.category}
        onChange={handleChange}
        className="w-full border p-2"
      />
      <textarea
        name="content"
        placeholder="Content"
        rows={6}
        value={blog.content}
        onChange={handleChange}
        className="w-full border p-2"
      />

      <ImageUploading
        value={images}
        onChange={(imageList) => setImages(imageList)}
        maxNumber={maxNumber}
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
            {imageList.map((image, index) => (
              <div key={index} className="flex items-center gap-4">
                <img src={image.data_url} alt="Preview" className="w-32 h-32 object-cover rounded" />
                <button onClick={onImageRemoveAll} className="text-sm text-red-500">Remove</button>
              </div>
            ))}
          </div>
        )}
      </ImageUploading>

      <button className="bg-blue-600 text-white px-4 py-2 w-full">Create Blog</button>
    </form>
  );
}
