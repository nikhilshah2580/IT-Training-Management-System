import api from "./apiClient";

const toBlogFormData = (data = {}) => {
  const formData = new FormData();
  Object.entries(data).forEach(([key, value]) => {
    if (value === undefined || value === null || value === "") return;
    formData.append(
      key,
      value instanceof Blob
        ? value
        : Array.isArray(value)
          ? JSON.stringify(value)
          : String(value),
    );
  });
  return formData;
};

// CREATE BLOG
// Admin / Instructor
export const createBlog = async (data) => {
  const response = await api.post("/blogs", toBlogFormData(data), {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return response.data;
};

// GET ALL BLOGS
// Public / Admin
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

// GET SINGLE BLOG
export const getBlogById = async (id) => {
  const response = await api.get(`/blogs/${id}`);

  return response.data;
};

// UPDATE BLOG
export const updateBlog = async (id, data = {}) => {
  const response = await api.put(`/blogs/${id}`, toBlogFormData(data), {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return response.data;
};

// DELETE BLOG
export const deleteBlog = async (id) => {
  const response = await api.delete(`/blogs/${id}`);

  return response.data;
};

// UPDATE BLOG STATUS
export const updateBlogStatus = async (id, status) => {
  const response = await api.patch(`/blogs/${id}/status`, { status });

  return response.data;
};
