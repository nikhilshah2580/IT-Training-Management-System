import {
  createDemoClassService,
  getDemoClassesService,
  getDemoClassService,
  updateDemoClassService,
  adminUpdateDemoClassService,
  deleteDemoClassService,
  adminDeleteDemoClassService,
  bookDemoClassService,
  cancelDemoBookingService,
  getMyDemoBookingsService,
} from "../services/demoClass.service.js";

// CREATE Instructor
export const createDemoClass = async (req, res) => {
  const demoClass = await createDemoClassService({
    ...req.body,
    instructor: req.user._id,
  });

  return res.status(201).json({
    success: true,
    message: "Demo class created successfully.",
    demoClass,
  });
};

// GET ALL
export const getDemoClasses = async (req, res) => {
  const demoClasses = await getDemoClassesService(req.query);

  return res.status(200).json({
    success: true,
    demoClasses,
  });
};

// GET SINGLE
export const getDemoClass = async (req, res) => {
  const demoClass = await getDemoClassService(req.params.id);

  if (!demoClass) {
    const error = new Error("Demo class not found.");

    error.statusCode = 404;
    throw error;
  }

  return res.status(200).json({
    success: true,
    demoClass,
  });
};

// UPDATE Instructor
export const updateDemoClass = async (req, res) => {
  const demoClass = await updateDemoClassService(
    req.params.id,
    req.user._id,
    req.body,
  );

  return res.status(200).json({
    success: true,
    message: "Demo class updated successfully.",
    demoClass,
  });
};

// ADMIN UPDATE
export const adminUpdateDemoClass = async (req, res) => {
  const demoClass = await adminUpdateDemoClassService(req.params.id, req.body);

  return res.status(200).json({
    success: true,
    message: "Demo class updated successfully.",
    demoClass,
  });
};

// DELETE Instructor
export const deleteDemoClass = async (req, res) => {
  await deleteDemoClassService(req.params.id, req.user._id);

  return res.status(200).json({
    success: true,
    message: "Demo class deleted successfully.",
  });
};

// ADMIN DELETE
export const adminDeleteDemoClass = async (req, res) => {
  await adminDeleteDemoClassService(req.params.id);

  return res.status(200).json({
    success: true,
    message: "Demo class deleted successfully.",
  });
};

// BOOK Student
export const bookDemoClass = async (req, res) => {
  const demoClass = await bookDemoClassService(req.params.id, req.user._id);

  return res.status(200).json({
    success: true,
    message: "Demo class booked successfully.",
    demoClass,
  });
};

// CANCEL BOOKING Student
export const cancelDemoBooking = async (req, res) => {
  await cancelDemoBookingService(req.params.id, req.user._id);

  return res.status(200).json({
    success: true,
    message: "Demo class booking cancelled successfully.",
  });
};

// MY BOOKINGS Student
export const getMyDemoBookings = async (req, res) => {
  const demoClasses = await getMyDemoBookingsService(req.user._id);

  return res.status(200).json({
    success: true,
    demoClasses,
  });
};
