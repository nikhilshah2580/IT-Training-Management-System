import AdminModulePage from "./AdminModulePage";
import {
  getAllTestimonials,
  approveTestimonial,
  rejectTestimonial,
  toggleFeaturedTestimonial,
  deleteTestimonial,
} from "../../api/testimonial.services";

const TestimonialManagement = () => (
  <AdminModulePage
    title="Testimonial Management"
    description="Approve, reject, feature, and delete testimonials."
    queryKey="admin-testimonials"
    listFn={() => getAllTestimonials({ limit: 100 })}
    listKeys={["testimonials"]}
    showForm={false}
    allowEdit={false}
    deleteFn={deleteTestimonial}
    statusFn={(id, action) =>
      action === "Approved"
        ? approveTestimonial(id)
        : action === "Rejected"
          ? rejectTestimonial(id)
          : toggleFeaturedTestimonial(id)
    }
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
      {
        value: "Featured",
        label: "Feature",
        className: "bg-yellow-100 text-yellow-700 hover:bg-yellow-200",
      },
    ]}
    columns={[
      {
        label: "Student",
        render: (row) => row.student?.fullName || row.user?.fullName || "-",
      },
      { label: "Course", render: (row) => row.course?.title || "-" },
      { label: "Rating", render: (row) => row.rating ?? "-" },
      { label: "Message", render: (row) => row.message || "-" },
      {
        label: "Status",
        render: (row) =>
          `${row.status || "-"}${row.isFeatured ? " / Featured" : ""}`,
      },
    ]}
  />
);
export default TestimonialManagement;
