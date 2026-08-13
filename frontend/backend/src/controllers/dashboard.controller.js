import { getDashboardService } from "../services/dashboard.service.js";

//GET ADMIN DASHBOARD

export const getDashboard = async (req, res) => {
    const dashboard = await getDashboardService();

    return res.status(200).json({
        success: true,
        message: "Dashboard data fetched successfully",
        dashboard,
    });
};
