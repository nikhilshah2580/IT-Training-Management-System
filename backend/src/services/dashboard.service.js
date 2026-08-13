import User from "../models/user.model.js";
import Course from "../models/course.model.js";
import Enrollment from "../models/enrollment.model.js";
import Payment from "../models/payment.model.js";
import JobPlacement from "../models/jobPlacement.model.js";
import Certificate from "../models/certificate.model.js";
import Contact from "../models/contact.model.js";

//ADMIN DASHBOARD

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
        // USERS
        User.countDocuments(),

        User.countDocuments({
            role: "student",
        }),

        User.countDocuments({
            role: "instructor",
        }),

        User.countDocuments({
            role: "admin",
        }),

        // COURSES
        Course.countDocuments(),

        Course.countDocuments({
            status: "Pending",
        }),

        Course.countDocuments({
            status: "Approved",
        }),

        Course.countDocuments({
            status: "Rejected",
        }),

        // ENROLLMENTS
        Enrollment.countDocuments(),

        Enrollment.countDocuments({
            status: "active",
        }),

        Enrollment.countDocuments({
            status: "completed",
        }),

        // PAYMENTS
        Payment.countDocuments(),

        Payment.countDocuments({
            status: "success",
        }),

        Payment.countDocuments({
            status: "pending",
        }),

        Payment.countDocuments({
            status: "failed",
        }),

        // PLACEMENTS
        JobPlacement.countDocuments(),

        // CERTIFICATES
        Certificate.countDocuments(),

        // CONTACTS
        Contact.countDocuments(),

        Contact.countDocuments({
            status: "Pending",
        }),
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

        placements: {
            total: totalPlacements,
        },

        certificates: {
            total: totalCertificates,
        },

        contacts: {
            total: totalContacts,
            pending: pendingContacts,
        },
    };
};