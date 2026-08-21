import {
  createTestimonialService,
  getApprovedTestimonialsService,
  getMyTestimonialsService,
  getTestimonialService,
  updateMyTestimonialService,
  getAllTestimonialsService,
  approveTestimonialService,
  rejectTestimonialService,
  toggleFeaturedTestimonialService,
  deleteMyTestimonialService,
  deleteTestimonialService,
} from "../services/testimonial.service.js";

// Student creates testimonial
export const createTestimonial = async (req, res) => {
  const testimonial = await createTestimonialService(req.user._id, req.body);

  return res.status(201).json({
    success: true,
    message: "Testimonial submitted successfully. Waiting for admin approval.",
    testimonial,
  });
};

// Public approved testimonials
export const getApprovedTestimonials = async (req, res) => {
  const result = await getApprovedTestimonialsService({
    page: req.query.page,
    limit: req.query.limit,
  });

  return res.status(200).json({
    success: true,
    ...result,
  });
};

// Student's own testimonials
export const getMyTestimonials = async (req, res) => {
  const testimonials = await getMyTestimonialsService(req.user._id);

  return res.status(200).json({
    success: true,
    testimonials,
  });
};

// Get single testimonial
export const getTestimonial = async (req, res) => {
  const testimonial = await getTestimonialService(req.params.id);

  if (!testimonial) {
    const error = new Error("Testimonial not found");
    error.statusCode = 404;
    throw error;
  }

  return res.status(200).json({
    success: true,
    testimonial,
  });
};

// Student update own testimonial
export const updateMyTestimonial = async (req, res) => {
  const testimonial = await updateMyTestimonialService(
    req.params.id,
    req.user._id,
    req.body,
  );

  return res.status(200).json({
    success: true,
    message: "Testimonial updated successfully. Waiting for approval again.",
    testimonial,
  });
};

// Admin get all
export const getAllTestimonials = async (req, res) => {
  const result = await getAllTestimonialsService({
    status: req.query.status,
    page: req.query.page,
    limit: req.query.limit,
  });

  return res.status(200).json({
    success: true,
    ...result,
  });
};

// Admin approve
export const approveTestimonial = async (req, res) => {
  const testimonial = await approveTestimonialService(req.params.id);

  return res.status(200).json({
    success: true,
    message: "Testimonial approved successfully",
    testimonial,
  });
};

// Admin reject
export const rejectTestimonial = async (req, res) => {
  const testimonial = await rejectTestimonialService(
    req.params.id,
    req.body.adminNote || "",
  );

  return res.status(200).json({
    success: true,
    message: "Testimonial rejected successfully",
    testimonial,
  });
};

// Admin feature/unfeature
export const toggleFeaturedTestimonial = async (req, res) => {
  const testimonial = await toggleFeaturedTestimonialService(req.params.id);

  return res.status(200).json({
    success: true,
    message: "Featured status updated successfully",
    testimonial,
  });
};

// Student delete own
export const deleteMyTestimonial = async (req, res) => {
  await deleteMyTestimonialService(req.params.id, req.user._id);

  return res.status(200).json({
    success: true,
    message: "Testimonial deleted successfully",
  });
};

// Admin delete
export const deleteTestimonial = async (req, res) => {
  await deleteTestimonialService(req.params.id);

  return res.status(200).json({
    success: true,
    message: "Testimonial deleted successfully",
  });
};
