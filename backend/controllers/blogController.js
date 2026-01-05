import blogModel from "../models/blogModel.js";
import mongoose from "mongoose";

export const createBlog = async (req, res) => {
  try {
    const userId = req.user.id;
    const { title, description, content, tags, coverImage } = req.body;

    if (!title || !description || !content) {
      return res.status(400).json({
        success: false,
        message: "Title, description, and content are required",
      });
    }

    const blog = await blogModel.create({
      title,
      description,
      content,
      tags: tags || [],
      coverImage: coverImage || "",
      author: userId,
    });

    return res.status(201).json({
      success: true,
      blog,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to create blog",
    });
  }
};

export const getBlogs = async (req, res) => {
  try {
    const blogs = await blogModel
      .find({ isPublished: true })
      .populate("author", "name")
      .sort({ createdAt: -1 });

    return res.json({ success: true, blogs });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getBlog = async (req, res) => {
  const { blogId } = req.params;

  try {
    // 1. Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(blogId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid blog ID",
      });
    }

    // 2. Find published blog
    const blog = await blogModel
      .findOne({
        _id: blogId,
        isPublished: true,
      })
      .populate("author", "name");

    // 3. Handle not found
    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found",
      });
    }

    return res.status(200).json({
      success: true,
      blog,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch blog",
    });
  }
};

export const likeBlog = async (req, res) => {
  const userId = req.user.id;
  const { blogId } = req.params;

  try {
    // validate blodId
    if (!mongoose.Types.ObjectId.isValid(blogId)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid blog ID." });
    }

    const blog = await blogModel.findById(blogId);

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found",
      });
    }

    const isLiked = blog.likes.includes(userId);

    if (isLiked) {
      blog.likes = blog.likes.filter((id) => id !== userId);
    } else {
      blog.likes.push(userId);
    }

    await blog.save();

    return res.status(200).json({
      success: true,
      message: !isLiked,
      likesCount: blog.likes.length,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
