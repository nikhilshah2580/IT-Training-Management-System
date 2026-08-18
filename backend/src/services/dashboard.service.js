import User from "../models/user.model.js";
import Course from "../models/course.model.js";
import Enrollment from "../models/enrollment.model.js";
import Payment from "../models/payment.model.js";
import JobPlacement from "../models/jobPlacement.model.js";
import Certificate from "../models/certificate.model.js";
import Contact from "../models/contact.model.js";

export const getDashboardService = async () => {
    const [
        totalUsers,
        totalStudents,
        totalInstructors,
        totalAdmins,
        totalCourses,
        pendingCourses,
        approvedCourses,
        rejectedCourses,
        activeCourses,
        totalEnrollments,
        activeEnrollments,
        completedEnrollments,
        totalPayments,
        successfulPayments,
        pendingPayments,
        failedPayments,
        totalPlacements,
        totalCertificates,
        totalContacts,
        pendingContacts,
    ] = await Promise.all([
        User.countDocuments(),
        User.countDocuments({ role: "student" }),
        User.countDocuments({ role: "instructor" }),
        User.countDocuments({ role: "admin" }),

        Course.countDocuments(),
        Course.countDocuments({ status: "Pending" }),
        Course.countDocuments({ status: "Active" }),
        Course.countDocuments({ status: "Rejected" }),
        Course.countDocuments({ status: "Active" }),

        Enrollment.countDocuments(),
        Enrollment.countDocuments({ status: "Active" }),
        Enrollment.countDocuments({ status: "Completed" }),

        Payment.countDocuments(),
        Payment.countDocuments({ paymentStatus: "Paid" }),
        Payment.countDocuments({ paymentStatus: "Pending" }),
        Payment.countDocuments({ paymentStatus: "Failed" }),

        JobPlacement.countDocuments(),
        Certificate.countDocuments(),
        Contact.countDocuments(),
        Contact.countDocuments({ status: "Pending" }),
    ]);

    return {
        users: {
            total: totalUsers,
            students: totalStudents,
            instructors: totalInstructors,
            admins: totalAdmins,
        },
        courses: {
            total: totalCourses,
            pending: pendingCourses,
            approved: approvedCourses,
            rejected: rejectedCourses,
            active: activeCourses,
        },
        enrollments: {
            total: totalEnrollments,
            active: activeEnrollments,
            completed: completedEnrollments,
        },
        payments: {
            total: totalPayments,
            successful: successfulPayments,
            pending: pendingPayments,
            failed: failedPayments,
        },
        placements: { total: totalPlacements },
        certificates: { total: totalCertificates },
        contacts: { total: totalContacts, pending: pendingContacts },
    };
};
