import Blog from "../models/blog.model.js";
import mongoose from "mongoose";

// Create blog
export const createBlogService = async (data, authorId) => {
  const {
    title,
    slug,
    excerpt,
    content,
    featuredImage,
    category,
    tags,
    status,
    isFeatured,
  } = data;

  const existingBlog = await Blog.findOne({ slug });

  if (existingBlog) {
    const error = new Error("Blog with this slug already exists.");
    error.statusCode = 400;
    throw error;
  }

  const publishedAt = status === "Published" ? new Date() : null;

  return await Blog.create({
    title,
    slug,
    excerpt,
    content,
    featuredImage,
    category,
    tags,
    author: authorId,
    status,
    publishedAt,
    isFeatured,
  });
};

// Get published blogs
export const getBlogsService = async ({
  page = 1,
  limit = 10,
  category,
  search,
  featured,
} = {}) => {
  page = Number(page);
  limit = Number(limit);

  const skip = (page - 1) * limit;

  const filter = {
    status: "Published",
  };

  if (category) {
    filter.category = category;
  }

  if (featured !== undefined) {
    filter.isFeatured = featured === "true";
  }

  if (search) {
    filter.$text = {
      $search: search,
    };
  }

  const [blogs, total] = await Promise.all([
    Blog.find(filter)
      .populate("author", "fullName email photo role")
      .sort({ publishedAt: -1 })
      .skip(skip)
      .limit(limit),

    Blog.countDocuments(filter),
  ]);

  return {
    blogs,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
};

// Get single published blog
export const getBlogService = async (id) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    const error = new Error("Invalid blog ID.");
    error.statusCode = 400;
    throw error;
  }

  const blog = await Blog.findOne({
    _id: id,
    status: "Published",
  }).populate("author", "fullName email photo role");

  return blog;
};

// Get blog by slug
export const getBlogBySlugService = async (slug) => {
  const blog = await Blog.findOne({
    slug,
    status: "Published",
  }).populate("author", "fullName email photo role");

  return blog;
};

// Increase views
export const incrementBlogViewsService = async (id) => {
  return await Blog.findOneAndUpdate(
    {
      _id: id,
      status: "Published",
    },
    {
      $inc: {
        views: 1,
      },
    },
    {
      returnDocument: "after",
    },
  );
};

// Admin/Instructor get all blogs
export const getAllBlogsAdminService = async ({
  page = 1,
  limit = 10,
  status,
  category,
  search,
} = {}) => {
  page = Number(page);
  limit = Number(limit);

  const skip = (page - 1) * limit;

  const filter = {};

  if (status) {
    filter.status = status;
  }

  if (category) {
    filter.category = category;
  }

  if (search) {
    filter.$text = {
      $search: search,
    };
  }

  const [blogs, total] = await Promise.all([
    Blog.find(filter)
      .populate("author", "fullName email photo role")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),

    Blog.countDocuments(filter),
  ]);

  return {
    blogs,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
};

// Get single admin blog
export const getBlogAdminService = async (id) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    const error = new Error("Invalid blog ID.");
    error.statusCode = 400;
    throw error;
  }

  return await Blog.findById(id).populate(
    "author",
    "fullName email photo role",
  );
};

// Update blog
export const updateBlogService = async (id, data, userId, userRole) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    const error = new Error("Invalid blog ID.");
    error.statusCode = 400;
    throw error;
  }

  const blog = await Blog.findById(id);

  if (!blog) {
    const error = new Error("Blog not found.");
    error.statusCode = 404;
    throw error;
  }

  // Instructor can update only own blog
  if (
    userRole === "instructor" &&
    blog.author.toString() !== userId.toString()
  ) {
    const error = new Error("You can only update your own blogs.");

    error.statusCode = 403;
    throw error;
  }

  if (data.slug && data.slug !== blog.slug) {
    const existingBlog = await Blog.findOne({
      slug: data.slug,
      _id: { $ne: id },
    });

    if (existingBlog) {
      const error = new Error("Blog with this slug already exists.");

      error.statusCode = 400;
      throw error;
    }
  }

  if (data.status === "Published" && blog.status !== "Published") {
    data.publishedAt = new Date();
  }

  return await Blog.findByIdAndUpdate(id, data, {
    returnDocument: "after",
    runValidators: true,
  }).populate("author", "fullName email photo role");
};

// Delete blog
export const deleteBlogService = async (id, userId, userRole) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    const error = new Error("Invalid blog ID.");
    error.statusCode = 400;
    throw error;
  }

  const blog = await Blog.findById(id);

  if (!blog) {
    const error = new Error("Blog not found.");
    error.statusCode = 404;
    throw error;
  }

  // Instructor can delete only own blog
  if (
    userRole === "instructor" &&
    blog.author.toString() !== userId.toString()
  ) {
    const error = new Error("You can only delete your own blogs.");

    error.statusCode = 403;
    throw error;
  }

  await Blog.findByIdAndDelete(id);

  return true;
};
