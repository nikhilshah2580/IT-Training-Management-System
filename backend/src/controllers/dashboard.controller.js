import {
  getDashboardService,
  getInstructorDashboardService,
} from "../services/dashboard.service.js";

//GET ADMIN DASHBOARD

export const getDashboard = async (req, res) => {
  const dashboard = await getDashboardService();

  return res.status(200).json({
    success: true,
    message: "Dashboard data fetched successfully",
    dashboard,
  });
};

// GET INSTRUCTOR DASHBOARD
export const getInstructorDashboard = async (req, res) => {
  const dashboard = await getInstructorDashboardService(req.user._id);

  return res.status(200).json({
    success: true,
    message: "Instructor dashboard data fetched successfully",
    dashboard,
  });
};
