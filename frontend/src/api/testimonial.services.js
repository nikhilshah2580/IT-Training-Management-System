import api from "./apiClient";

/*
|--------------------------------------------------------------------------
| PUBLIC — GET APPROVED TESTIMONIALS
|--------------------------------------------------------------------------
| GET /testimonials?page=1&limit=10
|--------------------------------------------------------------------------
*/

export const getApprovedTestimonials = async (params = {}) => {
  const response = await api.get("/testimonials", {
    params,
  });

  return response.data;
};

/*
|--------------------------------------------------------------------------
| PUBLIC — GET SINGLE TESTIMONIAL
|--------------------------------------------------------------------------
| GET /testimonials/:id
|--------------------------------------------------------------------------
*/

export const getTestimonial = async (id) => {
  const response = await api.get(`/testimonials/${id}`);

  return response.data;
};

/*
|--------------------------------------------------------------------------
| STUDENT — CREATE TESTIMONIAL
|--------------------------------------------------------------------------
| POST /testimonials
|--------------------------------------------------------------------------
|
| data:
| {
|   course: courseId,       // optional
|   message: "...",
|   rating: 5
| }
|--------------------------------------------------------------------------
*/

export const createTestimonial = async (data) => {
  const response = await api.post("/testimonials", data);

  return response.data;
};

/*
|--------------------------------------------------------------------------
| STUDENT — GET MY TESTIMONIALS
|--------------------------------------------------------------------------
| GET /testimonials/my
|--------------------------------------------------------------------------
*/

export const getMyTestimonials = async () => {
  const response = await api.get("/testimonials/my");

  return response.data;
};

/*
|--------------------------------------------------------------------------
| STUDENT — UPDATE MY TESTIMONIAL
|--------------------------------------------------------------------------
| PUT /testimonials/my/:id
|--------------------------------------------------------------------------
*/

export const updateMyTestimonial = async (id, data) => {
  const response = await api.put(`/testimonials/my/${id}`, data);

  return response.data;
};

/*
|--------------------------------------------------------------------------
| STUDENT — DELETE MY TESTIMONIAL
|--------------------------------------------------------------------------
| DELETE /testimonials/my/:id
|--------------------------------------------------------------------------
*/

export const deleteMyTestimonial = async (id) => {
  const response = await api.delete(`/testimonials/my/${id}`);

  return response.data;
};

/*
|--------------------------------------------------------------------------
| ADMIN — GET ALL TESTIMONIALS
|--------------------------------------------------------------------------
| GET /testimonials/admin/all
|--------------------------------------------------------------------------
|
| params:
| {
|   status,
|   page,
|   limit
| }
|--------------------------------------------------------------------------
*/

export const getAllTestimonials = async (params = {}) => {
  const response = await api.get("/testimonials/admin/all", {
    params,
  });

  return response.data;
};

/*
|--------------------------------------------------------------------------
| ADMIN — APPROVE TESTIMONIAL
|--------------------------------------------------------------------------
| PATCH /testimonials/admin/:id/approve
|--------------------------------------------------------------------------
*/

export const approveTestimonial = async (id) => {
  const response = await api.patch(`/testimonials/admin/${id}/approve`);

  return response.data;
};

/*
|--------------------------------------------------------------------------
| ADMIN — REJECT TESTIMONIAL
|--------------------------------------------------------------------------
| PATCH /testimonials/admin/:id/reject
|--------------------------------------------------------------------------
|
| data:
| {
|   adminNote: "Reason for rejection"
| }
|--------------------------------------------------------------------------
*/

export const rejectTestimonial = async (id, data = {}) => {
  const response = await api.patch(`/testimonials/admin/${id}/reject`, data);

  return response.data;
};

/*
|--------------------------------------------------------------------------
| ADMIN — FEATURE / UNFEATURE
|--------------------------------------------------------------------------
| PATCH /testimonials/admin/:id/featured
|--------------------------------------------------------------------------
*/

export const toggleFeaturedTestimonial = async (id) => {
  const response = await api.patch(`/testimonials/admin/${id}/featured`);

  return response.data;
};

/*
|--------------------------------------------------------------------------
| ADMIN — DELETE TESTIMONIAL
|--------------------------------------------------------------------------
| DELETE /testimonials/admin/:id
|--------------------------------------------------------------------------
*/

export const deleteTestimonial = async (id) => {
  const response = await api.delete(`/testimonials/admin/${id}`);

  return response.data;
};
