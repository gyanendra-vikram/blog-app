import Blog from '../models/Blog.js';
import User from '../models/User.js';
import fs from 'fs';
import path from 'path';

export const createBlog = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const blog = await Blog.create({
      title: req.body.title,
      category: req.body.category,
      content: req.body.content,
      image: req.body.image,
      author: user.name,
      userId: req.user.id,
    });

    res.status(201).json(blog);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

export const getBlogs = async (req, res) => {
  const { category, author } = req.query;
  let filters = {};
   if (category) {
    filters.category = { $regex: category, $options: 'i' };
  }

  if (author) {
    filters.author = { $regex: author, $options: 'i' };
  }

  try {
    const blogs = await Blog.find(filters).sort({ createdAt: -1 });
    res.status(200).json(blogs);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

export const updateBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog || blog.userId.toString() !== req.user.id)
      return res.status(403).json({ msg: 'Unauthorized' });

    const updatedBlog = await Blog.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json(updatedBlog);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

export const deleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog || blog.userId.toString() !== req.user.id) {
      return res.status(403).json({ msg: 'Unauthorized' });
    }

    // if (blog.image && blog.image.startsWith('/uploads/')) {
    //   const imagePath = path.join(path.resolve(), blog.image);

    //   fs.unlink(imagePath, (err) => {
    //     if (err) {
    //       console.error('❌ Failed to delete image:', err.message);
    //     } else {
    //       console.log('✅ Deleted image:', imagePath);
    //     }
    //   });
    // }

    await blog.deleteOne();
    res.status(200).json({ msg: 'Blog and image deleted successfully' });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

