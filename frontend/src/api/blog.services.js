import api from "./apiClient";

// ======================================================
// CREATE BLOG
// Admin / Instructor
// ======================================================
export const createBlog = async (data) => {
    const response = await api.post("/blogs", data);

    return response.data;
};

// ======================================================
// GET ALL BLOGS
// Public / Admin
// ======================================================
export const getBlogs = async (params = {}) => {
    const response = await api.get("/blogs", {
        params,
    });

    return response.data;
};

export const getManageBlogs = async (params = {}) => {
    const response = await api.get("/blogs/admin/all", {
        params,
    });

    return response.data;
};

// ======================================================
// GET SINGLE BLOG
// ======================================================
export const getBlogById = async (id) => {
    const response = await api.get(`/blogs/${id}`);

    return response.data;
};

// ======================================================
// UPDATE BLOG
// ======================================================
export const updateBlog = async (id, data) => {
    const response = await api.put(`/blogs/${id}`, data);

    return response.data;
};

// ======================================================
// DELETE BLOG
// ======================================================
export const deleteBlog = async (id) => {
    const response = await api.delete(`/blogs/${id}`);

    return response.data;
};

// ======================================================
// UPDATE BLOG STATUS
// ======================================================
export const updateBlogStatus = async (id, status) => {
    const response = await api.patch(`/blogs/${id}/status`, { status });

    return response.data;
};

