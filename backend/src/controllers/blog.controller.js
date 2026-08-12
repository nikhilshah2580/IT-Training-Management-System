import {
    createBlogService,
    getBlogsService,
    getBlogService,
    getBlogBySlugService,
    incrementBlogViewsService,
    getAllBlogsAdminService,
    getBlogAdminService,
    updateBlogService,
    deleteBlogService,
} from "../services/blog.service.js";

// CREATE BLOG
export const createBlog = async (req, res) => {
    const blog = await createBlogService(req.body, req.user._id);

    return res.status(201).json({
        success: true,
        message: "Blog created successfully.",
        blog,
    });
};

// PUBLIC BLOGS
export const getBlogs = async (req, res) => {
    const result = await getBlogsService({
        page: req.query.page,
        limit: req.query.limit,
        category: req.query.category,
        search: req.query.search,
        featured: req.query.featured,
    });

    return res.status(200).json({
        success: true,
        ...result,
    });
};

// PUBLIC SINGLE BLOG
export const getBlog = async (req, res) => {
    const blog = await getBlogService(req.params.id);

    if (!blog) {
        const error = new Error("Blog not found.");
        error.statusCode = 404;
        throw error;
    }

    return res.status(200).json({
        success: true,
        blog,
    });
};

// BLOG BY SLUG
export const getBlogBySlug = async (req, res) => {
    const blog = await getBlogBySlugService(req.params.slug);

    if (!blog) {
        const error = new Error("Blog not found.");
        error.statusCode = 404;
        throw error;
    }

    return res.status(200).json({
        success: true,
        blog,
    });
};

// INCREASE VIEWS
export const incrementBlogViews = async (req, res) => {
    const blog = await incrementBlogViewsService(req.params.id);

    if (!blog) {
        const error = new Error("Blog not found.");
        error.statusCode = 404;
        throw error;
    }

    return res.status(200).json({
        success: true,
        message: "Blog view recorded.",
        views: blog.views,
    });
};

// ADMIN/INSTRUCTOR GET ALL
export const getAllBlogsAdmin = async (req, res) => {
    const result = await getAllBlogsAdminService({
        page: req.query.page,
        limit: req.query.limit,
        status: req.query.status,
        category: req.query.category,
        search: req.query.search,
    });

    return res.status(200).json({
        success: true,
        ...result,
    });
};

// ADMIN GET SINGLE
export const getBlogAdmin = async (req, res) => {
    const blog = await getBlogAdminService(req.params.id);

    if (!blog) {
        const error = new Error("Blog not found.");
        error.statusCode = 404;
        throw error;
    }

    return res.status(200).json({
        success: true,
        blog,
    });
};

// UPDATE BLOG
export const updateBlog = async (req, res) => {
    const blog = await updateBlogService(req.params.id, req.body, req.user._id, req.user.role);

    return res.status(200).json({
        success: true,
        message: "Blog updated successfully.",
        blog,
    });
};

// DELETE BLOG
export const deleteBlog = async (req, res) => {
    await deleteBlogService(req.params.id, req.user._id, req.user.role);

    return res.status(200).json({
        success: true,
        message: "Blog deleted successfully.",
    });
};
