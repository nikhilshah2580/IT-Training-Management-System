import AdminModulePage from "./AdminModulePage";
import {
  getAllReviews,
  updateReviewStatus,
  adminDeleteReview,
} from "../../api/review.services";

const ReviewManagement = () => (
  <AdminModulePage
    title="Review Management"
    description="Approve, reject, and remove course reviews."
    queryKey="admin-reviews"
    listFn={() => getAllReviews({ limit: 100 })}
    listKeys={["reviews"]}
    showForm={false}
    allowEdit={false}
    deleteFn={adminDeleteReview}
    statusFn={(id, status) => updateReviewStatus(id, { status })}
    statusOptions={[
      {
        value: "Approved",
        label: "Approve",
        className: "bg-green-100 text-green-700 hover:bg-green-200",
      },
      {
        value: "Rejected",
        label: "Reject",
        className: "bg-red-100 text-red-700 hover:bg-red-200",
      },
    ]}
    columns={[
      {
        label: "Student",
        render: (row) => row.student?.fullName || row.user?.fullName || "-",
      },
      { label: "Course", render: (row) => row.course?.title || "-" },
      { label: "Rating", render: (row) => row.rating ?? "-" },
      { label: "Comment", render: (row) => row.comment || "-" },
      { label: "Status", render: (row) => row.status || "-" },
    ]}
  />
);
export default ReviewManagement;
