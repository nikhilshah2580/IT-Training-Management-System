import Assignment from "../models/assignment.model.js";
import Attendance from "../models/attendance.model.js";
import Blog from "../models/blog.model.js";
import Certificate from "../models/certificate.model.js";
import Contact from "../models/contact.model.js";
import Course from "../models/course.model.js";
import DemoClass from "../models/demoClass.model.js";
import Enrollment from "../models/enrollment.model.js";
import InstructorProfile from "../models/instructorProfile.model.js";
import JobListing from "../models/jobListing.model.js";
import JobPlacement from "../models/jobPlacement.model.js";
import Notification from "../models/notification.model.js";
import Payment from "../models/payment.model.js";
import Resource from "../models/resource.model.js";
import Review from "../models/review.model.js";
import Submission from "../models/submission.model.js";
import Testimonial from "../models/testimonial.model.js";
import User from "../models/user.model.js";

export const getDashboardService = async () => {
    const [
        totalUsers,
        totalStudents,
        totalInstructors,
        totalAdmins,
        verifiedUsers,
        totalCourses,
        pendingCourses,
        activeCourses,
        inactiveCourses,
        rejectedCourses,
        totalEnrollments,
        activeEnrollments,
        completedEnrollments,
        totalPayments,
        successfulPayments,
        pendingPayments,
        failedPayments,
        totalCertificates,
        totalAssignments,
        activeAssignments,
        closedAssignments,
        totalSubmissions,
        submittedSubmissions,
        gradedSubmissions,
        lateSubmissions,
        totalAttendance,
        presentAttendance,
        absentAttendance,
        lateAttendance,
        totalResources,
        publishedResources,
        totalBlogs,
        publishedBlogs,
        draftBlogs,
        archivedBlogs,
        featuredBlogs,
        totalDemoClasses,
        scheduledDemoClasses,
        completedDemoClasses,
        cancelledDemoClasses,
        totalJobListings,
        publishedJobListings,
        draftJobListings,
        closedJobListings,
        expiredJobListings,
        totalPlacements,
        placedPlacements,
        joinedPlacements,
        pendingPlacements,
        totalReviews,
        pendingReviews,
        approvedReviews,
        rejectedReviews,
        totalTestimonials,
        pendingTestimonials,
        approvedTestimonials,
        rejectedTestimonials,
        featuredTestimonials,
        totalInstructorProfiles,
        pendingInstructorProfiles,
        approvedInstructorProfiles,
        rejectedInstructorProfiles,
        totalContacts,
        pendingContacts,
        totalNotifications,
        unreadNotifications,
    ] = await Promise.all([
        User.countDocuments(),
        User.countDocuments({ role: "student" }),
        User.countDocuments({ role: "instructor" }),
        User.countDocuments({ role: "admin" }),
        User.countDocuments({ isVerified: true }),

        Course.countDocuments(),
        Course.countDocuments({ status: "Pending" }),
        Course.countDocuments({ status: "Active" }),
        Course.countDocuments({ status: "Inactive" }),
        Course.countDocuments({ status: "Rejected" }),

        Enrollment.countDocuments(),
        Enrollment.countDocuments({ status: "Active" }),
        Enrollment.countDocuments({ status: "Completed" }),

        Payment.countDocuments(),
        Payment.countDocuments({ paymentStatus: "Paid" }),
        Payment.countDocuments({ paymentStatus: "Pending" }),
        Payment.countDocuments({ paymentStatus: "Failed" }),

        Certificate.countDocuments(),

        Assignment.countDocuments(),
        Assignment.countDocuments({ status: "Active" }),
        Assignment.countDocuments({ status: "Closed" }),

        Submission.countDocuments(),
        Submission.countDocuments({ status: "Submitted" }),
        Submission.countDocuments({ status: "Graded" }),
        Submission.countDocuments({ status: "Late" }),

        Attendance.countDocuments(),
        Attendance.countDocuments({ status: "Present" }),
        Attendance.countDocuments({ status: "Absent" }),
        Attendance.countDocuments({ status: "Late" }),

        Resource.countDocuments(),
        Resource.countDocuments({ isPublished: true }),

        Blog.countDocuments(),
        Blog.countDocuments({ status: "Published" }),
        Blog.countDocuments({ status: "Draft" }),
        Blog.countDocuments({ status: "Archived" }),
        Blog.countDocuments({ isFeatured: true }),

        DemoClass.countDocuments(),
        DemoClass.countDocuments({ status: "Scheduled" }),
        DemoClass.countDocuments({ status: "Completed" }),
        DemoClass.countDocuments({ status: "Cancelled" }),

        JobListing.countDocuments(),
        JobListing.countDocuments({ status: "Published" }),
        JobListing.countDocuments({ status: "Draft" }),
        JobListing.countDocuments({ status: "Closed" }),
        JobListing.countDocuments({ status: "Expired" }),

        JobPlacement.countDocuments(),
        JobPlacement.countDocuments({ status: "Placed" }),
        JobPlacement.countDocuments({ status: "Joined" }),
        JobPlacement.countDocuments({ status: "Pending" }),

        Review.countDocuments(),
        Review.countDocuments({ status: "Pending" }),
        Review.countDocuments({ status: "Approved" }),
        Review.countDocuments({ status: "Rejected" }),

        Testimonial.countDocuments(),
        Testimonial.countDocuments({ status: "Pending" }),
        Testimonial.countDocuments({ status: "Approved" }),
        Testimonial.countDocuments({ status: "Rejected" }),
        Testimonial.countDocuments({ isFeatured: true }),

        InstructorProfile.countDocuments(),
        InstructorProfile.countDocuments({ status: "Pending" }),
        InstructorProfile.countDocuments({ status: "Approved" }),
        InstructorProfile.countDocuments({ status: "Rejected" }),

        Contact.countDocuments(),
        Contact.countDocuments({ status: "Pending" }),

        Notification.countDocuments(),
        Notification.countDocuments({ isRead: false }),
    ]);

    return {
        users: {
            total: totalUsers,
            students: totalStudents,
            instructors: totalInstructors,
            admins: totalAdmins,
            verified: verifiedUsers,
        },
        courses: {
            total: totalCourses,
            pending: pendingCourses,
            active: activeCourses,
            inactive: inactiveCourses,
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
        certificates: { total: totalCertificates },
        assignments: {
            total: totalAssignments,
            active: activeAssignments,
            closed: closedAssignments,
        },
        submissions: {
            total: totalSubmissions,
            submitted: submittedSubmissions,
            graded: gradedSubmissions,
            late: lateSubmissions,
        },
        attendance: {
            total: totalAttendance,
            present: presentAttendance,
            absent: absentAttendance,
            late: lateAttendance,
        },
        resources: {
            total: totalResources,
            published: publishedResources,
        },
        blogs: {
            total: totalBlogs,
            published: publishedBlogs,
            draft: draftBlogs,
            archived: archivedBlogs,
            featured: featuredBlogs,
        },
        demoClasses: {
            total: totalDemoClasses,
            scheduled: scheduledDemoClasses,
            completed: completedDemoClasses,
            cancelled: cancelledDemoClasses,
        },
        jobListings: {
            total: totalJobListings,
            published: publishedJobListings,
            draft: draftJobListings,
            closed: closedJobListings,
            expired: expiredJobListings,
        },
        placements: {
            total: totalPlacements,
            placed: placedPlacements,
            joined: joinedPlacements,
            pending: pendingPlacements,
        },
        reviews: {
            total: totalReviews,
            pending: pendingReviews,
            approved: approvedReviews,
            rejected: rejectedReviews,
        },
        testimonials: {
            total: totalTestimonials,
            pending: pendingTestimonials,
            approved: approvedTestimonials,
            rejected: rejectedTestimonials,
            featured: featuredTestimonials,
        },
        instructorProfiles: {
            total: totalInstructorProfiles,
            pending: pendingInstructorProfiles,
            approved: approvedInstructorProfiles,
            rejected: rejectedInstructorProfiles,
        },
        contacts: {
            total: totalContacts,
            pending: pendingContacts,
        },
        notifications: {
            total: totalNotifications,
            unread: unreadNotifications,
        },
    };
};
