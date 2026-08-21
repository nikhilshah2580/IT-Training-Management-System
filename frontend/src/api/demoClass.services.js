import api from "./apiClient";

// REQUEST DEMO CLASS
// Public user
export const createDemoClass = async (data) => {
  const response = await api.post("/demo-classes", data);

  return response.data;
};

// GET ALL DEMO CLASS REQUESTS
// Admin
export const getDemoClasses = async (params = {}) => {
  const response = await api.get("/demo-classes", {
    params,
  });

  return response.data;
};

// GET SINGLE DEMO CLASS REQUEST
// Admin
export const getDemoClassById = async (id) => {
  const response = await api.get(`/demo-classes/${id}`);

  return response.data;
};

// UPDATE DEMO CLASS STATUS
// Admin
export const updateDemoClassStatus = async (id, status) => {
  const response = await api.put(`/demo-classes/admin/${id}`, { status });

  return response.data;
};

// DELETE DEMO CLASS REQUEST
// Admin
export const deleteDemoClass = async (id) => {
  const response = await api.delete(`/demo-classes/admin/${id}`);

  return response.data;
};

// BOOK DEMO CLASS
// Student
export const bookDemoClass = async (id) => {
  const response = await api.post(`/demo-classes/${id}/book`);

  return response.data;
};
